/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 00:36:55
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-20 16:53:18
 */
import User from '../models/user.model';
import UserEvent from '../models/user.event.model';
import Event from '../models/event.model';
import Counters from '../models/counters.model';
import Auth from '../models/auth.model';
import config from '../../config/config';
import Utils from '../helpers/Utils';
const passport = require('passport');
/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
    User.get(id)
        .then(user => {
            req.user = user; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            user: req.user
        },
        message: '获取用户信息成功'
    });
}

/**
 * 返回自己的信息
 * @param req
 * @param res
 * @param next
 */
function me(req, res, next) {
    console.log(req.payload);
    User.get(req.payload.user)
        .then(user => {
            req.user = user;
            return res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    user: user
                },
                message: '获取用户信息成功'
            });
        })
        .catch(e => next(e));
}

/**
 * 获取我邀请的用户
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getMyInviteList(req, res, next) {
    User.find({
        invited_from: req.payload.user
    })
        .sort({ created_time: -1 })
        .then(userList => {
            return res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    userList: userList
                },
                message: '获取我邀请的用户列表'
            });
        })
        .catch(e => next(e));
}

/**
 * 获取邀请人的信息和被邀请人列表
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getInviteInfo(req, res, next) {
    const inviterId = req.inviterId;
    const eventId = req.eventId;
    console.log('inviterId = ', inviterId);
    console.log('eventId = ', eventId);
    User.findById(inviterId, 'nickname avatar')
        .then(user => {
            Event.findById(eventId)
                .populate({ path: 'service' })
                .then(event => {
                    UserEvent.findOne({
                        user: inviterId,
                        event: eventId
                    })
                        .populate({
                            path: 'event',
                            populate: { path: 'service' }
                        })
                        .populate({ path: 'assist_users.user' })
                        .then(userEvent => {
                            let userList = [];
                            let avatarList = [];
                            if (userEvent) {
                                userEvent.assist_users.forEach(
                                    (item, index) => {
                                        userList.push({
                                            name: item.user.nickname,
                                            avatar: item.user.avatar,
                                            created_time: item.created_time
                                        });
                                        avatarList.push({
                                            avatar: item.user.avatar
                                        });
                                    }
                                );
                            }
                            console.log(
                                ' avatarList.length avatarList.length == ',
                                avatarList.length
                            );
                            const len = avatarList.length;
                            if (len < 5) {
                                for (var i = 0; i < 5 - len; i++) {
                                    avatarList.push({ avatar: '' });
                                }
                            } else if (len > 5) {
                                avatarList.splice(1, len - 5);
                            }
                            return res.json({
                                status: 0,
                                type: 'SUCCESS',
                                data: {
                                    user,
                                    event: event,
                                    userList,
                                    avatarList
                                },
                                message: '获取邀请人的信息和被邀请人列表'
                            });
                        })
                        .catch(e => next(e));
                })
                .catch(e => next(e));
        })
        .catch(e => {
            return res.json({
                status: -1,
                type: 'FAILED',
                data: {
                    user: {},
                    userList: {}
                },
                message: '获取邀请人的信息和被邀请人列表'
            });
        });
}

/**
 * Create new user
 * @returns {User}
 */
function create(req, res, next) {
    const user = new User({
        // 用户类型 会员:member, 保姆:worker, 系统用户:system
        user_type: req.body.user_type,
        // 是否受雇为员工，默认false
        employment: req.body.employment,
        // 昵称
        nickname: req.body.nickname,
        // 头像
        avatar: req.body.avatar,
        // 姓名
        name: req.body.name,
        // 性别
        sex: req.body.sex,
        // 籍贯
        native_place: req.body.native_place,
        // 年龄
        age: req.body.age,
        // 婚姻状况
        marriaged: req.body.marriaged,
        // 生日
        birth: req.body.birth,
        // 身份证号
        id_card: req.body.id_card,
        // 身份证图片
        id_card_images: req.body.id_card_images,
        // 学历
        academic: req.body.academic,
        // 身高
        height: req.body.height,
        // 老家电话
        town_phone: req.body.town_phone,
        // 紧急电话
        urgent_phone: req.body.urgent_phone,
        // 联系电话 本人电话
        contact_phone: req.body.contact_phone,
        // 身体状况
        healthy: req.body.healthy,
        // 电子邮箱
        email: req.body.email,
        // 其他证件
        other_credentials: req.body.other_credentials,
        // 语言能力
        languages: req.body.languages,
        // 证件
        credentials: req.body.credentials,
        // 工作类型
        work_type: req.body.work_type,
        // 其他工作类型
        other_work_type: req.body.other_work_type,
        // 介绍人或担保人
        recommend_person: req.body.recommend_person,
        // 介绍人联系电话
        recommend_phone: req.body.recommend_phone,
        // 工作经验
        working_experience: req.body.working_experience,
        // 自我介绍
        introduce: req.body.introduce,
        // 受雇于哪个公司
        employed_to: req.body.employed_to,
        // 附件
        attachment: req.body.attachment,
        // 保姆编码
        worker_code: req.body.worker_code,
        // 公司名称
        company_name: req.body.company_name,
        // 公司地址
        company_address: req.body.company_address,
        // 公司电话
        company_tel: req.body.company_tel,
        // 电子邮箱
        company_email: req.body.company_email,
        // 公司营业执照
        company_business_license: req.body.company_business_license,
        // 状态
        status: req.body.status,
        // 角色
        roles: req.body.roles,
        // 创建人
        created_by: req.payload.user
    });
    user.save()
        .then(savedUser => {
            return res.json({
                status: 0,
                data: {
                    user: savedUser
                },
                type: 'SUCCESS',
                message: '账号创建成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Update existing user
 * @returns {User}
 */
function update(req, res, next) {
    const user = req.user;
    // 用户类型 会员:member; 保姆:worker; 系统用户:system
    user.user_type = req.body.user_type;
    // 是否受雇为员工，默认false
    user.employment = req.body.employment;
    // 昵称
    user.nickname = req.body.nickname;
    // 头像
    user.avatar = req.body.avatar;
    // 姓名
    user.name = req.body.name;
    // 性别
    user.sex = req.body.sex;
    // 籍贯
    user.native_place = req.body.native_place;
    // 年龄
    user.age = req.body.age;
    // 婚姻状况
    user.marriaged = req.body.marriaged;
    // 生日
    user.birth = req.body.birth;
    // 身份证号
    user.id_card = req.body.id_card;
    // 身份证图片
    user.id_card_images = req.body.id_card_images;
    // 学历
    user.academic = req.body.academic;
    // 身高
    user.height = req.body.height;
    // 老家电话
    user.town_phone = req.body.town_phone;
    // 紧急电话
    user.urgent_phone = req.body.urgent_phone;
    // 联系电话 本人电话
    user.contact_phone = req.body.contact_phone;
    // 身体状况
    user.healthy = req.body.healthy;
    // 电子邮箱
    user.email = req.body.email;
    // 其他证件
    user.other_credentials = req.body.other_credentials;
    // 语言能力
    user.languages = req.body.languages;
    // 证件
    user.credentials = req.body.credentials;
    // 工作类型
    user.work_type = req.body.work_type;
    // 其他工作类型
    user.other_work_type = req.body.other_work_type;
    // 介绍人或担保人
    user.recommend_person = req.body.recommend_person;
    // 介绍人联系电话
    user.recommend_phone = req.body.recommend_phone;
    // 工作经验
    user.working_experience = req.body.working_experience;
    // 自我介绍
    user.introduce = req.body.introduce;
    // 附件
    user.attachment = req.body.attachment;
    // 保姆编码
    // user.worker_code = req.body.worker_code;
    // 受雇于哪个公司
    user.employed_to = req.body.employed_to;
    // 公司名称
    user.company_name = req.body.company_name;
    // 公司地址
    user.company_address = req.body.company_address;
    // 公司电话
    user.company_tel = req.body.company_tel;
    // 电子邮箱
    user.company_email = req.body.company_email;
    // 公司营业执照
    user.company_business_license = req.body.company_business_license;
    // 状态
    user.status = req.body.status;
    user.updated_time = Date.now();
    user.updated_by = req.payload.user;
    user.save()
        .then(savedUser => {
            return res.json({
                status: 0,
                data: {
                    user: savedUser
                },
                type: 'SUCCESS',
                message: '账号更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * getMembers
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getMembers(req, res, next) {
    const {
        status = 'ALL',
        nickname = '',
        contact_phone = '',
        start_end = undefined
    } = req.query;
    let _filter = {
        $and: [
            {
                nickname: {
                    $regex: nickname,
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
                user_type: 'member'
            }
        ]
    };
    if (status !== 'ALL') {
        _filter.$and.push({
            status: status
        });
    }
    if (start_end !== undefined) {
        _filter.$and.push({
            created_time: {
                $gte: new Date(start_end[0]),
                $lte: new Date(start_end[1])
            }
        });
    }
    let total = await User.count(_filter);
    const query = Utils.handleQuery(req, total);
    User.find(_filter)
        .limit(query.limit)
        .skip(query.skip)
        .sort({
            created_time: -1
        })
        .exec()
        .then(users => {
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    users
                },
                message: '获取member列表成功'
            });
        })
        .catch(e => next(e));
}

/**
 * getMembers
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getMembersXcx(req, res, next) {
    const { status = 'ALL', nickname = '', contact_phone = '' } = req.query;
    let _filter = {
        created_time: {
            $gt: new Date().toLocaleDateString()
        }
    };
    if (status !== 'ALL') {
        _filter.$and.push({
            status: status
        });
    }
    let total = await User.count(_filter);
    const query = Utils.handleQuery(req, total);
    User.find(_filter)
        .limit(query.limit)
        .skip(query.skip)
        .sort({
            created_time: -1
        })
        .exec()
        .then(users => {
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    users
                },
                message: '获取member列表成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    User.list({
        limit,
        skip
    })
        .then(users =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    users: users
                },
                message: '获取用户列表成功'
            })
        )
        .catch(e => next(e));
}

/**
 * 获取所有公司用户 getCompanyUsers
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getCompanyUsers(req, res, next) {
    const { companyId = undefined } = req.query;
    let total = await Auth.count({
        identity_type: config.identity_type.company,
        company: companyId
    });
    const query = Utils.handleQuery(req, total);
    Auth.find(
        {
            identity_type: config.identity_type.company,
            company: companyId
        },
        '_id identifier user'
    )
        .populate({
            path: 'user'
        })
        .limit(query.limit)
        .skip(query.skip)
        .sort({
            created_time: -1
        })
        .exec()
        .then(auths => {
            let users = [];
            auths.forEach(item => {
                const user = {
                    _id: item.user._id,
                    identifier: item.identifier,
                    name: item.user.name,
                    nickname: item.user.nickname,
                    contact_phone: item.user.contact_phone,
                    email: item.user.email,
                    sex: item.user.sex,
                    birth: item.user.birth,
                    roles: item.user.roles,
                    status: item.user.status,
                    created_by: item.user.created_by,
                    updated_by: item.user.updated_by,
                    created_time: item.user.created_time,
                    updated_time: item.user.updated_time
                };
                users.push(user);
            });
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    users
                },
                message: '获取公司用户列表成功'
            });
        })
        .catch(e => next(e));
}
/**
 * 创建公司用户 createCompanyUser
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function createCompanyUser(req, res, next) {
    try {
        const auth = await Auth.findOne({
            identifier: req.body.identifier
        });
        if (auth) {
            return res.json({
                status: 1,
                type: 'HAS_REGISTERED_MOBILE',
                message: '账号已存在'
            });
        } else {
            const user = new User({
                company_name: req.body.company_name,
                nickname: req.body.company_name,
                company_address: req.body.company_address,
                company_tel: req.body.company_tel,
                company_email: req.body.company_email,
                company_business_license: req.body.company_business_license,
                roles: ['company'],
                avatar: 'http://images.llguanjia.com/avatar.png',
                register_ip: Utils.getClientIp(req)
            });
            console.log(user);
            user.save()
                .then(savedUser => {
                    const auth = new Auth({
                        user: savedUser._id,
                        identity_type: config.identity_type.company,
                        identifier: req.body.identifier
                    });
                    auth.setPassword(req.body.password);
                    auth.save()
                        .then(savedAuth => {
                            return res.json({
                                status: 0,
                                data: {
                                    user: savedUser
                                },
                                Type: 'SUCCESS',
                                message: '账号创建成功'
                            });
                        })
                        .catch(e => next(e));
                })
                .catch(e => next(e));
        }
    } catch (err) {
        next(err);
    }
}
/**
 * 更新公司用户 updateCompanyUser
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function updateCompanyUser(req, res, next) {
    const user = req.user;
    user.company_name = req.body.company_name;
    user.nickname = req.body.company_name;
    user.company_address = req.body.company_address;
    user.company_tel = req.body.company_tel;
    user.company_email = req.body.company_email;
    user.company_business_license = req.body.company_business_license;
    user.status = req.body.status;
    user.updated_time = Date.now();
    user.updated_by = req.payload.user;
    user.save()
        .then(savedUser => {
            if (savedUser) {
                return res.json({
                    status: 0,
                    data: {
                        user: savedUser
                    },
                    Type: 'SUCCESS',
                    message: '账号更新成功'
                });
            } else {
                return res.json({
                    status: 1,
                    data: {
                        user: savedUser
                    },
                    Type: 'ERROR',
                    message: '账号创建失败'
                });
            }
        })
        .catch(e => next(e));
}

/**
 * 获取所有系统用户 getSystemUsers
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getSystemUsers(req, res, next) {
    let total = await Auth.count({
        identity_type: config.identity_type.system
    });
    const query = Utils.handleQuery(req, total);
    Auth.find(
        {
            identity_type: config.identity_type.system
        },
        '_id identifier user'
    )
        .populate({
            path: 'user'
        })
        .limit(query.limit)
        .skip(query.skip)
        .sort({
            created_time: -1
        })
        .exec()
        .then(auths => {
            let users = [];
            auths.forEach(item => {
                const user = {
                    _id: item.user._id,
                    identifier: item.identifier,
                    name: item.user.name,
                    nickname: item.user.nickname,
                    contact_phone: item.user.contact_phone,
                    email: item.user.email,
                    sex: item.user.sex,
                    birth: item.user.birth,
                    roles: item.user.roles,
                    status: item.user.status,
                    created_by: item.user.created_by,
                    updated_by: item.user.updated_by,
                    created_time: item.user.created_time,
                    updated_time: item.user.updated_time
                };
                users.push(user);
            });
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    users
                },
                message: '获取用户列表成功'
            });
        })
        .catch(e => next(e));
}
/**
 * 创建系统用户 createSystemUser
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function createSystemUser(req, res, next) {
    try {
        const auth = await Auth.findOne({
            identifier: req.body.identifier
        });
        if (auth) {
            return res.json({
                status: 1,
                type: 'HAS_REGISTERED_MOBILE',
                message: '账号已存在'
            });
        } else {
            const user = new User({
                name: req.body.name,
                nickname: req.body.name,
                sex: req.body.sex,
                email: req.body.email,
                contact_phone: req.body.contact_phone,
                birth: req.body.birth,
                roles: req.body.roles,
                avatar: 'http://images.llguanjia.com/avatar.png',
                register_ip: Utils.getClientIp(req)
            });
            console.log(user);
            user.save()
                .then(savedUser => {
                    const auth = new Auth({
                        user: savedUser._id,
                        identity_type: config.identity_type.system,
                        identifier: req.body.identifier
                    });
                    auth.setPassword(req.body.password);
                    auth.save()
                        .then(savedAuth => {
                            return res.json({
                                status: 0,
                                data: {
                                    // token: savedAuth.generateJwt(),
                                    // auth: savedAuth,
                                    user: savedUser
                                },
                                Type: 'SUCCESS',
                                message: '账号创建成功'
                            });
                        })
                        .catch(e => next(e));
                })
                .catch(e => next(e));
        }
    } catch (err) {
        next(err);
    }
}
/**
 * 更新系统用户 updateSystemUser
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function updateSystemUser(req, res, next) {
    const user = req.user;
    user.name = req.body.name;
    user.email = req.body.email;
    user.sex = req.body.sex;
    user.birth = req.body.birth;
    user.roles = req.body.roles;
    user.status = req.body.status;
    user.contact_phone = req.body.contact_phone;
    user.updated_time = Date.now();
    user.updated_by = req.payload.user;
    user.save()
        .then(savedUser => {
            if (savedUser) {
                return res.json({
                    status: 0,
                    data: {
                        user: savedUser
                    },
                    Type: 'SUCCESS',
                    message: '账号更新成功'
                });
            } else {
                return res.json({
                    status: 1,
                    data: {
                        user: savedUser
                    },
                    Type: 'ERROR',
                    message: '账号创建失败'
                });
            }
        })
        .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
    const user = req.user;
    user.remove()
        .then(deletedUser => res.json(deletedUser))
        .catch(e => next(e));
}

export default {
    load,
    get,
    me,
    create,
    update,
    list,
    getMyInviteList,
    getInviteInfo,
    getMembers,
    getSystemUsers,
    createSystemUser,
    updateSystemUser,
    getCompanyUsers,
    createCompanyUser,
    updateCompanyUser,
    remove,
    getMembersXcx
};
