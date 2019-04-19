/*
 * @Author: Roy Chen
 * @Date: 2018-01-21 21:20:30
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-10-17 21:41:42
 */
import mongoose from 'mongoose';
import moment from 'moment';
import config from './config';
const Order = mongoose.model('Order');
const Appointment = mongoose.model('Appointment');
const Preappointment = mongoose.model('Preappointment');
const UserCoupon = mongoose.model('UserCoupon');
const Message = mongoose.model('Message');
import myJpush from '../server/helpers/jpush';
import wechatApi from '../server/helpers/wechatApi';
import {
    wechat_pay_success_reminder,
    xcx_pay_success_reminder,
    submit_reserve_reminder_for_admin
} from './reminder';
const prod = config.env === 'production'
/**
 * 检查订单 - 30分钟未支持自动关闭订单
 */
function checkOrder() {
    if (!prod) {
        console.info('Not production env, return directly' )
        return
    }
    const payOrderTime = 30; // 30分钟
    Order.find({
        status: 0, // 待付款
        is_reserve_order: false
    })
        .populate({
            path: 'user service'
        })
        .then((orders) => {
            if (orders && orders.length > 0) {
                console.log('发现未支付订单数: ', orders.length);
                orders.forEach((item) => {
                    if (
                        new Date(moment(item.created_time).add(payOrderTime, 'minutes')) <
                        new Date()
                    ) {
                        console.log('超时未支付的订单号: ', item.order_code);
                        Order.update(
                            {
                                _id: item._id
                            },
                            {
                                status: 4, // 交易关闭
                                is_auto_closed: true,
                                updated_time: new Date()
                            }
                        ).then((saveOrder) => {
                            const title = '订单未支付提醒';
                            const content = '您有一个订单超过30分钟未支付，系统自动关闭订单。';
                            const message = new Message({
                                user: item.user._id,
                                title,
                                content,
                                redirect_url: '/order'
                            });
                            message
                                .save()
                                .then((savedMessage) => {
                                    myJpush.pushNotification(
                                        savedMessage.user,
                                        content,
                                        title,
                                        '+1',
                                        {
                                            type: 'ORDER_REMINDER'
                                        }
                                    );
                                    // wechat_pay_success_reminder(item);
                                    // xcx_pay_success_reminder(item);
                                    if (
                                        item.user.wechat_openid !== null &&
                                        item.user.wechat_openid !== '' &&
                                        item.user.wechat_openid !== undefined
                                    ) {
                                        const data = {
                                            first: { value: content },
                                            keyword1: { value: item.order_code },
                                            keyword2: {
                                                value: moment(item.created_time).format(
                                                    'YYYY-MM-DD hh:mm:ss'
                                                )
                                            },
                                            keyword3: { value: item.service.title },
                                            remark: { value: '请重新下单，欢迎继续关注了了管家' }
                                        };
                                        wechatApi.sendTemplate(
                                            item.user.wechat_openid,
                                            'VhY1wtPiaQLDlYhR9bEw7rDLcQE7LFkRGIzvCd7Ah50',
                                            'http://wechat.llguanjia.com/#/order',
                                            '#000000',
                                            data
                                        );
                                    }
                                })
                                .catch((e) => {
                                    console.error('scheduler error = ', e);
                                });
                        });
                    }
                });
            }
        });
}

/**
 * 检查待回访订单 - 15分钟运行一次
 */
function checkReserveOrder() {
    if (!prod) {
        console.info('Not production env, return directly' )
        return
    }
    Order.find({
        status: 5, // 待回访
        is_reserve_order: true
    })
        .populate({
            path: 'user service address'
        })
        .then((orders) => {
            if (orders && orders.length > 0) {
                console.log('发现待回访订单数: ', orders.length);
                orders.forEach((item) => {
                    submit_reserve_reminder_for_admin(item);
                });
            }
        });
}

function checkAppointment() {
    if (!prod) {
        console.info('Not production env, return directly' )
        return
    }
    Appointment.update(
        {
            status: 1, // 已分配
            service_time: {
                $lt: new Date()
            }
        },
        {
            status: 2, // 服务中
            updated_time: new Date()
        },
        {
            multi: true
        }
    ).then((savedAppointment) => {
        console.log('[checkAppointment]', savedAppointment);
    });
}

function expirePreappointment() {
    if (!prod) {
        console.info('Not production env, return directly' )
        return
    }
    Preappointment.update(
        {
            status: 0,
            expired_date: {
                $lt: new Date()
            }
        },
        {
            status: 2, // 已过期
            updated_time: new Date()
        },
        {
            multi: true
        }
    ).then((savedPreAppointment) => {
        console.log('[expirePreappointment]',savedPreAppointment);
    });
}

/**
 * 优惠券过期提醒
 */
function couponReminder() {
    if (!prod) {
        console.info('Not production env, return directly' )
        return
    }
    // 3天后时间
    const check_time = new Date(moment().add(3, 'days'));
    UserCoupon.find({
        status: 0, // 未使用
        expire_date: {
            $gt: check_time
        },
        remind_times: {
            $lt: 3
        }
    })
        .populate({
            path: 'user coupon service'
        })
        .exec()
        .then((userCoupons) => {
            if (userCoupons && userCoupons.length > 0) {
                console.log('发现过期的优惠券数: ', userCoupons.length);
                userCoupons.forEach((item) => {
                    const title = '优惠券过期提醒';
                    const content = `亲，您有一张${
                        item.coupon.face_value
                    }元优惠券就要过期啦，快来逛逛吧。`;
                    const message = new Message({
                        user: item.user._id,
                        title,
                        content,
                        redirect_url: '/coupon'
                    });
                    message
                        .save()
                        .then((savedMessage) => {
                            myJpush.pushNotification(savedMessage.user, content, title, '+1', {
                                type: 'COUPON_REMINDER'
                            });
                        })
                        .catch((e) => {});
                    UserCoupon.update(
                        { _id: item._id },
                        {
                            $inc: { remind_times: 1 }
                        }
                    )
                        .then((savedCoupon) => {})
                        .catch((e) => {
                            console.error(e);
                        });
                });
            }
        });
}

/**
 * 自动设置优惠券为过期状态
 */
function expireCoupon() {
    if (!prod) {
        console.info('Not production env, return directly' )
        return
    }
    UserCoupon.update(
        {
            status: 0, // 未使用
            expire_date: {
                $lt: new Date()
            }
        },
        {
            status: 2, // 过期
            updated_time: new Date()
        },
        {
            multi: true
        }
    ).then((savedCoupon) => {
        console.log('[expireCoupon]', savedCoupon);
    });
}

export default {
    checkAppointment,
    expirePreappointment,
    checkOrder,
    checkReserveOrder,
    expireCoupon,
    couponReminder
};
