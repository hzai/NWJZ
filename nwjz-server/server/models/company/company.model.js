/*
 * @Author: Roy Chen
 * @Date: 2019-04-03 14:03:01
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-20 13:09:28
 */
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../../helpers/APIError';

/**
 * Company Schema
 *
 */
const CompanySchema = new mongoose.Schema(
    {
        // 公司名称
        name: {
            type: String
        },
        // 公司地址
        address: {
            type: String
        },
        // 公司电话
        telephone: {
            type: String
        },
        // 电子邮箱
        email: {
            type: String
        },
        // 网站
        website: {
            type: String
        },
        // 公司营业执照
        business_license_image: {
            type: String
        },
        // 状态 0 - 正常 1 - 禁用
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
 * Statics
 */
CompanySchema.statics = {
    /**
     * Get company
     * @param {ObjectId} id - The objectId of company.
     * @returns {Promise<Company, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then(company => {
                if (company) {
                    return company;
                }
                const err = new APIError(
                    'No such Company exists!',
                    httpStatus.NOT_FOUND
                );
                return Promise.reject(err);
            });
    },

    /**
     * List Companys in descending order of 'created' timestamp.
     * @param {number} skip - Number of Companys to be skipped.
     * @param {number} limit - Limit number of Companys to be returned.
     * @returns {Promise<Company[]>}
     */
    list({ skip = 0, limit = 50 } = {}) {
        return this.find()
            .sort({
                created: -1
            })
            .skip(skip)
            .limit(limit)
            .exec();
    }
};

/**
 * @typedef Company
 */
export default mongoose.model('Company', CompanySchema);
