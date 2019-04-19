/*
 * @Author = Roy Chen
 * @Date = 2017-12-13 00:36:55
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-08-14 01:17:38
 */
import WorkerService from '../models/worker.service.model';
import User from '../models/user.model';
import Auth from '../models/auth.model';
import config from '../../config/config';
import Utils from '../helpers/Utils';
const passport = require('passport');
/**
 * Load workerService and append to req.
 */
function load(req, res, next, id) {
    WorkerService.findById(id)
        .populate({
            path: 'appointment'
        })
        .then(workerService => {
            req.workerService = workerService; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get workerService
 * @returns {WorkerService}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            workerService: req.workerService
        },
        message: '获取保姆服务信息成功'
    });
}

/**
 * Create new workerService
 * @returns {WorkerService}
 */
async function create(req, res, next) {
    const workerService = new WorkerService({
        worker: req.body.worker,
        company: req.body.company,
        appointment: req.body.appointment,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        remark: req.body.remark,
        // 创建人
        created_by: req.payload.user
    });
    console.log(workerService);
    workerService
        .save()
        .then(savedWorkerService => {
            return res.json({
                status: 0,
                data: {
                    workerService: savedWorkerService
                },
                type: 'SUCCESS',
                message: '保姆服务信息创建成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Update existing workerService
 * @returns {WorkerService}
 */
async function update(req, res, next) {
    const workerService = req.workerService;
    workerService.start_time = req.body.start_time;
    workerService.end_time = req.body.end_time;
    workerService.remark = req.body.remark;
    workerService.status = req.body.status;
    workerService.updated_time = Date.now();
    workerService.updated_by = req.payload.user;
    workerService
        .save()
        .then(savedWorkerService => {
            return res.json({
                status: 0,
                data: {
                    workerService: savedWorkerService
                },
                type: 'SUCCESS',
                message: '保姆服务信息更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * getListByWorker
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getListByWorker(req, res, next) {
    return list(req, res, next);
}

/**
 * getListByCompany
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getListByCompany(req, res, next) {
    const { worker = 'ALL' } = req.query;
    let _filter = {
        $and: [
            {
                company: req.payload.user
            }
        ]
    };
    if (worker !== 'ALL') {
        _filter.$and.push({
            worker: worker
        });
    }
    req._filter = _filter;
    return list(req, res, next);
}

/**
 * Get workerService list.
 * @property {number} req.query.skip - Number of workerServices to be skipped.
 * @property {number} req.query.limit - Limit number of workerServices to be returned.
 * @returns {WorkerService[]}
 */
async function list(req, res, next) {
    let _filter = req._filter;
    let total = await WorkerService.count(_filter);
    const query = Utils.handleQuery(req, total);
    const limit = query.limit;
    const skip = query.skip;

    WorkerService.find(_filter)
        .populate({
            path: 'appointment',
            populate: [
                {
                    path: 'order',
                    select: 'order_code'
                },
                {
                    path: 'user',
                    select: 'nickname avatar'
                }
            ]
        })
        .populate({
            path: 'worker'
        })
        .sort({
            created_time: -1
        })
        .skip(skip)
        .limit(limit)
        .exec()
        .then(workerServices =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    workerServices
                },
                message: '获取保姆服务信息列表成功'
            })
        )
        .catch(e => next(e));
}

/**
 * 保姆数量统计
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function workerCountStatistics(req, res, next) {
    let _totalCountFilter = {
        $and: [
            {
                user_type: 'worker',
                status: 0
            }
        ]
    };
    if (Utils.isCompany(req.payload.roles)) {
        _totalCountFilter.$and.push({
            employed_to: req.payload.user
        });
    } else {
        _totalCountFilter.$and.push({
            employed_to: null
        });
    }

    const total = await User.count(_totalCountFilter);

    return res.json({
        status: 0,
        data: {
            total: total
        },
        type: 'SUCCESS',
        message: '保姆数量统计成功'
    });
}

/**
 * Delete workerService.
 * @returns {WorkerService}
 */
function remove(req, res, next) {
    const workerService = req.workerService;
    workerService
        .remove()
        .then(deletedWorkerService =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    deletedWorkerService
                },
                message: '删除保姆服务信息成功'
            })
        )
        .catch(e => next(e));
}

export default {
    load,
    get,
    create,
    update,
    getListByWorker,
    getListByCompany,
    workerCountStatistics,
    remove
};
