/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:54:27
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-07-02 20:10:48
 */

import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const AssistUserSchema = new mongoose.Schema({
    // user - 助力好友
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    success: {
        type: Boolean
    },
    remark: {
        type: String
    },
    created_time: {
        type: Date,
        default: Date.now
    }
});
/**
 * UserEvent Schema
 */
const UserEventSchema = new mongoose.Schema(
    {
        // 关联 User - 参加活动的用户
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        // 关联 Event
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: true
        },
        // 助力好友列表
        assist_users: [AssistUserSchema],
        // 0 - 未成功 1 - 助力成功
        status: {
            type: Number,
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
UserEventSchema.method({});

/**
 * Statics
 */
UserEventSchema.statics = {
    /**
     * Get UserEvent
     * @param {ObjectId} id - The objectId of UserEvent.
     * @returns {Promise<UserEvent, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((UserEvent) => {
                if (UserEvent) {
                    return UserEvent;
                }
                const err = new APIError('No such UserEvent exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List UserEvents in descending UserEvent of 'created_time' timestamp.
     * @param {number} skip - Number of UserEvents to be skipped.
     * @param {number} limit - Limit number of UserEvents to be returned.
     * @returns {Promise<UserEvent[]>}
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
 * @typedef UserEvent
 */
export default mongoose.model('UserEvent', UserEventSchema);
