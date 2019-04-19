/*
 * @Author = Roy Chen
 * @Date = 2017-12-13 00:36:55
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-10 19:54:04
 */
import UserCoupon from '../models/user.coupon.model';
import Coupon from '../models/coupon.model';
import User from '../models/user.model';
import Auth from '../models/auth.model';
import config from '../../config/config';
import Utils from '../helpers/Utils';
import moment from 'moment';
const passport = require('passport');
/**
 * Load UserCoupon and append to req.
 */
function load(req, res, next, id) {
    userCoupon
        .get(id)
        .then(userCoupon => {
            req.userCoupon = userCoupon; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get UserCoupon
 * @returns {UserCoupon}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            userCoupon: req.userCoupon
        },
        message: '获取用户优惠券信息成功'
    });
}

/**
 * 通过优惠卷码获取优惠卷
 */
async function getCouponFromCouponCode(req, res, next) {
    let _filter = {
        $and: [
            {
                coupon_code: req.body.coupon_code
            },
            {
                status: 0
            },
            {
                end_time: {
                    $gt: Date.now()
                }
            }
        ]
    };
    Coupon.find(_filter)
        .sort({
            created_time: -1
        })
        .exec()
        .then(async coupons => {
            if (coupons.length === 0) {
                return res.json({
                    status: 1,
                    type: 'ERROR',
                    message: '没有此优惠卷，请重新输入!'
                });
            }
            for (var cc of coupons) {
                console.log('cc', cc);
                const count = await UserCoupon.count({
                    $and: [
                        {
                            user: req.payload.user
                        },
                        {
                            coupon: cc._id
                        },
                        {
                            status: 0
                        }
                    ]
                });
                console.log('count:', count);
                if (count > 0) {
                    return res.json({
                        status: 1,
                        type: 'ERROR',
                        message: '已领取过该优惠卷！'
                    });
                } else {
                    const userCoupon = new UserCoupon({
                        // 关联用户
                        user: req.payload.user,
                        // 关联优惠券
                        coupon: cc,
                        service: cc.service,
                        // 优惠券号
                        expire_date: new Date(
                            moment(
                                Utils.addDate(cc.expire_date_count),
                                'YYYY-MM-DD'
                            )
                        ),
                        // 创建人
                        created_by: req.payload.user
                    });
                    console.log('dddddddd = ', userCoupon);
                    userCoupon
                        .save()
                        .then(savedUserCoupon => {
                            return res.json({
                                status: 0,
                                data: {
                                    userCoupon: savedUserCoupon
                                },
                                type: 'SUCCESS',
                                message: '用户优惠券创建成功'
                            });
                        })
                        .catch(e => next(e));
                }
            }
        });
}

/**
 * Create new UserCoupon
 * @returns {UserCoupon}
 */
function create(req, res, next) {
    const userCoupon = new UserCoupon({
        // 关联用户
        user: req.payload.user,
        // 关联优惠券
        coupon: req.body,
        service: req.body.service,
        // 优惠券号
        expire_date: Utils.addDate(req.body.expire_date_count),
        // 创建人
        created_by: req.payload.user
    });
    console.log(userCoupon);
    userCoupon
        .save()
        .then(savedUserCoupon => {
            return res.json({
                status: 0,
                data: {
                    userCoupon: savedUserCoupon
                },
                type: 'SUCCESS',
                message: '用户优惠券创建成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Update existing userCoupon
 * @returns {UserCoupon}
 */
function update(req, res, next) {
    const userCoupon = req.userCoupon;
    // 收入、支出导致的结果
    userCoupon.tx_result = req.body.tx_result;
    // 备注
    userCoupon.remark = req.body.remark;
    userCoupon.updated_time = Date.now();
    userCoupon.updated_by = req.payload.user;
    userCoupon
        .save()
        .then(savedUserCoupon => {
            return res.json({
                status: 0,
                data: {
                    userCoupon: savedUserCoupon
                },
                type: 'SUCCESS',
                message: '用户优惠券更新成功'
            });
        })
        .catch(e => next(e));
}
/**
 * Get my coupon list.
 * @property {number} req.query.skip - Number of orderes to be skipped.
 * @property {number} req.query.limit - Limit number of orderes to be returned.
 * @returns {Order[]}
 */
async function getMyCouponList(req, res, next) {
    const { status = 'ALL' } = req.query;
    let _filter = {};
    if (req.query.serviceId !== undefined) {
        _filter = {
            $and: [
                {
                    service: req.query.serviceId
                },
                {
                    user: req.payload.user
                },
                {
                    status: 0
                }
            ]
        };
    } else {
        if (status !== 'ALL') {
            _filter = {
                user: req.payload.user,
                status: status
            };
        } else {
            _filter = {
                user: req.payload.user
            };
        }
    }
    req._filter = _filter;
    console.log(_filter);
    return list(req, res, next);
}

/**
 * Get user coupon list.
 * @property {number} req.query.skip - Number of orderes to be skipped.
 * @property {number} req.query.limit - Limit number of orderes to be returned.
 * @returns {Order[]}
 */
async function getCouponByUser(req, res, next) {
    const { status = 'ALL' } = req.query;
    const userId = req.userId;

    let _filter = {
        user: userId
    };
    req._filter = _filter;
    return list(req, res, next);
}
/**
 * Get userCoupon list.
 * @property {number} req.query.skip - Number of userCoupones to be skipped.
 * @property {number} req.query.limit - Limit number of userCoupones to be returned.
 * @returns {UserCoupon[]}
 */
async function list(req, res, next) {
    let _filter = req._filter;

    console.log(_filter);
    let total = await UserCoupon.count(_filter);
    const query = Utils.handleQuery(req, total);
    const limit = query.limit;
    const skip = query.skip;

    UserCoupon.find(_filter)
        .populate({
            path: 'coupon service'
        })
        .sort({
            status: 1,
            created_time: -1
        })
        .skip(skip)
        .limit(limit)
        .exec()
        .then(userCoupones => {
            // console.log('userCoupones = ', userCoupones);
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    userCoupones
                },
                message: '获取用户优惠券列表成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Delete userCoupon.
 * @returns {UserCoupon}
 */
function remove(req, res, next) {
    const userCoupon = req.userCoupon;
    userCoupon
        .remove()
        .then(deletedUserCoupon =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    deletedUserCoupon
                },
                message: '删除用户优惠券成功'
            })
        )
        .catch(e => next(e));
}

export default {
    load,
    get,
    create,
    update,
    list,
    getMyCouponList,
    getCouponByUser,
    remove,
    getCouponFromCouponCode
};
