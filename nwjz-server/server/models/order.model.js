/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:54:27
 * @Last Modified by: Arnie Carter
 * @Last Modified time: 2018-09-20 22:36:01
 */

import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
/**
 * Order Schema
 */
const OrderSchema = new mongoose.Schema({
    // 是否预约单
    is_reserve_order: {
        type: Boolean,
        required: true,
        default: false
    },
    // 订单号
    order_code: {
        type: String,
        required: true
    },
    // 关联user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // 关联user
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    // 服务地址
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    // 优惠券号
    user_coupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserCoupon'
    },
    // 服务时长 (每次)
    service_duration: {
        type: Number,
        default: 1
    },
    // 总服务时长
    total_service_duration: {
        type: Number,
        default: 1
    },
    // 总服务次数
    total_service_times: {
        type: Number,
        default:1
    },
    // 服务时间
    service_time: {
        type: Date
    },
    // 服务购买数量
    quantity: {
        type: Number,
        default: 1
    },
    // 应付金额
    amount_payable: {
        type: Number,
        required: true
    },
    // 已付金额
    amount_paid: {
        type: Number,
        default: 0
    },
    // 优惠券的优惠金额
    coupon_reduce_price: {
        type: Number
    },
    // 余额的优惠金额
    balance_reduce_price: {
        type: Number,
        default: 0
    },
    // 支付方式
    pay_type: {
        type: String
    },
    // 详细要求
    requirements: {
        type: []
    },
    expected_baby_date: {
        type: Date,
    },
    // 注意事项
    memo: {
        type: String
    },
    // 运营备注
    remark: {
        type: String
    },
    // 保洁卡专用 领取方式  1 - 实物卡； 2 - 虚拟卡； 3 - 直冲当前账号
    buy_type: {
        type: Number
    },
    // 保洁卡专用  购买的卡金额  1 - 120元； 2 - 300元； 3 - 500元； 4 - 1000元；
    card_type: {
        type: Number
    },
    // 01 - 公众号， 02 - 小程序, 03 - app
    order_from: {
        type: String
    },
    // 订单状态 0 - 待付款；1 - 已付款；2 - 待评价；3 - 已完成；4 - 交易关闭; 5 - 待回访； 6 - 已回访; 7 - 已退款
    status: {
        type: Number,
        required: true,
        default: 0
    },
    // 是否自动关闭 30分钟
    is_auto_closed: {
        type: Boolean
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
OrderSchema.method({});

/**
 * Statics
 */
OrderSchema.statics = {
    /**
     * Get order
     * @param {ObjectId} id - The objectId of order.
     * @returns {Promise<Order, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((order) => {
                if (order) {
                    return order;
                }
                const err = new APIError('No such order exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List orders in descending order of 'created_time' timestamp.
     * @param {number} skip - Number of orders to be skipped.
     * @param {number} limit - Limit number of orders to be returned.
     * @returns {Promise<Order[]>}
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
 * @typedef Order
 */
export default mongoose.model('Order', OrderSchema);
