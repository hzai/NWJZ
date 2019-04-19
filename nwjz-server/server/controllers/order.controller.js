/*
 * @Author = Roy Chen
 * @Date = 2017-12-13 00:36:55
 * @Last Modified by: Arnie Carter
 * @Last Modified time: 2018-06-07 23:04:52
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-10 15:52:44
 */
import Order from '../models/order.model';
import Appointment from '../models/appointment.model';
import Preappointment from '../models/preappointment.model';
import UserCoupon from '../models/user.coupon.model';
import Service from '../models/service.model';
import User from '../models/user.model';
import Auth from '../models/auth.model';
import config from '../../config/config';
import Utils from '../helpers/Utils';
const passport = require('passport');
import { submit_reserve_reminder_for_admin } from '../../config/reminder';
/**
 * Load order and append to req.
 */
function load(req, res, next, id) {
    Order.findById(id)
        .populate({
            path: 'user_coupon user service address',
            populate: {
                path: 'coupon'
            }
        })
        // .populate('address', '_id contact_person contact_phone detail_address area')
        .then(order => {
            req.order = order; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get Order
 * @returns {Order}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            order: req.order
        },
        message: '获取订单信息成功'
    });
}

/**
 * Create new order
 * @returns {Order}
 */
async function create(req, res, next) {
    console.log('user_coupon', req.body.user_coupon === '');
    updateCellCount(req.body.service._id);
    if (
        req.body.service.buy_once === 'true' ||
        req.body.service.buy_once === true
    ) {
        let _filter = {
            $and: [
                {
                    user: req.payload.user
                },
                {
                    service: req.body.service
                },
                {
                    status: {
                        $ne: 4
                    }
                }
            ]
        };
        let total = await Order.count(_filter);
        _filter = {
            $and: [
                {
                    user: req.payload.user
                },
                {
                    service: req.body.service
                },
                {
                    status: 0
                }
            ]
        };
        const unpay = await Order.find(_filter);
        console.log('unpay', unpay);
        if (total > 0) {
            if (unpay.length > 0) {
                return res.json({
                    status: 2,
                    data: unpay,
                    type: 'cancel',
                    message: '您的订单尚未支付！'
                });
            } else {
                return res.json({
                    status: 1,
                    type: 'cancel',
                    message: '您已享受过此优惠了！'
                });
            }
        }
    }
    const order = new Order({
        is_reserve_order: req.body.is_reserve_order,
        // 关联user
        user: req.payload.user,
        // 订单号
        order_code: Utils.genOrderId(),
        // 关联 service
        service: req.body.service,
        // 关联 服务地址
        address: req.body.address,
        // 服务时长
        service_duration: req.body.service.default_times,
        // 服务时间
        service_time: req.body.service_time,
        // 应付金额
        amount_payable: isNaN(req.body.amount_payable)
            ? req.body.service.sale_price
            : req.body.amount_payable,
        // 已付金额
        // amount_paid: 0,
        // 优惠券号
        // coupon_code: req.body.service._id, // TODO
        // 注意事项
        memo: req.body.memo,
        // 运营备注
        // remark: req.body.remark,
        // 订单状态 0 - 待付款；1 - 已付款；2 - 待评价；3 - 已完成；
        requirements: req.body.requirements,
        expected_baby_date: req.body.expected_baby_date,
        status: req.body.status,
        // 01 - 公众号， 02 - 小程序
        order_from: req.body.order_from,
        // 创建人
        created_by: req.payload.user
    });
    console.log('==create order== ', order);
    order
        .save()
        .then(savedOrder => {
            submit_reserve_reminder_for_admin(savedOrder);
            return res.json({
                status: 0,
                data: {
                    order: savedOrder
                },
                type: 'SUCCESS',
                message: '订单创建成功'
            });
        })
        .catch(e => next(e));
}

function updateCellCount(id) {
    //counter.findByIdAndUpdate({_id: 'entityId'}, {$inc: { seq: 1} }
    Service.findByIdAndUpdate(
        { _id: id },
        { $inc: { sell_count: Math.floor(Math.random() * (8 - 4 + 1) + 4) } }
    )
        .then(resp => {})
        .catch(e => next(e));
}

/**
 * Update existing order
 * @returns {Order}
 */
function update(req, res, next) {
    const order = req.order;
    // 服务时间
    order.service_time = req.body.service_time;
    // 应付金额
    order.amount_payable = req.body.amount_payable;
    // 已付金额
    order.amount_paid = req.body.amount_paid;
    // 优惠券号
    order.coupon_code = req.body.coupon_code;
    // 优惠券的优惠金额
    order.coupon_reduce_price = req.body.coupon_reduce_price;
    // 现金的优惠金额
    order.cash_reduce_price = req.body.cash_reduce_price;
    // 支付方式
    order.pay_type = req.body.pay_type;
    // 注意事项
    order.memo = req.body.memo;
    // 运营备注
    order.remark = req.body.remark;
    // 订单状态 0 - 待付款；1 - 已付款；2 - 待评价；3 - 已完成；
    order.status = req.body.status;
    order.updated_time = Date.now();
    order.updated_by = req.payload.user;
    order
        .save()
        .then(savedOrder => {
            return res.json({
                status: 0,
                data: {
                    order: savedOrder
                },
                type: 'SUCCESS',
                message: '订单更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Create new user order
 * @returns {Order}
 */
async function createUserOrder(req, res, next) {
    const order = new Order({
        is_reserve_order: req.body.is_reserve_order,
        // 关联user
        user: req.userId,
        // 订单号
        order_code: Utils.genOrderId(),
        // 关联 service
        service: req.body.service,
        // 关联 服务地址
        address: req.body.address,
        // 服务时长
        service_duration: req.body.service_duration,
        // 服务时间
        service_time: req.body.service_time,
        total_service_times: req.body.service_times,
        // 应付金额
        amount_payable: 0,
        // 已付金额
        // amount_paid: 0,
        // 优惠券号
        // coupon_code: req.body.service._id, // TODO
        // 注意事项
        memo: req.body.memo,
        // 运营备注
        remark: req.body.remark,
        // 订单状态 0 - 待付款；1 - 已付款；2 - 待评价；3 - 已完成；
        requirements: req.body.requirements,
        expected_baby_date: req.body.expected_baby_date,
        status: 1,
        // 01 - 公众号， 02 - 小程序, 03 - app, 99 - 线下单
        order_from: req.body.order_from,
        pay_type: '99',
        // 创建人
        created_by: req.payload.user
    });
    // console.log(order);
    order
        .save()
        .then(savedOrder => {
            Order.findById(savedOrder._id)
                .populate({ path: 'address service' })
                .then(findOrder => {
                    const preappointment = new Preappointment({
                        user: req.userId,
                        order: savedOrder._id,
                        service: savedOrder.service,
                        duration: savedOrder.service_duration,
                        times: savedOrder.total_service_times,
                        suit_title: findOrder.service.title,
                        contact_person: findOrder.address.contact_person,
                        contact_phone: findOrder.address.contact_phone,
                        contact_area: findOrder.address.area,
                        contact_detail_address:
                            findOrder.address.detail_address,
                        expired_date: Utils.addDate(360),
                        status: 0,
                        created_by: savedOrder.created_by,
                        created_time: Date.now()
                    });
                    // console.log('preappointment = ', preappointment);
                    preappointment
                        .save()
                        .then(savePreappointment => {
                            console.log(
                                'savePreappointment = ',
                                savePreappointment
                            );
                            return res.json({
                                status: 0,
                                data: {
                                    order: savedOrder
                                },
                                type: 'SUCCESS',
                                message: '订单创建成功'
                            });
                        })
                        .catch(e => {
                            console.log(e);
                        });
                })
                .catch(e => next(e));
        })
        .catch(e => next(e));
}

function updateCellCount(id) {
    //counter.findByIdAndUpdate({_id: 'entityId'}, {$inc: { seq: 1} }
    Service.findByIdAndUpdate(
        { _id: id },
        { $inc: { sell_count: Math.floor(Math.random() * (8 - 4 + 1) + 4) } }
    )
        .then(resp => {})
        .catch(e => next(e));
}

/**
 * Update existing order
 * @returns {Order}
 */
function update(req, res, next) {
    const order = req.order;
    // 服务时间
    order.service_time = req.body.service_time;
    // 应付金额
    order.amount_payable = req.body.amount_payable;
    // 已付金额
    order.amount_paid = req.body.amount_paid;
    // 优惠券号
    order.coupon_code = req.body.coupon_code;
    // 优惠券的优惠金额
    order.coupon_reduce_price = req.body.coupon_reduce_price;
    // 现金的优惠金额
    order.cash_reduce_price = req.body.cash_reduce_price;
    // 支付方式
    order.pay_type = req.body.pay_type;
    // 注意事项
    order.memo = req.body.memo;
    // 运营备注
    order.remark = req.body.remark;
    // 订单状态 0 - 待付款；1 - 已付款；2 - 待评价；3 - 已完成；
    order.status = req.body.status;
    order.updated_time = Date.now();
    order.updated_by = req.payload.user;
    order
        .save()
        .then(savedOrder => {
            return res.json({
                status: 0,
                data: {
                    order: savedOrder
                },
                type: 'SUCCESS',
                message: '订单更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Get my order list.
 * @property {number} req.query.skip - Number of orderes to be skipped.
 * @property {number} req.query.limit - Limit number of orderes to be returned.
 * @returns {Order[]}
 */
async function getMyOrderList(req, res, next) {
    let _filter = {
        $and: [
            {
                user: req.payload.user
            }
        ]
    };
    req._filter = _filter;
    return list(req, res, next);
}

/**
 * Get order list by user.
 * @property {number} req.query.skip - Number of orderes to be skipped.
 * @property {number} req.query.limit - Limit number of orderes to be returned.
 * @returns {Order[]}
 */
async function getOrderListByUser(req, res, next) {
    const userId = req.userId;
    console.log('req.userId = ', req.userId);
    if (userId === null || userId === undefined) {
        res.json({
            status: 0,
            type: 'SUCCESS',
            data: {
                total,
                limit: 0,
                skip: 0,
                orders: null
            },
            message: '获取订单列表成功'
        });
    }
    let _filter = {
        $and: [
            {
                user: userId
            }
        ]
    };
    req._filter = _filter;
    return list(req, res, next);
}

/**
 * 获取我的预约服务
 * @property {number} req.query.skip - Number of appointmentes to be skipped.
 * @property {number} req.query.limit - Limit number of appointmentes to be returned.
 * @returns {appointment[]}
 */
async function getMyAppointments(req, res, next) {
    // Appointment状态 0 - 已预约（未分配）；1 - 已分配；2 - 服务中；3 - 服务完成
    let _filter = {
        user: req.payload.user
    };
    let total = await Appointment.count(_filter);
    const query = Utils.handleQuery(req, total);
    const limit = query.limit;
    const skip = query.skip;

    Appointment.find(_filter)
        .populate({
            path: 'order',
            model: 'Order',
            populate: {
                path: 'service address'
            }
        })
        .sort({
            created_time: -1
        })
        .skip(skip)
        .limit(limit)
        .exec()
        .then(appointments =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    appointments
                },
                message: '获取预约服务列表成功'
            })
        )
        .catch(e => next(e));
}

/**
 * 获取我的未预约服务
 * @property {number} req.query.skip - Number of appointmentes to be skipped.
 * @property {number} req.query.limit - Limit number of appointmentes to be returned.
 * @returns {appointment[]}
 */
async function getMyUnAppointments(req, res, next) {
    // 订单状态 0 - 待付款；1 - 已付款；2 - 待评价；3 - 已完成；
    let _filter = {
        user: req.payload.user,
        status: 1
    };
    Order.find(_filter)
        .populate('service address')
        .sort({
            created_time: -1
        })
        .exec()
        .then(orders => {
            let result = [];
            orders.forEach(item => {
                const total = item.appointment_total_count;
                const have = item.have_appointmented_count;
                if (have < total) {
                    result.push(item);
                }
            });
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    unappointments: result
                },
                message: '获取未预约服务列表成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Update order status
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {*} status
 */
async function updateStatus(req, res, next) {
    const order = req.order;
    const status = req.order_status;
    console.log(status);
    if (
        status !== '0' &&
        status !== '1' &&
        status !== '2' &&
        status !== '3' &&
        status !== '4' &&
        status !== '5' &&
        status !== '6'
    ) {
        return res.json({
            status: 1,
            type: 'FAILED',
            message: '参数错误'
        });
    }

    // 订单状态 0 - 待付款；1 - 已付款；2 - 待评价；3 - 已完成；
    order.status = status;
    order.remark = req.body.remark;
    order.updated_time = Date.now();
    order.updated_by = req.payload.user;
    order
        .save()
        .then(savedOrder => {
            console.log('savedOrder = ', savedOrder);
            return res.json({
                status: 0,
                data: {
                    order: savedOrder
                },
                type: 'SUCCESS',
                message: '订单状态更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * pay the order
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {*} status
 */
async function payOrder(req, res, next) {
    const order = req.order;
    // 订单状态 0 - 待付款；1 - 已付款；2 - 待评价；3 - 已完成；
    // order.status = 1; // update status when wechat pay callback
    console.log(req.body.user_coupon);
    order.pay_type = req.body.pay_type;
    if (req.body.user_coupon !== undefined) {
        order.user_coupon = req.body.user_coupon;
    }
    // order.amount_paid = req.body.amount_payable - req.body.coupon_reduce_price;
    // 优惠券的优惠金额
    if (
        req.body.user_coupon &&
        req.body.user_coupon.coupon !== undefined &&
        req.body.user_coupon.coupon.face_value !== undefined
    ) {
        order.coupon_reduce_price = req.body.user_coupon.coupon.face_value;
    } else {
        order.coupon_reduce_price = 0;
    }
    order.updated_time = Date.now();
    order.updated_by = req.payload.user;
    order
        .save()
        .then(savedOrder => {
            if (req.body.user_coupon !== undefined) {
                UserCoupon.findByIdAndUpdate(req.body.user_coupon._id, {
                    status: 1,
                    updated_by: req.payload.user,
                    updated_time: Date.now()
                }).then(resp => {});
            }
            // if (savedOrder && savedOrder.status === 1) {
            // if (!savedOrder.service.is_strict_selection) {
            //     // TODO 如果是单项服务，默认已预约1个服务
            //     const appointment = new Appointment({
            //         user: req.payload.user,
            //         memo: savedOrder.memo,
            //         suit_title: savedOrder.service.title,
            //         total_price: savedOrder.amount_paid,
            //         service_duration: savedOrder.service_duration,
            //         service: savedOrder.service,
            //         service_category: savedOrder.service.category,
            //         contact_person: savedOrder.address.contact_person,
            //         contact_phone: savedOrder.address.contact_phone,
            //         contact_area: savedOrder.address.area,
            //         contact_detail_address: savedOrder.address.detail_address,
            //         service_time: savedOrder.service_time,
            //         status: 0,
            //         order: savedOrder._id,
            //         created_by: req.payload.user
            //     });
            //     console.log(appointment);
            //     appointment
            //         .save()
            //         .then(savedAppointment => {})
            //         .catch(e => next(e));
            // } else {
            //     console.log(savedOrder.service.sub_services);
            //     console.log(Utils.addDate(180));
            //     savedOrder.service.sub_services.forEach(preapm => {
            //         const preappointment = new Preappointment({
            //             user: req.payload.user,
            //             order: savedOrder._id,
            //             service: preapm.service,
            //             duration: preapm.duration,
            //             times: preapm.times,
            //             suit_title: savedOrder.service.title,
            //             contact_person: savedOrder.address.contact_person,
            //             contact_phone: savedOrder.address.contact_phone,
            //             contact_area: savedOrder.address.area,
            //             contact_detail_address: savedOrder.address.detail_address,
            //             expired_date: Utils.addDate(savedOrder.service.expire_date_count),
            //             status: 0,
            //             created_by: req.payload.user,
            //             created_time: Date.now()
            //         });
            //         //console.log(preappointment)
            //         preappointment
            //             .save()
            //             .then(savePreappointment => {})
            //             .catch(e => next(e));
            //     });
            // }
            return res.json({
                status: 0,
                data: {
                    order: savedOrder
                },
                type: 'SUCCESS',
                message: '修改订单成功'
            });
            // }
        })
        .catch(e => next(e));
}

/**
 * Get order list.
 * @property {number} req.query.skip - Number of orderes to be skipped.
 * @property {number} req.query.limit - Limit number of orderes to be returned.
 * @returns {Order[]}
 */
async function list(req, res, next) {
    const {
        status = 'ALL',
        auto_close = '',
        order_code = '',
        start_end = undefined
    } = req.query;
    let _filter = req._filter;
    if (!_filter || _filter == 'undefined') {
        _filter = {
            $and: [
                {
                    order_code: {
                        $regex: order_code,
                        $options: '$i'
                    }
                }
            ]
        };
    } else {
        _filter.$and.push({
            order_code: {
                $regex: order_code,
                $options: '$i'
            }
        });
    }
    if (status !== 'ALL')
        _filter.$and.push({
            status: status
        });
    if (auto_close !== '') {
        if (auto_close === 'true') {
            _filter.$and.push({
                is_auto_closed: true
            });
        } else if (auto_close === 'false') {
            _filter.$and.push({
                is_auto_closed: false
            });
        }
    }
    if (start_end !== undefined) {
        _filter.$and.push({
            created_time: {
                $gte: new Date(start_end[0]),
                $lte: new Date(start_end[1])
            }
        });
    }
    let total = await Order.count(_filter);
    const query = Utils.handleQuery(req, total);
    const limit = query.limit;
    const skip = query.skip;
    console.log('_filter = ', _filter);
    Order.find(_filter)
        .populate('address user')
        .populate({
            path: 'service',
            model: 'Service'
        })
        .sort({
            created_time: -1
        })
        .skip(skip)
        .limit(limit)
        .exec()
        .then(orders =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    orders
                },
                message: '获取订单列表成功'
            })
        )
        .catch(e => next(e));
}

/**
 * 根据订单编号(_id)获取未预约服务 - 只有admin 可用
 * @param {g} req
 * @param {*} res
 * @param {*} next
 */
function getPreApmByOrderId(req, res, next) {
    const order = req.order;
    let _filter = {
        order: order._id
    };
    Preappointment.find(_filter)
        .populate('user order service')
        .sort({
            created_time: -1
        })
        .exec()
        .then(preappointments =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    preappointments
                },
                message: '获取未预约服务列表成功'
            })
        )
        .catch(e => next(e));
}
/**
 * 根据订单编号(_id)获取预约服务 - 只有admin 可用
 * @param {g} req
 * @param {*} res
 * @param {*} next
 */
function getApmByOrderId(req, res, next) {
    const order = req.order;
    let _filter = {
        order: order._id
    };
    Appointment.find(_filter)
        .populate('user order service worker')
        .sort({
            service_time: 1
        })
        .exec()
        .then(appointments =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    appointments
                },
                message: '获取预约服务列表成功'
            })
        )
        .catch(e => next(e));
}
/**
 * Delete order.
 * @returns {Order}
 */
function remove(req, res, next) {
    const order = req.order;
    order
        .remove()
        .then(deletedOrder =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    deletedOrder
                },
                message: '删除订单成功'
            })
        )
        .catch(e => next(e));
}

export default {
    load,
    get,
    create,
    createUserOrder,
    update,
    list,
    getOrderListByUser,
    getMyOrderList,
    getMyAppointments,
    getMyUnAppointments,
    updateStatus,
    getPreApmByOrderId,
    getApmByOrderId,
    payOrder,
    remove
};
