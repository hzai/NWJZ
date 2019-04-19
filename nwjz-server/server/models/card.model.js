/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:54:27
 * @Last Modified by: Arnie Carter
 * @Last Modified time: 2018-09-21 00:04:36
 */

import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
/**
 * Card Schema
 */
const CardSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        front_image: {
            type: String
        },
        back_image: {
            type: String
        },
        // 卡类型 01 - 礼品卡
        type: {
            type: String,
            required: true,
            default: '01'
        },
        // 购买的卡金额  1 - 120元； 2 - 300元； 3 - 500元； 4 - 1000元；
        card_type: {
            type: Number,
            required: true
        },
        // 面值
        face_value: {
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
CardSchema.method({});

/**
 * Statics
 */
CardSchema.statics = {
    /**
     * Get card
     * @param {ObjectId} id - The objectId of card.
     * @returns {Promise<card, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((card) => {
                if (card) {
                    return card;
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
 * @typedef Card
 */
export default mongoose.model('Card', CardSchema);
