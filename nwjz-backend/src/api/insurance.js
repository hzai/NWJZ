/*
 * @Author: Roy Chen
 * @Date: 2017-12-19 21:19:02
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-09 20:32:01
 */

import request from '@/utils/request';

export function fetchWorkerInsurances(_id) {
    return request({
        url: '/ins/worker/' + _id,
        method: 'get'
    });
}

export function addInsurance(data) {
    return request({
        url: '/ins',
        method: 'post',
        data
    });
}

export function updateInsurance(id, data) {
    return request({
        url: `/ins/${id}`,
        method: 'put',
        data
    });
}

export function deleteInsurance(id) {
    return request({
        url: `/ins/${id}`,
        method: 'delete'
    });
}
