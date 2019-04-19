/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:54:27
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-03-26 12:15:03
 */

import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';

const SubServicesSchema = new mongoose.Schema({
    // 包含的服务
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    service_title: {
        type: String,
        default: ''
    },
    // 包含服务的次数
    times: {
        type: Number,
        default: 0
    },
    // 服务时长
    duration: {
        type: Number
    }
});

const TimePeriodSchema = new mongoose.Schema({
    name: {
        type: String
    },
    value: {
        type: String
    },
    counter: {
        type: Number,
        default: 0
    }
})

/**
 * Service Schema
 */
const ServiceSchema = new mongoose.Schema(
    {
        // 服务类型
        category: {
            type: String
        },
        // 服务名称,服务主题
        title: {
            type: String,
            required: true
        },
        // 服务子主题
        sub_title: {
            type: String
        },
        // 服务的主图
        primary_pic: {
            type: String,
            required: true
        },
        discounted_price: {
            type: Number
        },
        // 销售价格
        sale_price: {
            type: Number
        },
        // 价格单位
        price_unit: {
            type: String
        },
        // 是否需要选择时长
        need_choose_time: {
            type: Boolean,
            default: true
        },
        // 默认时长
        default_times: {
            type: Number,
            default: 1
        },
        // 是否套餐 是：true; 否：false
        is_suite: {
            type: Boolean,
            required: true,
            default: false
        },
        // 是否是卖卡使用
        is_card: {
            type: Boolean,
            required: true,
            default: false
        },
        buyable: {
            type: Boolean,
            required: true,
            default: false
        },
        // 只能购买一次
        buy_once: {
            type: Boolean,
            default: false
        },
        // 只有新用户可以买
        new_user_can_buy: {
            type: Boolean,
            default: false
        },
        // 套餐情况下，设定基本的服务次数
        base_service_times: {
            type: Number
        },
        // 服务过期日数
        expire_date_count: {
            type: Number
        },
        // 关键词，用于搜索
        keywords: {
            type: [String]
        },
        // 是否上架
        is_alive: {
            type: Boolean,
            required: true,
            default: true
        },
        // 是否严选服务
        is_strict_selection: {
            type: Boolean,
            default: false
        },
        // 直接购买的情况下是否可以直接选择服务时间。不进入preapointment
        is_buy_and_order: {
            type: Boolean,
            default: false
        },
        is_special_event: {
            type: Boolean,
            default: false
        },
        time_periods: [TimePeriodSchema],
        // 详细图片
        detail_images: {
            type: []
        },
        // 套餐包含项目
        sub_services: [SubServicesSchema],
        // 销售量统计
        sell_count: {
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
ServiceSchema.method({});

/**
 * Statics
 */
ServiceSchema.statics = {
    /**
     * Get service
     * @param {ObjectId} id - The objectId of service.
     * @returns {Promise<Service, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((service) => {
                if (service) {
                    return service;
                }
                const err = new APIError('No such service exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List services in descending order of 'created_time' timestamp.
     * @param {number} skip - Number of services to be skipped.
     * @param {number} limit - Limit number of services to be returned.
     * @returns {Promise<Service[]>}
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
 * @typedef Service
 */
export default mongoose.model('Service', ServiceSchema);
