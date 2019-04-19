/*
 * @Author: Roy Chen
 * @Date: 2019-04-03 14:03:01
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-03 23:38:58
 */
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../../helpers/APIError';
/**
 * Role Schema
 *
 */
const RoleSchema = new mongoose.Schema(
    {
        // key
        key: {
            type: String,
            required: true
        },
        // name
        name: {
            type: String,
            required: true
        },
        // description
        description: {
            type: String
        },
        routes: [{}],
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
 * Statics
 */
RoleSchema.statics = {
    /**
     * Get role
     * @param {ObjectId} id - The objectId of role.
     * @returns {Promise<Role, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then(role => {
                if (role) {
                    return role;
                }
                const err = new APIError(
                    'No such role exists!',
                    httpStatus.NOT_FOUND
                );
                return Promise.reject(err);
            });
    },

    /**
     * List roles in descending order of 'created' timestamp.
     * @param {number} skip - Number of roles to be skipped.
     * @param {number} limit - Limit number of roles to be returned.
     * @returns {Promise<Role[]>}
     */
    list({ skip = 0, limit = 50 } = {}) {
        return this.find()
            .sort({
                created: -1
            })
            .skip(skip)
            .limit(limit)
            .exec();
    }
};

/**
 * @typedef Role
 */
export default mongoose.model('Role', RoleSchema);
