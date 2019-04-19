/*
 * @Author = Roy Chen
 * @Date = 2017-12-13 00:36:55
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-08-14 16:49:26
 */
import Address from '../models/address.model';
import User from '../models/user.model';
import Auth from '../models/auth.model';
import config from '../../config/config';
import Utils from '../helpers/Utils';
import { fail } from 'assert';
const passport = require('passport');
/**
 * Load address and append to req.
 */
function load(req, res, next, id) {
    Address.get(id)
        .then(address => {
            req.address = address; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get address
 * @returns {Address}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            address: req.address
        },
        message: '获取地址信息成功'
    });
}

function updateDefaultAddress(req, res, next) {

        Address.update(
            {
                user: req.payload.user
            },
            {
                is_default: false
            },
            {
                multi: true
            }
        )
            .then(resp => {
                console.log(resp);
                return resp;
            })
            .catch(e => next(e));

}

/**
 * Create new address
 * @returns {Address}
 */
async function create(req, res, next) {
    try {
        if (req.body.is_default === 'true') {
            await updateDefaultAddress(req, res, next);
        }
    } catch (e) {
        next(e);
    }
    const address = new Address({
        user: req.payload.user,
        contact_person: req.body.contact_person,
        contact_phone: req.body.contact_phone,
        area: req.body.area,
        detail_address: req.body.detail_address,
        tags: req.body.tags === '' ? '家' : req.body.tags,
        is_default: req.body.is_default === 'true' ? true : false,
        // 创建人
        created_by: req.payload.user
    });
    console.log(address);
    address
        .save()
        .then(savedAddress => {
            return res.json({
                status: 0,
                data: {
                    address: savedAddress
                },
                type: 'SUCCESS',
                message: '地址创建成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Update existing address
 * @returns {Address}
 */
async function update(req, res, next) {
    // try {
    if (req.body.is_default === 'true') {
        const mayUpdate = await Address.count({
            $and:[
                { user: req.payload.user },
                { _id: req.body._id },
                { is_default: true }
            ]});
        console.log('count:', mayUpdate);
        if (mayUpdate === 0) {
            await updateDefaultAddress(req, res, next);
        }
    }
    const address = req.address;
    address.contact_person = req.body.contact_person;
    address.contact_phone = req.body.contact_phone;
    address.area = req.body.area;
    address.detail_address = req.body.detail_address;
    address.tags = req.body.tags === '' ? '家' : req.body.tags;
    address.is_default = req.body.is_default === 'true' ? true : false;
    address.updated_time = Date.now();
    address.updated_by = req.payload.user;
    console.log(address);
    address
        .save()
        .then(savedAddress => {
            return res.json({
                status: 0,
                data: {
                    address: savedAddress
                },
                type: 'SUCCESS',
                message: '地址更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Get address list.
 * @property {number} req.query.skip - Number of addresses to be skipped.
 * @property {number} req.query.limit - Limit number of addresses to be returned.
 * @returns {Address[]}
 */
async function list(req, res, next) {
    let _filter = {
        user: req.payload.user
    };
    let total = await Address.count(_filter);
    const query = Utils.handleQuery(req, total);
    const limit = query.limit;
    const skip = query.skip;

    Address.find(_filter)
        .sort({
            created_time: -1
        })
        .skip(skip)
        .limit(limit)
        .exec()
        .then(addresses =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    addresses
                },
                message: '获取地址列表成功'
            })
        )
        .catch(e => next(e));
}

/**
 * Get address list.
 * @property {number} req.query.skip - Number of addresses to be skipped.
 * @property {number} req.query.limit - Limit number of addresses to be returned.
 * @returns {Address[]}
 */
async function getUserAddress(req, res, next) {
    let _filter = {
        user: req.userId
    };
    let total = await Address.count(_filter);
    const query = Utils.handleQuery(req, total);
    const limit = query.limit;
    const skip = query.skip;

    Address.find(_filter)
        .sort({
            created_time: -1
        })
        .skip(skip)
        .limit(limit)
        .exec()
        .then(addresses =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    addresses
                },
                message: '获取地址列表成功'
            })
        )
        .catch(e => next(e));
}

/**
 * Create new address
 * @returns {Address}
 */
async function createUserAddress(req, res, next) {
    try {
        if (req.body.is_default === 'true') {
            await updateDefaultAddress(req, res, next);
        }
    } catch (e) {
        next(e);
    }
    const address = new Address({
        user: req.userId,
        contact_person: req.body.contact_person,
        contact_phone: req.body.contact_phone,
        area: req.body.area,
        detail_address: req.body.detail_address,
        tags: req.body.tags === '' ? '家' : req.body.tags,
        is_default: req.body.is_default === 'true' ? true : false,
        // 创建人
        created_by: req.payload.user
    });
    console.log(address);
    address
        .save()
        .then(savedAddress => {
            return res.json({
                status: 0,
                data: {
                    address: savedAddress
                },
                type: 'SUCCESS',
                message: '地址创建成功'
            });
        })
        .catch(e => next(e));
}

async function geiDefaultAddress(req, res, next) {
    let _filter = {
        user: req.payload.user,
        is_default: true
    };
    Address.find(_filter)
        .exec()
        .then(addresses =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    addresses
                },
                message: '获取默认地址成功'
            })
        )
        .catch(e => next(e));
}

/**
 * Delete address.
 * @returns {Address}
 */
function remove(req, res, next) {
    const address = req.address;
    address
        .remove()
        .then(deletedAddress =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    deletedAddress
                },
                message: '删除地址成功'
            })
        )
        .catch(e => next(e));
}

export default {
    load,
    get,
    create,
    update,
    list,
    remove,
    geiDefaultAddress,
    getUserAddress,
    createUserAddress
};
