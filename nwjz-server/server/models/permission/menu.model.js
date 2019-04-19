/*
 * @Author: Roy Chen
 * @Date: 2019-04-03 14:03:01
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-09 15:00:50
 */
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../../helpers/APIError';

const ChildrenSchema = new mongoose.Schema({
    name: {
        type: String
    },
    path: {
        type: String,
        required: true
    },
    component: {
        type: String,
        required: true
    },
    // under meta
    title: {
        type: String
    },
    // under meta
    icon: {
        type: String
    },
    roles: {
        type: [String]
    },
    affix: {
        type: Boolean
    },
    hidden: {
        type: Boolean
    },
    noCache: {
        type: Boolean,
        default: true
    }
});
/**
 * Menu Schema
 *
 */
const MenuSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        path: {
            type: String
        },
        component: {
            type: String
        },
        redirect: {
            type: String
        },
        alwaysShow: {
            type: Boolean
        },
        hidden: {
            type: Boolean
        },
        // under meta
        title: {
            type: String
        },
        // under meta
        icon: {
            type: String
        },
        roles: {
            type: [String]
        },
        children: [ChildrenSchema],
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
MenuSchema.statics = {
    /**
     * Get menu
     * @param {ObjectId} id - The objectId of menu.
     * @returns {Promise<Menu, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then(menu => {
                if (menu) {
                    return menu;
                }
                const err = new APIError(
                    'No such menu exists!',
                    httpStatus.NOT_FOUND
                );
                return Promise.reject(err);
            });
    },

    /**
     * List menus in descending order of 'created' timestamp.
     * @param {number} skip - Number of menus to be skipped.
     * @param {number} limit - Limit number of menus to be returned.
     * @returns {Promise<Menu[]>}
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
 * @typedef Menu
 */
export default mongoose.model('Menu', MenuSchema);
