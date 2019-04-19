/*
 * @Author = Roy Chen
 * @Date = 2017-12-13 00:36:55
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-03-26 12:19:27
 */
import mongoose from 'mongoose';
import Service from '../models/service.model';
import User from '../models/user.model';
import Auth from '../models/auth.model';
import config from '../../config/config';
import Utils from '../helpers/Utils';
import myJpush from '../helpers/jpush';
import UserCoupon from '../models/user.coupon.model';
import Address from '../models/address.model';
import Setting from '../models/setting.model';
import ServiceCategory from '../models/service.category.model';
const passport = require('passport');

/**
 * Load service and append to req.
 */
function load(req, res, next, id) {
    Service.findById(id)
        .populate({
            path: 'sub_services.service'
        })
        .then(service => {
            req.service = service; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get service
 * @returns {Service}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            service: req.service
        },
        message: '获取服务信息成功'
    });
}

async function getSubmitOrder(req, res) {
    const _filter = {
        $and: [
            {
                service: req.service._id
            },
            {
                user: req.payload.user
            },
            {
                status: 0
            }
        ]
    };
    const userc = await UserCoupon.find(_filter)
        .populate({
            path: 'coupon service'
        })
        .exec();
    const myadd = await Address.find({ user: req.payload.user })
        .sort({ is_default: -1 })
        .exec();

    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            service: req.service,
            userCoupones: userc,
            address: myadd
        },
        message: '获取服务信息成功'
    });
}

/**
 * Create new service
 * @returns {Service}
 */
function create(req, res, next) {
    const service = new Service({
        category: req.body.category,
        // 服务名称,服务主题
        title: req.body.title,
        // 服务子主题
        sub_title: req.body.sub_title,
        // 服务的主图
        primary_pic: req.body.primary_pic,
        // 折后价格
        discounted_price: req.body.discounted_price,
        // 销售价格
        sale_price: req.body.sale_price,
        price_unit: req.body.price_unit,
        // 是否套餐 是：true; 否：false
        is_suite: req.body.is_suite,
        // 套餐情况下，设定基本的服务次数
        base_service_times: req.body.base_service_times,
        // 服务过期日数
        expire_date_count: req.body.expire_date_count,
        // 关键词，用于搜索
        keywords: req.body.keywords,
        // 是否上架
        is_alive: req.body.is_alive,
        // 是否严选服务
        is_strict_selection: req.body.is_strict_selection,
        is_buy_and_order: req.body.is_buy_and_order,
        is_special_event: req.body.is_special_event,
        buy_once: req.body.buy_once,
        new_user_can_buy: req.body.new_user_can_buy,
        // 详细图片
        detail_images: req.body.detail_images,
        // 套餐包含项目
        sub_services: req.body.sub_services,
        need_choose_time: req.body.need_choose_time,
        default_times: req.body.default_times,
        // 是否可以直接购买
        buyable: req.body.buyable,
        sell_count: Math.floor(Math.random() * (201 - 55 + 1) + 50),
        // 创建人
        created_by: req.payload.user
    });

    console.log(service);
    service
        .save()
        .then(savedService => {
            return res.json({
                status: 0,
                data: {
                    service: savedService
                },
                type: 'SUCCESS',
                message: '服务创建成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Update existing service
 * @returns {Service}
 */
function update(req, res, next) {
    console.log(req.body);
    const service = req.service;
    service.category = req.body.category;
    // 服务名称,服务主题
    service.title = req.body.title;
    // 服务子主题
    service.sub_title = req.body.sub_title;
    // 服务的主图
    service.primary_pic = req.body.primary_pic;
    // 折后价格
    service.discounted_price = req.body.discounted_price;
    // 销售价格
    service.sale_price = req.body.sale_price;
    service.price_unit = req.body.price_unit;
    // 是否套餐 是：true; 否：false
    service.is_suite = req.body.is_suite;
    service.is_buy_and_order = req.body.is_buy_and_order;
    service.is_special_event = req.body.is_special_event;
    service.buy_once = req.body.buy_once;
    service.new_user_can_buy = req.body.new_user_can_buy;
    // 套餐情况下，设定基本的服务次数
    service.base_service_times = req.body.base_service_times;
    // 服务过期日数
    (service.expire_date_count = req.body.expire_date_count),
        // 关键词，用于搜索
        (service.keywords = req.body.keywords);
    // 是否上架
    service.is_alive = req.body.is_alive;
    // 是否严选服务
    service.is_strict_selection = req.body.is_strict_selection;
    // 详细图片
    service.detail_images = req.body.detail_images;
    // 套餐包含项目
    service.sub_services = req.body.sub_services;
    service.sell_count = req.body.sell_count;
    service.need_choose_time = req.body.need_choose_time;
    service.default_times = req.body.default_times;
    service.updated_time = Date.now();
    service.updated_by = req.payload.user;
    service.buyable = req.body.buyable;
    console.log(service);
    service
        .save()
        .then(savedService => {
            return res.json({
                status: 0,
                data: {
                    service: savedService
                },
                type: 'SUCCESS',
                message: '服务更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Get service list.
 * @property {number} req.query.skip - Number of services to be skipped.
 * @property {number} req.query.limit - Limit number of services to be returned.
 * @returns {Service[]}
 */
async function list(req, res, next) {
    // myJpush.pushNotification('5a951d3bd7ac76436b3aefa4', 'content', 'title', '+1', {type: 'COUPON_REMINDER'})
    const { category = 'ALL', title = '', strictService = 'ALL' } = req.query;
    let _filter = {
        $and: [
            {
                title: {
                    $regex: title,
                    $options: '$i'
                }
            }
        ]
    };
    if (category !== 'ALL')
        _filter.$and.push({
            category: category
        });

    if (strictService !== 'ALL')
        _filter.$and.push({
            is_strict_selection: strictService === '1' ? true : false
        });
    let total = await Service.count(_filter);
    const query = Utils.handleQuery(req, total);
    const limit = query.limit;
    const skip = query.skip;

    console.log(_filter);

    Service.find(_filter)
        // .populate({
        //     path: 'sub_services',
        //     model: 'SubServicesSchema',
        //     populate: {
        //         path: 'service',
        //         model: 'Service'
        //     }
        // })
        .sort({
            created_time: -1
        })
        .skip(skip)
        .limit(limit)
        .exec()
        .then(services =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    services
                },
                message: '获取服务列表成功'
            })
        )
        .catch(e => next(e));
}

/**
 * 获取严选服务列表
 * @property {number} req.query.skip - Number of services to be skipped.
 * @property {number} req.query.limit - Limit number of services to be returned.
 * @returns {Service[]}
 */
async function getStrictSerivces(req, res, next) {
    let _filter = {
        $and: [
            {
                is_strict_selection: true
            },
            {
                is_alive: true
            }
        ]
    };
    let total = await Service.count(_filter);
    const query = Utils.handleQuery(req, total);
    const limit = query.limit;
    const skip = query.skip;

    Service.find(_filter)
        .sort({
            created_time: -1
        })
        .skip(skip)
        .limit(limit)
        .exec()
        .then(services =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    services
                },
                message: '获取服务列表成功'
            })
        )
        .catch(e => next(e));
}

/**
 * 获取专项服务 category = 'ZXBJ'
 * @property {number} req.query.skip - Number of services to be skipped.
 * @property {number} req.query.limit - Limit number of services to be returned.
 * @returns {Service[]}
 */
async function getSpecialSerivces(req, res, next) {
    let _filter = {
        $and: [
            {
                category: 'ZXBJ'
            },
            {
                is_alive: true
            }
        ]
    };
    let total = await Service.count(_filter);
    const query = Utils.handleQuery(req, total);
    const limit = query.limit;
    const skip = query.skip;

    Service.find(_filter)
        .sort({
            created_time: -1
        })
        .skip(skip)
        .limit(limit)
        .exec()
        .then(services =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    services
                },
                message: '获取服务列表成功'
            })
        )
        .catch(e => next(e));
}

/**
 * 获取可被套餐包含的服务
 * @property {number} req.query.skip - Number of services to be skipped.
 * @property {number} req.query.limit - Limit number of services to be returned.
 * @returns {Service[]}
 */
async function getIncludedSerivces(req, res, next) {
    let _filter = {
        $and: [
            {
                is_alive: true
            },
            {
                is_strict_selection: false
            }
        ]
    };
    let total = await Service.count(_filter);
    const query = Utils.handleQuery(req, total);
    const limit = query.limit;
    const skip = query.skip;

    Service.find(_filter)
        .sort({
            created_time: -1
        })
        .skip(skip)
        .limit(limit)
        .exec()
        .then(services =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    services
                },
                message: '获取服务列表成功'
            })
        )
        .catch(e => next(e));
}
/**
 * Get service by category.
 * @property {number} req.query.skip - Number of services to be skipped.
 * @property {number} req.query.limit - Limit number of services to be returned.
 * @returns {Service[]}
 */
async function getSerivceByCat(req, res, next) {
    const category = req.category;
    console.log(category);
    let _filter = {
        $and: [
            {
                category: category
            },
            {
                is_alive: true
            }
        ]
    };
    Service.find(_filter)
        .limit(1)
        .exec()
        .then(service =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    service
                },
                message: '获取服务成功'
            })
        )
        .catch(e => next(e));
}

/**
 * Delete service.
 * @returns {Service}
 */
function remove(req, res, next) {
    const service = req.service;
    service
        .remove()
        .then(deletedService => res.json(deletedService))
        .catch(e => next(e));
}

/**
 * App 首页接口
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getHomePage(req, res, next) {
    // banner
    const banners = await Setting.findOne({ isSystem: true }, 'banner')
        .then(setting => {
            return setting;
        })
        .catch(e => next(e));

    // service category
    const cats = await ServiceCategory.find({ status: 0 }, 'code label icon color order service status')
        .sort({
            order: 1
        })
        .then(serviceCategories => {
            return serviceCategories;
        })
        .catch(e => next(e));

    // 获取严选服务列表
    const strictServices = await Service.find({
        $and: [
            {
                is_strict_selection: true
            },
            {
                is_alive: true
            }
        ]
    }, 'title sub_title primary_pic discounted_price sale_price sell_count')
        .sort({
            created_time: -1
        })
        .then(services => {
            return services;
        })
        .catch(e => next(e));
    res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            banners: banners.banner,
            cats,
            strictServices
        },
        message: 'App 首页接口'
    });
}

export default {
    load,
    get,
    create,
    update,
    list,
    getStrictSerivces,
    getSpecialSerivces,
    getIncludedSerivces,
    getSerivceByCat,
    remove,
    getSubmitOrder,
    getHomePage
};
