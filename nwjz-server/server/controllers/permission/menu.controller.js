/*
 * @Author: Roy Chen
 * @Date: 2019-04-01 21:07:26
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-13 23:49:36
 */

import Menu from '../../models/permission/menu.model';
import Role from '../../models/permission/role.model';
import Utils from '../../helpers/Utils';
/**
 * Load menu and append to req.
 */
function load(req, res, next, id) {
    Menu.get(id)
        .then(menu => {
            req.menu = menu; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get menu
 * @returns {Menu}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            menu: req.menu
        },
        message: '获取菜单成功'
    });
}

/**
 * Create new menu
 * @returns {Menu}
 */
function create(req, res, next) {
    const menu = new Menu(req.body);
    menu.created_by = req.payload.user;
    menu.save()
        .then(savedMenu => {
            return res.json({
                status: 0,
                data: {
                    menu: savedMenu
                },
                type: 'SUCCESS',
                message: '创建menu成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Update existing menu
 * @returns {Menu}
 */
function update(req, res, next) {
    const menu = req.body;
    menu.updated_time = Date.now();
    menu.updated_by = req.payload.user;
    Menu.findByIdAndUpdate(req.body._id, menu)
        .then(savedMenu => {
            return res.json({
                status: 0,
                data: {
                    menu: savedMenu
                },
                type: 'SUCCESS',
                message: '更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * getMenus
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function getMenus(req, res, next) {
    let _filter = {};
    Menu.find(_filter)
        .sort({
            created_time: -1
        })
        .exec()
        .then(menus => {
            let result = [];
            menus.forEach(menu => {
                let row = {
                    name: menu.name,
                    path: menu.path,
                    component: menu.component,
                    redirect: menu.redirect,
                    alwaysShow: menu.alwaysShow,
                    meta: {
                        title: menu.title,
                        icon: menu.icon
                        // roles: menu.roles
                    },
                    children: []
                };
                let children = [];
                menu.children.forEach(child => {
                    let ch = {
                        name: child.name,
                        path: child.path,
                        component: child.component,
                        meta: {
                            title: child.title,
                            icon: child.icon
                            // roles: child.roles
                        }
                    };
                    children.push(ch);
                });
                row.children = children;
                result.push(row);
            });
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    menus: result
                },
                message: '获取菜单列表成功'
            });
        })
        .catch(e => next(e));
}

/**
 * getRoutes - 获取路由表
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getRoutes(req, res, next) {
    const roles = req.body;
    let _filter = {
        key: {
            $in: roles
        }
    };
    const routesInRoles = await Role.find(_filter);

    Menu.find({})
        .sort({
            sort: -1
        })
        .exec()
        .then(menus => {
            let result = [];
            menus.forEach(menu => {
                const menuRoles = getRoleInRoutes(
                    menu.name,
                    routesInRoles,
                    false
                );
                // console.log('menuRoles = ', menuRoles);
                let row = {
                    name: menu.name,
                    path: menu.path,
                    component: menu.component,
                    redirect: menu.redirect,
                    alwaysShow: menu.alwaysShow,
                    hidden: menu.hidden,
                    meta: {
                        title: menu.title,
                        icon: menu.icon,
                        roles: menuRoles
                    },
                    children: []
                };
                let children = [];
                menu.children.forEach(child => {
                    const childMenuRoles = getRoleInRoutes(
                        child.name,
                        routesInRoles,
                        true
                    );
                    // console.log('childMenuRoles = ', childMenuRoles);
                    let ch = {
                        name: child.name,
                        path: child.path,
                        component: child.component,
                        hidden: child.hidden,
                        meta: {
                            title: child.title,
                            icon: child.icon,
                            affix: child.affix,
                            roles: childMenuRoles,
                            noCache: child.noCache
                        }
                    };
                    children.push(ch);
                });
                row.children = children;
                result.push(row);
            });
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    routes: result
                },
                message: '获取路由表成功'
            });
        })
        .catch(e => next(e));
}

function getRoleInRoutes(routeName, roles, children) {
    // console.log('routeName = ', routeName);
    // console.log('roles = ', roles);
    let result = [];
    if (!children) {
        roles.forEach(role => {
            // console.log('role = ', role);
            const routes = role.routes;
            if (routes === undefined || routes.length < 1) return [];
            if (isExist(routeName, routes)) {
                result.push(role.key);
            }
        });
    } else {
        roles.forEach(role => {
            const routes = role.routes;
            if (routes === undefined || routes.length < 1) return [];
            for (const route of routes) {
                const children = route.children;
                if (children === undefined || children.length < 1) return [];
                if (isExist(routeName, children)) {
                    result.push(role.key);
                }
            }
        });
    }
    return result;
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
 * Delete menu.
 * @returns {Menu}
 */
function remove(req, res, next) {
    const menu = req.menu;
    menu.remove()
        .then(deletedMenu => res.json(deletedMenu))
        .catch(e => next(e));
}

export default {
    load,
    get,
    create,
    update,
    getMenus,
    getRoutes,
    remove
};
