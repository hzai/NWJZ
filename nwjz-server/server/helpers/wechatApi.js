/*
 * @Author: Roy Chen
 * @Date: 2018-05-30 00:54:02
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-09-12 22:24:44
 */

import config from '../../config/config';
const WechatAPI = require('co-wechat-api');
const redis = require('async-redis');
const bluebird = require('bluebird');

const WECHAT_MP_AC_TOKEN_KEY = 'wechat_mp_access_token:';
const WECHAT_XCX_AC_TOKEN_KEY = 'wechat_xcx_access_token:';
const WECHAT_ADMIN_XCX_AC_TOKEN_KEY = 'wechat_admin_xcx_access_token:';

async function getMPAccessToken() {
    try {
        let client = redis.createClient({
            host: config.redis.host,
            port: config.redis.port,
            password: config.redis.pwd
        });
        const value = await client.get(WECHAT_MP_AC_TOKEN_KEY);
        return JSON.parse(value);
    } catch (error) {
        throw error;
    }
}

async function saveMPAccessToken(token) {
    try {
        let client = redis.createClient({
            host: config.redis.host,
            port: config.redis.port,
            password: config.redis.pwd
        });
        await client.set(WECHAT_MP_AC_TOKEN_KEY, JSON.stringify(token));
    } catch (error) {
        throw error;
    }
}

async function getXCXAccessToken() {
    try {
        let client = redis.createClient({
            host: config.redis.host,
            port: config.redis.port,
            password: config.redis.pwd
        });
        const value = await client.get(WECHAT_XCX_AC_TOKEN_KEY);
        return JSON.parse(value);
    } catch (error) {
        throw error;
    }
}

async function saveXCXAccessToken(token) {
    try {
        let client = redis.createClient({
            host: config.redis.host,
            port: config.redis.port,
            password: config.redis.pwd
        });
        await client.set(WECHAT_XCX_AC_TOKEN_KEY, JSON.stringify(token));
    } catch (error) {
        throw error;
    }
}

async function getAdminXCXAccessToken() {
    try {
        let client = redis.createClient({
            host: config.redis.host,
            port: config.redis.port,
            password: config.redis.pwd
        });
        const value = await client.get(WECHAT_ADMIN_XCX_AC_TOKEN_KEY);
        return JSON.parse(value);
    } catch (error) {
        throw error;
    }
}

async function saveAdminXCXAccessToken(token) {
    try {
        let client = redis.createClient({
            host: config.redis.host,
            port: config.redis.port,
            password: config.redis.pwd
        });
        await client.set(WECHAT_ADMIN_XCX_AC_TOKEN_KEY, JSON.stringify(token));
    } catch (error) {
        throw error;
    }
}


async function sendTemplate(openId, templateId, url, topColor, data) {
    // const api = new WechatAPI(config.wechat.wx_mp_appid, config.wechat.wx_mp_secret);
    const api = new WechatAPI(
        config.wechat.wx_mp_appid,
        config.wechat.wx_mp_secret,
        getMPAccessToken,
        saveMPAccessToken
    );
    const result = await api.sendTemplate(openId, templateId, url, topColor, data);
    console.log('sendTemplate result = ', result);
    return result;
}

async function sendMiniProgramTemplate(openid, templateId, page, from_id, data) {
    const api = new WechatAPI(
        config.wechat.wx_xcx_appid,
        config.wechat.wx_xcx_secret,
        getXCXAccessToken,
        saveXCXAccessToken
    );
    const result = await api.sendMiniProgramTemplate(openid, templateId, page, from_id, data);
    console.log('sendMiniProgramTemplate result = ', result);
    return result;
}

async function sendAdminXcxTemplate(openid, templateId, url, appid, pagepath, data, color) {
    const api = new WechatAPI(
        config.wechat.wx_admin_xcx_appid,
        config.wechat.wx_admin_xcx_secret,
        getAdminXCXAccessToken,
        saveAdminXCXAccessToken
    );
    const result = await api.sendMiniProgramTemplate(openid, templateId, url, appid, pagepath, data, color);
    console.log('sendMiniProgramTemplate result = ', result);
    return result;
}

async function getRealUserInfo(openid) {
    const api = new WechatAPI(
        config.wechat.wx_mp_appid,
        config.wechat.wx_mp_secret,
        getMPAccessToken,
        saveMPAccessToken
    );

    return await api.getUser({'openid': openid, lang: 'zh_CN'}).then(result => {
        console.log('getRealUserInfo result = ', result);
    return result;
    });
}


export default {
    sendTemplate,
    sendMiniProgramTemplate,
    sendAdminXcxTemplate,
    getRealUserInfo
};
