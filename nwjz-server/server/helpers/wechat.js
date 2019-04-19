/*
 * @Author: Roy Chen
 * @Date: 2018-02-08 13:38:22
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-06-06 23:10:16
 */
import config from '../../config/config';
const fs = require('fs');
const https = require('https');
const crypto = require('crypto');
const qs = require('querystring');
const redis = require('async-redis');
const bluebird = require('bluebird')

const XCX_SESSION_KEY_PREFIX = 'xcx_open_id:';

class Wechat {
    constructor(appId, appSecret) {
        this.appId = appId;
        this.appSecret = appSecret;
    }
    //生成16位随机字符串
    _createNonceStr(length = 16) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let str = '';
        for (let i = 0; i < length; i++) {
            str += chars.charAt(Math.floor(Math.random() * 62));
        }
        return str;
    }

    /**
     * 获取授权页面的URL地址
     * @param {*} redirect 授权后要跳转的地址
     * @param {*} state 开发者可提供的数据
     * @param {*} scope 作用范围，值为snsapi_userinfo和snsapi_base，前者用于弹出，后者用于跳转
     */
    _getAuthorizeURL(redirect, state, scope) {
        const url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
        const info = {
            appid: this.appId,
            redirect_uri: encodeURIComponent(redirect),
            response_type: 'code',
            scope: scope || 'snsapi_base',
            state: state || ''
        };
        return url + '?' + qs.stringify(info) + '#wechat_redirect';
    }
    // access_token 应该全局存储与更新，这里写入到文件中
    _setAccessToken(filename) {
        return new Promise((resolve, reject) => {
            const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${
                this.appId
            }&secret=${this.appSecret}`;
            //向微信服务器发送请求
            https
                .get(url, function(res) {
                    res.setEncoding('utf8');
                    res.on('data', function(data) {
                        if (data) {
                            data = JSON.parse(data);
                            //如果微信返回错误
                            if (data.errcode) {
                                return reject(new Error(data.errmsg));
                            }
                            const access_token = data.access_token;
                            if (!access_token) {
                                return reject(
                                    new Error('getAccessToken 请求返回数据没有access_token')
                                );
                            }
                            const insert_data = {
                                expire_time: new Date().getTime() + 7000 * 1000,
                                access_token: access_token
                            };
                            //获得的access_token写入文件
                            fs.writeFile(filename, JSON.stringify(insert_data), function(err) {
                                if (err) {
                                    return reject(new Error('access_token写入文件失败'));
                                }
                                //成功后返回access_token
                                return resolve(access_token);
                            });
                        } else {
                            return reject(new Error('getAccessToken 请求返回数据为空'));
                        }
                    });
                })
                .on('error', function(err) {
                    return resolve(err);
                });
        });
    }
    //获取access_token
    getAccessToken() {
        const that = this;
        return new Promise(function(resolve, reject) {
            const filename = 'access_token.json';
            //判断access_token.json是否存在
            fs.exists(filename, async function(exist) {
                //不存在,去获取access_token
                if (!exist) {
                    try {
                        const access_token = await that._setAccessToken(filename);
                        return resolve(access_token);
                    } catch (err) {
                        return reject(err);
                    }
                } else {
                    //存在，直接读取access_token.json
                    fs.readFile(filename, async function(err, data) {
                        let access_token = '';
                        if (err) {
                            return reject(err);
                        }
                        data = JSON.parse(data);
                        if (data && data.expire_time) {
                            if (data.expire_time < new Date().getTime()) {
                                try {
                                    access_token = await that._setAccessToken(filename);
                                } catch (err) {
                                    return reject(err);
                                }
                            } else {
                                access_token = data.access_token;
                            }
                        } else {
                            try {
                                access_token = await that._setAccessToken(filename);
                            } catch (err) {
                                return reject(err);
                            }
                        }
                        return resolve(access_token);
                    });
                }
            });
        });
    }

    // jsapi_ticket 应该全局存储与更新，这里写入到文件中
    _setJsApiTicket(filename) {
        const that = this;
        return new Promise(async function(resolve, reject) {
            let access_token = '';
            try {
                access_token = await that.getAccessToken();
            } catch (err) {
                return reject(err);
            }
            const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`;
            https
                .get(url, function(res) {
                    res.setEncoding('utf8');
                    res.on('data', function(data) {
                        if (data) {
                            data = JSON.parse(data);
                            //如果微信返回错误
                            if (data.errcode) {
                                return reject(new Error(data.errmsg));
                            }
                            const jsapi_ticket = data.ticket;
                            if (!jsapi_ticket) {
                                return reject(
                                    new Error('getJsApiTicket 请求返回数据没有jsapi_ticket')
                                );
                            }
                            const insert_data = {
                                expire_time: new Date().getTime() + 7000 * 1000,
                                jsapi_ticket: jsapi_ticket
                            };
                            //获得的access_token写入文件
                            fs.writeFile(filename, JSON.stringify(insert_data), function(err) {
                                if (err) {
                                    return reject(new Error('jsapi_ticket写入文件失败'));
                                }
                                //成功后返回access_token
                                return resolve(jsapi_ticket);
                            });
                        } else {
                            return reject(new Error('getJsApiTicket 请求返回数据为空'));
                        }
                    });
                })
                .on('error', function(err) {
                    return resolve(err);
                });
        });
    }

    //获取jsapi_ticket
    getJsApiTicket() {
        const that = this;
        return new Promise(async function(resolve, reject) {
            const filename = 'jsapi_ticket.json';
            //获取jsapi_ticket.json是否存在
            fs.exists(filename, async function(exist) {
                //不存在,获取jsapi_ticket
                if (!exist) {
                    let jsapi_ticket = '';
                    try {
                        jsapi_ticket = await that._setJsApiTicket(filename);
                        return resolve(jsapi_ticket);
                    } catch (err) {
                        return reject(err);
                    }
                } else {
                    //存在，直接读取jsapi_ticket.json
                    // 异步读取
                    fs.readFile(filename, async function(err, data) {
                        let jsapi_ticket = '';
                        if (err) {
                            return reject(err);
                        }
                        data = JSON.parse(data);
                        if (data && data.expire_time) {
                            if (data.expire_time < new Date().getTime()) {
                                try {
                                    jsapi_ticket = await that._setJsApiTicket(filename);
                                } catch (err) {
                                    reject(err);
                                }
                            } else {
                                jsapi_ticket = data.jsapi_ticket;
                            }
                        } else {
                            try {
                                jsapi_ticket = await that._setJsApiTicket(filename);
                            } catch (err) {
                                reject(err);
                            }
                        }
                        return resolve(jsapi_ticket);
                    });
                }
            });
        });
    }

    //获取
    async getSignPackage(url) {
        let jsapiTicket = '';
        try {
            jsapiTicket = await this.getJsApiTicket();
        } catch (err) {
            throw err;
        }
        const timestamp = Math.round(new Date().getTime() / 1000);
        const nonceStr = this._createNonceStr();
        // 这里参数的顺序要按照 key 值 ASCII 码升序排序
        const string = `jsapi_ticket=${jsapiTicket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;
        var sha1 = crypto.createHash('sha1');
        sha1.update(string, 'utf8');
        const signature = sha1.digest('hex');
        const signPackage = {
            appId: this.appId,
            nonceStr: nonceStr,
            timestamp: timestamp,
            signature: signature
        };
        return signPackage;
    }

    async getXcxOpenId(js_code) {
        const that = this
        return new Promise((resolve, reject) => {
            //console.log('data',data)
            const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${this.appId}&secret=${
                this.appSecret
            }&js_code=${js_code}&grant_type=authorization_code`;
            console.log('url:', url);
            https.get(url, function(res) {
                res.setEncoding('utf8');
                res
                    .on('data', function(data) {
                        if (data) {
                            data = JSON.parse(data);
                            console.log(data); //如何缓存session_key???后面用户授权登录要使用，解析unionid用。
                            // 在redis保存session_key    key: xcx_open_id:<openid>   value: <session_key>
                            that.saveSessionKey(data.openid, data.session_key)
                            const xopenid = {
                                openid: data.openid,
                                unionid: data.unionid
                            };
                            return resolve(xopenid);
                        }
                    })
                    .on('error', function(err) {
                        return resolve(err);
                    });
            });
        });
    }

    async getSessionKey(openid) {
        try {
            let client = redis.createClient({
                host: config.redis.host,
                port: config.redis.port,
                password: config.redis.pwd
            });
            return await client.get(XCX_SESSION_KEY_PREFIX + openid);
        } catch (error) {
            throw error;
        }
    }

    async saveSessionKey(openid, key) {
        try {
            let client = redis.createClient({
                host: config.redis.host,
                port: config.redis.port,
                password: config.redis.pwd
            });
            await client.set(XCX_SESSION_KEY_PREFIX + openid, key);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Wechat;
