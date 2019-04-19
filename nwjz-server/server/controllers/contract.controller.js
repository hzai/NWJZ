/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 00:36:55
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-03-27 14:53:08
 */
import Contract from '../models/contract.model';
import Worker from '../models/worker.model';
import Employer from '../models/employer.model';
import Counters from '../models/counters.model';
import config from '../../config/config';
import Utils from '../helpers/Utils';
const passport = require('passport');
import moment from 'moment';
/**
 * Load contract and append to req.
 */
function load(req, res, next, id) {
    Contract.findById(id)
        .populate('employer worker worker_record.worker')
        .then(contract => {
            req.contract = contract; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get contract
 * @returns {Contract}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            contract: req.contract
        },
        message: '获取合同信息成功'
    });
}

/**
 * Create new contract
 * @returns {Contract}
 */
async function create(req, res, next) {
    const counter = await Counters.getNextContractNo('contract_no');
    req.body.contract_no = 'HT' + moment().format('YYYY') + Utils.buquan(counter.contract_no_seq, 5);
    const contract = new Contract(req.body);
    const worker_record = [
        {
            worker: contract.worker,
            start_date: contract.contract_start_date,
            end_date: contract.contract_end_date,
            remark: ''
        }
    ];
    contract.worker_record = worker_record;
    console.log(contract);
    contract.create_by = req.payload.user;
    contract
        .save()
        .then(savedContract => {
            // 更改保姆的状态 = 1 已分配
            Worker.findByIdAndUpdate(savedContract.worker, {
                status: 1, // 已分配
                updated_time: Date.now(),
                updated_by: req.payload.user
            })
                .then(resp => {})
                .catch(e => next(e));
            // 更改雇主的状态 = 1 已分配
            Employer.findByIdAndUpdate(savedContract.employer, {
                status: 1, // 已分配
                updated_time: Date.now(),
                updated_by: req.payload.user
            })
                .then(resp => {})
                .catch(e => next(e));
            return res.json({
                status: 0,
                data: {
                    contract: savedContract
                },
                type: 'SUCCESS',
                message: '创建成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Update existing contract
 * @returns {Contract}
 */
function update(req, res, next) {
    const contract = req.body;
    contract.updated_time = Date.now();
    contract.updated_by = req.payload.user;
    Contract.findByIdAndUpdate(req.body._id, contract)
        .then(savedContract => {
            return res.json({
                status: 0,
                data: {
                    contract: savedContract
                },
                type: 'SUCCESS',
                message: '更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Get contract list.
 * @property {number} req.query.skip - Number of contracts to be skipped.
 * @property {number} req.query.limit - Limit number of contracts to be returned.
 * @returns {Contract[]}
 */
async function getContractListByEmployer(req, res, next) {
    const employerId = req.employerId;
    Contract.find({ employer: employerId })
        .populate('worker')
        .sort({
            created_time: -1
        })
        .exec()
        .then(contracts => {
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    contracts
                },
                message: '获取合同列表成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Get contract list.
 * @property {number} req.query.skip - Number of contracts to be skipped.
 * @property {number} req.query.limit - Limit number of contracts to be returned.
 * @returns {Contract[]}
 */
async function list(req, res, next) {
    const { status = 'ALL', name = '', contact_phone = '' } = req.query;
    let _filter = {
        $and: [{}]
    };
    if (status !== 'ALL')
        _filter.$and.push({
            status: status
        });
    let total = await Contract.count(_filter);
    const query = Utils.handleQuery(req, total);
    console.log(_filter);
    Contract.find(_filter)
        .populate('worker employer worker_record.worker')
        .limit(query.limit)
        .skip(query.skip)
        .sort({
            created_time: -1
        })
        .exec()
        .then(contracts => {
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    contracts
                },
                message: '获取合同列表成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Delete contract.
 * @returns {Contract}
 */
function remove(req, res, next) {
    const contract = req.contract;
    contract
        .remove()
        .then(deletedContract => res.json(deletedContract))
        .catch(e => next(e));
}

/**
 * 更新保姆更换记录
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function updateWorkerRecord(req, res, next) {
    const contractForm = req.body;
    const contract = req.contract;
    contract.worker_record = contractForm.worker_record;
    contract.updated_time = Date.now();
    contract.updated_by = req.payload.user;
    Contract.findByIdAndUpdate(req.body._id, contract)
        .then(savedContract => {
            return res.json({
                status: 0,
                data: {
                    contract: savedContract
                },
                type: 'SUCCESS',
                message: '更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * 更新回访记录
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function updateReviewRecord(req, res, next) {
    const contractForm = req.body;
    const contract = req.contract;
    contract.review_record = contractForm.review_record;
    contract.updated_time = Date.now();
    contract.updated_by = req.payload.user;
    Contract.findByIdAndUpdate(req.body._id, contract)
        .then(savedContract => {
            return res.json({
                status: 0,
                data: {
                    contract: savedContract
                },
                type: 'SUCCESS',
                message: '更新成功'
            });
        })
        .catch(e => next(e));
}

export default {
    load,
    get,
    create,
    update,
    list,
    remove,
    getContractListByEmployer,
    updateWorkerRecord,
    updateReviewRecord
};
