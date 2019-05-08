/*
 * @Author: Roy Chen
 * @Date: 2019-04-01 21:07:26
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-29 21:55:09
 */

import InsCompany from '../models/inscompany.model';
import Counters from '../models/counters.model';
import config from '../../config/config';
import Utils from '../helpers/Utils';
const passport = require('passport');
/**
 * Load insurance_company and append to req.
 */
function load(req, res, next, id) {
    InsCompany.get(id)
        .then(insurance_company => {
            req.insurance_company = insurance_company; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get insurance_company
 * @returns {InsCompany}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            insurance_company: req.insurance_company
        },
        message: '获取保险公司信息成功'
    });
}

/**
 * Create new insurance_company
 * @returns {InsCompany}
 */
async function create(req, res, next) {
    const insurance_company = new InsCompany(req.body);
    insurance_company.created_by = req.payload.user;
    insurance_company
        .save()
        .then(savedInsCompany => {
            return res.json({
                status: 0,
                data: {
                    insurance_company: savedInsCompany
                },
                type: 'SUCCESS',
                message: '创建保险公司信息成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Update existing insurance_company
 * @returns {InsCompany}
 */
function update(req, res, next) {
    console.log('req.inscomId = ', req.inscomId);
    const insurance_company = req.body;
    insurance_company.updated_time = Date.now();
    insurance_company.updated_by = req.payload.user;
    InsCompany.findByIdAndUpdate(req.body._id, insurance_company)
        .then(savedInsCompany => {
            return res.json({
                status: 0,
                data: {
                    insurance_company: savedInsCompany
                },
                type: 'SUCCESS',
                message: '更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * getInsCompanys
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getInsCompanys(req, res, next) {
    const { status = 'ALL' } = req.query;
    let _filter = {};
    if (status !== 'ALL') {
        _filter.$and.push({
            status: status
        });
    }

    let total = await InsCompany.count(_filter);
    const query = Utils.handleQuery(req, total);
    InsCompany.find(_filter)
        .limit(query.limit)
        .skip(query.skip)
        .sort({
            created_time: -1
        })
        .exec()
        .then(insurance_companys => {
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    insurance_companys
                },
                message: '获取保险公司列表成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Delete insurance_company.
 * @returns {InsCompany}
 */
function remove(req, res, next) {
    const insurance_company = req.insurance_company;
    insurance_company
        .remove()
        .then(deletedInsCompany => res.json(deletedInsCompany))
        .catch(e => next(e));
}

export default {
    load,
    get,
    create,
    update,
    getInsCompanys,
    remove
};
