/*
 * @Author: Roy Chen
 * @Date: 2017-12-19 21:19:02
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-12 23:34:49
 */

import request from '@/utils/request';

export function fetchWorkerComms(_id) {
    return request({
        url: '/comms/worker/' + _id,
        method: 'get'
    });
}

export function fetchEmployerComms(_id) {
    return request({
        url: '/comms/employer/' + _id,
        method: 'get'
    });
}

export function addComm(data) {
    return request({
        url: '/comms',
        method: 'post',
        data
    });
}

export function updateComm(id, data) {
    return request({
        url: `/comms/${id}`,
        method: 'put',
        data
    });
}

export function deleteComm(id) {
    return request({
        url: `/comms/${id}`,
        method: 'delete'
    });
}
