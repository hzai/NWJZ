/*
 * @Author: Roy Chen
 * @Date: 2018-01-21 21:20:30
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-19 13:19:34
 */
import moment from 'moment';
import config from './config';
import wechatApi from '../server/helpers/wechatApi';
import mongoose from 'mongoose';
const User = mongoose.model('User');
const Message = mongoose.model('Message');
const Order = mongoose.model('Order');
const Preappointment = mongoose.model('Preappointment');
import myJpush from '../server/helpers/jpush';
import Utils from '../server/helpers/Utils';

const prod = config.env === 'production';

const admin_openid = [
    {
        openid: 'oFjz600zrQ9T_udVZp0li_s3nU4E' // Roy
    },
    {
        openid: 'oFjz602sr6lpPMoIT-RXzHMouzjc' // Arnie 17603013120
    },
    {
        openid: 'oFjz602F_OrBY6KafTBpBzinN6u8' // 13392812662
    }
    // ,
    // {
    //     openid: 'oFjz6046RLhVLO9MErtMhLRSdprY' // Yoyo
    // }
];

/**
 * 微信支付成功提醒 - 给后台管理员
 * @param {*} order
 */
function pay_success_reminder_for_admin(order) {
    if (!prod) {
        console.info('Not production env, return directly');
        return;
    }
    const templateId = 'GC_5h8ewhyr2ZJLajuznYyZPV2dmTCUTg2y2U60jiPo';
    const redirect_url = 'http://wechat.llguanjia.com';
    // console.log('order = ', order)
    admin_openid.forEach(item => {
        const data = {
            first: {
                value: '有一笔订单微信支付成功！- 提醒',
                color: '#ff0000'
            },
            keyword1: {
                value: moment(order.updated_time).format('YYYY-MM-DD hh:mm:ss')
            },
            keyword2: { value: order.user.nickname },
            keyword3: {
                value:
                    order.order_from === '01'
                        ? '01 - 公众号购买'
                        : order.order_from === '02'
                        ? '02 - 小程序购买'
                        : '03 - APP购买',
                color: '#00FF00'
            },
            keyword4: { value: order.service.title },
            keyword5: { value: `${order.amount_paid}元` },
            remark: {
                value: '接单啦 - 请在后台系统或小程序处理订单！',
                color: '#0000FF'
            }
        };
        wechatApi.sendTemplate(
            item.openid,
            templateId,
            redirect_url,
            '#000000',
            data
        );
    });
}

/**
 * 预约单提醒 （for 定期保洁，住家保姆 等预约单）
 * @param {*} order
 */
function submit_reserve_reminder_for_admin(order) {
    if (!prod) {
        console.info('Not production env, return directly');
        return;
    }
    const templateId = 'qAqXdpAyNsEvKEOw5uzTESp3YZk-kAWDOBdyiOZLkzE';
    // 模板消息
    // {{first.DATA}}
    // 顾客名称：{{keyword1.DATA}}
    // 顾客电话：{{keyword2.DATA}}
    // 顾客地址：{{keyword3.DATA}}
    // 服务项目：{{keyword4.DATA}}
    // 预约时间：{{keyword5.DATA}}
    // {{remark.DATA}}
    const redirect_url = 'http://wechat.llguanjia.com';
    // console.log('order = ', order)
    Order.findById(order._id)
        .populate({
            path: 'user service address'
        })
        .then(foundOrder => {
            if (foundOrder !== null) {
                admin_openid.forEach(item => {
                    const data = {
                        first: {
                            value: '系统有新的预约服务订单，请尽快处理 - 提醒',
                            color: '#ff0000'
                        },
                        keyword1: { value: foundOrder.address.contact_person },
                        keyword2: { value: foundOrder.address.contact_phone },
                        keyword3: { value: foundOrder.address.detail_address },
                        keyword4: { value: foundOrder.service.title },
                        keyword5: {
                            value: moment(foundOrder.created_time).format(
                                'YYYY-MM-DD hh:mm:ss'
                            )
                        },
                        remark: {
                            value:
                                '打开小程序或者后台管理系统查看详情，请尽快电话回访',
                            color: '#0000FF'
                        }
                    };
                    wechatApi.sendTemplate(
                        item.openid,
                        templateId,
                        redirect_url,
                        '#000000',
                        data
                    );
                });
            }
        });
}

/**
 * 微信支付成功提醒
 * @param {*} order
 */
function wechat_pay_success_reminder(info, order) {
    if (!prod) {
        console.info('Not production env, return directly');
        return;
    }
    const templateId = '_Dg1annCUEFkvG_mz7fEZY5HhBV1iHkYIXbhs-VoC8I';
    const redirect_url =
        'http://wechat.llguanjia.com/#/serdetail?serviceId=5affe389f398671f8a3da84c';
    // console.log('order = ', order)
    if (
        info.openid !== null &&
        info.openid !== '' &&
        info.openid !== undefined
    ) {
        const data = {
            first: { value: '您好，您的订单已支付成功！' },
            keyword1: { value: order.service.title },
            keyword2: { value: order.order_code },
            keyword3: { value: `${order.amount_paid}元` },
            remark: {
                value:
                    '现在仅需132元即可享受原价200元4小时专业保洁+做饭，做饭搞卫生两不误！'
            }
        };
        wechatApi.sendTemplate(
            info.openid,
            templateId,
            redirect_url,
            '#000000',
            data
        );
        pay_success_reminder_for_admin(order);
    }
}

/**
 * 小程序支付成功提醒
 * @param {*} order
 */
function xcx_pay_success_reminder(info, order) {
    if (!prod) {
        console.info('Not production env, return directly');
        return;
    }
    const templateId = 'kRSGWPW_ijcfZyFM513DY1xKvXiNLZT_1wmZXmQodTM';
    const redirect_url =
        'http://wechat.llguanjia.com/#/serdetail?serviceId=5affe389f398671f8a3da84c';
    // console.log('order = ', order)
    if (
        info.openid !== null &&
        info.openid !== '' &&
        info.openid !== undefined
    ) {
        const data = {
            first: { value: '您好，您的订单已支付成功！' },
            keyword1: { value: order.service.title },
            keyword2: { value: order.order_code },
            keyword3: { value: `${order.amount_paid}元` }
        };
        console.log('data = ', data);
        wechatApi.sendMiniProgramTemplate(
            info.openid,
            templateId,
            redirect_url,
            config.wechat.wx_xcx_appid,
            'pages/servicedetail/servicedetail',
            data,
            '#000000'
        );
        pay_success_reminder_for_admin(order);
    }
}

/**
 * 微信订单已接单提醒
 * @param {*} order
 */
function pick_order_success_reminder(appointment) {
    if (!prod) {
        console.info('Not production env, return directly');
        return;
    }
    console.log(
        'wechat_pick_order_success_reminder appointment = ',
        appointment
    );
    // oFjz600zrQ9T_udVZp0li_s3nU4E
    User.findById(appointment.user)
        .then(foundUser => {
            if (foundUser) {
                const title = '订单预约成功';
                const content = `您购买的${
                    appointment.suit_title
                }服务订单已经预约成功，感谢您的惠顾！祝您生活愉快！`;
                const message = new Message({
                    user: foundUser._id,
                    title,
                    content,
                    redirect_url: `/apmdetail?apmId=${appointment._id}`
                });
                message
                    .save()
                    .then(savedMessage => {
                        // 1 - 发提醒短信
                        Utils.sendSMS(
                            appointment.contact_phone,
                            config.sms.pickOrderTemplateCode,
                            `{"title": "${appointment.suit_title}"}`
                        );
                        // 2- APP推送
                        myJpush.pushNotification(
                            savedMessage.user,
                            content,
                            title,
                            '+1',
                            {
                                type: 'ORDER_REMINDER'
                            }
                        );
                        // 3 - 公众号推送
                        if (
                            foundUser.wechat_openid !== null &&
                            foundUser.wechat_openid !== '' &&
                            foundUser.wechat_openid !== undefined
                        ) {
                            const openid = foundUser.wechat_openid;
                            console.log('original target openid = ', openid);
                            // openid = 'oFjz600zrQ9T_udVZp0li_s3nU4E';
                            // console.log('current target openid = ', openid);
                            const templateId =
                                '2tJw9B1mWQGJ6MVfro4eIzv5MHixfHty77QKb4IlxDc';
                            // 模板消息
                            // {{first.DATA}}
                            // 订单类型：{{keyword1.DATA}}
                            // 订单编号：{{keyword2.DATA}}
                            // 订单状态：{{keyword3.DATA}}
                            // 接单时间：{{keyword4.DATA}}
                            // 接单人信息：{{keyword5.DATA}}
                            // {{remark.DATA}}
                            const redirect_url = `http://wechat.llguanjia.com/#/apmdetail?apmId=${
                                appointment._id
                            }`;
                            const data = {
                                first: {
                                    value:
                                        '尊敬的顾客您好，您购买的服务订单已经预约成功，感谢您的惠顾！祝您生活愉快！\n\n'
                                },
                                keyword1: { value: appointment.suit_title },
                                keyword2: {
                                    value: appointment.order.order_code
                                },
                                keyword3: { value: '已接单' },
                                keyword4: {
                                    value: moment().format(
                                        'YYYY-MM-DD hh:mm:ss'
                                    )
                                },
                                keyword5: { value: '了了管家' },
                                remark: {
                                    value: '点击查看详情',
                                    color: '#ff0000'
                                }
                            };
                            wechatApi.sendTemplate(
                                openid,
                                templateId,
                                redirect_url,
                                '#000000',
                                data
                            );
                        }
                    })
                    .catch(e => {
                        console.log('scheduler error = ', e);
                    });
            } else {
                console.log('找不到该用户 - ', user);
            }
        })
        .catch(e => next(e));
}

/**
 * 服务完成提醒
 * @param {*} appointment
 */
function complete_appointment_reminder(appointment) {
    if (!prod) {
        console.info('Not production env, return directly');
        return;
    }
    console.log(
        'complete_appointment_reminder_reminder appointment = ',
        appointment
    );
    // oFjz600zrQ9T_udVZp0li_s3nU4E
    User.findById(appointment.user)
        .then(foundUser => {
            if (foundUser) {
                const title = '服务完成提醒';
                const content = `您预约的${
                    appointment.suit_title
                }服务订单已经完成，感谢您使用了了管家服务！请对我们的服务进行评价，感谢您的支持！`;
                const message = new Message({
                    user: foundUser._id,
                    title,
                    content,
                    redirect_url: `/orderdetail?orderId=${
                        appointment.order._id
                    }`
                });
                message
                    .save()
                    .then(savedMessage => {
                        // 1 - 发提醒短信
                        // Utils.sendSMS(appointment.contact_phone, config.sms.pickOrderTemplateCode,'{"title": "' + appointment.suit_title + '"}')
                        // 2- APP推送
                        myJpush.pushNotification(
                            savedMessage.user,
                            content,
                            title,
                            '+1',
                            {
                                type: 'ORDER_REMINDER'
                            }
                        );
                        // 3 - 公众号推送
                        if (
                            foundUser.wechat_openid !== null &&
                            foundUser.wechat_openid !== '' &&
                            foundUser.wechat_openid !== undefined
                        ) {
                            const openid = foundUser.wechat_openid;
                            console.log('original target openid = ', openid);
                            // openid = 'oFjz600zrQ9T_udVZp0li_s3nU4E';
                            // console.log('current target openid = ', openid);
                            const templateId =
                                '7wEn0-Q6mXHPi1vA77Y6jDv2E-TX2qqxQfiC67DUG4g';
                            // {{first.DATA}}
                            // 服务地址：{{keyword1.DATA}}
                            // 服务完成时间：{{keyword2.DATA}}
                            // {{remark.DATA}}
                            const redirect_url = `http://wechat.llguanjia.com/#/orderdetail?orderId=${
                                appointment.order._id
                            }`;
                            const data = {
                                first: {
                                    value: `尊敬的顾客您好，您预约的服务订单已经完成。\n\n订单编号: ${
                                        appointment.order.order_code
                                    }\n服务内容: ${
                                        appointment.suit_title
                                    }\n服务时间: ${moment(
                                        appointment.service_time
                                    ).format('YYYY-MM-DD hh:mm:ss')}`
                                },
                                keyword1: {
                                    value: appointment.contact_detail_address
                                },
                                keyword2: {
                                    value: moment(appointment.service_time)
                                        .add(
                                            appointment.service_duration,
                                            'hours'
                                        )
                                        .format('YYYY-MM-DD hh:mm:ss')
                                },
                                remark: {
                                    value:
                                        '感谢您使用【了了管家】服务！请对我们的服务进行评价，感谢您的支持！',
                                    color: '#ff0000'
                                }
                            };
                            wechatApi.sendTemplate(
                                openid,
                                templateId,
                                redirect_url,
                                '#000000',
                                data
                            );
                        }
                    })
                    .catch(e => {
                        console.log('save message error = ', e);
                    });
            } else {
                console.log('找不到该用户 - ', user);
            }
        })
        .catch(e => next(e));
}

/**
 * 有人评论提醒 - for admin
 */
function create_comment_reminder_for_admin(comment) {
    if (!prod) {
        console.info('Not production env, return directly');
        return;
    }
    console.log('==create_comment_reminder_for_admin== comment = ', comment);
    const templateId = 'zti3kk3_mX5Q4S4GKol8E_p4tHJjDrcvGYYZu_jyohc';
    // {{first.DATA}}
    // 会员账号：{{keyword1.DATA}}
    // 订单总额：{{keyword2.DATA}}
    // 订单编号：{{keyword3.DATA}}
    // 评价时间：{{keyword4.DATA}}
    // {{remark.DATA}}

    const redirect_url = `http://wechat.llguanjia.com/#/serdetail?serviceId=${
        comment.service
    }`;
    // console.log('order = ', order)
    admin_openid.forEach(item => {
        const data = {
            first: {
                value: '有一笔订单会员已评价，请注意查看 - 提醒',
                color: '#ff0000'
            },
            keyword1: {
                value: comment.user_name
            },
            keyword2: { value: '' },
            keyword3: { value: '' },
            keyword4: {
                value: moment(comment.created_time).format(
                    'YYYY-MM-DD hh:mm:ss'
                )
            },
            remark: { value: `\n\n${comment.org_content}`, color: '#0000FF' }
        };
        wechatApi.sendTemplate(
            item.openid,
            templateId,
            redirect_url,
            '#000000',
            data
        );
    });
}

/**
 * 处理过期未预约的提醒 - 每周日 20:00 提醒
 */
function expire_preappointment_reminder() {
    if (!prod) {
        console.info('Not production env, return directly');
        return;
    }
    console.log('---开始处理过期未预约的提醒----');
    Preappointment.find({
        status: 0,
        expired_date: {
            $gt: new Date()
        },
        user: { $ne: '5b162a15d44f6f44c1d4503a' }
    })
        .populate({
            path: 'user'
        })
        .then(findPapms => {
            // console.log('findPapms = ', findPapms);
            findPapms.forEach(item => {
                const title = '订单到期提醒';
                const content = `尊敬的顾客您好！您购买的${
                    item.suit_title
                }即将到期！请及时预约。`;
                const message = new Message({
                    user: item.user._id,
                    title,
                    content,
                    redirect_url: `/preapmdetail?preapmId=${item._id}`
                });
                message
                    .save()
                    .then(savedMessage => {
                        console.log('savedMessage = ', savedMessage);
                        // 1 - 发提醒短信
                        Utils.sendSMS(
                            item.contact_phone,
                            config.sms.expiredPapmReminderTemplateCode,
                            `{"title": "${item.suit_title}"}`
                        );
                        // 2- APP推送
                        myJpush.pushNotification(
                            savedMessage.user,
                            content,
                            title,
                            '+1',
                            {
                                type: 'ORDER_REMINDER'
                            }
                        );
                        // 3 - 公众号推送
                        if (
                            item.user.wechat_openid !== null &&
                            item.user.wechat_openid !== '' &&
                            item.user.wechat_openid !== undefined
                        ) {
                            const openid = item.user.wechat_openid;
                            console.log('original target openid = ', openid);
                            // openid = 'oFjz600zrQ9T_udVZp0li_s3nU4E';
                            // console.log('current target openid = ', openid);
                            const templateId =
                                'g9Hgwrzbj-bsRaWQePf1rFlJ_yq_TTwPz7FzPHkHvQQ';
                            // 模板消息
                            // {{first.DATA}}
                            // 订购产品：{{keyword1.DATA}}
                            // 剩余数量：{{keyword2.DATA}}
                            // 到期时间：{{keyword3.DATA}}
                            // {{remark.DATA}}
                            const redirect_url = `http://wechat.llguanjia.com/#/preapmdetail?preapmId=${
                                item._id
                            }`;
                            const data = {
                                first: {
                                    value:
                                        '尊敬的顾客您好，您购买的' +
                                        item.suit_title +
                                        '即将过期，请及时预约，感谢您的惠顾！祝您生活愉快！\n\n'
                                },
                                keyword1: { value: item.suit_title },
                                keyword2: { value: item.times },
                                keyword3: {
                                    value: moment(item.expired_date).format(
                                        'YYYY-MM-DD hh:mm:ss'
                                    )
                                },
                                remark: {
                                    value: '点击查看详情',
                                    color: '#ff0000'
                                }
                            };
                            wechatApi.sendTemplate(
                                openid,
                                templateId,
                                redirect_url,
                                '#000000',
                                data
                            );
                        }
                    })
                    .catch(e => {
                        console.log('scheduler error = ', e);
                    });
            });
        });
}

export default {
    pay_success_reminder_for_admin,
    submit_reserve_reminder_for_admin,
    wechat_pay_success_reminder,
    xcx_pay_success_reminder,
    pick_order_success_reminder,
    complete_appointment_reminder,
    create_comment_reminder_for_admin,
    expire_preappointment_reminder
};
