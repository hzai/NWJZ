/*
 * @Author: Roy Chen
 * @Date: 2019-4-1 20:17:23
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-25 17:59:17
 */
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../../helpers/APIError';

/**
 * 财务记录 FinanceRecordSchema
 */
const FinanceRecordSchema = new mongoose.Schema(
    {
        /* ** 隶属于的公司 */
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        },
        // 关联 worker
        worker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Worker'
        },
        // 关联 employer
        employer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employer'
        },
        // 收入或支出
        tx_type: {
            type: String
        },
        // 类型名称 中介费、交通费等
        finance_type: {
            type: String
        },
        // 发生时间
        tx_time: {
            type: Date
        },
        // 金额
        amount: {
            type: Number
        },
        // 备注
        remark: {
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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        updated_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        versionKey: '_v'
    }
);

/**
 * Methods
 */
FinanceRecordSchema.method({});

/**
 * Statics
 */
FinanceRecordSchema.statics = {
    /**
     * Get FinanceRecord
     * @param {ObjectId} id - The objectId of FinanceRecord.
     * @returns {Promise<FinanceRecord, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then(financerecord => {
                if (financerecord) {
                    return financerecord;
                }
                const err = new APIError(
                    'No such financerecord exists!',
                    httpStatus.NOT_FOUND
                );
                return Promise.reject(err);
            });
    },

    /**
     * List insurances in descending order of 'created_time' timestamp.
     * @param {number} skip - Number of insurances to be skipped.
     * @param {number} limit - Limit number of insurances to be returned.
     * @returns {Promise<FinanceRecord[]>}
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
 * @typedef FinanceRecord
 */
export default mongoose.model('FinanceRecord', FinanceRecordSchema);
