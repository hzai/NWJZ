/*
 * @Author: Roy Chen
 * @Date: 2019-04-03 14:20:17
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-04 00:47:22
 */
import request from '@/utils/request';

export function getRoutes() {
    return request({
        url: '/menus',
        method: 'get'
    });
}

export function getRoutesByRoles(data) {
    return request({
        url: '/roles/routes',
        method: 'post',
        data
    });
}

export function getRoles() {
    return request({
        url: '/roles',
        method: 'get'
    });
}

export function addRole(data) {
    return request({
        url: '/roles',
        method: 'post',
        data
    });
}

export function updateRole(id, data) {
    return request({
        url: `/roles/${id}`,
        method: 'put',
        data
    });
}

export function deleteRole(id) {
    return request({
        url: `/roles/${id}`,
        method: 'delete'
    });
}
