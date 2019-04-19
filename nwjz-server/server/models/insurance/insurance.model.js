/*
 * @Author: Roy Chen
 * @Date: 2019-4-1 20:17:23
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-13 21:48:19
 */
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../../helpers/APIError';

/**
 * 保险 Schema
 */
const InsuranceSchema = new mongoose.Schema(
    {
        // 保险单号
        insurance_no: {
            type: String,
            required: true
        },
        // 保险类型 single - 个人险 group - 团体险
        insurance_type: {
            type: String,
            required: true
        },
        // 是否可以换人 false - 不可换 true - 可以换
        can_changed: {
            type: Boolean,
            default: false
        },
        // 关联 worker 一对多
        worker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Worker'
        },
        // 保险开始日期
        start_date: {
            type: Date,
            required: true
        },
        // 保险结束日期
        end_date: {
            type: Date,
            required: true
        },
        // 备注
        remark: {
            type: String
        },
        // 附件
        attachment: {
            type: []
        },
        // 状态 0 - 生效 1 - 过期
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
 * Methods
 */
InsuranceSchema.method({});

/**
 * Statics
 */
InsuranceSchema.statics = {
    /**
     * Get insurance
     * @param {ObjectId} id - The objectId of insurance.
     * @returns {Promise<Insurance, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then(insurance => {
                if (insurance) {
                    return insurance;
                }
                const err = new APIError(
                    'No such insurance exists!',
                    httpStatus.NOT_FOUND
                );
                return Promise.reject(err);
            });
    },

    /**
     * List insurances in descending order of 'created_time' timestamp.
     * @param {number} skip - Number of insurances to be skipped.
     * @param {number} limit - Limit number of insurances to be returned.
     * @returns {Promise<Insurance[]>}
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
 * @typedef Insurance
 */
export default mongoose.model('Insurance', InsuranceSchema);
