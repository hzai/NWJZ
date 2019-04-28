/*
 * @Author: Roy Chen
 * @Date: 2019-4-1 20:17:23
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-27 15:52:49
 */
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../../helpers/APIError';

/**
 * 字典 DictionarySchema
 */
const DictionarySchema = new mongoose.Schema(
    {
        /* ** 隶属于的公司 */
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        },
        category: {
            type: String
        },
        value: {
            type: String
        },
        label: {
            type: String
        },
        sort: {
            type: Number
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
 * Methods
 */
DictionarySchema.method({});

/**
 * Statics
 */
DictionarySchema.statics = {
    /**
     * Get Dictionary
     * @param {ObjectId} id - The objectId of Dictionary.
     * @returns {Promise<Dictionary, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then(dictionary => {
                if (dictionary) {
                    return dictionary;
                }
                const err = new APIError(
                    'No such dictionary exists!',
                    httpStatus.NOT_FOUND
                );
                return Promise.reject(err);
            });
    },

    /**
     * List insurances in descending order of 'created_time' timestamp.
     * @param {number} skip - Number of insurances to be skipped.
     * @param {number} limit - Limit number of insurances to be returned.
     * @returns {Promise<Dictionary[]>}
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
 * @typedef Dictionary
 */
export default mongoose.model('Dictionary', DictionarySchema);
