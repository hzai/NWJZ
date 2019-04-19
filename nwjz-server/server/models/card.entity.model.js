/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:54:27
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-09-20 23:47:29
 */

import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
/**
 * CardEntity Schema
 */
const CardEntitySchema = new mongoose.Schema(
    {
        // 关联 card
        card: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Card',
            required: true
        },
        // 序列号
        card_number: {
            type: String,
            unique: true,
            required: true
        },
        // 密码
        card_pwd: {
            type: String,
            unique: true,
            required: true
        },
        // 未加密密码
        card_org_pwd: {
            type: String,
            unique: true,
            required: true
        },
        buy_type: {
            type: Number,
        },
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        // 是否激活， 0 - 未激活, 1 - 激活
        actived: {
            type: Number,
            default: 0
        },
        // 状态: 未售出：0，已售出：1，已失效：2
        status: {
            type: Number,
            required: true,
            default: 0
        },
        // 备注
        remark: {
            type: String
        },
        // 0 - 实物卡， 1 - 虚拟卡
        virtual: {
            type: Number,
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
CardEntitySchema.method({});

/**
 * Statics
 */
CardEntitySchema.statics = {
    /**
     * Get card
     * @param {ObjectId} id - The objectId of card.
     * @returns {Promise<card, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((cardDetail) => {
                if (cardDetail) {
                    return cardDetail;
                }
                const err = new APIError('No such cardDetail exists!', httpStatus.NOT_FOUND);
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
 * @typedef CardEntity
 */
export default mongoose.model('CardEntity', CardEntitySchema);
