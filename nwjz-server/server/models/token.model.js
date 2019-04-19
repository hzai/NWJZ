/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:53:48
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-02-24 22:02:34
 */
import moment from 'moment';
import jwt from 'jsonwebtoken';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
/**
 * Token Schema
 */
const TokenSchema = new mongoose.Schema(
    {
        access_token: String,
        expires_in: Number,
        refresh_token: String,
        openid: String,
        scope: String,
        create_at: String
    },
    {
        versionKey: '_v'
    }
);

TokenSchema.statics.getToken = function (openid, cb) {
    this.findOne({ openid }, (err, result) => {
        if (err) throw err;
        return cb(null, result);
    });
};

TokenSchema.statics.setToken = function (openid, token, cb) {
    // 有则更新，无则添加
    const query = { openid };
    const options = { upsert: true };
    this.update(query, token, options, (err, result) => {
        if (err) throw err;
        return cb(null);
    });
};
/**
 * @typedef Token
 */
export default mongoose.model('Token', TokenSchema);
