/*
 * @Author: Roy Chen
 * @Date: 2019-04-01 21:07:26
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-13 23:42:39
 */

import Communication from '../../models/communication/communication.model';
import Utils from '../../helpers/Utils';
/**
 * Load communication and append to req.
 */
function load(req, res, next, id) {
    Communication.get(id)
        .then(communication => {
            req.communication = communication; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get communication
 * @returns {Communication}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            communication: req.communication
        },
        message: '获取信息成功'
    });
}

/**
 * Create new communication
 * @returns {Communication}
 */
function create(req, res, next) {
    const communication = new Communication(req.body);
    communication.created_by = req.payload.user;
    communication
        .save()
        .then(savedCommunication => {
            return res.json({
                status: 0,
                data: {
                    communication: savedCommunication
                },
                type: 'SUCCESS',
                message: '创建成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Update existing communication
 * @returns {Communication}
 */
function update(req, res, next) {
    const communication = req.body;
    communication.updated_time = Date.now();
    communication.updated_by = req.payload.user;
    Communication.findByIdAndUpdate(req.body._id, communication)
        .then(savedCommunication => {
            return res.json({
                status: 0,
                data: {
                    communication: savedCommunication
                },
                type: 'SUCCESS',
                message: '更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * getWorkerComms
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getWorkerComms(req, res, next) {
    let _filter = { worker: req.workerId };
    Communication.find(_filter)
        .sort({
            created_time: -1
        })
        .exec()
        .then(communications => {
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    communications
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
    Communication.find(_filter)
        .sort({
            created_time: -1
        })
        .exec()
        .then(communications => {
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    communications
                },
                message: '获取列表成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Delete communication.
 * @returns {Communication}
 */
function remove(req, res, next) {
    const communication = req.communication;
    communication
        .remove()
        .then(deletedCommunication => res.json(deletedCommunication))
        .catch(e => next(e));
}

export default {
    load,
    get,
    create,
    update,
    getWorkerComms,
    getEmployerComms,
    remove
};
