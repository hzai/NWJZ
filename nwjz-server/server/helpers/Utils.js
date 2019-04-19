/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 22:29:03
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-06 01:47:53
 */

const crypto = require('crypto');
const config = require('../../config/config');
const SMSClient = require('@alicloud/sms-sdk');

function md5(str) {
    const md5 = crypto.createHash('md5');
    md5.update(str);
    const str1 = md5.digest('hex');
    const s = str1.toLowerCase(); // 32位小写
    return s;
}
/**
 * 获取用户的IP地址
 * @param req
 * @returns {*}
 */
function getClientIp(req) {
    return (
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress
    );
}
/**
 * 生成昵称
 * @param req
 */
function genNickname(req) {
    return req.body.nickname === null || req.body.nickname === undefined
        ? req.body.mobile
        : req.body.nickname;
}

/**
 * 生成随机数
 * @param length
 */
function genRandomCode(length) {
    let Num = '';
    for (let i = 0; i < length; i++) {
        Num += Math.floor(Math.random() * 10);
    }
    return Num;
}
/**
 * 生成订单号
 */
function genOrderId() {
    // 下单时间的年月日(12) + 随机数6位
    return new Date().Format('yyyyMMddhhmmss') + genRandomCode(6);
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt) {
    // author: meizz
    const o = {
        'M+': this.getMonth() + 1, // 月份
        'd+': this.getDate(), // 日
        'h+': this.getHours(), // 小时
        'm+': this.getMinutes(), // 分
        's+': this.getSeconds(), // 秒
        'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
        S: this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            `${this.getFullYear()}`.substr(4 - RegExp.$1.length)
        );
    }
    for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1
                    ? o[k]
                    : `00${o[k]}`.substr(`${o[k]}`.length)
            );
        }
    }
    return fmt;
};

// Generate four random hex digits.
function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

/**
 * 生成UUID
 */
function genUuid() {
    return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
}

/**
 * 处理QUERY，返回limit, skip, 等等
 * @param {*} req
 * @param {*} total
 */
function handleQuery(req) {
    if (!req) {
        return {
            limit: 0,
            skip: 0
        };
    }
    const limit = isNaN(parseInt(req.query.limit))
        ? 0
        : parseInt(req.query.limit);
    const page = isNaN(parseInt(req.query.page)) ? 0 : parseInt(req.query.page);
    const skip = (page - 1) * limit;

    return {
        limit,
        skip
    };
}

function addDate(days) {
    const today = new Date();
    const t = today.getTime() + 1000 * 60 * 60 * 24 * days;
    return new Date(t);
}

function isCompany(roles) {
    return roles.indexOf('company') !== -1;
}

function buquan(num, length) {
    let numstr = num.toString();
    const l = numstr.length;
    if (numstr.length >= length) {
        return numstr;
    }

    for (let i = 0; i < length - l; i++) {
        numstr = `0${numstr}`;
    }
    return numstr;
}

function randomPassword(size) {
    const seed = new Array(
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'm',
        'n',
        'p',
        'Q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9'
    ); // 数组
    const seedlength = seed.length; // 数组长度
    let createPassword = '';
    for (let i = 0; i < size; i++) {
        const j = Math.floor(Math.random() * seedlength);
        createPassword += seed[j];
    }
    return createPassword;
}

function sendSMS(mobile, templateCode, TemplateParam) {
    // smsClient
    const smsClient = new SMSClient({
        accessKeyId: config.sms.accessKeyId,
        secretAccessKey: config.sms.secretAccessKey
    });

    smsClient
        .sendSMS({
            PhoneNumbers: mobile,
            SignName: '了了管家',
            TemplateCode: templateCode,
            TemplateParam: TemplateParam
        })
        .then(result => {
            const { Code } = result;
            if (Code === 'OK') {
                // 处理返回参数
                console.log('短信发送成功 - ', mobile + ' ' + templateCode);
            }
        });
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 */
function deepClone(source) {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments', 'deepClone');
    }
    const targetObj = source.constructor === Array ? [] : {};
    Object.keys(source).forEach(keys => {
        if (source[keys] && typeof source[keys] === 'object') {
            targetObj[keys] = deepClone(source[keys]);
        } else {
            targetObj[keys] = source[keys];
        }
    });
    return targetObj;
}

export default {
    getClientIp,
    genNickname,
    genRandomCode,
    genUuid,
    handleQuery,
    genOrderId,
    addDate,
    isCompany,
    md5,
    buquan,
    randomPassword,
    sendSMS,
    deepClone
};
