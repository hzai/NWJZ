/*
 * @Author: Roy Chen
 * @Date: 2017-12-19 21:19:02
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-28 14:33:44
 */

import request from '@/utils/request';

export function statisticsWorker() {
    return request({
        url: '/workers/statistics',
        method: 'get'
    });
}

export function fetchWorker(_id) {
    return request({
        url: '/workers/' + _id,
        method: 'get'
    });
}

export function fetchWorkerList(query) {
    return request({
        url: '/workers',
        method: 'get',
        params: query
    });
}

export function fetchWorkerServiceList(query) {
    return request({
        url: '/workers/services',
        method: 'get',
        params: query
    });
}

export function createWorker(data) {
    return request({
        url: '/workers',
        method: 'post',
        data
    });
}

export function updateWorker(_id, data) {
    return request({
        url: '/workers/' + _id,
        method: 'put',
        data
    });
}

export function statWorker() {
    return request({
        url: '/workers/stat',
        method: 'get'
    });
}

export function fetchWorkerCommentList(workerId, query) {
    return request({
        url: '/workers/' + workerId + '/comment/',
        method: 'get',
        params: query
    });
}
export function fetchWorkerComment(workerId, _id) {
    return request({
        url: '/workers/' + workerId + '/comment/' + _id,
        method: 'get'
    });
}
export function createWorkerComment(data) {
    return request({
        url: '/workers/' + data.worker + '/comment/',
        method: 'post',
        data
    });
}

export function updateWorkerComment(data) {
    return request({
        url: '/workers/' + data.worker + '/comment/' + data._id,
        method: 'put',
        data
    });
}
export function deleteWorkerComment(data) {
    return request({
        url: '/workers/' + data.worker + '/comment/' + data._id,
        method: 'delete',
        data
    });
}
