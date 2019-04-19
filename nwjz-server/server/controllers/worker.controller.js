/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 00:36:55
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-09 16:02:16
 */
import Worker from '../models/worker.model';
import Counters from '../models/counters.model';
import config from '../../config/config';
import Utils from '../helpers/Utils';
const passport = require('passport');
/**
 * Load worker and append to req.
 */
function load(req, res, next, id) {
    Worker.get(id)
        .then(worker => {
            req.worker = worker; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get worker
 * @returns {Worker}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            worker: req.worker
        },
        message: '获取服务人员信息成功'
    });
}

/**
 * Create new worker
 * @returns {Worker}
 */
async function create(req, res, next) {
    const counter = await Counters.getNextWorkerCode('worker_code');
    req.body.worker_code = counter.worker_code_seq;
    //console.log(req.body)
    const worker = new Worker(req.body);
    worker.belong_to = req.payload.user;
    worker.create_by = req.payload.user;
    worker
        .save()
        .then(savedWorker => {
            return res.json({
                status: 0,
                data: {
                    worker: savedWorker
                },
                type: 'SUCCESS',
                message: '创建worker成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Update existing worker
 * @returns {Worker}
 */
function update(req, res, next) {
    const worker = req.body;
    worker.updated_time = Date.now();
    worker.updated_by = req.payload.user;
    Worker.findByIdAndUpdate(req.body._id, worker)
        .then(savedWorker => {
            return res.json({
                status: 0,
                data: {
                    worker: savedWorker
                },
                type: 'SUCCESS',
                message: '更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * getWorkers
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getWorkers(req, res, next) {
    const {
        status = 'ALL',
        name = '',
        contact_phone = '',
        id_card = '',
        is_employed = 'ALL',
        languages = undefined,
        credentials = undefined,
        work_type = undefined,
        introduce = undefined,
        working_experience = undefined,
        native_place = undefined,
        nation = undefined,
        zodiac = undefined
    } = req.query;
    let _filter = {
        $and: [
            {
                name: {
                    $regex: name,
                    $options: '$i'
                }
            },
            {
                contact_phone: {
                    $regex: contact_phone,
                    $options: '$i'
                }
            },
            {
                id_card: {
                    $regex: id_card,
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
    if (is_employed !== 'ALL') {
        _filter.$and.push({
            is_employed: is_employed
        });
    }
    if (languages !== undefined) {
        _filter.$and.push({
            languages: { $in: languages }
        });
    }
    if (credentials !== undefined) {
        _filter.$and.push({
            credentials: { $in: credentials }
        });
    }
    if (work_type !== undefined) {
        _filter.$and.push({
            work_type: { $in: work_type }
        });
    }
    if (introduce !== undefined) {
        _filter.$and.push({
            introduce: {
                $regex: introduce,
                $options: '$i'
            }
        });
    }
    if (working_experience !== undefined) {
        _filter.$and.push({
            working_experience: {
                $regex: working_experience,
                $options: '$i'
            }
        });
    }
    if (native_place !== undefined) {
        _filter.$and.push({
            native_place: {
                $regex: native_place,
                $options: '$i'
            }
        });
    }
    if (nation !== undefined && nation !== '') {
        _filter.$and.push({
            nation: { $in: nation }
        });
    }
    if (zodiac !== undefined && zodiac !== '') {
        _filter.$and.push({
            zodiac: {
                $regex: zodiac,
                $options: '$i'
            }
        });
    }
    // _filter.$and.push({
    //     belong_to: req.payload.user
    // });

    let total = await Worker.count(_filter);
    const query = Utils.handleQuery(req, total);
    Worker.find(_filter)
        .populate({
            path: 'allocated_to'
        })
        .limit(query.limit)
        .skip(query.skip)
        .sort({
            created_time: -1
        })
        .exec()
        .then(workers => {
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    workers
                },
                message: '获取保姆服务人员列表成功'
            });
        })
        .catch(e => next(e));
}

/**
 * 获取空闲的保姆 - 根据公司
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getFreeWorkers(req, res, next) {
    const { is_employed = true } = req.query;
    let _filter = {
        $and: [
            {
                is_employed: is_employed,
                status: {
                    $in: [0, 1]
                }
            }
        ]
    };

    if (Utils.isCompany(req.payload.roles)) {
        _filter.$and.push({
            belong_to: req.payload.user
        });
    } else {
        _filter.$and.push({
            belong_to: null
        });
    }

    let total = await Worker.count(_filter);
    const query = Utils.handleQuery(req, total);
    Worker.find(_filter)
        .limit(query.limit)
        .skip(query.skip)
        .sort({
            created_time: 1
        })
        .exec()
        .then(workers => {
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    workers
                },
                message: '获取保姆服务人员列表成功'
            });
        })
        .catch(e => next(e));
}

/**
 * 统计status
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function statWorkerStatus(req, res, next) {
    let total = await Worker.count({});
    Worker.aggregate([
        { $match: {} },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ])
        .exec()
        .then(workers => {
            console.log(workers);
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total: total,
                    workers
                },
                message: '获取保姆服务人员列表成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Delete worker.
 * @returns {Worker}
 */
function remove(req, res, next) {
    const worker = req.worker;
    worker
        .remove()
        .then(deletedWorker => res.json(deletedWorker))
        .catch(e => next(e));
}

export default {
    load,
    get,
    create,
    update,
    getWorkers,
    getFreeWorkers,
    statWorkerStatus,
    remove
};
