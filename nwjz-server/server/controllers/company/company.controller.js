/*
 * @Author: Roy Chen
 * @Date: 2019-04-01 21:07:26
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-20 23:11:34
 */

import Company from '../../models/company/company.model';
import Utils from '../../helpers/Utils';
/**
 * Load company and append to req.
 */
function load(req, res, next, id) {
    Company.get(id)
        .then(company => {
            req.company = company; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get company
 * @returns {Company}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            company: req.company
        },
        message: '获取信息成功'
    });
}

/**
 * Create new company
 * @returns {Company}
 */
function create(req, res, next) {
    const company = new Company(req.body);
    company.created_by = req.payload.user;
    company
        .save()
        .then(savedCompany => {
            return res.json({
                status: 0,
                data: {
                    company: savedCompany
                },
                type: 'SUCCESS',
                message: '创建成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Update existing company
 * @returns {Company}
 */
function update(req, res, next) {
    const company = req.body;
    company.updated_time = Date.now();
    company.updated_by = req.payload.user;
    Company.findByIdAndUpdate(req.body._id, company)
        .then(savedCompany => {
            return res.json({
                status: 0,
                data: {
                    company: savedCompany
                },
                type: 'SUCCESS',
                message: '更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * getCompanys
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getCompanys(req, res, next) {
    // console.log('payload = ', req.payload);
    const { status = 'ALL', name = '', telephone = '' } = req.query;
    let _filter = {
        $and: [
            {
                name: {
                    $regex: name,
                    $options: '$i'
                }
            },
            {
                telephone: {
                    $regex: telephone,
                    $options: '$i'
                }
            }
        ]
    };
    if (status !== 'ALL') {
        _filter.$and.push({
            status: status
        });
    }
    let total = await Company.count(_filter);
    const query = Utils.handleQuery(req, total);
    Company.find(_filter)
        .limit(query.limit)
        .skip(query.skip)
        .sort({
            created_time: -1
        })
        .exec()
        .then(companys => {
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    companys
                },
                message: '获取列表成功'
            });
        })
        .catch(e => next(e));
}

/**
 * getEmployerComms
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getEmployerComms(req, res, next) {
    let _filter = { employer: req.employerId };
    console.log(_filter);
    Company.find(_filter)
        .sort({
            created_time: -1
        })
        .exec()
        .then(companys => {
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    companys
                },
                message: '获取列表成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Delete company.
 * @returns {Company}
 */
function remove(req, res, next) {
    const company = req.company;
    company
        .remove()
        .then(deletedCompany => res.json(deletedCompany))
        .catch(e => next(e));
}

export default {
    load,
    get,
    create,
    update,
    getCompanys,
    remove
};
