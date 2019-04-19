/*
 * @Author = Roy Chen
 * @Date = 2017-12-13 00:36:55
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-09-21 02:42:27
 */
import UserCard from '../models/user.card.model';
import Card from '../models/card.model';
import CardEntity from '../models/card.entity.model';
import UserBalance from '../models/user.balance.model';
import User from '../models/user.model';
import Auth from '../models/auth.model';
import config from '../../config/config';
import Utils from '../helpers/Utils';
import moment from 'moment';
const passport = require('passport');
/**
 * Load UserCard and append to req.
 */
function load(req, res, next, id) {
    userCard
        .get(id)
        .then(userCard => {
            req.userCard = userCard; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get UserCard
 * @returns {UserCard}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            userCard: req.userCard
        },
        message: '获取用户保洁卡信息成功'
    });
}

/**
 * 通过保洁卡码获取保洁卡
 */
async function activeAndChargeCard(req, res, next) {
    let _filter = {
        $and: [
            {
                card_pwd: req.body.card_pwd,
                card_number: req.body.card_number
            },
            {
                status: 1
            }
        ]
    };
    console.log('_filter = ', _filter);
    CardEntity.findOne(_filter)
        .populate({
            path: 'card'
        })
        .exec()
        .then(async entity => {
            console.log('entity = ', entity);
            if (entity === null) {
                return res.json({
                    status: 1,
                    type: 'ERROR',
                    message: '没有此保洁卡，请重新输入!'
                });
            }

            if (entity.actived === 1) {
                return res.json({
                    status: 1,
                    type: 'ERROR',
                    message: '该保洁卡已激活！'
                });
            } else {
                const userBalance = new UserBalance({
                    user: req.payload.user,
                    card_entity: entity,
                    balance_type: '01', // 充值
                    charge_way: '02', // 保洁卡充值
                    amount: entity.card.face_value,
                    remark: '保洁卡充值',
                    created_by: req.payload.user
                });
                userBalance
                    .save()
                    .then(saveUserBalance => {
                        if (saveUserBalance) {
                            User.findByIdAndUpdate(req.payload.user, {
                                $inc: { balance: entity.card.face_value },
                                $push: {
                                    remark: [new Date(), '保洁卡充值 ' + entity.card.face_value]
                                },
                                updated_by: req.payload.user,
                                updated_time: new Date()
                            })
                                .then(resp => {})
                                .catch(e => next(e));
                            CardEntity.findByIdAndUpdate(entity._id, {
                                actived: 1,
                                updated_time: Date.now(),
                                updated_by: req.payload.user
                            })
                                .then(resp => {})
                                .catch(e => next(e));
                            return res.json({
                                status: 0,
                                data: {
                                    saveUserBalance
                                },
                                type: 'SUCCESS',
                                message: '用户保洁卡创建成功'
                            });
                        }
                    })
                    .catch(e => next(e));
            }
        });
}

/**
 * Create new UserCard
 * @returns {UserCard}
 */
function create(req, res, next) {
    const userCard = new UserCard({
        // 关联用户
        user: req.payload.user,
        // 关联保洁卡
        coupon: req.body,
        service: req.body.service,
        // 保洁卡号
        expire_date: Utils.addDate(req.body.expire_date_count),
        // 创建人
        created_by: req.payload.user
    });
    console.log(userCard);
    userCard
        .save()
        .then(savedUserCard => {
            return res.json({
                status: 0,
                data: {
                    userCard: savedUserCard
                },
                type: 'SUCCESS',
                message: '用户保洁卡创建成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Update existing userCard
 * @returns {UserCard}
 */
function update(req, res, next) {
    const userCard = req.userCard;
    // 收入、支出导致的结果
    userCard.tx_result = req.body.tx_result;
    // 备注
    userCard.remark = req.body.remark;
    userCard.updated_time = Date.now();
    userCard.updated_by = req.payload.user;
    userCard
        .save()
        .then(savedUserCard => {
            return res.json({
                status: 0,
                data: {
                    userCard: savedUserCard
                },
                type: 'SUCCESS',
                message: '用户保洁卡更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Get my card list.
 * @property {number} req.query.skip - Number of userCards to be skipped.
 * @property {number} req.query.limit - Limit number of userCards to be returned.
 * @returns {UserCard[]}
 */
async function getMyCardList(req, res, next) {
    let _filter = { user: req.payload.user };
    let total = await UserCard.count(_filter);
    const query = Utils.handleQuery(req, total);
    const limit = query.limit;
    const skip = query.skip;

    UserCard.find(_filter)
        .populate({
            path: 'card_entity',
            populate: {
                path: 'card'
            }
        })
        .sort({
            created_time: -1
        })
        .skip(skip)
        .limit(limit)
        .exec()
        .then(userCards =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    userCards
                },
                message: '获取用户保洁卡列表成功'
            })
        )
        .catch(e => next(e));
}

/**
 * Delete userCard.
 * @returns {UserCard}
 */
function remove(req, res, next) {
    const userCard = req.userCard;
    userCard
        .remove()
        .then(deletedUserCard =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    deletedUserCard
                },
                message: '删除用户保洁卡成功'
            })
        )
        .catch(e => next(e));
}

export default {
    load,
    get,
    create,
    update,
    getMyCardList,
    remove,
    activeAndChargeCard
};
