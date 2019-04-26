/*
 * @Author: Roy Chen
 * @Date: 2017-12-19 21:19:02
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-27 00:19:52
 */

import request from '@/utils/request';

export function fetchFinanceRecords() {
    return request({
        url: '/fin',
        method: 'get'
    });
}
export function fetchFinanceTypes() {
    return request({
        url: '/fin/type',
        method: 'get'
    });
}

export function fetchWorkerFinanceRecords(_id) {
    return request({
        url: '/fin/worker/' + _id,
        method: 'get'
    });
}

export function addFinanceRecord(data) {
    return request({
        url: '/fin',
        method: 'post',
        data
    });
}

export function updateFinanceRecord(id, data) {
    return request({
        url: `/fin/${id}`,
        method: 'put',
        data
    });
}

export function addFinanceType(data) {
    return request({
        url: '/fin/type',
        method: 'post',
        data
    });
}

export function updateFinanceType(id, data) {
    return request({
        url: `/fin/type/${id}`,
        method: 'put',
        data
    });
}
export function deleteFinanceType(id) {
    return request({
        url: `/fin/type/${id}`,
        method: 'delete'
    });
}

export function deleteFinanceRecord(id) {
    return request({
        url: `/fin/${id}`,
        method: 'delete'
    });
}
