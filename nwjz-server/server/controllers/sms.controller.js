/*
 * @Author: Roy Chen
 * @Date: 2018-01-12 17:33:04
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-03-19 13:45:41
 */
import moment from 'moment';
import redis from 'redis';
import Utils from '../helpers/Utils';
const config = require('../../config/config');
const SMSClient = require('@alicloud/sms-sdk');

// constant
const sendSwitch = config.sms.switch === '1' ? true: false;
const SMS_DB_NUM = 1;
const SMS_KEY = 'sms:';

// smsClient
let smsClient = new SMSClient({
    accessKeyId: config.sms.accessKeyId,
    secretAccessKey: config.sms.secretAccessKey
})

/**
 * sendRegisterSMS
 * @param req
 * @param res
 * @param next
 */
function sendRegisterSMS(req, res, next) {
    sendSMS(req, res, next, config.sms.registerTemplateCode);
}
/**
 * sendForgetSMS
 * @param req
 * @param res
 * @param next
 */
function sendForgetSMS(req, res, next) {
    sendSMS(req, res, next, config.sms.forgetTemplateCode);
}

/**
 * sendSMS
 * @param req
 * @param res
 * @param next
 * @param smsTemplateCode
 */
function sendSMS(req, res, next, smsTemplateCode) {
    if (req.body.mobile === null || req.body.mobile === undefined) {
        return res.send({
            status: 1,
            type: 'FAILED',
            message: '短信验证码发送失败，请传入正确的手机号码'
        })
    }
    const mobile = req.body.mobile;
    const client = redis.createClient({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.pwd
    });

    client.on('error', (err) => {
        console.log('error ' + err);
    });

    client.select(SMS_DB_NUM);
    client.hgetall(SMS_KEY + mobile, (err, reply) => {
        if (err) {
            return res.send({
                status: -1,
                type: 'FAILED',
                message: '短信验证码获取失败!,请稍后再试!'
            })
        }
        if (!reply) {
            let code = Utils.genRandomCode(4);
            const info = {
                first_time: Date.now(),
                sent_time: Date.now(),
                code: code,
                times: 1,
                verified: '0'
            };
            if (sendSwitch) { // switch on
                console.log('验证码 = ', code)
                send(res, next, client, mobile, smsTemplateCode, code, info);
            } else { // switch off
                console.log('验证码 = ', code)
                client.select(SMS_DB_NUM);
                client.hmset(SMS_KEY + mobile, info, redis.print);
                client.expire(SMS_KEY + mobile, config.sms.expiredTime);
                client.quit();
                return res.send({
                    status: 0,
                    type: 'SUCCESS',
                    message: '短信验证码发送成功'
                })
            }
        } else {
            const code = Utils.genRandomCode(4);
            const firstTime = reply.first_time;
            const lastSentTime = reply.sent_time;
            const times = Number(reply.times);
            const diff = Number(moment.duration(Date.now() - firstTime).get('hours'));
            const diffMinutes = Number(moment.duration(Date.now() - lastSentTime).get('minutes'));
            if (diffMinutes < 1) {
                return res.send({
                    status: 1,
                    type: 'FAILED',
                    message: '短信验证码获取太频繁!,请稍后再试!'
                })
            }
            if (diff < 1 && times >= 5) {
                return res.send({
                    status: 1,
                    type: 'FAILED',
                    message: '验证码获取次数过多,请稍后再试!'
                })
            }
            const info = {
                first_time: firstTime,
                sent_time: Date.now(),
                code: code,
                times: times + 1,
                verified: '0'
            };
            if (sendSwitch) { // switch on
                console.log('验证码 = ', code)
                send(res, next, client, mobile, smsTemplateCode, code, info);
            } else { // switch off
                console.log('验证码 = ', code)
                client.select(SMS_DB_NUM);
                client.hmset(SMS_KEY + mobile, info, redis.print);
                client.expire(SMS_KEY + mobile, config.sms.expiredTime);
                client.quit();
                return res.send({
                    status: 0,
                    type: 'SUCCESS',
                    message: '短信验证码发送成功'
                })
            }
        }
    });
}

function send(res, next, client, mobile, templateCode, code, info) {
    smsClient.sendSMS({
            PhoneNumbers: mobile,
            SignName: '了了管家',
            TemplateCode: templateCode,
            TemplateParam: '{"code": "' + code + '"}'
        }).then((result) => {
            let {
                Code
            } = result
            if (Code === 'OK') {
                //处理返回参数
                client.select(SMS_DB_NUM);
                client.hmset(SMS_KEY + mobile, info, redis.print);
                client.expire(SMS_KEY + mobile, config.sms.expiredTime);
                client.quit();
                return res.send({
                    status: 0,
                    type: 'SUCCESS',
                    message: '短信验证码发送成功'
                })
            }
        })
        .catch(e => next(e));
}

export default {
    sendRegisterSMS,
    sendForgetSMS
};
