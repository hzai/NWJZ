/*
 * @Author = Roy Chen
 * @Date = 2017-12-13 00:36:55
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-01-20 20:30:18
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-06-05 23:44:55
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-11-03 22:00:57
 */
import Appointment from '../models/appointment.model';
import Order from '../models/order.model';
import Preappointment from '../models/preappointment.model';
import WorkerService from '../models/worker.service.model';
import Worker from '../models/worker.model';
import User from '../models/user.model';
import Auth from '../models/auth.model';
import config from '../../config/config';
import Utils from '../helpers/Utils';
import calendar from '../helpers/calendar';
import UserEvent from '../models/user.event.model';
import moment from 'moment';
const passport = require('passport');
import { pick_order_success_reminder, complete_appointment_reminder } from '../../config/reminder';
/**
 * Load appointment and append to req.
 */
function load(req, res, next, id) {
    Appointment.findById(id)
        .populate({
            path: 'order preappointment worker company',
            populate: {
                path: 'service'
            }
        })
        .then(appointment => {
            req.appointment = appointment; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get appointment
 * @returns {Appointment}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            appointment: req.appointment
        },
        message: '获取预约服务信息成功'
    });
}

async function xcxIndexCount(req, res, next) {
    let _filter = {
        status: 1,
        service_time: {
            $gt: new Date()
        }
    };
    let unAtotal = await Appointment.count({ status: 0 });
    let atotal = await Appointment.count(_filter);
    let order = await Order.count({ status: 5 });
    let autoCLoseOrder = await Order.count({ status: 4 });
    let payOrder = await Order.count({ status: 1 });
    let events = await UserEvent.count({ event: '5b98fe41ef5913798fdc691c',status: {$gt: 0}});
    _filter = {
        user_type: 'member',
        created_time: {
            $gt: new Date().toLocaleDateString()
        }
    };
    let newUser = await User.count(_filter);
    console.log('data:', unAtotal, atotal, order, newUser, payOrder, autoCLoseOrder);

    return res.json({
        status: 0,
        data: {
            unAtotal: unAtotal,
            atotal: atotal,
            order: order,
            newUser: newUser,
            autoCLoseOrder: autoCLoseOrder,
            payOrder: payOrder,
            events: events
        },
        type: 'SUCCESS',
        message: '获取首页信息成功！'
    });
}

/**
 * Update existing appointment
 * @returns {appointment}
 */
async function update(req, res, next) {
    const appointment = req.appointment;
    appointment.updated_time = Date.now();
    appointment.updated_by = req.payload.user;
    appointment.remark.push(moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + req.body.remark);
    appointment
        .save()
        .then(savedAppointment => {
            return res.json({
                status: 0,
                data: {
                    appointment: savedAppointment
                },
                type: 'SUCCESS',
                message: '预约服务更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Update appointment status
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {*} status
 */
async function updateStatus(req, res, next) {
    const appointment = req.appointment;
    const status = req.status;
    console.log('appointment id(' + appointment._id + ') 更改状态为：', status);
    if (status !== '0' && status !== '1' && status !== '2' && status !== '3' && status !== '4' && status !== '5') {
        return res.json({
            status: 1,
            type: 'FAILED',
            message: '参数错误'
        });
    }

    // Appointment状态 0 - 已预约（未分配）；1 - 已分配；2 - 服务中；3 - 服务完成; 4 - 服务取消；5 - 暂停服务
    appointment.status = status;
    appointment.remark.push(moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + req.body.remark);
    appointment.updated_time = Date.now();
    appointment.updated_by = req.payload.user;
    appointment
        .save()
        .then(savedAppointment => {
            return res.json({
                status: 0,
                data: {
                    appointment: savedAppointment
                },
                type: 'SUCCESS',
                message: '服务状态更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * 取消服务，
 * TODO 如是preappointment， 服务次数+1？ 如不是preappointment 不能取消？？？？？
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function cancelService(req, res, next) {
    const appointment = req.appointment;
    if (appointment.preappointment !== '') {
        appointment.status = 4;
        appointment.updated_time = Date.now();
        appointment.updated_by = req.payload.user;
        appointment.remark.push(moment().format('YYYY-MM-DD HH:mm:ss') + ' 后台标记: 取消服务');
        appointment
            .save()
            .then(savedAppointment => {
                Preappointment.findByIdAndUpdate(appointment.preappointment._id, {
                    times: appointment.preappointment.times + 1,
                    updated_time: Date.now(),
                    updated_by: req.payload.user
                })
                    .then(resp => {})
                    .catch(e => next(e));
                return res.json({
                    status: 0,
                    data: {
                        appointment: savedAppointment
                    },
                    type: 'SUCCESS',
                    message: '取消服务成功'
                });
            })
            .catch(e => next(e));
    }
}

/**
 * 后台完成服务
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function completeService(req, res, next) {
    const appointment = req.appointment;
    appointment.status = 3;
    // appointment.remark = req.body.remark;
    appointment.remark.push(moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + req.body.remark);
    appointment.updated_time = Date.now();
    appointment.updated_by = req.payload.user;
    const updateApm = await appointment
        .save()
        .then(savedAppointment => {
            return savedAppointment;
        })
        .catch(e => {
            console.log('completeService error = ', e);
            next(e);
        });
    const order = updateApm.order;
    const preappointment = updateApm.preappointment;

    if (preappointment !== null && preappointment !== undefined) {
        if (preappointment.times > 0) {
            console.log('preappointment.times > 0)')
            return res.json({
                status: 0,
                data: {
                    appointment: updateApm,
                    order: order
                },
                type: 'SUCCESS',
                message: '1)该服务已完成\n2)该订单还有未预约服务待分配！\n'
            });
        } else {
            console.log('preappointment.times === 0)')
            // Appointment状态 0 - 已预约（未分配）；1 - 已分配；2 - 服务中；3 - 服务完成; 4 - 服务取消
            let apmCount = await Appointment.count({
                order: order._id,
                status: { $in: [0, 1, 2] }
            });
            if (apmCount > 0) {
                console.log('apmCount > 0)')
                return res.json({
                    status: 0,
                    data: {
                        appointment: updateApm,
                        order: order
                    },
                    type: 'SUCCESS',
                    message: '1)该服务已完成\n2)该订单下还有预约服务未完成'
                });
            } else {
                console.log('apmCount === 0)')
                // 订单状态 0 - 待付款；1 - 已付款；2 - 待评价；3 - 已完成；4 - 交易关闭; 5 - 待回访
                order.status = 2; // 同时标记订单为 待评价
                order.save().then(savedOrder => {
                    complete_appointment_reminder(appointment)
                    return res.json({
                        status: 0,
                        data: {
                            appointment: updateApm,
                            order: savedOrder
                        },
                        type: 'SUCCESS',
                        message: '1)该服务已完成\n2)该订单下所有预约服务已完成\n3)同时标记订单状态为待评价\n'
                    });
                });
            }
        }
    } else {
        // 订单状态 0 - 待付款；1 - 已付款；2 - 待评价；3 - 已完成；4 - 交易关闭; 5 - 待回访
        order.status = 2; // 同时标记订单为 待评价
        order.save().then(savedOrder => {
            complete_appointment_reminder(appointment)
            return res.json({
                status: 0,
                data: {
                    appointment: updateApm,
                    order: savedOrder
                },
                type: 'SUCCESS',
                message: '1)该服务已完成\n2)同时标记订单状态为待评价\n'
            });
        });
    }
}

/**
 * 后台 - 更换服务时间
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function changeServiceTime(req, res, next) {
    const appointment = req.appointment;
    const org_st = appointment.service_time
    appointment.service_time = req.body.service_time;
    // appointment.remark = req.body.remark;
    appointment.remark.push(moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + req.body.remark + ': ' + moment(org_st).format('YYYY-MM-DD HH:mm:ss') + ' --> ' + moment(req.body.service_time).format('YYYY-MM-DD HH:mm:ss'));
    appointment.updated_time = Date.now();
    appointment.updated_by = req.payload.user;
    appointment
        .save()
        .then(savedAppointment => {
            return res.json({
                status: 0,
                data: {
                    appointment: savedAppointment
                },
                type: 'SUCCESS',
                message: '更换服务时间成功'
            });
        })
        .catch(e => next(e));
}

/**
 * 获取所有未分配的预约服务
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getNotAllocatedAppoinment(req, res, next) {
    let _filter = {
        status: 0
    };
    let total = await Appointment.count(_filter);
    const query = Utils.handleQuery(req, total);
    const limit = query.limit;
    const skip = query.skip;

    Appointment.find(_filter)
        .populate({
            path: 'order preappointment service'
        })
        .populate({
            path: 'user',
            select: 'avatar nickname'
        })
        .sort({
            service_time: 1,
            created_time: 1
        })
        .skip(skip)
        .limit(limit)
        .exec()
        .then(appointments =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    appointments
                },
                message: '获取预约服务列表成功'
            })
        )
        .catch(e => next(e));
}

/**
 * 获取未生效前已分配的预约服务，小程序用
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getAllocatedAppoinment(req, res, next) {
    let _filter = {
        status: 1,
        service_time: {
            $gt: new Date()
        }
    };
    let total = await Appointment.count(_filter);
    const query = Utils.handleQuery(req, total);
    const limit = query.limit;
    const skip = query.skip;

    Appointment.find(_filter)
        .populate({
            path: 'service worker'
        })
        .sort({
            service_time: 1
        })
        .limit(50)
        .exec()
        .then(appointments =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    appointments
                },
                message: '获取已预约服务列表成功'
            })
        )
        .catch(e => next(e));
}

/**
 * 获取公司所有的服务记录
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getAppoinmentsByCompany(req, res, next) {
    const { status = 'ALL', worker = 'ALL', contact_person = '', contact_phone = '', start_end = undefined } = req.query;
    let _filter = {
        $and: [
            {
                company: req.payload.user
            },
            {
                contact_person: {
                    $regex: contact_person,
                    $options: '$i'
                }
            },
            {
                contact_phone: {
                    $regex: contact_phone,
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
    if (worker !== 'ALL') {
        _filter.$and.push({
            worker: worker
        });
    }
    if (start_end !== undefined) {
        _filter.$and.push({
            service_time: {
                $gte: new Date(start_end[0]),
                $lte: new Date(start_end[1])
            }
        });
    }
    let total = await Appointment.count(_filter);
    const query = Utils.handleQuery(req, total);
    const limit = query.limit;
    const skip = query.skip;

    Appointment.find(_filter)
        .populate({
            path: 'order worker',
            populate: 'service'
        })
        .populate({
            path: 'user',
            select: 'avatar nickname'
        })
        .sort({
            service_time: 1
        })
        .skip(skip)
        .limit(limit)
        .exec()
        .then(appointments =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    appointments
                },
                message: '获取预约服务列表成功'
            })
        )
        .catch(e => next(e));
}

/**
 * 指定公司和保姆
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function allocateCompanyAndWorker(req, res, next) {
    const appointment = req.appointment;
    const company = req.payload.user;
    const worker = req.body.worker;
    const remark = req.body.remark;

    WorkerService.findOneAndUpdate(
        { appointment: appointment._id },
        {
            worker: worker,
            company: company,
            $push: { remark: { time: new Date(), company: company, content: '承接服务' } },
            updated_by: req.payload.user,
            updated_time: new Date()
        }
    ).then(async savedWorkerService => {
        console.log('savedWorkerService = ', savedWorkerService)
        if (!savedWorkerService) {
            console.log('allocateCompanyAndWorker - 分配保姆 - appointment._id = ', appointment._id)
            const workerService = new WorkerService({
                worker: worker,
                company: company,
                appointment: appointment._id,
                remark: [{ time: new Date(), company: company, content: '承接服务' }],
                created_by: req.payload.user
            });
            workerService
                .save()
                .then(async savedWorkerService => {
                    if (savedWorkerService) {
                        const workerName = await getWorkerName(worker)
                        appointment.company = company;
                        appointment.worker = worker;
                        appointment.status = 1; // 转为已分配
                        // appointment.remark = remark;
                        appointment.remark.push(moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + '接单，分配保姆: ' + workerName + ' ' + remark);
                        appointment.updated_time = Date.now();
                        appointment.updated_by = req.payload.user;
                        appointment
                            .save()
                            .then(savedAppointment => {
                                // console.log('savedAppointment = ', savedAppointment)
                                pick_order_success_reminder(savedAppointment)
                                return res.json({
                                    status: 0,
                                    data: {
                                        appointment: savedAppointment
                                    },
                                    type: 'SUCCESS',
                                    message: '指定公司和保姆，更新预约服务成功'
                                });
                            })
                            .catch(e => next(e));
                    }
                })
                .catch(e => next(e));
        } else {
            console.log('allocateCompanyAndWorker - 更换保姆 - appointment._id = ', appointment._id)
            const workerName = await getWorkerName(worker)
            appointment.company = company;
            appointment.worker = worker;
            appointment.status = 1; // 转为已分配
            // appointment.remark = remark;
            appointment.remark.push(moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + '更换保姆: ' + workerName);
            appointment.updated_time = Date.now();
            appointment.updated_by = req.payload.user;
            appointment
                .save()
                .then(savedAppointment => {
                    return res.json({
                        status: 0,
                        data: {
                            appointment: savedAppointment
                        },
                        type: 'SUCCESS',
                        message: '指定公司和保姆，更新预约服务成功'
                    });
                })
                .catch(e => next(e));
        }
    });
}

/**
 * 公司取消该预约服务
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function cancelAllocateCompanyAndWorker(req, res, next) {
    const appointment = req.appointment;
    console.log(appointment);
    const company = req.payload.user;
    const worker = req.body.worker;
    WorkerService.findOneAndUpdate(
        { appointment: appointment._id },
        {
            worker: null,
            company: null,
            $push: { remark: { time: new Date(), company: company, content: '取消该服务' } },
            updated_by: req.payload.user,
            updated_time: new Date()
        }
    ).then(savedWorkerService => {
        console.log('11111');
        console.log(savedWorkerService);
        if (savedWorkerService) {
            appointment.company = null;
            appointment.worker = null;
            appointment.status = 0; // 由已分配转为未分配
            appointment.remark.push(moment().format('YYYY-MM-DD HH:mm:ss') + ' 后台标记: 取消服务');
            appointment.updated_time = Date.now();
            appointment.updated_by = req.payload.user;
            appointment
                .save()
                .then(savedAppointment => {
                    return res.json({
                        status: 0,
                        data: {
                            appointment: savedAppointment
                        },
                        type: 'SUCCESS',
                        message: '公司取消预约服务成功'
                    });
                })
                .catch(e => next(e));
        }
    });
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
    let total = await Appointment.count(_filter);
    const query = Utils.handleQuery(req, total);
    const limit = query.limit;
    const skip = query.skip;

    Appointment.find(_filter)
        .sort({
            created_time: -1
        })
        .skip(skip)
        .limit(limit)
        .exec()
        .then(appointmentes =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    appointmentes
                },
                message: '获取预约服务列表成功'
            })
        )
        .catch(e => next(e));
}

async function getWorkerName(workerId) {
    const worker = await Worker.get(workerId).then(w => {
        return w.nickname
    })
    console.log('worker = ', worker)
    return worker;
}

export default {
    load,
    get,
    update,
    list,
    updateStatus,
    cancelService,
    completeService,
    changeServiceTime,
    getNotAllocatedAppoinment,
    getAppoinmentsByCompany,
    allocateCompanyAndWorker,
    cancelAllocateCompanyAndWorker,
    getAllocatedAppoinment,
    xcxIndexCount
};
