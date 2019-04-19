/*
 * @Author: Roy Chen
 * @Date: 2017-12-19 21:19:02
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-03-10 11:43:15
 */

import request from '@/utils/request';

export function fetchContract(_id) {
    return request({
        url: '/contracts/' + _id,
        method: 'get'
    });
}

export function fetchContractList(query) {
    return request({
        url: '/contracts',
        method: 'get',
        params: query
    });
}

export function getContractListByEmployer(employerId) {
    return request({
        url: '/contracts/employer/' + employerId,
        method: 'get'
    });
}

export function createContract(data) {
    return request({
        url: '/contracts',
        method: 'post',
        data
    });
}

export function updateContract(_id, data) {
    return request({
        url: '/contracts/' + _id,
        method: 'put',
        data
    });
}

export function updateWorkerRecord(_id, data) {
    return request({
        url: '/contracts/' + _id + '/wr',
        method: 'put',
        data
    });
}
export function updateReviewRecord(_id, data) {
    return request({
        url: '/contracts/' + _id + '/rr',
        method: 'put',
        data
    });
}
