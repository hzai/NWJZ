/*
 * @Author: Roy Chen
 * @Date: 2019-04-01 21:07:26
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-13 21:49:17
 */

import Insurance from '../../models/insurance/insurance.model';
import Utils from '../../helpers/Utils';
/**
 * Load insurance and append to req.
 */
function load(req, res, next, id) {
    Insurance.get(id)
        .then(insurance => {
            req.insurance = insurance; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get insurance
 * @returns {Insurance}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            insurance: req.insurance
        },
        message: '获取服务人员信息成功'
    });
}

/**
 * Create new insurance
 * @returns {Insurance}
 */
function create(req, res, next) {
    const insurance = new Insurance(req.body);
    insurance.created_by = req.payload.user;
    insurance
        .save()
        .then(savedInsurance => {
            return res.json({
                status: 0,
                data: {
                    insurance: savedInsurance
                },
                type: 'SUCCESS',
                message: '创建insurance成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Update existing insurance
 * @returns {Insurance}
 */
function update(req, res, next) {
    const insurance = req.body;
    insurance.updated_time = Date.now();
    insurance.updated_by = req.payload.user;
    Insurance.findByIdAndUpdate(req.body._id, insurance)
        .then(savedInsurance => {
            return res.json({
                status: 0,
                data: {
                    insurance: savedInsurance
                },
                type: 'SUCCESS',
                message: '更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * getInsurances
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getInsurances(req, res, next) {
    const { status = 'ALL' } = req.query;
    let _filter = {};
    if (status !== 'ALL') {
        _filter.$and.push({
            status: status
        });
    }
    let total = await Insurance.count(_filter);
    const query = Utils.handleQuery(req, total);
    Insurance.find(_filter)
        .populate({ path: 'worker' })
        .limit(query.limit)
        .skip(query.skip)
        .sort({
            created_time: -1
        })
        .exec()
        .then(insurances => {
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    insurances
                },
                message: '获取保姆服务人员列表成功'
            });
        })
        .catch(e => next(e));
}

/**
 * getWorkerInsurances
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getWorkerInsurances(req, res, next) {
    const { status = 'ALL' } = req.query;
    const workerId = req.workerId;
    let _filter = {
        $and: [
            {
                worker: workerId
            }
        ]
    };
    if (status !== 'ALL') {
        _filter.$and.push({
            status: status
        });
    }
    let total = await Insurance.count(_filter);
    const query = Utils.handleQuery(req, total);
    Insurance.find(_filter)
        .populate({ path: 'worker' })
        .limit(query.limit)
        .skip(query.skip)
        .sort({
            created_time: -1
        })
        .exec()
        .then(insurances => {
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    insurances
                },
                message: '获取服务人员保险列表成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Delete insurance.
 * @returns {Insurance}
 */
function remove(req, res, next) {
    const insurance = req.insurance;
    insurance
        .remove()
        .then(deletedInsurance => res.json(deletedInsurance))
        .catch(e => next(e));
}

export default {
    load,
    get,
    create,
    update,
    getInsurances,
    getWorkerInsurances,
    remove
};
