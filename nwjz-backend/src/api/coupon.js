/*
 * @Author: Roy Chen
 * @Date: 2017-12-19 21:19:02
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-10 19:45:25
 */

import request from '@/utils/request';

export function fetchCoupon(_id) {
    return request({
        url: '/coupons/' + _id,
        method: 'get'
    });
}

export function fetchCouponList(query) {
    return request({
        url: '/coupons',
        method: 'get',
        params: query
    });
}

export function createCoupon(data) {
    return request({
        url: '/coupons',
        method: 'post',
        data
    });
}

export function updateCoupon(data) {
    return request({
        url: '/coupons/' + data._id,
        method: 'put',
        data
    });
}

export function fetchUserCouponList(_id, query) {
    return request({
        url: '/coupons/user/' + _id,
        method: 'get',
        params: query
    });
}
