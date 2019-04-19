/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:54:27
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-04-05 11:43:53
 */

import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
/**
 * Setting Schema
 */
const SettingSchema = new mongoose.Schema(
    {
        isSystem: {
            type: Boolean,
            default: false
        },
        banner: {
            type: []
        },
        user_protocol: {
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
SettingSchema.method({});

/**
 * Statics
 */
SettingSchema.statics = {
    /**
     * Get config
     * @param {ObjectId} id - The objectId of config.
     * @returns {Promise<config, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((config) => {
                if (config) {
                    return config;
                }
                const err = new APIError('No such config exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List configs in descending order of 'created_time' timestamp.
     * @param {number} skip - Number of configs to be skipped.
     * @param {number} limit - Limit number of configs to be returned.
     * @returns {Promise<config[]>}
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
 * @typedef Setting
 */
export default mongoose.model('Setting', SettingSchema);
