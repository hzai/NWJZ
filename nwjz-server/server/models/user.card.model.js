/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:54:27
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-07-25 13:47:33
 */

import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
/**
 * UserCard Schema
 */
const UserCardSchema = new mongoose.Schema(
    {
        // 关联user
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        // 关联card
        card_entity: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CardEntity',
            required: true
        },
        // 备注
        remark: {
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
UserCardSchema.method({});

/**
 * Statics
 */
UserCardSchema.statics = {
    /**
     * Get card
     * @param {ObjectId} id - The objectId of card.
     * @returns {Promise<card, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((cardRecord) => {
                if (cardRecord) {
                    return cardRecord;
                }
                const err = new APIError('No such card exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List cards in descending order of 'created_time' timestamp.
     * @param {number} skip - Number of cards to be skipped.
     * @param {number} limit - Limit number of cards to be returned.
     * @returns {Promise<card[]>}
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
 * @typedef UserCard
 */
export default mongoose.model('UserCard', UserCardSchema);
