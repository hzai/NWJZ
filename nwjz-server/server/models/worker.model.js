/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:54:27
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-09 17:32:27
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

/**
 * 保险 Schema
 */
const InsuranceSchema = new mongoose.Schema({
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
    worker: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Worker'
        }
    ],
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
    // 状态 0 - 生效 1 - 失效 2 - 过期
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
});
/**
 * Worker Schema
 */
const WorkerSchema = new mongoose.Schema(
    {
        // 保姆编码
        worker_code: {
            type: String
        },
        /* 隶属于的公司 */
        belong_to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        // 昵称
        nickname: {
            type: String,
            required: '昵称是必填项'
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
        // 户籍地址
        address: {
            type: String
        },
        // 年龄
        age: {
            type: Number
        },
        // 婚姻状况
        marriaged: {
            type: Boolean
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
        // 学历
        academic: {
            type: String
        },
        // 身高
        height: {
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
        // 语言能力
        languages: {
            type: [String]
        },
        // 证件
        credentials: {
            type: [String]
        },
        // 工作类型
        work_type: {
            type: [String]
        },
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
        insurance: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Insurance'
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
