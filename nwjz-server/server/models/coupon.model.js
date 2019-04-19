/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:54:27
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-06-05 18:24:28
 */

import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
/**
 * Coupon Schema
 */
const CouponSchema = new mongoose.Schema({
  // 优惠券名称
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  // 优惠券类型 满减、指定服务优惠、新人优惠、新年优惠等等。
  coupon_type: {
    type: [String],
    required: true
  },
  // 是否可以重复领取使用。默认只能领取使用一次。
  is_repetition_use: {
    type: Boolean,
    default: false
  },
  coupon_code: {
    type: String,
  },
  // 面值
  face_value: {
    type: Number,
    required: true
  },
  // 满多少钱
  enough_money: {
    type: Number
  },
  // 打折
  discount: {
    type: Number
  },
  // 开始时间
  begin_time: {
    type: Date
  },
  // 结束时间
  end_time: {
    type: Date
  },
  expire_date_count: {
    type: Number
  },
  // 临时变量
  tags: {
    type: Number
  },
  // 状态: 正常：0，已失效：1，已过期：2
  status: {
    type: Number,
    required: true,
    default: 0
  },
  visiabled: {
    type: Boolean,
    default: false
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
CouponSchema.method({});

/**
 * Statics
 */
CouponSchema.statics = {
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
  list({
    skip = 0,
    limit = 50
  } = {}) {
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
 * @typedef Coupon
 */
export default mongoose.model('Coupon', CouponSchema);
