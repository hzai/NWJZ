/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:54:27
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-21 13:28:20
 */

import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import userData from './initData/user';
import Auth from './auth.model';
import config from '../../config/config';
/**
 * User Schema
 */
const UserSchema = new mongoose.Schema(
    {
        // 公众号openid
        wechat_openid: {
            type: String
        },
        xcx_openid: {
            type: String
        },
        // 用户类型 系统用户:system 会员:member, 公司:company
        user_type: {
            type: String,
            required: true,
            default: 'member'
        },
        // 余额
        balance: {
            type: Number,
            default: 0
        },
        is_newUser: {
            type: String,
            default: '0' // 0:老用户 1:新用户
        },
        invited_from: {
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
            type: String,
            default: ''
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
        // 自我介绍
        introduce: {
            type: String
        },
        // 附件图片
        attachment: {
            type: []
        },
        // 保姆编码
        worker_code: {
            type: String
        },
        /* ** 隶属于的公司 */
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        },
        // 状态 0-正常 1-禁用
        status: {
            type: Number,
            required: true,
            default: 0
        },
        // 角色
        roles: {
            type: [String],
            default: ['user']
        },
        // 备注
        remark: {
            type: []
        },
        // 注册IP
        register_ip: {
            type: String
        },
        // 登录时间
        login_time: {
            type: Date
        },
        // 登录IP
        login_ip: {
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
UserSchema.method({});

/**
 * Statics
 */
UserSchema.statics = {
    /**
     * Get user
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then(user => {
                if (user) {
                    return user;
                }
                const err = new APIError(
                    'No such user exists!',
                    httpStatus.NOT_FOUND
                );
                return Promise.reject(err);
            });
    },

    /**
     * List users in descending order of 'created_time' timestamp.
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
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

const User = mongoose.model('User', UserSchema);

User.findOne((err, data) => {
    if (!data) {
        userData.forEach(item => {
            User.create(item).then(savedUser => {
                const auth = new Auth({
                    user: savedUser._id,
                    identity_type: config.identity_type.system,
                    identifier: 'admin',
                    created_by: savedUser._id
                });
                auth.setPassword('12345678');
                auth.save();
            });
        });
    }
});

/**
 * @typedef User
 */
export default User;
