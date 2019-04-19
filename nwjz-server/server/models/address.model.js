/*
 * @Author: Roy Chen 
 * @Date: 2017-12-12 23:54:27 
 * @Last Modified by: Arnie Carter
 * @Last Modified time: 2018-01-05 18:09:59
 */

import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import { fail } from 'assert';
/**
 * Address Schema
 */
const AddressSchema = new mongoose.Schema({
    // 关联user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contact_person: {
        type: String,
        required: true
    },
    contact_phone: {
        type: String,
        required: true
    },
    area: {
        type: [String],
        required: true
    },
    detail_address: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        default: '家'
    },
    is_default: {
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
AddressSchema.method({});

/**
 * Statics
 */
AddressSchema.statics = {
    /**
     * Get address
     * @param {ObjectId} id - The objectId of address.
     * @returns {Promise<address, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((address) => {
                if (address) {
                    return address;
                }
                const err = new APIError('No such address exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List addresses in descending order of 'created_time' timestamp.
     * @param {number} skip - Number of addresss to be skipped.
     * @param {number} limit - Limit number of addresses to be returned.
     * @returns {Promise<Address[]>}
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
 * @typedef Address
 */
export default mongoose.model('Address', AddressSchema);
