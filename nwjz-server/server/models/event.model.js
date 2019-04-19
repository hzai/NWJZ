/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:54:27
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-06-29 21:28:44
 */

import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
/**
 * Event Schema
 */
const EventSchema = new mongoose.Schema({
    // 活动名称
    name: {
        type: String
    },
    // 关联Service
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    begin_time: {
        type: Date,
    },
    end_time: {
        type: Date,
    },
    // 活动状态 0 - 正常， 1 - 已失效， 2 - 已过期
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
        type: mongoose.Schema.Types.ObjectId
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId
    }
}, {
    versionKey: '_v'
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
EventSchema.method({});

/**
 * Statics
 */
EventSchema.statics = {
    /**
     * Get event
     * @param {ObjectId} id - The objectId of event.
     * @returns {Promise<Event, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((event) => {
                if (event) {
                    return event;
                }
                const err = new APIError('No such event exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List events in descending event of 'created_time' timestamp.
     * @param {number} skip - Number of events to be skipped.
     * @param {number} limit - Limit number of events to be returned.
     * @returns {Promise<Event[]>}
     */
    list({
        skip = 0,
        limit = 50
    } = {}) {
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
 * @typedef Event
 */
export default mongoose.model('Event', EventSchema);
