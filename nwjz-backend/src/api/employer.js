/*
 * @Author: Roy Chen
 * @Date: 2017-12-19 21:19:02
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-29 15:35:49
 */

import request from '@/utils/request';

export function fetchEmployer(_id) {
    return request({
        url: '/employers/' + _id,
        method: 'get'
    });
}

export function fetchEmployerList(query) {
    return request({
        url: '/employers',
        method: 'get',
        params: query
    });
}

export function statEmployerStatus(query) {
    return request({
        url: '/employers/stat',
        method: 'get',
        params: query
    });
}

export function createEmployer(data) {
    return request({
        url: '/employers',
        method: 'post',
        data
    });
}

export function updateEmployer(_id, data) {
    return request({
        url: '/employers/' + _id,
        method: 'put',
        data
    });
}
