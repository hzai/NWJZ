/*
 * @Author = Roy Chen
 * @Date = 2017-12-13 00:36:55
 * @Last Modified by: Arnie Carter
 * @Last Modified time: 2018-09-20 15:56:27
 */
import moment from 'moment';
import Event from '../models/event.model';
import UserEvent from '../models/user.event.model';
import Order from '../models/order.model';
import User from '../models/user.model';
import config from '../../config/config';
import Utils from '../helpers/Utils';
const passport = require('passport');
import WechatApi from '../helpers/wechatApi';
/**
 * Load event and append to req.
 */
function load(req, res, next, id) {
    Event.findById(id)
        .populate({ path: 'service' })
        .then(event => {
            req.event = event; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get event
 * @returns {event}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            event: req.event
        },
        message: '获取活动信息成功'
    });
}

/**
 * Create new event
 * @returns {event}
 */
function create(req, res, next) {
    //console.log(req.body)
    const event = new Event(req.body);
    event.created_by = req.payload.user;
    event
        .save()
        .then(savedEvent => {
            return res.json({
                status: 0,
                data: {
                    event: savedEvent
                },
                type: 'SUCCESS',
                message: '活动创建成功'
            });
        })
        .catch(e => next(e));
}

/**
 * 活动助力
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function eventAssist(req, res, next) {
    const inviterId = req.inviterId;
    const event = req.event;
    const isNewUser = req.body.isNewUser;
    const userOpenId = req.body.userOpenId;

    console.log('inviterId = ', inviterId);
    // console.log('event = ', event);
    console.log('isNewUser = ', isNewUser);
    const subResult = await WechatApi.getRealUserInfo(userOpenId);
    const subscribed = subResult.subscribe;
    // ---- 判断是否关注 --------
    // subscribed === 0 代表用户没关注公众号
    if (subscribed === 0) {
        return res.json({
            status: 1,
            type: 'FAILED',
            data: {
                subResult
            },
            message: '用户没关注公众号'
        });
    } else {
        UserEvent.findOne({
            user: inviterId,
            event: event._id
        })
            .populate({ path: 'user', select: 'nickname' })
            .then(findUserEvent => {
                if (findUserEvent) {
                    // console.log('Found user event = ', findUserEvent);
                    const assist_users = findUserEvent.assist_users;
                    console.log('assist_users.length = ', assist_users.length);
                    let haveAssisted = false;
                    try {
                        assist_users.forEach(element => {
                            if (element.user + '' === req.payload.user + '') {
                                haveAssisted = true;
                                foreach.break = new Error('StopIteration');
                            }
                        });
                    } catch (e) {
                        if (e.message === 'foreach is not defined') {
                            // console.log('foreach break');
                        }
                    }
                    console.log(' haveAssisted = ', haveAssisted);
                    if (!haveAssisted) {
                        findUserEvent
                            .update({
                                $push: {
                                    assist_users: {
                                        user: req.payload.user,
                                        success: isNewUser === '01' ? true : false,
                                        remark: isNewUser === '01' ? '助力成功' : '助力失败'
                                    }
                                },
                                $inc: { status: isNewUser === '01' ? 1 : 0 }
                            })
                            .then(savedUserEvent => {
                                if (isNewUser === '01') {
                                    User.findByIdAndUpdate(req.payload.user, { is_newUser: '0' })
                                        .then(updateUser => {})
                                        .catch(e => next(e));
                                }
                                console.log(
                                    '==event==' +
                                        moment().format('YYYY-MM-DD HH:mm:ss') +
                                        ' == UPDATE'
                                );
                                console.log(
                                    '==event==' +
                                        moment().format('YYYY-MM-DD HH:mm:ss') +
                                        ' 邀请人: ' +
                                        inviterId +
                                        ' 昵称: ' +
                                        findUserEvent.user.nickname
                                );
                                console.log(
                                    '==event==' +
                                        moment().format('YYYY-MM-DD HH:mm:ss') +
                                        ' 好友: ' +
                                        req.payload.nickname
                                );
                                console.log(
                                    '==event==' +
                                        moment().format('YYYY-MM-DD HH:mm:ss') +
                                        ' 助力情况: ',
                                    isNewUser === '01' ? ' 助力成功' : ' 助力失败'
                                );
                                return getUserInviteInfo(res, inviterId, event);
                            });
                    } else {
                        return getUserInviteInfo(res, inviterId, event);
                    }
                } else {
                    const userEvent = new UserEvent({
                        user: inviterId,
                        event: event._id,
                        assist_users: [
                            {
                                user: req.payload.user,
                                success: isNewUser === '01' ? true : false,
                                remark: isNewUser === '01' ? '助力成功' : '助力失败'
                            }
                        ],
                        status: isNewUser === '01' ? 1 : 0,
                        created_by: req.payload.user
                    });
                    userEvent.save().then(savedUserEvent => {
                        if (isNewUser === '01') {
                            User.findByIdAndUpdate(req.payload.user, { is_newUser: '0' })
                                .then(updateUser => {})
                                .catch(e => next(e));
                        }
                        User.findById(inviterId).then(findUser => {
                            if (findUser) {
                                console.log(
                                    '==event==' +
                                        moment().format('YYYY-MM-DD HH:mm:ss') +
                                        ' == CREATE '
                                );
                                console.log(
                                    '==event==' +
                                        moment().format('YYYY-MM-DD HH:mm:ss') +
                                        ' == 邀请人：' +
                                        inviterId +
                                        ' 昵称: ' +
                                        findUser.nickname
                                );
                                console.log(
                                    '==event==' +
                                        moment().format('YYYY-MM-DD HH:mm:ss') +
                                        ' == 好友: ' +
                                        req.payload.nickname
                                );
                                console.log(
                                    '==event==' +
                                        moment().format('YYYY-MM-DD HH:mm:ss') +
                                        ' == 助力情况: ',
                                    isNewUser === '01' ? ' 助力成功' : ' 助力失败'
                                );
                            } else {
                                console.log(
                                    '==event==' +
                                        moment().format('YYYY-MM-DD HH:mm:ss') +
                                        ' == CREATE '
                                );
                                console.log(
                                    '==event==' +
                                        moment().format('YYYY-MM-DD HH:mm:ss') +
                                        ' == 邀请人：' +
                                        inviterId
                                );
                                console.log(
                                    '==event==' +
                                        moment().format('YYYY-MM-DD HH:mm:ss') +
                                        ' == 好友: ' +
                                        req.payload.nickname
                                );
                                console.log(
                                    '==event==' +
                                        moment().format('YYYY-MM-DD HH:mm:ss') +
                                        ' == 助力情况: ',
                                    isNewUser === '01' ? ' 助力成功' : ' 助力失败'
                                );
                            }
                        });
                        return getUserInviteInfo(res, inviterId, event);
                    });
                }
            });
    }
}

/**
 * 获取邀请人的信息和被邀请人列表
 * @param {*} inviterId
 * @param {*} event
 */
function getUserInviteInfo(res, inviterId, event) {
    UserEvent.findOne({
        user: inviterId,
        event: event._id
    })
        .populate({ path: 'user' })
        .populate({ path: 'assist_users.user' })
        .then(userEvent => {
            // console.log('userEvent = ', userEvent);
            let userList = [];
            let avatarList = [];
            if (userEvent) {
                userEvent.assist_users.forEach((item, index) => {
                    if (item.success) {
                        userList.unshift({
                            name: item.user.nickname,
                            avatar: item.user.avatar,
                            created_time: item.created_time,
                            success: item.success,
                            remark: item.remark,
                            _id: item.user._id
                        });
                        avatarList.push({ avatar: item.user.avatar, success: true });
                    }
                });
            }
            console.log(' avatarList.length  = ', avatarList.length);
            const len = avatarList.length;
            if (len < 8) {
                for (var i = 0; i < 8 - len; i++) {
                    avatarList.push({ avatar: '', success: false });
                }
            } else if (len > 8) {
                avatarList.splice(8, len - 8);
            }
            return res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    user: userEvent ? userEvent.user : null,
                    event: event,
                    status: userEvent ? userEvent.status : 0,
                    userList,
                    avatarList
                },
                message: '获取邀请人的信息和被邀请人列表'
            });
        })
        .catch(e => next(e));
}

function fetchInviteListForXcx(req, res, next) {
    UserEvent.find({
        event: '5b98fe41ef5913798fdc691c',
        status: { $gt: 0 } })
        .populate({ path: 'user' })
        .populate({ path: 'assist_users.user' })
        .sort({ created_time: -1 })
        .exec()
        .then(userEvent => {
            return res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    userEvent
                },
                message: '获取邀请人的信息和被邀请人列表'
            });
        });
}

/**
 * 获取邀请人的列表
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getInviteList(req, res, next) {
    const inviterId = req.inviterId;
    const event = req.event;
    console.log('inviterId = ', inviterId);
    UserEvent.findOne({
        user: inviterId,
        event: event._id
    })
        .populate({ path: 'user' })
        .populate({ path: 'assist_users.user' })
        .then(userEvent => {
            if (userEvent === null) {
                const uE = new UserEvent({
                    user: inviterId,
                    event: event._id,
                    created_by: inviterId,
                    status: 0,
                    assist_users: []
                });
                uE.save().then(obj => {
                    console.log(
                        '==event==' +
                            moment().format('YYYY-MM-DD HH:mm:ss') +
                            '==== ' +
                            inviterId +
                            ' 开团==='
                    );
                });
            }
            // console.log('userEvent = ', userEvent);
            let userList = [];
            let avatarList = [];
            if (userEvent) {
                userEvent.assist_users.forEach((item, index) => {
                    if (item.success) {
                        userList.unshift({
                            name: item.user.nickname,
                            avatar: item.user.avatar,
                            created_time: item.created_time,
                            success: item.success,
                            remark: item.remark,
                            _id: item.user._id
                        });
                        avatarList.push({ avatar: item.user.avatar, success: true });
                    }
                });
            }
            console.log(' avatarList.length  = ', avatarList.length);
            const len = avatarList.length;
            if (len < 8) {
                for (var i = 0; i < 8 - len; i++) {
                    avatarList.push({ avatar: '', success: false });
                }
            } else if (len > 8) {
                avatarList.splice(8, len - 8);
            }
            return res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    user: userEvent ? userEvent.user : null,
                    event: event,
                    status: userEvent ? userEvent.status : 0,
                    userList,
                    avatarList
                },
                message: '获取邀请人的信息和被邀请人列表'
            });
        })
        .catch(e => next(e));
}
/**
 * 检查是否助力成功
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function checkUserEvent(req, res, next) {
    const serviceId = req.serviceId;
    const _filter = {
        $and: [
            {
                user: req.payload.user
            },
            {
                service: serviceId
            }
        ]
    };
    const counter = await Order.count(_filter);

    Event.findOne({
        service: serviceId
    })
        .sort({
            created_time: -1
        })
        .then(findEvent => {
            console.log('checkUserEvent - findEvent = ', findEvent);
            UserEvent.findOne({
                user: req.payload.user,
                event: findEvent._id
            })
                .sort({
                    created_time: -1
                })
                .then(findUE => {
                    if (!findUE) {
                        return res.json({
                            status: 0,
                            type: 'SUCCESS',
                            data: {
                                createdUE: false,
                                success: false,
                                assisted: 0,
                                buyed: counter > 0 ? true : false
                            },
                            message: '检查是否助力成功'
                        });
                    } else {
                        const status = findUE.status;
                        return res.json({
                            status: 0,
                            type: 'SUCCESS',
                            data: {
                                createdUE: true,
                                success: status >= 8 ? true : false,
                                assisted: status,
                                buyed: counter > 0 ? true : false
                            },
                            message: '检查是否助力成功'
                        });
                    }
                });
        });
}

/**
 * Update existing event
 * @returns {event}
 */
function update(req, res, next) {
    const event = req.body;
    event.updated_time = Date.now();
    event.updated_by = req.payload.user;
    Event.findByIdAndUpdate(req.body._id, event)
        .then(savedevent => {
            return res.json({
                status: 0,
                data: {
                    event: savedevent
                },
                type: 'SUCCESS',
                message: '活动更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Get event list.
 * @property {number} req.query.skip - Number of eventes to be skipped.
 * @property {number} req.query.limit - Limit number of eventes to be returned.
 * @returns {event[]}
 */
async function list(req, res, next) {
    let _filter = {};
    if (req.query.serviceId !== undefined) {
        _filter = {
            service: req.query.serviceId
        };
    }
    let total = await Event.count(_filter);
    const query = Utils.handleQuery(req, total);
    const limit = query.limit;
    const skip = query.skip;

    Event.find(_filter)
        .populate({
            path: 'service'
        })
        .sort({
            created_time: -1
        })
        .skip(skip)
        .limit(limit)
        .exec()
        .then(events =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    events
                },
                message: '获取活动列表成功'
            })
        )
        .catch(e => next(e));
}

/**
 * Delete event.
 * @returns {Event}
 */
function remove(req, res, next) {
    const event = req.event;
    event
        .remove()
        .then(deletedEvent =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    deletedEvent
                },
                message: '删除活动成功'
            })
        )
        .catch(e => next(e));
}

/**
 * 写事件
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function callLog(req, res, next) {
    const event = req.body.message;
    console.log(
        '==event==' +
            moment().format('YYYY-MM-DD HH:mm:ss') +
            ' == ' +
            req.payload.nickname +
            ' ' +
            event
    );
    res.json({
        status: 0,
        type: 'SUCCESS',
        message: '事件'
    });
}

export default {
    load,
    get,
    create,
    update,
    list,
    remove,
    eventAssist,
    checkUserEvent,
    callLog,
    getInviteList,
    fetchInviteListForXcx
};
