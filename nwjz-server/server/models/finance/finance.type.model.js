/*
 * @Author: Roy Chen
 * @Date: 2019-4-1 20:17:23
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-25 16:45:02
 */
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../../helpers/APIError';

/**
 * 财务类型 FinanceTypeSchema
 */
const FinanceTypeSchema = new mongoose.Schema(
    {
        /* ** 隶属于的公司 */
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        },
        // 收入或支出
        tx_type: {
            type: String
        },
        // 类型名称 中介费、交通费等
        finance_type: {
            type: String
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
FinanceTypeSchema.method({});

/**
 * Statics
 */
FinanceTypeSchema.statics = {
    /**
     * Get FinanceType
     * @param {ObjectId} id - The objectId of FinanceType.
     * @returns {Promise<FinanceType, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then(financetype => {
                if (financetype) {
                    return financetype;
                }
                const err = new APIError(
                    'No such financetype exists!',
                    httpStatus.NOT_FOUND
                );
                return Promise.reject(err);
            });
    },

    /**
     * List insurances in descending order of 'created_time' timestamp.
     * @param {number} skip - Number of insurances to be skipped.
     * @param {number} limit - Limit number of insurances to be returned.
     * @returns {Promise<FinanceType[]>}
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
 * @typedef FinanceType
 */
export default mongoose.model('FinanceType', FinanceTypeSchema);
