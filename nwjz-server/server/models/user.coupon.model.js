/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:54:27
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-03-28 16:32:57
 */

import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
/**
 * UserCoupon Schema
 */
const UserCouponSchema = new mongoose.Schema(
    {
        // 关联user
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        // 关联优惠券
        coupon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coupon',
            required: true
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true
        },
        // 过期时间
        expire_date: {
            type: Date,
            required: true
        },
        remind_times: {
            type: Number,
            default: 0
        },
        // 状态 0 - 已领取； 1 - 已使用； 2 - 已过期；
        status: {
            type: Number,
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
UserCouponSchema.method({});

/**
 * Statics
 */
UserCouponSchema.statics = {
    /**
     * Get coupon
     * @param {ObjectId} id - The objectId of coupon.
     * @returns {Promise<coupon, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((couponRecord) => {
                if (couponRecord) {
                    return couponRecord;
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
 * @typedef UserCoupon
 */
export default mongoose.model('UserCoupon', UserCouponSchema);
