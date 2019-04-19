/*
 * @Author = Roy Chen
 * @Date = 2017-12-13 00:36:55
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-04-05 13:42:10
 */
import User from '../models/user.model';
import Setting from '../models/setting.model';
import Auth from '../models/auth.model';
import config from '../../config/config';
import Utils from '../helpers/Utils';
const passport = require('passport');
/**
 * Load setting and append to req.
 */
function load(req, res, next, id) {
    Setting.get(id)
        .then((setting) => {
            req.setting = setting; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get setting
 * @returns {setting}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            setting: req.setting
        },
        message: '获取配置信息成功'
    });
}

/**
 * Create new setting
 * @returns {setting}
 */
function create(req, res, next) {
    // console.log(req.body)
    const setting = new Setting(req.body);
    setting.create_by = req.payload.user;
    setting
        .save()
        .then(savedSetting =>
            res.json({
                status: 0,
                data: {
                    setting: savedSetting
                },
                type: 'SUCCESS',
                message: '配置创建成功'
            })
        )
        .catch(e => next(e));
}

/**
 * Update existing setting
 * @returns {setting}
 */
function update(req, res, next) {
    const setting = req.body;
    setting.updated_time = Date.now();
    setting.updated_by = req.payload.user;
    Setting.findByIdAndUpdate(req.body._id, setting)
        .then(savedsetting =>
            res.json({
                status: 0,
                data: {
                    setting: savedsetting
                },
                type: 'SUCCESS',
                message: '配置更新成功'
            })
        )
        .catch(e => next(e));
}

/**
 * Get my setting list.
 * @returns {setting[]}
 */
function getUserProtocol(req, res, next) {
    const _filter = { isSystem: true };
    Setting.findOne(_filter, 'user_protocol')
        .exec()
        .then((setting) => {
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    setting
                },
                message: '获取用户协议成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Get my setting list.
 * @returns {setting[]}
 */
function getBanners(req, res, next) {
    const _filter = { isSystem: true };
    Setting.findOne(_filter, 'banner')
        .exec()
        .then((setting) => {
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    setting
                },
                message: '获取广告轮播图成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Delete setting.
 * @returns {Setting}
 */
function remove(req, res, next) {
    const setting = req.setting;
    setting
        .remove()
        .then(deletedSetting =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    deletedSetting
                },
                message: '删除配置成功'
            })
        )
        .catch(e => next(e));
}

export default {
    load,
    get,
    create,
    update,
    getUserProtocol,
    getBanners,
    remove
};
