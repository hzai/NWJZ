/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:54:27
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-03-07 21:12:51
 */

import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
/**
 * Worker Service Record Schema 保姆服务记录表
 */
const WorkerServiceSchema = new mongoose.Schema({
    // 关联 worker
    worker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
        required: true
    },
    // 关联 company
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // 关联的 appointment
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    start_time: {
        type: Date
    },
    end_time: {
        type: Date
    },
    // 状态 0 - 分配中，1 - 服务中， 2 - 服务完成， 3 - 服务取消
    status: {
        type: Number,
        default: 0
    },
    remark: {
        type: [],
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
WorkerServiceSchema.method({});

/**
 * Statics
 */
WorkerServiceSchema.statics = {
    /**
     * Get workerService
     * @param {ObjectId} id - The objectId of workerService.
     * @returns {Promise<workerService, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((workerService) => {
                if (workerService) {
                    return workerService;
                }
                const err = new APIError('No such workerService exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List addresses in descending order of 'created_time' timestamp.
     * @param {number} skip - Number of addresss to be skipped.
     * @param {number} limit - Limit number of addresses to be returned.
     * @returns {Promise<WorkerService[]>}
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
 * @typedef WorkerService
 */
export default mongoose.model('WorkerService', WorkerServiceSchema);
