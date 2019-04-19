/*
 * @Author: Roy Chen
 * @Date: 2017-12-19 21:19:02
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-10 11:38:04
 */

import request from '@/utils/request';

export function fetchUserAddress(userId, query) {
    return request({
        url: '/addresses/user/' + userId,
        method: 'get',
        params: query
    });
}

export function createUserAddress(userId, data) {
    return request({
        url: '/addresses/user/' + userId,
        method: 'post',
        data
    });
}
