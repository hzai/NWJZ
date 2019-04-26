/*
 * @Author: Roy Chen
 * @Date: 2019-04-01 21:07:26
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-27 00:49:49
 */

import FinanceRecord from '../../models/finance/finance.record.model';
import FinanceType from '../../models/finance/finance.type.model';
import Utils from '../../helpers/Utils';
/**
 * Load finance and append to req.
 */
function load(req, res, next, id) {
    FinanceRecord.get(id)
        .then(financerecord => {
            req.financerecord = financerecord; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get finance
 * @returns {FinanceRecord}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            finance: req.finance
        },
        message: '获取信息成功'
    });
}

/**
 * Create new finance
 * @returns {FinanceRecord}
 */
function create(req, res, next) {
    const financerecord = new FinanceRecord(req.body);
    financerecord.company = req.payload.company;
    financerecord.created_by = req.payload.user;
    financerecord
        .save()
        .then(savedFinanceRecord => {
            return res.json({
                status: 0,
                data: {
                    finance: savedFinanceRecord
                },
                type: 'SUCCESS',
                message: '创建成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Update existing finance
 * @returns {FinanceRecord}
 */
function update(req, res, next) {
    const financerecord = req.body;
    financerecord.updated_time = Date.now();
    financerecord.updated_by = req.payload.user;
    FinanceRecord.findByIdAndUpdate(req.financerecord._id, financerecord)
        .then(savedFinanceRecord => {
            return res.json({
                status: 0,
                data: {
                    finance: savedFinanceRecord
                },
                type: 'SUCCESS',
                message: '更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Create new finance type
 * @returns {FinanceRecord}
 */
function createFinType(req, res, next) {
    const financetype = new FinanceType(req.body);
    financetype.company = req.payload.company;
    financetype.created_by = req.payload.user;
    financetype
        .save()
        .then(savedFinanceType => {
            return res.json({
                status: 0,
                data: {
                    finance: savedFinanceType
                },
                type: 'SUCCESS',
                message: '创建成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Update existing finance type
 * @returns {FinanceRecord}
 */
function updateFinType(req, res, next) {
    const financetype = req.body;
    financetype.updated_time = Date.now();
    financetype.updated_by = req.payload.user;
    FinanceType.findByIdAndUpdate(req.typeId, financetype)
        .then(savedFinanceType => {
            return res.json({
                status: 0,
                data: {
                    finance: savedFinanceType
                },
                type: 'SUCCESS',
                message: '更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * getCompanyFinanceRecord
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getCompanyFinanceRecord(req, res, next) {
    let _filter = { company: req.payload.company };
    FinanceRecord.find(_filter)
        .sort({
            created_time: -1
        })
        .exec()
        .then(finances => {
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    finances
                },
                message: '获取列表成功'
            });
        })
        .catch(e => next(e));
}

/**
 * getCompanyFinanceType
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getCompanyFinanceType(req, res, next) {
    let _filter = { company: req.payload.company };
    FinanceType.find(_filter)
        .sort({
            created_time: -1
        })
        .exec()
        .then(types => {
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    types
                },
                message: '获取列表成功'
            });
        })
        .catch(e => next(e));
}
/**
 * getCompanyFinanceRecord
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getWorkerFinanceRecord(req, res, next) {
    let _filter = { company: req.payload.company, worker: req.workerId };
    FinanceRecord.find(_filter)
        .sort({
            tx_time: -1
        })
        .exec()
        .then(finances => {
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    finances
                },
                message: '获取列表成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Delete finance.
 * @returns {FinanceRecord}
 */
function remove(req, res, next) {
    const financerecord = req.financerecord;
    financerecord
        .remove()
        .then(deletedFinanceRecord => res.json(deletedFinanceRecord))
        .catch(e => next(e));
}

/**
 * Delete finance.
 * @returns {FinanceRecord}
 */
function removeType(req, res, next) {
    FinanceType.findByIdAndRemove({ _id: req.typeId })
        .then(deletedFinanceType => {
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    deletedFinanceType
                },
                message: '删除成功'
            });
        })
        .catch(e => next(e));
}

export default {
    load,
    get,
    create,
    update,
    createFinType,
    updateFinType,
    removeType,
    getCompanyFinanceRecord,
    getCompanyFinanceType,
    getWorkerFinanceRecord,
    remove
};
