/*
 * @Author: Roy Chen
 * @Date: 2019-4-1 20:17:23
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-01 23:36:27
 */
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
/**
 * 保险险种
 */
const InsTypeSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    // 备注
    remark: {
        type: String
    }
});
/**
 * 保险公司 Schema
 */
const InsCompanySchema = new mongoose.Schema(
    {
        // 保险公司名称
        name: {
            type: String,
            required: true
        },
        // 保险经纪人
        agent: {
            type: String
        },
        // 联系电话
        contact_phone: {
            type: String
        },
        // 险种
        types: [InsTypeSchema],
        // 备注
        remark: {
            type: String
        },
        // 附件
        attachment: {
            type: []
        },
        // 状态 0 - 生效 1 - 失效
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
            type: Date,
            default: Date.now
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
InsCompanySchema.method({});

/**
 * Statics
 */
InsCompanySchema.statics = {
    /**
     * Get insurance_company
     * @param {ObjectId} id - The objectId of insurance_company.
     * @returns {Promise<InsCompany, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((insurance_company) => {
                if (insurance_company) {
                    return insurance_company;
                }
                const err = new APIError('No such insurance_company exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List insurance_companys in descending order of 'created_time' timestamp.
     * @param {number} skip - Number of insurance_companys to be skipped.
     * @param {number} limit - Limit number of insurance_companys to be returned.
     * @returns {Promise<InsCompany[]>}
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
 * @typedef InsCompany
 */
export default mongoose.model('InsCompany', InsCompanySchema);
