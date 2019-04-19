/*
 * @Author = Roy Chen
 * @Date = 2017-12-13 00:36:55
 * @Last Modified by: Arnie Carter
 * @Last Modified time: 2018-08-31 18:51:33
 */
import mongoose from 'mongoose';
import Service from '../models/service.model';
import User from '../models/user.model';
import Auth from '../models/auth.model';
import config from '../../config/config';
import Utils from '../helpers/Utils';
import myJpush from '../helpers/jpush';
import Wechat from '../helpers/wechat';

async function getWechatSignPackage(req, res, next) {
    const url = decodeURIComponent(req.body.url);
    const wechat = new Wechat(config.wechat.wx_mp_appid, config.wechat.wx_mp_secret);
    const signPackage = await wechat.getSignPackage(url);
    res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            signPackage
        },
        message: '获取成功'
    })
}

async function getXcxOpenId(req,res,next) {
    const xcx = new Wechat(config.wechat.wx_xcx_appid,config.wechat.wx_xcx_secret);
    const data = await xcx.getXcxOpenId(req.body.js_code)
    console.log(data)
    res.json({
        status: 0,
        type: 'SUCCESS',
        data: data,
        message: '获取成功'
    })
}

async function getXcxCardOpenId(req,res,next) {
    const xcx = new Wechat(config.wechat.wx_xcxcard_appid,config.wechat.wx_xcxcard_secret);
    const data = await xcx.getXcxOpenId(req.body.js_code)
    console.log(data)
    res.json({
        status: 0,
        type: 'SUCCESS',
        data: data,
        message: '获取成功'
    })
}

export default {
    getWechatSignPackage,
    getXcxOpenId,
    getXcxCardOpenId
};
