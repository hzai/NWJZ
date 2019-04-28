/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:54:27
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-28 16:17:53
 */

import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../../helpers/APIError';
/**
 * Worker Comment Record Schema 阿姨评价备注记录表
 */
const WorkerCommentSchema = new mongoose.Schema(
    {
        // 关联 worker
        worker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Worker',
            required: true
        },
        // 关联 company
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Compnay',
            required: true
        },
        // 工作技能
        skill: {
            type: Number
        },
        // 工作态度
        attitude: {
            type: Number
        },
        // 责任心
        responsibility: {
            type: Number
        },
        // 人品
        character: {
            type: Number
        },
        // 评价内容
        comment: {
            type: String
        },
        remark: {
            type: String
        },
        isDisplay: {
            type: Boolean
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
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
WorkerCommentSchema.method({});

/**
 * Statics
 */
WorkerCommentSchema.statics = {
    /**
     * Get workerComment
     * @param {ObjectId} id - The objectId of workerComment.
     * @returns {Promise<workerComment, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then(workerComment => {
                if (workerComment) {
                    return workerComment;
                }
                const err = new APIError(
                    'No such workerComment exists!',
                    httpStatus.NOT_FOUND
                );
                return Promise.reject(err);
            });
    },

    /**
     * List addresses in descending order of 'created_time' timestamp.
     * @param {number} skip - Number of addresss to be skipped.
     * @param {number} limit - Limit number of addresses to be returned.
     * @returns {Promise<WorkerComment[]>}
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
 * @typedef WorkerComment
 */
export default mongoose.model('WorkerComment', WorkerCommentSchema);
