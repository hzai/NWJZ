/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:54:27
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-05-08 20:02:28
 */

import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
/**
 * Employer Schema
 */
const EmployerSchema = new mongoose.Schema(
    {
        /* ** 隶属于的公司 */
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        },
        // 来源
        source: {
            type: String
        },
        // 姓名
        name: {
            type: String,
            required: true
        },
        // 联系电话
        contact_phone: {
            type: String
        },
        // 现居地址 省市区
        address_area: {
            type: []
        },
        // 现居详细地址
        detail_address: {
            type: String
        },
        // 备注（特殊需求
        remark: {
            type: String
        },
        // 性别
        sex: {
            type: String
        },
        // 籍贯
        native_place: {
            type: String
        },
        // 年龄
        age: {
            type: Number
        },
        // 身份证号
        id_card: {
            type: String
        },
        // 身份证号图片
        id_card_images: {
            type: []
        },
        requirements: {
            type: String
        },
        service_time: {
            type: String
        },
        // 阿姨籍贯要求
        worker_native_place: {
            type: String
        },
        // 阿姨从业经验
        worker_exp: {
            type: String
        },
        // 阿姨薪资要求最低
        salary_min: {
            type: Number
        },
        // 阿姨薪资要求最低
        salary_max: {
            type: Number
        },
        // 吃饭口味
        taste: {
            type: []
        },
        // 年龄要求最小
        age_min: {
            type: Number
        },
        // 年龄要求最大
        age_max: {
            type: Number
        },
        // 家庭内人口
        family: {
            type: Number
        },
        // 面积
        area: {
            type: Number
        },
        // 婴儿或幼童数量
        childrens: {
            type: Number
        },
        // 宠物数量
        pets: {
            type: Number
        },
        // 预产期
        childbirth: {
            type: Date
        },
        images: {
            type: []
        },
        videos: {
            type: []
        },
        // 附件
        attachment: {
            type: []
        },
        // 状态 0 - 新建 1 - 跟进中 2 - 匹配中 3 - 待面试 4 - 待签单 5 - 已服务 6 - 已放弃 7 - 已私签 8 - 黑名单
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
EmployerSchema.method({});

/**
 * Statics
 */
EmployerSchema.statics = {
    /**
     * Get employer
     * @param {ObjectId} id - The objectId of employer.
     * @returns {Promise<Employer, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then(employer => {
                if (employer) {
                    return employer;
                }
                const err = new APIError(
                    'No such employer exists!',
                    httpStatus.NOT_FOUND
                );
                return Promise.reject(err);
            });
    },

    /**
     * List employers in descending order of 'created_time' timestamp.
     * @param {number} skip - Number of employers to be skipped.
     * @param {number} limit - Limit number of employers to be returned.
     * @returns {Promise<Employer[]>}
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
 * @typedef Employer
 */
export default mongoose.model('Employer', EmployerSchema);
