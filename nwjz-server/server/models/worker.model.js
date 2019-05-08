/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:54:27
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-05-08 22:43:26
 */

import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const FamilySchema = new mongoose.Schema({
    name: {
        type: String
    },
    sex: {
        type: String
    },
    relationship: {
        type: String
    },
    age: {
        type: String
    },
    company: {
        type: String
    },
    tel: {
        type: String
    }
});

const WorkExpSchema = new mongoose.Schema({
    start_end: {
        type: [Date]
    },
    content: {
        type: String
    }
});

/**
 * Worker Schema
 */
const WorkerSchema = new mongoose.Schema(
    {
        /* ** 隶属于的公司 */
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        },
        // 保姆编码
        worker_code: {
            type: String
        },
        // 头像
        avatar: {
            type: String
        },
        // 姓名
        name: {
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
        // 民族
        nation: {
            type: String
        },
        // 属相
        zodiac: {
            type: String
        },
        // 生肖
        astro: {
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
        // 年龄
        age: {
            type: Number
        },
        // 婚姻状况
        marriaged: {
            type: String
        },
        // 生日
        birth: {
            type: Date
        },
        // 身份证号
        id_card: {
            type: String
        },
        // 身份证号图片
        id_card_images: {
            type: []
        },
        // 身份证地址
        id_card_address: {
            type: String
        },
        // 学历
        academic: {
            type: String
        },
        // 身高
        height: {
            type: Number
        },
        weight: {
            type: Number
        },
        // 老家电话
        town_phone: {
            type: String
        },
        // 紧急电话
        urgent_phone: {
            type: String
        },
        // 联系电话 本人电话
        contact_phone: {
            type: String
        },
        // 身体状况
        healthy: {
            type: String
        },
        // 电子邮箱
        email: {
            type: String
        },
        // 其他证件
        other_credentials: {
            type: String
        },
        mandarin_level: {
            type: String
        },
        // 语言能力
        languages: {
            type: [String]
        },
        // 证件
        credentials: {
            type: [String]
        },
        zuofannengli: {
            type: String
        },
        caixi: {
            type: [String]
        },
        // 工作类型
        work_type: {
            type: [String]
        },
        // 薪资要求
        salary: {
            type: Number
        },
        // 工作时间
        work_time: {
            type: [String]
        },
        working_age: {
            type: String
        },
        // 工作经历
        work_exp: [WorkExpSchema],
        // 其他工作类型
        other_work_type: {
            type: String
        },
        // 介绍人或担保人
        recommend_person: {
            type: String
        },
        // 介绍人联系电话
        recommend_phone: {
            type: String
        },
        // 工作经验
        working_experience: {
            type: String
        },
        // 家庭成员
        family: [FamilySchema],
        // 自我介绍
        introduce: {
            type: String
        },
        // 附件图片
        attachment: {
            type: []
        },
        images: {
            type: []
        },
        videos: {
            type: []
        },
        // 后台标记
        remark: {
            type: String
        },
        // 状态 0-未分配 1-已分配 2-离职 3-黑名单
        status: {
            type: Number,
            required: true,
            default: 0
        },
        // 是否正式员工
        is_employed: {
            type: Boolean,
            default: false
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
WorkerSchema.method({});

/**
 * Statics
 */
WorkerSchema.statics = {
    /**
     * Get worker
     * @param {ObjectId} id - The objectId of worker.
     * @returns {Promise<Worker, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then(worker => {
                if (worker) {
                    return worker;
                }
                const err = new APIError(
                    'No such worker exists!',
                    httpStatus.NOT_FOUND
                );
                return Promise.reject(err);
            });
    },

    /**
     * List workers in descending order of 'created_time' timestamp.
     * @param {number} skip - Number of workers to be skipped.
     * @param {number} limit - Limit number of workers to be returned.
     * @returns {Promise<Worker[]>}
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
 * @typedef Worker
 */
export default mongoose.model('Worker', WorkerSchema);
