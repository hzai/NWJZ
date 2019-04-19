/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:54:27
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-07-05 15:35:29
 */

import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
/**
 * Service Category Schema
 */
const ServiceCategorySchema = new mongoose.Schema({
    // 关联 Service
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    // 服务类型编码
    code: {
        type: String,
        required: true
    },
    // 服务类型名称
    label: {
        type: String,
        required: true
    },
    // 图标
    icon: {
        type: String,
        required: true
    },
    // 颜色
    color: {
        type: String,
        required: true
    },
    // 顺序
    order: {
        type: Number,
        required: true
    },
    // 服务类型状态 0:正常 1:关闭
    status: {
        type: Number,
        required: true,
        default: 1
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
ServiceCategorySchema.method({});

/**
 * Statics
 */
ServiceCategorySchema.statics = {
    /**
     * Get service
     * @param {ObjectId} id - The objectId of service.
     * @returns {Promise<Service, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((serviceCategory) => {
                if (serviceCategory) {
                    return serviceCategory;
                }
                const err = new APIError('No such Service Category exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List services in descending order of 'created_time' timestamp.
     * @param {number} skip - Number of services to be skipped.
     * @param {number} limit - Limit number of services to be returned.
     * @returns {Promise<ServiceCategory[]>}
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
 * @typedef ServiceCategory
 */
export default mongoose.model('ServiceCategory', ServiceCategorySchema);
