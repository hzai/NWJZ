/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:53:48
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-07-03 17:05:29
 */
import moment from 'moment';
import jwt from 'jsonwebtoken';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';

const crypto = require('crypto');
/**
 * Auth Schema
 *
 * 一个用户user 可以有多个 auth, 例如一个用户可以用手机号码登录，可以用微信登录
 */
const AuthSchema = new mongoose.Schema({
    // 关联user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // 账号类型 手机号码:MOBILE, 微信:WECHAT, 系统用户:SYSTEM   可以参考定义 .env
    identity_type: {
        type: String,
        required: true
    },
    // 账号
    identifier: {
        type: String,
        required: true
    },
    // 加密的密码
    credential: {
        type: String,
        required: true
    },
    // 密码盐
    salt: {
        type: String
    },
    created_time: {
        type: Date,
        default: Date.now
    },
    updated_time: {
        type: Date
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId
    }
}, {
    versionKey: '_v'
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
AuthSchema.method({
    // 设置密码
    setPassword(password) {
        this.salt = crypto.randomBytes(16).toString('hex');
        // 100000代表迭代次数 64代表长度
        this.credential = crypto.pbkdf2Sync(password, this.salt, 100000, 64, 'sha512').toString('hex');
    },
    // 验证密码
    validPassword(password) {
        const hash = crypto.pbkdf2Sync(password, this.salt, 100000, 64, 'sha512').toString('hex');
        return this.credential === hash;
    },
    // 产生 JWT token
    generateJwt() {
        const expiry = moment().add(30, 'days'); // Token 有效期 7天
        // const expiry = moment().add(2, 'minutes'); // Token 有效期 7天
        return jwt.sign({
            user: this.user._id,
            nickname: this.user.nickname,
            identifier: this.identifier,
            identity_type: this.identity_type,
            roles: this.user.roles,
            exp: parseInt(expiry / 1000, 10)
        }, config.jwtSecret);
    }
});

/**
 * Statics
 */
AuthSchema.statics = {
    /**
     * Get auth
     * @param {ObjectId} id - The objectId of auth.
     * @returns {Promise<Auth, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((auth) => {
                if (auth) {
                    return auth;
                }
                const err = new APIError('No such auth exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List auths in descending order of 'created' timestamp.
     * @param {number} skip - Number of auths to be skipped.
     * @param {number} limit - Limit number of auths to be returned.
     * @returns {Promise<Auth[]>}
     */
    list({
        skip = 0,
        limit = 50
    } = {}) {
        return this.find()
            .sort({
                created: -1
            })
            .skip(skip)
            .limit(limit)
            .exec();
    },
};

/**
 * @typedef Auth
 */
export default mongoose.model('Auth', AuthSchema);
