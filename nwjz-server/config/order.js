/*
 * @Author: Roy Chen
 * @Date: 2018-01-21 21:20:30
 * @Last Modified by: Arnie Carter
 * @Last Modified time: 2018-09-21 02:03:13
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-11-01 14:25:34
 */
import mongoose from 'mongoose';
import moment from 'moment';
import Utils from '../server/helpers/Utils';
const Order = mongoose.model('Order');
const Appointment = mongoose.model('Appointment');
const Preappointment = mongoose.model('Preappointment');
const UserBalance = mongoose.model('UserBalance');
const Card = mongoose.model('Card');
const UserCard = mongoose.model('UserCard');
const Counters = mongoose.model('Counters');
const CardEntity = mongoose.model('CardEntity');

import { wechat_pay_success_reminder, xcx_pay_success_reminder, pay_success_reminder_for_admin } from './reminder';

/**
 * 微信支付后，业务逻辑...
 * @param {*} info
 */
function handlePayOrder(info) {
    console.log(
        '====wechat rollback call======== Pay Order Handling =start===========out_trade_no=',
        info.out_trade_no
    );
    console.log('callback info = ', info);
    if (info && info.result_code && info.result_code === 'SUCCESS') {
        //     { appid: 'wxa3f0a849e754785c',
        //   bank_type: 'CFT',
        //   cash_fee: '1',
        //   fee_type: 'CNY',
        //   is_subscribe: 'N',
        //   mch_id: '1499346172',
        //   nonce_str: 'yimo7nz2t5Ofh5lU',
        //   openid: 'odOa11Q1JjmKO6qBie3vk1-_FpkA',
        //   out_trade_no: '20180319223802653904',
        //   result_code: 'SUCCESS',
        //   return_code: 'SUCCESS',
        //   sign: '29348AD10A146EC52350592CCAEC4770',
        //   time_end: '20180319223816',
        //   total_fee: '1',
        //   trade_type: 'APP',
        //   transaction_id: '4200000093201803191889529573' }
        const out_trade_no = info.out_trade_no;
        const trade_type = info.trade_type;
        const transaction_id = info.transaction_id;
        const total_fee = info.total_fee;
        Order.findOneAndUpdate(
            { order_code: out_trade_no },
            {
                $set: {
                    status: 1,
                    pay_type: '01',
                    amount_paid: total_fee / 100,
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
                        '====wechat rollback call======== Pay Order Handling =end===========out_trade_no=',
                        info.out_trade_no
                    );
                    return;
                }
                console.log('saveOrder = ', savedOrder);
                if (!savedOrder.service.is_strict_selection) {
                    console.log('===单项服务购买===');
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
                    appointment.remark.push(moment().format('YYYY-MM-DD HH:mm:ss') + ' 用户预约服务');
                    console.log('appointment = ', appointment);
                    appointment
                        .save()
                        .then(savedAppointment => {
                            if (savedOrder.order_from === '01') {
                                wechat_pay_success_reminder(info, savedOrder);
                            } else if (savedOrder.order_from === '02') {
                                xcx_pay_success_reminder(info, savedOrder);
                            } else if (savedOrder.order_from === '03') {
                                pay_success_reminder_for_admin(savedOrder);
                            }
                        })
                        .catch(e => {});
                } else if (savedOrder.service.is_buy_and_order) {
                    console.log('===套餐并选择直接购买服务，如99元===');
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
                    appointment.remark.push(moment().format('YYYY-MM-DD HH:mm:ss') + ' 用户预约服务');
                    appointment
                        .save()
                        .then(savedAppointment => {
                            if (savedOrder.order_from === '01') {
                                wechat_pay_success_reminder(info, savedOrder);
                            } else if (savedOrder.order_from === '02') {
                                xcx_pay_success_reminder(info, savedOrder);
                            } else if (savedOrder.order_from === '03') {
                                pay_success_reminder_for_admin(savedOrder);
                            }
                        })
                        .catch(e => {});
                } else {
                    // 保洁卡充值功能
                    if (savedOrder.service.is_card) {
                        console.log('===进入卖卡程序===');
                        if (savedOrder.buy_type === 1) {
                            console.log('===实体卡===');
                            // 实体卡
                            // ..to do something.....
                        } else if (savedOrder.buy_type === 2) {
                            console.log('===虚拟卡===');
                            //虚拟卡
                            Card.findOne({ card_type: savedOrder.card_type }).then(async card => {
                                console.log('===卡类型===', card);
                                await createVirtualCard(savedOrder.created_by, card, savedOrder.quantity);
                            });
                        } else if (savedOrder.buy_type === 3) {
                            console.log('===直冲===');
                            // 直冲
                            let face_value = 0;
                            switch (savedOrder.card_type) {
                                case '1':
                                    face_value = 120;
                                case '2':
                                    face_value = 300;
                                case '3':
                                    face_value = 500;
                                case '4':
                                    face_value = 1000;
                            }
                            const userBalance = new UserBalance({
                                user: savedOrder.created_by,
                                balance_type: '01', // 充值
                                charge_way: '02', // 保洁卡充值
                                amount: face_value,
                                remark: '保洁卡充值',
                                created_by: savedOrder.created_by
                            });
                            userBalance.save().then(saveUserBalance => {
                                if (saveUserBalance) {
                                    User.findByIdAndUpdate(savedOrder.created_by, {
                                        $inc: { balance: face_value },
                                        $push: {
                                            remark: [new Date(), `保洁卡充值 ${face_value}`]
                                        },
                                        updated_by: savedOrder.created_by,
                                        updated_time: new Date()
                                    })
                                        .then(resp => {})
                                        .catch(e => next(e));
                                }
                            });
                        }
                        if (savedOrder.order_from === '01') {
                            wechat_pay_success_reminder(info, savedOrder);
                        }
                    } else {
                        console.log('===套餐===');
                        console.log(savedOrder.service.sub_services);
                        // console.log(Utils.addDate(180));
                        savedOrder.service.sub_services.forEach(preapm => {
                            const preappointment = new Preappointment({
                                user: savedOrder.created_by,
                                order: savedOrder._id,
                                service: preapm.service,
                                duration: preapm.duration,
                                times: preapm.times,
                                suit_title: `${savedOrder.service.title}-${preapm.service_title}`,
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
                            wechat_pay_success_reminder(info, savedOrder);
                        } else if (savedOrder.order_from === '02') {
                            xcx_pay_success_reminder(info, savedOrder);
                        } else if (savedOrder.order_from === '03') {
                            pay_success_reminder_for_admin(savedOrder);
                        }
                    }
                }
                console.log(
                    '====wechat rollback call======== Pay Order Handling =end===========out_trade_no=',
                    info.out_trade_no
                );
            });
    } else {
        console.log('Do nothing!');
        console.log(
            '====wechat rollback call======== Pay Order Handling =end============out_trade_no=',
            info.out_trade_no
        );
    }
}

/**
 * 生成虚拟卡
 * @param {*} card_id
 * @param {*} face_value
 * @param {*} count
 */
async function createVirtualCard(user, card, count) {
    const card_num_length = 7;
    console.log('===进入制卡程序===');
    for (var i = 0; i < count; i++) {
        const card_num_suffix = await Counters.getNextVirtualCardNum(card._id.toString());
        const card_num = '9' + Utils.buquan(card_num_suffix.card_number_seq, card_num_length);
        console.log('+++进入制卡程序+++, card_num = ', card_num)
        let loop = true;
        let pwd = '';
        while (loop) {
            pwd = Utils.randomPassword(8);
            const checkPWD = await CardEntity.count({ card_org_pwd: pwd });
            if (checkPWD < 1) {
                loop = false;
            }
            console.log('===loop===', checkPWD);
        }
        const cardEntity = new CardEntity({
            card: card._id,
            card_number: card_num,
            card_pwd: Utils.md5(pwd.toLowerCase()),
            card_org_pwd: pwd,
            status: 1,
            remark: '程序生成虚拟卡' + card_num,
            virtual: 1
        });

        cardEntity.save().then(savedCE => {
            const userCard = new UserCard({
                user: user,
                card_entity: savedCE._id,
                remark: savedCE.remark,
                created_by: user
            });
            userCard.save().then(abc => {
                console.log('===卖卡成功===');
            });
        });
    }
}

export default {
    handlePayOrder
};
