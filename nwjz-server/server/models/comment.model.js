/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:54:27
 * @Last Modified by: Arnie Carter
 * @Last Modified time: 2018-06-21 23:02:39
 */
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
/**
 * Comment Schema
 */
const CommentSchema = new mongoose.Schema(
    {
        // 关联user
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        // 关联user
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true
        },
        // 关联 appointment
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true
        },
        // 是否匿名评价
        is_anonymous: {
            type: Boolean,
            default: true
        },
        user_name: {
            type: String
        },
        user_avatar: {
            type: String
        },
        // 评分
        score: {
            type: Number,
            default: 0
        },
        // 内容
        content: {
            type: String,
            default: '此用户没有填写评价。'
        },
        // 内容
        org_content: {
            type: String,
            default: '此用户没有填写评价。'
        },
        // 评价
        rate: {
            type: Number
        },
        // 图片
        images: {
            type: []
        },
        // 排序
        sort: {
            type: Number,
            default: 0
        },
        is_top: {
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
CommentSchema.method({});

/**
 * Statics
 */
CommentSchema.statics = {
    /**
     * Get comment
     * @param {ObjectId} id - The objectId of comment.
     * @returns {Promise<Comment, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((comment) => {
                if (comment) {
                    return comment;
                }
                const err = new APIError('No such comment exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List comments in descending comment of 'created_time' timestamp.
     * @param {number} skip - Number of comments to be skipped.
     * @param {number} limit - Limit number of comments to be returned.
     * @returns {Promise<Comment[]>}
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
 * @typedef Comment
 */
export default mongoose.model('Comment', CommentSchema);
