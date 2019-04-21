/*
 * @Author: Roy Chen
 * @Date: 2019-04-01 21:07:26
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-21 14:04:32
 */

import Role from '../../models/permission/role.model';
import Utils from '../../helpers/Utils';
/**
 * Load role and append to req.
 */
function load(req, res, next, id) {
    Role.get(id)
        .then(role => {
            req.role = role; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get role
 * @returns {Role}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            role: req.role
        },
        message: '获取角色成功'
    });
}

/**
 * Create new role
 * @returns {Role}
 */
async function create(req, res, next) {
    const role = new Role(req.body);
    role.created_by = req.payload.user;
    role.save()
        .then(savedRole => {
            return res.json({
                status: 0,
                data: {
                    role: savedRole
                },
                type: 'SUCCESS',
                message: '创建role成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Update existing role
 * @returns {Role}
 */
function update(req, res, next) {
    const role = req.body;
    // console.log('role = ', role);
    role.updated_time = Date.now();
    role.updated_by = req.payload.user;
    Role.findByIdAndUpdate(req.body._id, role)
        .then(savedRole => {
            return res.json({
                status: 0,
                data: {
                    role: savedRole
                },
                type: 'SUCCESS',
                message: '更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * getRoles
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getRoles(req, res, next) {
    let _filter = {};
    let total = await Role.count(_filter);
    const query = Utils.handleQuery(req, total);
    Role.find(_filter)
        .limit(query.limit)
        .skip(query.skip)
        .sort({
            created_time: 1
        })
        .exec()
        .then(roles => {
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    roles
                },
                message: '获取角色列表成功'
            });
        })
        .catch(e => next(e));
}

/**
 * getRoutesByRoles
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getRoutesByRoles(req, res, next) {
    const roles = req.body;
    let _filter = {
        key: {
            $in: roles
        }
    };
    Role.find(_filter)
        .exec()
        .then(roles => {
            let result = [];
            roles.forEach(role => {
                const routes = role.routes;
                // console.log('routes = ', routes);
                routes.forEach(route => {
                    // console.log('route = ', route);
                    // console.log('result = ', result);
                    if (isExist(route.name, result)) {
                        result.meta.roles.push('route.meta.roles');
                    } else {
                        result.push(route);
                    }
                });
            });
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    routes: result
                },
                message: '获取Routes by 角色成功'
            });
        })
        .catch(e => next(e));
}

function isExist(key, arrs) {
    let result = false;
    for (const arr of arrs) {
        // console.log('key = ', key, arr.name);
        if (key === arr.name) {
            result = true;
        }
    }
    return result;
}

/**
 * Delete role.
 * @returns {Role}
 */
function remove(req, res, next) {
    const role = req.role;
    role.remove()
        .then(deletedRole => res.json(deletedRole))
        .catch(e => next(e));
}

export default {
    load,
    get,
    create,
    update,
    getRoles,
    getRoutesByRoles,
    remove
};
