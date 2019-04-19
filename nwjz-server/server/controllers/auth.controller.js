/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 00:29:42
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-12-17 18:55:33
 */

import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import Auth from '../models/auth.model';
import Token from '../models/token.model';
import User from '../models/user.model';
import redis from 'redis';
import Utils from '../helpers/Utils';
import config from '../../config/config';
const passport = require('passport');
const OAuth = require('wechat-oauth');
import WXBizDataCrypt from '../helpers/WXBizDataCrypt';
import Wechat from '../helpers/wechat';
import WechatApi from '../helpers/wechatApi';

const SMS_DB_NUM = 1;
const SMS_KEY = 'sms:';

/**
 * Load auth and append to req.
 */
function load(req, res, next, id) {
    Auth.get(id)
        .then(auth => {
            req.auth = auth; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get auth
 * @returns {Auth}
 */
function get(req, res) {
    return res.json(req.auth);
}

/**
 * Returns jwt token if valid authname and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
    // Ideally you'll fetch this from the db
    // Idea here was to show how jwt works with simplicity
    passport.authenticate('local.login', (err, auth, info) => {
        if (err) {
            return next(new APIError(info, httpStatus.NOT_FOUND, true));
        }
        if (auth) {
            return res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    token: auth.generateJwt(),
                    auth: auth
                }
            });
        }
        return next(new APIError(info, httpStatus.UNAUTHORIZED, true));
    })(req, res);
}

/**
 * Logout
 * @param req
 * @param res
 * @param next
 */
function logout(req, res, next) {
    // process to remove the token from cache
    // TODO
    res.json({
        status: 0,
        type: 'SUCCESS',
        message: '退出成功'
    });
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
    // req.auth is assigned by jwt middleware if valid token is provided
    return res.json({
        abc: req.user,
        payload: req.payload,
        num: Math.random() * 100,
        aa: 'aa'
    });
}
/**
 * 手机号码登录
 * 已注册，自动登录
 * 未注册，创建用户
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function loginByMobile(req, res, next) {
    try {
        if (req.body.mobile === null || req.body.mobile === undefined) {
            return res.json({
                status: 1,
                type: 'SMS_VERIFIED_FAILED',
                message: '请输入正确的手机号码'
            });
        }
        if (req.body.verify_code === null || req.body.verify_code === undefined) {
            return res.json({
                status: 1,
                type: 'SMS_VERIFIED_FAILED',
                message: '请输入正确的验证码'
            });
        }
        const mobile = req.body.mobile;
        const verify_code = req.body.verify_code;
        const client = redis.createClient({
            host: config.redis.host,
            port: config.redis.port,
            password: config.redis.pwd
        });
        client.on('error', err => {
            console.log('error ' + err);
        });
        client.select(SMS_DB_NUM);
        client.hgetall(SMS_KEY + mobile, async (err, reply) => {
            if (!reply) {
                return res.json({
                    status: 1,
                    type: 'SMS_VERIFIED_FAILED',
                    message: '请输入正确的验证码'
                });
            }
            const smsCode = reply.code;
            const verified = reply.verified;

            if (smsCode !== verify_code || verified === '1') {
                return res.json({
                    status: 1,
                    type: 'SMS_VERIFIED_FAILED',
                    message: '请输入正确的验证码'
                });
            }
            reply.verified = '1';
            client.hmset(SMS_KEY + mobile, reply, redis.print);
            client.quit();

            const auth = await Auth.findOne({
                identifier: req.body.mobile
            }).populate('user');
            if (auth) {
                return res.json({
                    status: 0,
                    data: {
                        token: auth.generateJwt(),
                        auth: auth
                    },
                    type: 'SUCCESS',
                    message: '登录成功'
                });
            } else {
                const user = new User({
                    nickname: Utils.genNickname(req),
                    contact_phone: req.body.mobile,
                    avatar: 'http://images.llguanjia.com/avatar.png',
                    register_ip: Utils.getClientIp(req)
                });
                user.save()
                    .then(savedUser => {
                        const auth = new Auth({
                            user: savedUser._id,
                            identity_type: config.identity_type.mobile,
                            identifier: req.body.mobile
                        });
                        auth.setPassword(Utils.genUuid()); // 随机密码
                        auth.save()
                            .then(savedAuth => {
                                savedAuth.user = savedUser;
                                return res.json({
                                    status: 0,
                                    data: {
                                        token: savedAuth.generateJwt(),
                                        auth: savedAuth
                                    },
                                    type: 'SUCCESS',
                                    message: '手机号码注册成功'
                                });
                            })
                            .catch(e => next(e));
                    })
                    .catch(e => next(e));
            }
        });
    } catch (err) {
        next(err);
    }
}
/**
 * 微信授权登录
 * 已注册，自动登录
 * 未注册，创建用户
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function loginByWechat(req, res, next) {
    try {
        // ======== START VERIFY PARAMETERS===========
        if (req.body.openid === null || req.body.openid === undefined) {
            return res.json({
                status: 1,
                type: 'WRONG_OPEN_ID',
                message: '请传入openid'
            });
        }
        if (req.body.mobile === null || req.body.mobile === undefined) {
            return res.json({
                status: 1,
                type: 'SMS_VERIFIED_FAILED',
                message: '请输入正确的手机号码'
            });
        }
        if (req.body.verify_code === null || req.body.verify_code === undefined) {
            return res.json({
                status: 1,
                type: 'SMS_VERIFIED_FAILED',
                message: '请输入正确的验证码'
            });
        }
        // ======== END VERIFY PARAMETERS ===========
        // ======== START VERIFY SMS CODE===========
        const mobile = req.body.mobile;
        const verify_code = req.body.verify_code;
        const client = redis.createClient({
            host: config.redis.host,
            port: config.redis.port,
            password: config.redis.pwd
        });
        client.on('error', err => {
            console.log('error ' + err);
        });
        client.select(SMS_DB_NUM);
        client.hgetall(SMS_KEY + mobile, async (err, reply) => {
            if (!reply) {
                return res.json({
                    status: 1,
                    type: 'SMS_VERIFIED_FAILED',
                    message: '请输入正确的验证码'
                });
            }
            const smsCode = reply.code;
            const verified = reply.verified;
            if (smsCode !== verify_code || verified === '1') {
                return res.json({
                    status: 1,
                    type: 'SMS_VERIFIED_FAILED',
                    message: '请输入正确的验证码'
                });
            }
            reply.verified = '1';
            client.hmset(SMS_KEY + mobile, reply, redis.print);
            client.quit();
            // ======== END VERIFY SMS CODE===========
            // ======== START HANDLING REGISTER PROCESS===========
            // unionid? ===> mobile?
            console.log('openid = ', req.body.openid);
            console.log('unionid = ', req.body.unionid);
            const auth = await Auth.findOne({
                identifier: req.body.unionid
            }).populate('user'); // openid已存在，可以正常登录
            console.log(auth);
            if (auth) {
                console.log('unionid已存在，可以正常登录');
                return res.json({
                    status: 0,
                    data: {
                        token: auth.generateJwt(),
                        auth: auth
                    },
                    type: 'SUCCESS',
                    message: '登录成功'
                });
            } else {
                console.log('unionid不存在');
                const auth2 = await Auth.findOne({
                    identifier: req.body.mobile
                }).populate('user');
                if (auth2) {
                    console.log('手机号码已存在');
                    const auth3 = await Auth.findOne({
                        $and: [
                            {
                                identity_type: config.identity_type.wechat
                            },
                            {
                                user: auth2.user._id
                            }
                        ]
                    }).populate('user');
                    if (auth3) {
                        console.log('unionid绑定了其他手机号码');
                        return res.json({
                            status: 0,
                            type: 'WECHAT_BINDING_FAILED',
                            message: '该手机号码已被绑定其他的微信号，请更换手机号码'
                        });
                    } else {
                        console.log('unionid未绑定了其他手机号码');
                        const oAuthClient = new OAuth(
                            config.wechat.wx_mp_appid,
                            config.wechat.wx_mp_secret,
                            function(openid, callback) {
                                // 传入一个根据openid获取对应的全局token的方法
                                // 在getUser时会通过该方法来获取token
                                Token.getToken(openid, callback);
                            },
                            function(openid, token, callback) {
                                // 持久化时请注意，每个openid都对应一个唯一的token!
                                Token.setToken(openid, token, callback);
                            }
                        );
                        oAuthClient.getUser(
                            { openid: req.body.openid, lang: '' },
                            (err, wechatUserInfo) => {
                                if (err) {
                                    return res.json({
                                        status: 0,
                                        type: 'WECHAT_BINDING_FAILED',
                                        message: '微信绑定失败'
                                    });
                                }
                                const auth4 = new Auth({
                                    user: auth2.user._id,
                                    identity_type: config.identity_type.wechat,
                                    identifier: req.body.unionid
                                });
                                auth4.setPassword(Utils.genUuid()); // 随机密码
                                auth4
                                    .save()
                                    .then(savedAuth => {
                                        savedAuth.user = auth2.user;
                                        return res.json({
                                            status: 0,
                                            data: {
                                                token: savedAuth.generateJwt(),
                                                auth: savedAuth
                                            },
                                            type: 'SUCCESS',
                                            message: '微信绑定手机号码成功'
                                        });
                                    })
                                    .catch(e => next(e));
                            }
                        );
                    }
                } else {
                    console.log('手机号码没注册');
                    const oAuthClient = new OAuth(
                        config.wechat.wx_mp_appid,
                        config.wechat.wx_mp_secret,
                        function(openid, callback) {
                            // 传入一个根据openid获取对应的全局token的方法
                            // 在getUser时会通过该方法来获取token
                            Token.getToken(openid, callback);
                        },
                        function(openid, token, callback) {
                            // 持久化时请注意，每个openid都对应一个唯一的token!
                            Token.setToken(openid, token, callback);
                        }
                    );
                    oAuthClient.getUser(
                        { openid: req.body.openid, lang: '' },
                        (err, wechatUserInfo) => {
                            if (err) {
                                return res.json({
                                    status: 0,
                                    type: 'WECHAT_BINDING_FAILED',
                                    message: '微信绑定失败'
                                });
                            }
                            console.log('=========== get user info from wechat ============');
                            console.log(wechatUserInfo);
                            const user = new User({
                                wechat_openid: req.body.openid,
                                nickname: wechatUserInfo.nickname,
                                contact_phone: req.body.mobile,
                                avatar: wechatUserInfo.headimgurl,
                                register_ip: Utils.getClientIp(req)
                            });
                            user.save()
                                .then(savedUser => {
                                    const auth4 = new Auth({
                                        user: savedUser._id,
                                        identity_type: config.identity_type.mobile,
                                        identifier: req.body.mobile
                                    });
                                    auth4.setPassword(Utils.genUuid()); // 随机密码
                                    auth4
                                        .save()
                                        .then(savedAuth => {
                                            const auth5 = new Auth({
                                                user: savedUser._id,
                                                identity_type: config.identity_type.wechat,
                                                identifier: req.body.unionid
                                            });
                                            auth5.setPassword(Utils.genUuid()); // 随机密码
                                            auth5.save().then(savedAuth2 => {
                                                savedAuth2.user = savedUser;
                                                return res.json({
                                                    status: 0,
                                                    data: {
                                                        token: savedAuth2.generateJwt(),
                                                        auth: savedAuth2
                                                    },
                                                    type: 'SUCCESS',
                                                    message: '微信绑定手机号码成功'
                                                });
                                            });
                                        })
                                        .catch(e => next(e));
                                })
                                .catch(e => next(e));
                        }
                    );
                }
            }
        });
    } catch (err) {
        next(err);
    }
}

async function register(req, res, next) {
    try {
        const auth = await Auth.findOne({
            identifier: req.body.mobile
        });
        if (auth) {
            return res.json({
                status: 1,
                type: 'HAS_REGISTERED_MOBILE',
                message: '手机号码已注册'
            });
        } else {
            const user = new User({
                nickname: Utils.genNickname(req),
                contact_phone: req.body.mobile,
                avatar: 'http://images.llguanjia.com/avatar.png',
                register_ip: Utils.getClientIp(req)
            });
            user.save()
                .then(savedUser => {
                    const auth = new Auth({
                        user: savedUser._id,
                        identity_type: config.identity_type.mobile,
                        identifier: req.body.mobile
                    });
                    auth.setPassword(req.body.password);
                    auth.save()
                        .then(savedAuth => {
                            return res.json({
                                status: 0,
                                data: {
                                    token: savedAuth.generateJwt(),
                                    auth: savedAuth,
                                    user: savedUser
                                },
                                type: 'SUCCESS',
                                message: '手机号码注册成功'
                            });
                        })
                        .catch(e => next(e));
                })
                .catch(e => next(e));
        }
    } catch (err) {
        next(err);
    }
}

/**
 * 获取授权页面的URL地址
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getWechatAuthorizeURL(req, res, next) {
    const client = new OAuth(config.wechat.wx_mp_appid, config.wechat.wx_mp_secret);
    const url = client.getAuthorizeURL(
        config.wechat.wx_mp_redirect_url,
        '-' + new Date(),
        'snsapi_userinfo'
    );
    console.log('获取授权页面的URL地址 = ', url);
    return res.json({
        status: 0,
        type: 'SUCCESS',
        url,
        message: 'SUCCESS'
    });
}

/**
 * 获取授权页面的URL地址 - 静默模式
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getWechatAuthorizeURL2(req, res, next) {
    const state = req.body.state;
    const client = new OAuth(config.wechat.wx_mp_appid, config.wechat.wx_mp_secret);
    const url = client.getAuthorizeURL(
        config.wechat.wx_mp_redirect_silence_url,
        state,
        'snsapi_base'
    );
    console.log('获取授权页面的URL地址(静默模式) = ', url);
    return res.json({
        status: 0,
        type: 'SUCCESS',
        url,
        message: 'SUCCESS'
    });
}

/**
 * 静默模式 - 处理openId
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function handleSilenceCallback(req, res, next) {
    const code = req.query.code;
    const state = req.query.state; // no handle so far
    console.log('code = ', code);
    console.log('state = ', state);
    const client = new OAuth(
        config.wechat.wx_mp_appid,
        config.wechat.wx_mp_secret,
        function(openid, callback) {
            // 传入一个根据openid获取对应的全局token的方法
            // 在getUser时会通过该方法来获取token
            Token.getToken(openid, callback);
        },
        function(openid, token, callback) {
            // 持久化时请注意，每个openid都对应一个唯一的token!
            Token.setToken(openid, token, callback);
        }
    );
    client.getUserByCode({ code: code, lang: 'zh_CN' }, (err, result) => {
        if (err) {
            return res.json({
                status: -1,
                type: 'FAILED',
                message: '微信授权失败'
            });
        }
        console.log(result);
        const openid = result.openid;
        const unionid = result.unionid;
        console.log('openid = ', openid);
        console.log('unionid = ', unionid);
    });
}

/**
 * 公众号网页授权
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function wechatAuthorizeByMP(req, res, next) {
    console.log('========开始公众号网页授权 wechatAuthorizeByMP ============');
    const code = req.body.code;
    const state = req.body.state; // no handle so far
    console.log('code = ', code);
    const client = new OAuth(
        config.wechat.wx_mp_appid,
        config.wechat.wx_mp_secret,
        function(openid, callback) {
            // 传入一个根据openid获取对应的全局token的方法
            // 在getUser时会通过该方法来获取token
            Token.getToken(openid, callback);
        },
        function(openid, token, callback) {
            // 持久化时请注意，每个openid都对应一个唯一的token!
            Token.setToken(openid, token, callback);
        }
    );
    client.getUserByCode({ code: code, lang: 'zh_CN' }, async (err, wechatUserInfo) => {
        if (err) {
            return res.json({
                status: -1,
                type: 'FAILED',
                message: '微信授权失败'
            });
        }
        console.log('通过授权code获取微信用户信息 = ', wechatUserInfo);
        const openid = wechatUserInfo.openid;
        const unionid = wechatUserInfo.unionid;
        const subResult = await WechatApi.getRealUserInfo(openid);
        const subscribed = subResult.subscribe;
        const headimgurl = wechatUserInfo.headimgurl;
        Auth.findOne({
            identifier: unionid
        })
            .populate('user')
            .exec()
            .then(auth => {
                if (auth) {
                    console.log('-----unionid已注册, 登录成功, 可以返回数据库的用户信息------');
                    User.update(
                        {
                            _id: auth.user._id
                        },
                        {
                            wechat_openid: openid,
                            avatar: headimgurl
                        }
                    )
                        .then(resp => {
                            console.log(
                                '+++小分支，数据库的openid为空，更新user.wechat_openid = openid+++++'
                            );
                            console.log(resp);
                        })
                        .catch(e => next(e));
                    return res.json({
                        status: 0,
                        data: {
                            token: auth.generateJwt(),
                            auth: auth,
                            user: auth.user,
                            openid: openid,
                            unionid: unionid,
                            isNewUser: '02', // false
                            subscribed: subscribed
                        },
                        type: 'SUCCESS',
                        message: 'openid已注册, 登录成功'
                    });
                } else {
                    // ----------- 开通绑定手机程序 --start---------
                    // console.log('-----unionid未注册, 进入绑定手机程序, 返回 type=NO_REGISTERED_OPENID-----');
                    // return res.json({
                    //     status: 0,
                    //     type: 'NO_REGISTERED_OPENID',
                    //     data: {
                    //         openid: openid,
                    //         unionid: unionid
                    //     },
                    //     message: 'unionid未注册, 进入绑定手机程序'
                    // });
                    // ----------- 开通绑定手机程序 --end---------

                    // ------------ 不需要绑定手机， 注册并直接登录----------
                    console.log('-----unionid未注册, 注册并直接登录-----');
                    const user = new User({
                        wechat_openid: openid,
                        nickname: wechatUserInfo.nickname,
                        // contact_phone: req.body.mobile,
                        is_newUser: "1",
                        avatar: wechatUserInfo.headimgurl,
                        register_ip: Utils.getClientIp(req)
                    });
                    user.save()
                        .then(savedUser => {
                            console.log('+++savedUser = ', savedUser);
                            const auth = new Auth({
                                user: savedUser._id,
                                identity_type: config.identity_type.wechat,
                                identifier: unionid
                            });
                            auth.setPassword(Utils.genUuid()); // 随机密码
                            auth.save()
                                .then(savedAuth => {
                                    savedAuth.user = savedUser;
                                    console.log('+++savedAuth = ', savedAuth);
                                    return res.json({
                                        status: 0,
                                        data: {
                                            token: savedAuth.generateJwt(),
                                            auth: savedAuth,
                                            user: savedAuth.user,
                                            openid: openid,
                                            unionid: unionid,
                                            isNewUser: '01', // true
                                            subscribed: subscribed
                                        },
                                        type: 'SUCCESS',
                                        message: 'unionid未注册, 注册并直接登录'
                                    });
                                })
                                .catch(e => next(e));
                        })
                        .catch(e => next(e));
                }
            });
    });
}

// async function _decodeData(req, res, next) {
//     const xcx = new Wechat(config.wechat.wx_xcx_appid, config.wechat.wx_xcx_secret);
//     const appId = config.wechat.wx_xcx_appid;
//     // const sessionKey = req.body.sessionKey
//     const openId = req.body.openid;
//     const sessionKey = await xcx.getSessionKey(openId);
//     const encryptedData = req.body.encryptedData;
//     const iv = req.body.iv;
//     const pc = new WXBizDataCrypt(appId, sessionKey);
//     const data = pc.decryptData(encryptedData, iv);
//     console.log('解密后 data: ', data);
//     return data;
//     // res.json({
//     //     status: 0,
//     //     type: 'SUCCESS',
//     //     data: data,
//     //     message: '获取成功'
//     // })
//     // 解密后的数据为
//     //
//     // data = {
//     //   "nickName": "Band",
//     //   "gender": 1,
//     //   "language": "zh_CN",
//     //   "city": "Guangzhou",
//     //   "province": "Guangdong",
//     //   "country": "CN",
//     //   "avatarUrl": "http://wx.qlogo.cn/mmopen/vi_32/aSKcBBPpibyKNicHNTMM0qJVh8Kjgiak2AHWr8MHM4WgMEm7GFhsf8OYrySdbvAMvTsw3mo8ibKicsnfN5pRjl1p8HQ/0",
//     //   "unionId": "ocMvos6NjeKLIBqg5Mr9QjxrP1FA",
//     //   "watermark": {
//     //     "timestamp": 1477314187,
//     //     "appid": "wx4f4bc4dec97d474b"
//     //   }
//     // }
// }

function decodeData(req, res, next) {
    const appId = config.wechat.wx_xcx_appid;
    const sessionKey = req.body.sessionKey;
    const encryptedData = req.body.encryptedData;
    const iv = req.body.iv;
    const pc = new WXBizDataCrypt(appId, sessionKey);
    const data = pc.decryptData(encryptedData, iv);
    console.log('解密后 data: ', data);
    res.json({
        status: 0,
        type: 'SUCCESS',
        data: data,
        message: '获取成功'
    });
}
async function loginbyXCX(req, res, next) {
    console.log('======小程序xcx登录流程=====');
    let unionid = req.body.unionid;
    if (unionid === null || unionid === '' || unionid === undefined) {
        // const decodeData = await _decodeData(req, res, next);
        try {
            const xcx = new Wechat(config.wechat.wx_xcx_appid, config.wechat.wx_xcx_secret);
            const appId = config.wechat.wx_xcx_appid;
            // const sessionKey = req.body.sessionKey
            const openId = req.body.openid;
            const sessionKey = await xcx.getSessionKey(openId);
            console.log('sessionKey = ', sessionKey);
            const encryptedData = req.body.encryptedData;
            const iv = req.body.iv;
            console.log('req.body = ', req.body);
            console.log('appId = ', appId);
            const pc = new WXBizDataCrypt(appId, sessionKey);
            const data = pc.decryptData(encryptedData, iv);
            console.log('解密后 data: ', data);
            unionid = data.unionId;
        } catch (error) {
            console.log('error = ', error);
            unionid = null;
        }
    }
    if (unionid === null) {
        console.log('unionid is null, repsone status = 1');
        return res.json({
            status: 1,
            data: {},
            type: 'SUCCESS',
            message: '授权失败'
        });
    } else {
        console.log('unionid = ', unionid);
    }
    const auth = await Auth.findOne({
        identifier: unionid
    }).populate('user');
    if (auth) {
        console.log('unionid已注册');
        return res.json({
            status: 0,
            data: {
                token: auth.generateJwt(),
                auth: auth
            },
            type: 'SUCCESS',
            message: '登录成功'
        });
    } else {
        console.log('unionid未注册');
        const wechatUserInfo = req.body.wechatUserInfo;
        if (wechatUserInfo === null || wechatUserInfo === undefined) {
            console.log('没有用户信息，不用注册');
            return res.json({
                status: 1,
                type: 'SUCCESS',
                message: '已授权，不注册'
            });
        }
        const user = new User({
            xcx_openid: req.body.openid,
            nickname: wechatUserInfo.nickName,
            // contact_phone: req.body.mobile, // 暂无手机号码
            avatar: wechatUserInfo.avatarUrl,
            register_ip: Utils.getClientIp(req)
        });
        user.save()
            .then(savedUser => {
                const auth = new Auth({
                    user: savedUser._id,
                    identity_type: config.identity_type.wechat,
                    identifier: unionid
                });
                auth.setPassword(Utils.genUuid()); // 随机密码
                auth.save()
                    .then(savedAuth => {
                        savedAuth.user = savedUser;
                        return res.json({
                            status: 0,
                            data: {
                                token: savedAuth.generateJwt(),
                                auth: savedAuth
                            },
                            type: 'SUCCESS',
                            message: '小程序绑定成功'
                        });
                    })
                    .catch(e => next(e));
            })
            .catch(e => next(e));
    }
}


async function loginbyXCXCard(req, res, next) {
    console.log('======小程序xcxcard登录流程=====');
    let unionid = req.body.unionid;
    if (unionid === null || unionid === '' || unionid === undefined) {
        // const decodeData = await _decodeData(req, res, next);
        try {
            const xcx = new Wechat(config.wechat.wx_xcxcard_appid, config.wechat.wx_xcxcard_secret);
            const appId = config.wechat.wx_xcxcard_appid;
            // const sessionKey = req.body.sessionKey
            const openId = req.body.openid;
            const sessionKey = await xcx.getSessionKey(openId);
            console.log('sessionKey = ', sessionKey);
            const encryptedData = req.body.encryptedData;
            const iv = req.body.iv;
            console.log('req.body = ', req.body);
            console.log('appId = ', appId);
            const pc = new WXBizDataCrypt(appId, sessionKey);
            const data = pc.decryptData(encryptedData, iv);
            console.log('解密后 data: ', data);
            unionid = data.unionId;
        } catch (error) {
            console.log('error = ', error);
            unionid = null;
        }
    }
    if (unionid === null) {
        console.log('unionid is null, repsone status = 1');
        return res.json({
            status: 1,
            data: {},
            type: 'SUCCESS',
            message: '授权失败'
        });
    } else {
        console.log('unionid = ', unionid);
    }
    const auth = await Auth.findOne({
        identifier: unionid
    }).populate('user');
    if (auth) {
        console.log('unionid已注册');
        return res.json({
            status: 0,
            data: {
                token: auth.generateJwt(),
                auth: auth
            },
            type: 'SUCCESS',
            message: '登录成功'
        });
    } else {
        console.log('unionid未注册');
        const wechatUserInfo = req.body.wechatUserInfo;
        if (wechatUserInfo === null || wechatUserInfo === undefined) {
            console.log('没有用户信息，不用注册');
            return res.json({
                status: 1,
                type: 'SUCCESS',
                message: '已授权，不注册'
            });
        }
        const user = new User({
            xcx_openid: req.body.openid,
            nickname: wechatUserInfo.nickName,
            // contact_phone: req.body.mobile, // 暂无手机号码
            avatar: wechatUserInfo.avatarUrl,
            register_ip: Utils.getClientIp(req)
        });
        user.save()
            .then(savedUser => {
                const auth = new Auth({
                    user: savedUser._id,
                    identity_type: config.identity_type.wechat,
                    identifier: unionid
                });
                auth.setPassword(Utils.genUuid()); // 随机密码
                auth.save()
                    .then(savedAuth => {
                        savedAuth.user = savedUser;
                        return res.json({
                            status: 0,
                            data: {
                                token: savedAuth.generateJwt(),
                                auth: savedAuth
                            },
                            type: 'SUCCESS',
                            message: '小程序绑定成功'
                        });
                    })
                    .catch(e => next(e));
            })
            .catch(e => next(e));
    }
}

/**
 * 微信APP授权登录
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function wechatAuthorizeByWX(req, res, next) {
    console.log('========开始微信APP授权登录 wechatAuthorizeByWX ============');
    const code = req.body.code;
    const state = req.body.state; // no handle so far
    console.log('code = ', code);
    console.log('state = ', state);
    const client = new OAuth(
        config.wechat.wx_app_appid,
        config.wechat.wx_app_secret,
        function(openid, callback) {
            // 传入一个根据openid获取对应的全局token的方法
            // 在getUser时会通过该方法来获取token
            Token.getToken(openid, callback);
        },
        function(openid, token, callback) {
            // 持久化时请注意，每个openid都对应一个唯一的token!
            Token.setToken(openid, token, callback);
        }
    );
    client.getUserByCode({ code: code, lang: 'zh_CN' }, (err, wechatUserInfo) => {
        if (err) {
            return res.json({
                status: -1,
                type: 'FAILED',
                message: '微信授权失败'
            });
        }
        console.log('通过授权code获取微信用户信息 = ', wechatUserInfo);
        const openid = wechatUserInfo.openid;
        const unionid = wechatUserInfo.unionid;
        const headimgurl = wechatUserInfo.headimgurl;
        Auth.findOne({
            identifier: unionid
        })
            .populate('user')
            .exec()
            .then(auth => {
                if (auth) {
                    console.log('-----unionid已注册, 登录成功, 可以返回数据库的用户信息------');
                    User.update(
                        {
                            _id: auth.user._id
                        },
                        {
                            wechat_openid: openid,
                            avatar: headimgurl
                        }
                    )
                        .then(resp => {
                            console.log(
                                '+++小分支，数据库的openid为空，更新user.wechat_openid = openid+++++'
                            );
                            console.log(resp);
                        })
                        .catch(e => next(e));
                    return res.json({
                        status: 0,
                        data: {
                            token: auth.generateJwt(),
                            auth: auth,
                            user: auth.user,
                            openid: openid,
                            unionid: unionid,
                            isNewUser: '02' // false
                        },
                        type: 'SUCCESS',
                        message: 'openid已注册, 登录成功'
                    });
                } else {
                    // ----------- 开通绑定手机程序 --start---------
                    // console.log('-----unionid未注册, 进入绑定手机程序, 返回 type=NO_REGISTERED_OPENID-----');
                    // return res.json({
                    //     status: 0,
                    //     type: 'NO_REGISTERED_OPENID',
                    //     data: {
                    //         openid: openid,
                    //         unionid: unionid
                    //     },
                    //     message: 'openid未注册'
                    // });
                    // ----------- 开通绑定手机程序 ---end--------

                    // ------------ 不需要绑定手机， 注册并直接登录----------
                    console.log('-----unionid未注册, 注册并直接登录-----');
                    const user = new User({
                        wechat_openid: openid,
                        nickname: wechatUserInfo.nickname,
                        // contact_phone: req.body.mobile,
                        avatar: wechatUserInfo.headimgurl,
                        register_ip: Utils.getClientIp(req)
                    });
                    user.save()
                        .then(savedUser => {
                            console.log('+++savedUser = ', savedUser);
                            const auth = new Auth({
                                user: savedUser._id,
                                identity_type: config.identity_type.wechat,
                                identifier: unionid
                            });
                            auth.setPassword(Utils.genUuid()); // 随机密码
                            auth.save()
                                .then(savedAuth => {
                                    savedAuth.user = savedUser;
                                    console.log('+++savedAuth = ', savedAuth);
                                    return res.json({
                                        status: 0,
                                        data: {
                                            token: savedAuth.generateJwt(),
                                            auth: savedAuth,
                                            user: savedAuth.user,
                                            openid: openid,
                                            unionid: unionid,
                                            isNewUser: '01' // true
                                        },
                                        type: 'SUCCESS',
                                        message: 'unionid未注册, 注册并直接登录'
                                    });
                                })
                                .catch(e => next(e));
                        })
                        .catch(e => next(e));
                }
            });
    });
}

export default {
    load,
    get,
    login,
    logout,
    getRandomNumber,
    register,
    loginByMobile,
    loginByWechat,
    getWechatAuthorizeURL,
    getWechatAuthorizeURL2,
    handleSilenceCallback,
    wechatAuthorizeByMP,
    wechatAuthorizeByWX,
    loginbyXCX,
    decodeData,
    loginbyXCXCard
};
