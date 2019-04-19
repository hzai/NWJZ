/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:54:27
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-03-26 20:26:01
 */

import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
/**
 * Message Schema
 */
const MessageSchema = new mongoose.Schema(
    {
        // 关联user
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        // 消息类型: 01 - 提醒消息 02 - 推广消息
        type: {
            type: String
        },
        // 消息主题
        title: {
            type: String
        },
        // 消息内容
        content: {
            type: String
        },
        // 跳转URL
        redirect_url: {
            type: String
        },
        // 图片
        images: {
            type: []
        },
        // 状态: 0 - 未读 1 - 已读
        status: {
            type: Number,
            required: true,
            default: 0
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
    },
    {
        versionKey: '_v'
    }
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
MessageSchema.method({});

/**
 * Statics
 */
MessageSchema.statics = {
    /**
     * Get coupon
     * @param {ObjectId} id - The objectId of coupon.
     * @returns {Promise<coupon, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((coupon) => {
                if (coupon) {
                    return coupon;
                }
                const err = new APIError('No such coupon exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List coupons in descending order of 'created_time' timestamp.
     * @param {number} skip - Number of coupons to be skipped.
     * @param {number} limit - Limit number of coupons to be returned.
     * @returns {Promise<coupon[]>}
     */
    list({ skip = 0, limit = 50 } = {}) {
        return this.find()
            .sort({
                created_time: -1
            })
            .skip(skip)
            .limit(limit)
            .exec();
    }
};

/**
 * @typedef Message
 */
export default mongoose.model('Message', MessageSchema);
