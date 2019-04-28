/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:54:27
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-28 17:58:25
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
        // 类型 prospect - 潜在客户 client - 客户
        type: {
            type: String
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
        // 联系电话 本人电话
        contact_phone: {
            type: String
        },
        address: {
            type: String
        },
        // 吃饭口味
        taste: {
            type: String
        },
        // 家庭内人口
        family: {
            type: Number
        },
        // 面积
        area: {
            type: Number
        },
        // 服务类型（买菜、做饭、遛狗、接送孩子、照顾老人、手洗衣物（多选））
        service_type: {
            type: [String]
        },
        // 老人类型（健康、患病、瘫痪、特殊（单选）
        old_man_type: {
            type: String
        },
        // 婴儿或幼童数量
        childrens: {
            type: Number
        },
        // 宠物数量
        pets: {
            type: Number
        },
        requirements: {
            type: String
        },
        salary_range: {
            type: String
        },
        work_time: {
            type: String
        },
        working_age: {
            type: String
        },
        // 备注（特殊需求
        remark: {
            type: String
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
