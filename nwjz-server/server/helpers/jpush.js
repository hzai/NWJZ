/*
 * @Author: Roy Chen
 * @Date: 2018-03-22 20:43:00
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-03-28 17:10:11
 */

const Jpush = require('jpush-sdk');
import config from '../../config/config';

const client = Jpush.buildClient(config.jpush.app_key, config.jpush.app_secret);

function pushAll(msg) {
    client
        .push()
        .setPlatform(Jpush.ALL)
        .setAudience(Jpush.ALL)
        .setNotification('Hi, Jpush', Jpush.ios('ios alert', 'happy', 5))
        .setMessage(msg)
        .send((err, res) => {
            if (err) {
                console.log(err.message);
            } else {
                console.log(`Sendno: ${res.sendno}`);
                console.log(`Msg_id: ${res.msg_id}`);
            }
        });
}

function pushNotification(target, msg, title, badge, extras) {
    console.log(target)
    console.log(badge)
    console.log(msg)
    console.log(title)
    console.log(extras)
    try{
        client
        .push()
        .setPlatform(Jpush.ALL)
        .setAudience(Jpush.alias(''+target))
        .setNotification(
            Jpush.ios(msg, 'sound', badge, false, extras),
            Jpush.android(msg, title, 1, extras)
        )
        .send((err, res) => {
            console.log(res)
            if (err) {
                console.log(err.message);
            } else {
                console.log(res)
                console.log(`Sendno: ${res.sendno}`);
                console.log(`Msg_id: ${res.msg_id}`);
            }
        });
    } catch(e){
        console.log('pushNotification exception = ', e)
    }
}

function pushMessage(msg, target) {
    console.log('msg = ', msg)
    console.log('target = ', target)
    console.log(client)
    client
        .push()
        .setPlatform('ios', 'android')
        .setAudience(Jpush.alias(target))
        .setNotification(
            'Hi, Jpush',
            Jpush.ios('ios alert'),
            Jpush.android('android alert', null, 1)
        )
        .setMessage(msg)
        .setOptions(null, 60)
        .send((err, res) => {
            if (err) {
                console.log(err.message);
            } else {
                console.log(`Sendno: ${res.sendno}`);
                console.log(`Msg_id: ${res.msg_id}`);
            }
        });
}

export default {
    pushMessage,
    pushNotification
};
