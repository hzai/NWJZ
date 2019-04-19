/*
 * @Author: Roy Chen
 * @Date: 2019-04-03 00:24:43
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-06 21:37:14
 */
import { getRoutesByRoles } from '@/api/role';
import { constantRoutes, routerMap } from '@/router';

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.includes(role));
    } else {
        return true;
    }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
    const res = [];
    console.log('routes - ', routes);
    routes.forEach(route => {
        const tmp = { ...route };
        const tmpComponent = tmp.component;
        tmp.component = routerMap[tmpComponent];
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles);
            }
            res.push(tmp);
        }
    });
    console.log('res - ', res);
    return res;
}

const state = {
    routes: [],
    addRoutes: []
};

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes;
        state.routes = constantRoutes.concat(routes);
    }
};

const actions = {
    generateRoutes({ commit }, roles) {
        return new Promise((resolve, reject) => {
            getRoutesByRoles(roles)
                .then(response => {
                    const serverRoutes = response.data.data.routes;
                    console.log('serverRoutes = ', serverRoutes);
                    // let accessedRoutes;
                    // if (roles.includes('admin')) {
                    //     accessedRoutes = asyncRoutes;
                    // } else {
                    //     accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
                    // }
                    const accessedRoutes = filterAsyncRoutes(
                        serverRoutes,
                        roles
                    );
                    console.log('accessedRoutes = ', accessedRoutes);
                    commit('SET_ROUTES', accessedRoutes);
                    resolve(accessedRoutes);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
