/*
 * @Author: Roy Chen
 * @Date: 2019-4-1 20:17:23
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-13 22:26:06
 */
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../../helpers/APIError';

/**
 * 沟通记录 Schema
 */
const CommunicationSchema = new mongoose.Schema(
    {
        // 关联 user
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        // 关联 worker
        worker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Worker'
        },
        // 关联 employer
        employer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employer'
        },
        // 内容
        content: {
            type: String
        },
        // 附件
        attachment: {
            type: []
        },
        author: {
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
 * Methods
 */
CommunicationSchema.method({});

/**
 * Statics
 */
CommunicationSchema.statics = {
    /**
     * Get Communication
     * @param {ObjectId} id - The objectId of Communication.
     * @returns {Promise<Communication, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then(communication => {
                if (communication) {
                    return communication;
                }
                const err = new APIError(
                    'No such communication exists!',
                    httpStatus.NOT_FOUND
                );
                return Promise.reject(err);
            });
    },

    /**
     * List insurances in descending order of 'created_time' timestamp.
     * @param {number} skip - Number of insurances to be skipped.
     * @param {number} limit - Limit number of insurances to be returned.
     * @returns {Promise<Communication[]>}
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
 * @typedef Communication
 */
export default mongoose.model('Communication', CommunicationSchema);
