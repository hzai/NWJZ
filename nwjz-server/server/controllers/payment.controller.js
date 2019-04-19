/*
 * @Author = Roy Chen
 * @Date = 2017-12-13 00:36:55
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-03-26 14:49:54
 */
import User from '../models/user.model';
import Auth from '../models/auth.model';
import config from '../../config/config';
import Utils from '../helpers/Utils';
import Order from '../models/order.model';
import Service from '../models/service.model';
import UserCoupon from '../models/user.coupon.model';
import UserBalance from '../models/user.balance.model';
import Appointment from '../models/appointment.model';
import Preappointment from '../models/preappointment.model';
const tenpay = require('tenpay');
import { pay_success_reminder_for_admin } from '../../config/reminder';

/**
 * 获取APP微信支付参数
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getWechatAppPaymentParams(req, res, next) {
    const out_trade_no = req.body.out_trade_no;
    const body = req.body.body;
    const total_fee = req.body.total_fee;
    const app_wechat_config = {
        appid: config.wechat.wx_app_appid, // app的appid
        mchid: config.wechat.wx_app_mch_id, // 商户Id
        partnerKey: config.wechat.wx_app_mch_key, // 商户密钥
        notify_url: config.wechat.wx_app_payment_notify_url, // 通知地址
        spbill_create_ip: '127.0.0.1'
        // pfx: fs.readFileSync('<location-of-your-apiclient-cert.p12>') // 可选, 退款等情况时需要用到
    };
    const Tenpay = new tenpay(app_wechat_config);
    const order = {
        out_trade_no: out_trade_no,
        body: body,
        total_fee: total_fee * 100
    };
    const params = await Tenpay.getAppParams(order);
    console.log(params);
    if (params) {
        return res.json({
            status: 0,
            type: 'SUCCESS',
            data: {
                params: params
            },
            message: 'SUCCESS'
        });
    } else {
        return res.json({
            status: 1,
            type: 'FAILED',
            message: 'FAILED'
        });
    }
}

/**
 * 获取公众号微信支付参数  /mp/pay
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getWechatMPPaymentParams(req, res, next) {
    console.log('req req = ', req.body);
    const out_trade_no = req.body.out_trade_no;
    const body = req.body.body;
    const total_fee = req.body.total_fee;
    const openId = req.body.openId;
    const mp_wechat_config = {
        appid: config.wechat.wx_mp_appid, // 公众号的appid
        mchid: config.wechat.wx_mp_mch_id, // 商户Id
        partnerKey: config.wechat.wx_mp_mch_key, // 商户密钥
        notify_url: config.wechat.wx_mp_payment_notify_url, // 通知地址
        spbill_create_ip: '127.0.0.1'
        // pfx: fs.readFileSync('<location-of-your-apiclient-cert.p12>') // 可选, 退款等情况时需要用到
    };
    const Tenpay = new tenpay(mp_wechat_config);
    const order = {
        out_trade_no: out_trade_no,
        body: body,
        total_fee: total_fee * 100,
        openid: openId
    };
    console.log(mp_wechat_config);
    console.log(order);
    const params = await Tenpay.getPayParams(order);
    console.log(params);
    if (params) {
        return res.json({
            status: 0,
            type: 'SUCCESS',
            data: {
                params: params
            },
            message: 'SUCCESS'
        });
    } else {
        return res.json({
            status: 1,
            type: 'FAILED',
            message: 'FAILED'
        });
    }
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

function updateTimePeriod(id, selectTime) {
    Service.findById({ _id: id })
        .then(findService => {
            const temp = findService.time_periods;
            temp.forEach(element => {
                if (selectTime === element.value) {
                    element.counter--;
                }
            });
            const timePeriod = temp;
            console.log('temp = ', temp);
            Service.findByIdAndUpdate({ _id: id }, { $set: { time_periods: temp } })
                .then(resp => {})
                .catch(e => next(e));
        })
        .catch(e => next(e));
}

async function createAndPay(req, res, next) {
    console.log('user_coupon = ', req.body.user_coupon === '');
    updateCellCount(req.body.service._id);
    if (req.body.service.buy_once === 'true' || req.body.service.buy_once === true) {
        let _filter = {};
        if (
            req.body.service.new_user_can_buy === 'true' ||
            req.body.service.new_user_can_buy === true
        ) {
            _filter = {
                $and: [
                    {
                        user: req.payload.user
                    },
                    {
                        status: {
                            $in: [0, 1, 2, 3, 7]
                        }
                    }
                ]
            };
        } else {
            _filter = {
                $and: [
                    {
                        user: req.payload.user
                    },
                    {
                        service: req.body.service
                    },
                    {
                        status: {
                            $in: [0, 1, 2, 3, 7]
                        }
                    }
                ]
            };
        }

        let total = await Order.count(_filter);

        if (
            req.body.service.new_user_can_buy === 'true' ||
            req.body.service.new_user_can_buy === true
        ) {
            _filter = {
                $and: [
                    {
                        user: req.payload.user
                    },
                    {
                        status: 0
                    }
                ]
            };
        } else {
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
        }

        const unpay = await Order.find(_filter);
        console.log('total = ', total);
        console.log('unpay = ', unpay);
        if (total > 0) {
            if (unpay.length > 0) {
                return res.json({
                    status: 2,
                    data: unpay,
                    type: 'cancel',
                    message: '您的订单尚未支付！'
                });
            } else {
                if (
                    req.body.service.new_user_can_buy === 'true' ||
                    req.body.service.new_user_can_buy === true
                ) {
                    return res.json({
                        status: 1,
                        type: 'cancel',
                        message: '只有新用户才能享受过此优惠哦！'
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
    }

    console.log('req.body = ', req.body);

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
        // 服务时长 (每次)
        service_duration: req.body.service_duration,
        // 总服务时长
        total_service_duration: req.body.total_service_duration,
        // 总服务次数
        total_service_times: req.body.total_service_times,
        // 服务购买数量
        quantity: req.body.quantity,
        // 服务时间
        service_time: req.body.service_time,
        // 应付金额
        amount_payable: isNaN(req.body.amount_payable)
            ? req.body.service.sale_price
            : req.body.amount_payable,
        // 使用余额
        balance_reduce_price: isNaN(req.body.canUseBalance) ? 0 : req.body.canUseBalance,
        // 已付金额
        // amount_paid: 0,
        // 优惠券号
        pay_type: req.body.pay_type,
        // user_coupon: req.body.user_coupon !== undefined ? req.body.user_coupon : null,
        // amount_payable: req.body.amount_payable,
        // coupon_reduce_price: req.body.user_coupon.coupon.face_value !== undefined ? req.body.user_coupon.coupon.face_value : 0,
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
    // console.log('BEFORE create and pay order = ', order);
    order
        .save()
        .then(savedOrder => {
            console.log('savedOrder = ', savedOrder);
            if (req.body.user_coupon !== undefined) {
                UserCoupon.findByIdAndUpdate(req.body.user_coupon._id, {
                    status: 1,
                    updated_by: req.payload.user,
                    updated_time: Date.now()
                }).then(resp => {});
            }
            req.body.out_trade_no = savedOrder.order_code;
            req.body.body = req.body.service.title;
            req.body.total_fee =
                order.amount_payable - order.coupon_reduce_price - order.balance_reduce_price;
            if (savedOrder.order_from === '01') {
                //公众号
                getWechatMPPaymentParams(req, res, next);
            } else if (savedOrder.order_from === '03') {
                //App
                getWechatAppPaymentParams(req, res, next);
            }
        })
        .catch(e => next(e));
}

async function buyCardPay(req, res, next) {
    updateCellCount(req.body.service._id);
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
        // 服务购买数量
        quantity: req.body.quantity,
        remark: req.body.remark,
        // 应付金额
        amount_payable: req.body.amount_payable,
        // 优惠券号
        pay_type: req.body.pay_type,
        // 领取方式  1 - 实物卡； 2 - 虚拟卡； 3 - 直冲当前账号
        buy_type: req.body.buy_type,
        // 购买的卡金额  1 - 120元； 2 - 300元； 3 - 500元； 4 - 1000元；
        card_type: req.body.card_type,
        // 订单状态 0 - 待付款；1 - 已付款；2 - 待评价；3 - 已完成；
        status: req.body.status,
        // 01 - 公众号， 02 - 小程序
        order_from: req.body.order_from,
        // 创建人
        created_by: req.payload.user
    });
    // console.log('BEFORE create and pay order = ', order);
    order
        .save()
        .then(savedOrder => {
            console.log('savedOrder = ', savedOrder);
            req.body.out_trade_no = savedOrder.order_code;
            req.body.body = req.body.service.title;
            req.body.total_fee = order.amount_payable;
            if (savedOrder.order_from === '01') {
                //公众号
                getWechatMPPaymentParams(req, res, next);
            } else if (savedOrder.order_from === '03') {
                //App
                getWechatAppPaymentParams(req, res, next);
            }
        })
        .catch(e => next(e));
}

async function createAndNoPay(req, res, next) {
    console.log('user_coupon = ', req.body.user_coupon === '');
    updateCellCount(req.body.service._id);
    if (req.body.service.buy_once === 'true' || req.body.service.buy_once === true) {
        let _filter = {};
        if (
            req.body.service.new_user_can_buy === 'true' ||
            req.body.service.new_user_can_buy === true
        ) {
            _filter = {
                $and: [
                    {
                        user: req.payload.user
                    },
                    {
                        status: {
                            $in: [0, 1, 2, 3, 7]
                        }
                    }
                ]
            };
        } else {
            _filter = {
                $and: [
                    {
                        user: req.payload.user
                    },
                    {
                        service: req.body.service
                    },
                    {
                        status: {
                            $in: [0, 1, 2, 3, 7]
                        }
                    }
                ]
            };
        }

        let total = await Order.count(_filter);

        if (
            req.body.service.new_user_can_buy === 'true' ||
            req.body.service.new_user_can_buy === true
        ) {
            _filter = {
                $and: [
                    {
                        user: req.payload.user
                    },
                    {
                        status: 0
                    }
                ]
            };
        } else {
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
        }

        const unpay = await Order.find(_filter);
        console.log('total = ', total);
        console.log('unpay = ', unpay);
        if (total > 0) {
            if (unpay.length > 0) {
                return res.json({
                    status: 2,
                    data: unpay,
                    type: 'cancel',
                    message: '您的订单尚未支付！'
                });
            } else {
                if (
                    req.body.service.new_user_can_buy === 'true' ||
                    req.body.service.new_user_can_buy === true
                ) {
                    return res.json({
                        status: 1,
                        type: 'cancel',
                        message: '只有新用户才能享受过此优惠哦！'
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
    }

    console.log('req.body = ', req.body);

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
        // 服务时长 (每次)
        service_duration: req.body.service_duration,
        // 总服务时长
        total_service_duration: req.body.total_service_duration,
        // 总服务次数
        total_service_times: req.body.total_service_times,
        // 服务购买数量
        quantity: req.body.quantity,
        // 服务时间
        service_time: req.body.service_time,
        // 应付金额
        amount_payable: isNaN(req.body.amount_payable)
            ? req.body.service.sale_price
            : req.body.amount_payable,
        // 使用余额
        balance_reduce_price: isNaN(req.body.canUseBalance) ? 0 : req.body.canUseBalance,
        // 已付金额
        // amount_paid: 0,
        // 优惠券号
        pay_type: req.body.pay_type,
        // user_coupon: req.body.user_coupon !== undefined ? req.body.user_coupon : null,
        // amount_payable: req.body.amount_payable,
        // coupon_reduce_price: req.body.user_coupon.coupon.face_value !== undefined ? req.body.user_coupon.coupon.face_value : 0,
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
    // console.log('BEFORE create and pay order = ', order);
    order
        .save()
        .then(savedOrder => {
            console.log('savedOrder = ', savedOrder);
            // ---start----  扣除余额 ---------------
            User.findByIdAndUpdate(req.payload.user, {
                $inc: { balance: -req.body.canUseBalance },
                $push: {
                    remark: [new Date(), '余额消费 ' + req.body.canUseBalance]
                },
                updated_by: req.payload.user,
                updated_time: new Date()
            })
                .then(resp => {})
                .catch(e => next(e));
            // ---end----  扣除余额 ---------------
            // ----start---  增加消费记录 ---------------
            const userBalance = new UserBalance({
                user: req.payload.user,
                order: savedOrder,
                balance_type: '02', // 消费
                amount: req.body.canUseBalance,
                remark: '余额消费 ' + req.body.canUseBalance,
                created_by: req.payload.user
            });
            userBalance
                .save()
                .then(resp => {})
                .catch(e => next(e));
            // ----end---  增加消费记录 ---------------
            if (req.body.user_coupon !== undefined) {
                UserCoupon.findByIdAndUpdate(req.body.user_coupon._id, {
                    status: 1,
                    updated_by: req.payload.user,
                    updated_time: Date.now()
                }).then(resp => {});
            }
            if (savedOrder.order_from === '01') {
                //公众号
                //getWechatMPPaymentParams(req, res, next);
                handleNoPayOrder(savedOrder.order_code);
            } else if (savedOrder.order_from === '03') {
                //App
                //getWechatAppPaymentParams(req, res, next);
                handleNoPayOrder(savedOrder.order_code);
            }
            return res.json({
                status: 0,
                type: 'success',
                message: '支付成功'
            });
        })
        .catch(e => next(e));
}

function handleNoPayOrder(out_trade_no) {
    Order.findOneAndUpdate(
        { order_code: out_trade_no },
        {
            $set: {
                status: 1,
                pay_type: '02',
                amount_paid: 0,
                updated_time: new Date()
            }
        },
        { new: true }
    )
        .populate({
            path: 'user_coupon user service address',
            populate: {
                path: 'coupon'
            }
        })
        .exec((err, savedOrder) => {
            if (err) {
                console.log('修改订单状态出错');
                console.log(
                    '====createAndNoPay======== Pay Order Handling =end===========out_trade_no=',
                    out_trade_no
                );
                return;
            }
            console.log('saveOrder = ', savedOrder);
            console.log(
                '====createAndNoPay======== Pay Order Handling =end===========out_trade_no=',
                out_trade_no
            );
            if (!savedOrder.service.is_strict_selection) {
                // TODO 如果是单项服务，默认已预约1个服务
                const appointment = new Appointment({
                    user: savedOrder.created_by,
                    memo: savedOrder.memo,
                    suit_title: savedOrder.service.title,
                    total_price: savedOrder.amount_paid,
                    service_duration: savedOrder.service_duration,
                    service: savedOrder.service,
                    service_category: savedOrder.service.category,
                    contact_person: savedOrder.address.contact_person,
                    contact_phone: savedOrder.address.contact_phone,
                    contact_area: savedOrder.address.area,
                    contact_detail_address: savedOrder.address.detail_address,
                    service_time: savedOrder.service_time,
                    status: 0,
                    order: savedOrder._id,
                    created_by: savedOrder.created_by
                });
                console.log('appointment = ', appointment);
                appointment
                    .save()
                    .then(savedAppointment => {
                        if (savedOrder.order_from === '01') {
                            // wechat_pay_success_reminder(info, savedOrder)
                            pay_success_reminder_for_admin(savedOrder);
                        } else if (savedOrder.order_from === '02') {
                            // xcx_pay_success_reminder(info, savedOrder)
                        } else if (savedOrder.order_from === '03') {
                            pay_success_reminder_for_admin(savedOrder);
                        }
                    })
                    .catch(e => {});
            } else if (savedOrder.service.is_buy_and_order) {
                console.log('this is a no buy and order!!');
                const appointment = new Appointment({
                    user: savedOrder.created_by,
                    memo: savedOrder.memo,
                    suit_title: savedOrder.service.title,
                    total_price: savedOrder.amount_paid,
                    service_duration: savedOrder.service_duration,
                    service: savedOrder.service,
                    service_category: savedOrder.service.title,
                    contact_person: savedOrder.address.contact_person,
                    contact_phone: savedOrder.address.contact_phone,
                    contact_area: savedOrder.address.area,
                    contact_detail_address: savedOrder.address.detail_address,
                    service_time: savedOrder.service_time,
                    status: 0,
                    order: savedOrder._id,
                    created_by: savedOrder.created_by
                });
                console.log('appointment = ', appointment);
                appointment
                    .save()
                    .then(savedAppointment => {
                        if (savedOrder.order_from === '01') {
                            // wechat_pay_success_reminder(info, savedOrder)
                            pay_success_reminder_for_admin(savedOrder);
                        } else if (savedOrder.order_from === '02') {
                            // xcx_pay_success_reminder(info, savedOrder)
                        } else if (savedOrder.order_from === '03') {
                            pay_success_reminder_for_admin(savedOrder);
                        }
                    })
                    .catch(e => {});
            } else {
                console.log(savedOrder.service.sub_services);
                // console.log(Utils.addDate(180));
                savedOrder.service.sub_services.forEach(preapm => {
                    const preappointment = new Preappointment({
                        user: savedOrder.created_by,
                        order: savedOrder._id,
                        service: preapm.service,
                        duration: preapm.duration,
                        times: preapm.times,
                        suit_title: savedOrder.service.title + '-' + preapm.service_title,
                        contact_person: savedOrder.address.contact_person,
                        contact_phone: savedOrder.address.contact_phone,
                        contact_area: savedOrder.address.area,
                        contact_detail_address: savedOrder.address.detail_address,
                        expired_date: Utils.addDate(savedOrder.service.expire_date_count),
                        status: 0,
                        created_by: savedOrder.created_by,
                        created_time: Date.now()
                    });
                    console.log('preappointment = ', preappointment);
                    preappointment
                        .save()
                        .then(savePreappointment => {
                            console.log('savePreappointment = ', savePreappointment);
                        })
                        .catch(e => {
                            console.log(e);
                        });
                });
                if (savedOrder.order_from === '01') {
                    // wechat_pay_success_reminder(info, savedOrder)
                    pay_success_reminder_for_admin(savedOrder);
                } else if (savedOrder.order_from === '02') {
                    // xcx_pay_success_reminder(info, savedOrder)
                } else if (savedOrder.order_from === '03') {
                    pay_success_reminder_for_admin(savedOrder);
                }
            }
            console.log(
                '====createAndNoPay======== Pay Order Handling =end===========out_trade_no=',
                out_trade_no
            );
        });
}

/**
 * 创建助力活动订单和预约服务
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function createEventOrder(req, res, next) {
    console.log('user_coupon = ', req.body.user_coupon === '');
    updateCellCount(req.body.service._id);
    if (req.body.service.buy_once === 'true' || req.body.service.buy_once === true) {
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
        console.log('unpay = ', unpay);
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

    console.log('createEventOrder req.body = ', req.body);

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
        // 服务时长 (每次)
        service_duration: req.body.service_duration,
        // 总服务时长
        total_service_duration: req.body.total_service_duration,
        // 总服务次数
        total_service_times: req.body.total_service_times,
        // 服务购买数量
        quantity: req.body.quantity,
        // 服务时间
        service_time: req.body.service_time,
        // 应付金额
        amount_payable: isNaN(req.body.amount_payable)
            ? req.body.service.sale_price
            : req.body.amount_payable, // 助力活动
        // 已付金额
        amount_paid: 0, // 助力活动 已付金额 = 0
        // 优惠券号
        pay_type: req.body.pay_type,
        // user_coupon: req.body.user_coupon !== undefined ? req.body.user_coupon : null,
        // amount_payable: req.body.amount_payable,
        coupon_reduce_price: isNaN(req.body.amount_payable)
            ? req.body.service.sale_price
            : req.body.amount_payable,
        // 注意事项
        memo: req.body.memo,
        // 运营备注
        // remark: req.body.remark,
        // 订单状态 0 - 待付款；1 - 已付款；2 - 待评价；3 - 已完成；
        requirements: req.body.requirements,
        expected_baby_date: req.body.expected_baby_date,
        status: 1, // 助力活动 status = 1
        // 01 - 公众号， 02 - 小程序
        order_from: req.body.order_from,
        // 创建人
        created_by: req.payload.user
    });
    // console.log('BEFORE create and pay order = ', order);
    order
        .save()
        .then(savedOrder => {
            console.log('createEventOrder savedOrder = ', savedOrder);
            console.log(
                'createEventOrder - 直接购买 - 创建预约服务 - user = ',
                req.payload.nickname
            );
            const appointment = new Appointment({
                user: savedOrder.created_by,
                memo: savedOrder.memo,
                suit_title: req.body.service.title,
                total_price: savedOrder.amount_paid,
                service_duration: savedOrder.service_duration,
                service: savedOrder.service,
                service_category: req.body.service.title,
                contact_person: req.body.address.contact_person,
                contact_phone: req.body.address.contact_phone,
                contact_area: req.body.address.area,
                contact_detail_address: req.body.address.detail_address,
                service_time: savedOrder.service_time,
                status: 0,
                order: savedOrder._id,
                created_by: savedOrder.created_by
            });
            console.log('createEventOrder appointment = ', appointment);
            appointment
                .save()
                .then(savedAppointment => {
                    if (savedAppointment) {
                        const selectTime = req.body.selectTime;
                        updateTimePeriod(req.body.service._id, selectTime);
                        if (savedOrder.order_from === '01') {
                            savedOrder.service.title = req.body.service.title;
                            savedOrder.user.nickname = req.payload.nickname;
                            pay_success_reminder_for_admin(savedOrder);
                        } else if (savedOrder.order_from === '02') {
                            // xcx_pay_success_reminder(info, savedOrder);
                        } else if (savedOrder.order_from === '03') {
                        }
                        return res.json({
                            status: 0,
                            type: 'SUCCESS',
                            message: 'SUCCESS'
                        });
                    } else {
                        return res.json({
                            status: 1,
                            type: 'FAILED',
                            message: 'FAILED'
                        });
                    }
                })
                .catch(e => {});
        })
        .catch(e => next(e));
}

/**
 * 获取公众号微信支付参数  /mp/pay
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getWechatXcxPaymentParams(req, res, next) {
    const out_trade_no = req.body.out_trade_no;
    const body = req.body.body;
    const total_fee = req.body.total_fee;
    const openId = req.body.openId;
    const mp_wechat_config = {
        appid: config.wechat.wx_xcx_appid, // 公众号的appid
        mchid: config.wechat.wx_mp_mch_id, // 商户Id
        partnerKey: config.wechat.wx_mp_mch_key, // 商户密钥
        notify_url: config.wechat.wx_xcx_payment_notify_url, // 通知地址
        spbill_create_ip: '127.0.0.1'
        // pfx: fs.readFileSync('<location-of-your-apiclient-cert.p12>') // 可选, 退款等情况时需要用到
    };
    const Tenpay = new tenpay(mp_wechat_config);
    const order = {
        out_trade_no: out_trade_no,
        body: body,
        total_fee: total_fee * 100,
        openid: openId
    };
    console.log(mp_wechat_config);
    console.log(order);
    const params = await Tenpay.getPayParams(order);
    console.log(params);
    if (params) {
        return res.json({
            status: 0,
            type: 'SUCCESS',
            data: {
                params: params
            },
            message: 'SUCCESS'
        });
    } else {
        return res.json({
            status: 1,
            type: 'FAILED',
            message: 'FAILED'
        });
    }
}

/**
 * 获取公众号微信支付参数  /mp/pay
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getWechatXcxCardPaymentParams(req, res, next) {
    const out_trade_no = req.body.out_trade_no;
    const body = req.body.body;
    const total_fee = req.body.total_fee;
    const openId = req.body.openId;
    const mp_wechat_config = {
        appid: config.wechat.wx_xcxcard_appid, // 公众号的appid
        mchid: config.wechat.wx_mp_mch_id, // 商户Id
        partnerKey: config.wechat.wx_mp_mch_key, // 商户密钥
        notify_url: config.wechat.wx_xcxcard_payment_notify_url, // 通知地址
        spbill_create_ip: '127.0.0.1'
        // pfx: fs.readFileSync('<location-of-your-apiclient-cert.p12>') // 可选, 退款等情况时需要用到
    };
    const Tenpay = new tenpay(mp_wechat_config);
    const order = {
        out_trade_no: out_trade_no,
        body: body,
        total_fee: total_fee * 100,
        openid: openId
    };
    console.log(mp_wechat_config);
    console.log(order);
    const params = await Tenpay.getPayParams(order);
    console.log(params);
    if (params) {
        return res.json({
            status: 0,
            type: 'SUCCESS',
            data: {
                params: params
            },
            message: 'SUCCESS'
        });
    } else {
        return res.json({
            status: 1,
            type: 'FAILED',
            message: 'FAILED'
        });
    }
}

export default {
    getWechatAppPaymentParams,
    getWechatMPPaymentParams,
    getWechatXcxPaymentParams,
    getWechatXcxCardPaymentParams,
    createAndPay,
    createEventOrder,
    createAndNoPay,
    buyCardPay
};
