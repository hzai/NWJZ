/*
 * @Author = Roy Chen
 * @Date = 2017-12-13 00:36:55
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-07-05 16:09:36
 */
import ServiceCategory from '../models/service.category.model';
import User from '../models/user.model';
import Auth from '../models/auth.model';
import config from '../../config/config';
import Utils from '../helpers/Utils';
const passport = require('passport');
/**
 * Load service category and append to req.
 */
function load(req, res, next, id) {
    ServiceCategory.get(id)
        .then((serviceCategory) => {
            req.serviceCategory = serviceCategory; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get service category
 * @returns {ServiceCategory}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            serviceCategory: req.serviceCategory
        },
        message: '获取服务类型信息成功'
    });
}

/**
 * Create new service
 * @returns {ServiceCategory}
 */
function create(req, res, next) {
    const serviceCategory = new ServiceCategory({
        // 服务
        service: req.body.service,
        // 服务类型编码
        code: req.body.code,
        // 服务类型名称
        label: req.body.label,
        // 图标
        icon: req.body.icon,
        // 颜色
        color: req.body.color,
        // 顺序
        order: req.body.order,
        // 状态
        status: req.body.status,
        // 创建人
        created_by: req.payload.user
    });
    console.log(serviceCategory)
    serviceCategory.save()
        .then(savedServiceCategory => {
            return res.json({
                status: 0,
                data: {
                    serviceCategory: savedServiceCategory
                },
                type: 'SUCCESS',
                message: '服务类型创建成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Update existing service
 * @returns {ServiceCategory}
 */
function update(req, res, next) {
    console.log('req.body = ', req.body)
    const serviceCategory = req.serviceCategory;
    // 服务
    serviceCategory.service = req.body.service._id;
    // 服务类型编码
    serviceCategory.code = req.body.code;
    // 服务类型名称
    serviceCategory.label = req.body.label;
    // 图标
    serviceCategory.icon = req.body.icon;
    // 颜色
    serviceCategory.color = req.body.color;
    // 顺序
    serviceCategory.order=req.body.order;
    // 状态
    serviceCategory.status=req.body.status;
    serviceCategory.updated_time = Date.now();
    serviceCategory.updated_by = req.payload.user;
    serviceCategory.save()
        .then(savedServiceCategory => {
            return res.json({
                status: 0,
                data: {
                    serviceCategory: savedServiceCategory
                },
                type: 'SUCCESS',
                message: '服务类型更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Get service catgory list.
 * @property {number} req.query.skip - Number of services to be skipped.
 * @property {number} req.query.limit - Limit number of services to be returned.
 * @returns {ServiceCategory[]}
 */
async function list(req, res, next) {
    let _filter = {}
    let total = await ServiceCategory.count(_filter)
    const query = Utils.handleQuery(req, total)
    const limit = query.limit
    const skip = query.skip

    ServiceCategory.find(_filter)
        .populate({path: 'service', select: 'title'})
        .sort({
            created_time: -1
        })
        .skip(skip)
        .limit(limit)
        .exec().then(serviceCategories => res.json({
            status: 0,
            type: 'SUCCESS',
            data: {
                total,
                limit: query.limit,
                skip: query.skip,
                serviceCategories
            },
            message: '获取服务类型列表成功'
        }))
        .catch(e => next(e));
}

/**
 * Get active service catgory list.
 * @property {number} req.query.skip - Number of services to be skipped.
 * @property {number} req.query.limit - Limit number of services to be returned.
 * @returns {ServiceCategory[]}
 */
async function getActiveCategory(req, res, next) {
    let _filter = {'status': 0}
    let total = await ServiceCategory.count(_filter)
    const query = Utils.handleQuery(req, total)
    const limit = query.limit
    const skip = query.skip

    ServiceCategory.find(_filter)
        .sort({
            order: 1
        })
        .skip(skip)
        .limit(limit)
        .exec().then(serviceCategories => res.json({
            status: 0,
            type: 'SUCCESS',
            data: {
                total,
                limit: query.limit,
                skip: query.skip,
                serviceCategories
            },
            message: '获取服务类型列表成功'
        }))
        .catch(e => next(e));
}

/**
 * Delete service catgory
 * @returns {ServiceCategory}
 */
function remove(req, res, next) {
    const serviceCategory = req.serviceCategory;
    serviceCategory.remove()
        .then(deletedServiceCategory => res.json(deletedServiceCategory))
        .catch(e => next(e));
}

export default {
    load,
    get,
    create,
    update,
    list,
    getActiveCategory,
    remove
};
