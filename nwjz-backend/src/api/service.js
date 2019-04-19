/*
 * @Author: Roy Chen
 * @Date: 2017-12-19 21:19:02
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-10 11:39:12
 */

import request from '@/utils/request';

export function fetchService(_id) {
    return request({
        url: '/services/' + _id,
        method: 'get'
    });
}
/**
 * 获取服务列表
 * @param {*} query
 */
export function fetchServiceList(query) {
    return request({
        url: '/services',
        method: 'get',
        params: query
    });
}
/**
 * 获取专项服务
 * @param {*} query
 */
export function fetchSpecialServiceList(query) {
    return request({
        url: '/services/special',
        method: 'get',
        params: query
    });
}
/**
 * 获取专项服务
 * @param {*} query
 */
export function fetchIncludedServiceList(query) {
    return request({
        url: '/services/include',
        method: 'get',
        params: query
    });
}

export function createService(data) {
    return request({
        url: '/services',
        method: 'post',
        data
    });
}

export function updateService(_id, data) {
    return request({
        url: '/services/' + _id,
        method: 'put',
        data
    });
}

export function fetchServiceCatgoryList(query) {
    return request({
        url: '/servcates',
        method: 'get',
        params: query
    });
}
export function fetchActiveServiceCatgoryList() {
    return request({
        url: '/servcates/active',
        method: 'get'
    });
}
export function createServiceCatgory(data) {
    return request({
        url: '/servcates',
        method: 'post',
        data
    });
}
export function updateServiceCatgory(data) {
    return request({
        url: '/servcates/' + data._id,
        method: 'put',
        data
    });
}
