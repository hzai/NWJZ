/*
 * @Author: Arnie Carter
 * @Date: 2018-01-09 22:29:06
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-10-12 21:51:49
 */

import Preappointment from '../models/preappointment.model';
import WorkerService from '../models/worker.service.model';
import User from '../models/user.model';
import Auth from '../models/auth.model';
import config from '../../config/config';
import Utils from '../helpers/Utils';
import Appointment from '../models/appointment.model';
import moment from 'moment';
const passport = require('passport');
import { submit_reserve_reminder_for_admin } from '../../config/reminder';
/**
 * Load appointment and append to req.
 */
function load(req, res, next, id) {
    Preappointment.findById(id)
        .populate({
            path: 'order service'
        })
        .then(preappointment => {
            req.preappointment = preappointment; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get appointment
 * @returns {preappointment}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            preappointment: req.preappointment
        },
        message: '获取预约服务信息成功'
    });
}

/**
 * Update existing appointment
 * @returns {preappointment}
 */
async function update(req, res, next) {
    const preappointment = req.preappointment;
    preappointment.updated_time = Date.now();
    preappointment.updated_by = req.payload.user;
    preappointment
        .save()
        .then(savedPreappointment => {
            return res.json({
                status: 0,
                data: {
                    preappointment: savedPreappointment
                },
                type: 'SUCCESS',
                message: '预约服务更新成功'
            });
        })
        .catch(e => next(e));
}

async function createAppointment(req, res, next) {
    const preappointment = req.preappointment;
    const appointment = req.body.appointment;
    preappointment.times = preappointment.times - 1;
    if (preappointment.times === 0) {
        preappointment.status = 1;
    }
    preappointment.updated_time = Date.now();
    preappointment.updated_by = req.payload.user;
    preappointment.save().then(savedPreappointment => {
        const apm = new Appointment({
            user: savedPreappointment.user, // fixed a bug, 后台代预约时，不能用后台admin的 user _id, 用回未预约单 preappointment 的 user _id
            order: savedPreappointment.order._id,
            service: savedPreappointment.service,
            service_duration: savedPreappointment.duration,
            preappointment: savedPreappointment._id,
            suit_title: savedPreappointment.suit_title,
            contact_person: savedPreappointment.contact_person,
            contact_phone: savedPreappointment.contact_phone,
            service_category: savedPreappointment.service.category,
            contact_area: savedPreappointment.contact_area,
            contact_detail_address: savedPreappointment.contact_detail_address,
            memo: appointment.memo,
            service_time: appointment.service_time,
            created_time: Date.now(),
            created_by: req.payload.user
        });
        apm.remark.push(moment().format('YYYY-MM-DD HH:mm:ss') + ' 预约服务');
        console.log(apm);
        apm.save()
            .then(saveAppointment => {
                submit_reserve_reminder_for_admin(savedPreappointment.order)
            })
            .catch(e => next(e));
        return res.json({
            status: 0,
            data: {
                preappointment: savedPreappointment
            },
            type: 'SUCCESS',
            message: '预约成功'
        });
    });
}

/**
 * 代客预约服务
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function allocateAppointment(req, res, next) {
    const preappointment = req.preappointment;
    const appointment = req.body.appointment;
    const specifyTimes = req.body.specifyTimes;
    const specifyServiceTimeArray = req.body.specifyServiceTimeArray;

    preappointment.times = preappointment.times - specifyTimes;
    if (preappointment.times === 0) {
        preappointment.status = 1;
    }
    preappointment.updated_time = Date.now();
    preappointment.updated_by = req.payload.user;
    preappointment.save().then(savedPreappointment => {
        specifyServiceTimeArray.forEach(element => {
            console.log('element = ', element);
            const apm = new Appointment({
                user: savedPreappointment.user, // fixed a bug, 后台代预约时，不能用后台admin的 user _id, 用回未预约单 preappointment 的 user _id
                order: savedPreappointment.order._id,
                service: savedPreappointment.service,
                service_duration: savedPreappointment.duration,
                preappointment: savedPreappointment._id,
                suit_title: savedPreappointment.suit_title,
                contact_person: savedPreappointment.contact_person,
                contact_phone: savedPreappointment.contact_phone,
                service_category: savedPreappointment.service.category,
                contact_area: savedPreappointment.contact_area,
                contact_detail_address: savedPreappointment.contact_detail_address,
                memo: appointment.memo,
                service_time: element, // 后台指定的时间
                created_time: Date.now(),
                created_by: req.payload.user,
                company: req.payload.user,
                worker: appointment.worker,
                status: 1 // 已分配
                //remark: '后台代客预约服务'
            });
            apm.remark.push(moment().format('YYYY-MM-DD HH:mm:ss') + ' 后台代客预约服务');
            apm.save()
                .then(saveAppointment => {
                    const workerService = new WorkerService({
                        worker: saveAppointment.worker,
                        company: saveAppointment.company,
                        appointment: saveAppointment._id,
                        remark: [{ time: new Date(), company: saveAppointment.company, content: '承接服务' }],
                        created_by: req.payload.user
                    });
                    workerService
                        .save()
                        .then(savedWorkerService => {})
                        .catch(e => next(e));
                })
                .catch(e => next(e));
        });
        return res.json({
            status: 0,
            data: {
                preappointment: savedPreappointment
            },
            type: 'SUCCESS',
            message: '预约成功'
        });
    });
}

/**
 * Update order status
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {*} status
 */
async function updateStatus(req, res, next) {
    const preappointment = req.preappointment;
    const status = req.preappointment_status;
    console.log(status);
    if (status !== '0' && status !== '1' && status !== '2' && status !== '3' && status !== '4') {
        return res.json({
            status: 1,
            type: 'FAILED',
            message: '参数错误'
        });
    }

    // 订单状态 0 - 待付款；1 - 已付款；2 - 待评价；3 - 已完成；
    preappointment.status = status;
    preappointment.updated_time = Date.now();
    preappointment.updated_by = req.payload.user;
    preappointment
        .save()
        .then(savedPreappointment => {
            return res.json({
                status: 0,
                data: {
                    preappointment: savedPreappointment
                },
                type: 'SUCCESS',
                message: '订单状态更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Get appointment list.
 * @property {number} req.query.skip - Number of appointmentes to be skipped.
 * @property {number} req.query.limit - Limit number of appointmentes to be returned.
 * @returns {appointment[]}
 */
async function list(req, res, next) {
    let _filter = {
        user: req.payload.user
    };
    let total = await Preappointment.count(_filter);
    const query = Utils.handleQuery(req, total);
    const limit = query.limit;
    const skip = query.skip;

    Preappointment.find(_filter)
        .populate({
            path: 'order service'
        })
        .sort({
            created_time: -1
        })
        .skip(skip)
        .limit(limit)
        .exec()
        .then(preappointment =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    preappointment
                },
                message: '获取未预约服务列表成功'
            })
        )
        .catch(e => next(e));
}

export default {
    load,
    get,
    update,
    list,
    updateStatus,
    createAppointment,
    allocateAppointment
};
