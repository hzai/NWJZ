/*
 * @Author = Roy Chen
 * @Date = 2017-12-13 00:36:55
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-08-31 21:47:44
 */
import Card from '../models/card.model';
import CardEntity from '../models/card.entity.model';
import UserCard from '../models/user.card.model';
import User from '../models/user.model';
import Auth from '../models/auth.model';
import config from '../../config/config';
import Utils from '../helpers/Utils';
import { start } from 'repl';
const passport = require('passport');
/**
 * Load card and append to req.
 */
function load(req, res, next, id) {
    Card.get(id)
        .then(card => {
            req.card = card; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get card
 * @returns {card}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            card: req.card
        },
        message: '获取card成功'
    });
}

/**
 * Create new card
 * @returns {card}
 */
function create(req, res, next) {
    //console.log(req.body)
    const card = new Card(req.body);
    card.created_by = req.payload.user;
    card.save()
        .then(savedCard => {
            return res.json({
                status: 0,
                data: {
                    card: savedCard
                },
                type: 'SUCCESS',
                message: 'card创建成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Update existing card
 * @returns {card}
 */
function update(req, res, next) {
    const card = req.body;
    card.updated_time = Date.now();
    card.updated_by = req.payload.user;
    Card.findByIdAndUpdate(req.body._id, card)
        .then(savedCard => {
            return res.json({
                status: 0,
                data: {
                    card: savedCard
                },
                type: 'SUCCESS',
                message: 'card更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Get card list.
 * @property {number} req.query.skip - Number of cardes to be skipped.
 * @property {number} req.query.limit - Limit number of cardes to be returned.
 * @returns {card[]}
 */
async function list(req, res, next) {
    let _filter = {};
    let total = await Card.count(_filter);
    const query = Utils.handleQuery(req, total);
    const limit = query.limit;
    const skip = query.skip;

    Card.find(_filter)
        .sort({
            created_time: -1
        })
        .skip(skip)
        .limit(limit)
        .exec()
        .then(cards => {
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    cards
                },
                message: '获取card列表成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Delete card.
 * @returns {Card}
 */
function remove(req, res, next) {
    const card = req.card;
    card.remove()
        .then(deletedCard =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    deletedCard
                },
                message: '删除card成功'
            })
        )
        .catch(e => next(e));
}
/**
 * 获取card 的开放列表
 * @param {*} req
 * @param {*} rex
 * @param {*} next
 */
async function getCardEntitys(req, res, next) {
    const { status = 'ALL', actived = 'ALL', card_number = '' } = req.query;
    let _filter = {
        $and: [
            {
                card: req.card,
                card_number: {
                    $regex: card_number,
                    $options: '$i'
                }
            }
        ]
    };
    if (status !== 'ALL')
        _filter.$and.push({
            status: status
        });
    if (actived !== 'ALL') {
        _filter.$and.push({
            actived: actived
        });
    }
    let total = await CardEntity.count(_filter);
    const query = Utils.handleQuery(req, total);
    const limit = query.limit;
    const skip = query.skip;

    CardEntity.find(_filter)
        .sort({
            created_time: -1
        })
        .skip(skip)
        .limit(limit)
        .exec()
        .then(cardEntitys =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    cardEntitys
                },
                message: '获取card开放列表成功'
            })
        )
        .catch(e => next(e));
}

/**
 * update card entity
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function updateCardEntity(req, res, next) {
    const entity = req.body;
    entity.updated_time = Date.now();
    entity.updated_by = req.payload.user;
    CardEntity.findByIdAndUpdate(req.body._id, entity)
        .then(savedEntity => {
            return res.json({
                status: 0,
                data: {
                    entity: savedEntity
                },
                type: 'SUCCESS',
                message: '更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * 批量售卡
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function batchSellCards(req, res, next) {
    const card = req.body.card;
    const startCardNumber = req.body.startCardNumber;
    const endCardNumber = req.body.endCardNumber;
    const remark = req.body.remark;

    if (startCardNumber === undefined || endCardNumber === undefined) {
        return res.json({
            status: 1,
            type: 'FALIED',
            message: '请输入正确的卡号范围'
        });
    }

    if (startCardNumber >= endCardNumber) {
        return res.json({
            status: 1,
            type: 'FALIED',
            message: '请输入正确的卡号范围'
        });
    }
    let result = [];
    for (let i = startCardNumber; i <= endCardNumber; i++) {
        // console.log('当前卡号 = ', i);
        const tempResult = await CardEntity.findOne({
            card: card,
            card_number: i,
            $or: [{ status: 0 }, { status: null }]
        }).then(async savedEntity => {
            // console.log(' savedEntity = ', savedEntity)
            if (savedEntity === null) {
                return i + ' ';
            }
        });
        // console.log('tempResult = ', tempResult)
        if (tempResult !== undefined) {
            result.push(tempResult);
        }
    }
    if (result.length > 0) {
        return res.json({
            status: 2,
            data: {
                result: result
            },
            type: 'FAILED',
            message: '有卡号不存在或已售出'
        });
    } else {
        result = [];
        for (let i = startCardNumber; i <= endCardNumber; i++) {
            // console.log('当前卡号 = ', i);
            const tempResult = await CardEntity.findOneAndUpdate(
                {
                    card: card,
                    card_number: i,
                    $or: [{ status: 0 }, { status: null }]
                },
                {
                    status: 1, // 已售出
                    remark: remark // 备注
                }
            ).then(async savedEntity => {
                // console.log(' savedEntity = ', savedEntity)
                if (savedEntity !== null) {
                    return '卡号 - ' + i + ' 成功 ';
                } else {
                    return '卡号 - ' + i + ' 失败 (卡号不存在或已售出))';
                }
            });
            result.push(tempResult);
        }
        return res.json({
            status: 0,
            data: {
                result: result
            },
            type: 'SUCCESS',
            message: '更新成功'
        });
    }
}

export default {
    load,
    get,
    create,
    update,
    list,
    getCardEntitys,
    updateCardEntity,
    batchSellCards,
    remove
};
