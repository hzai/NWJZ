/*
 * @Author: Roy Chen
 * @Date: 2017-12-19 21:19:02
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-20 13:51:46
 */

import request from '@/utils/request';

export function fetchCompany(_id) {
    return request({
        url: '/companys/' + _id,
        method: 'get'
    });
}

export function fetchCompanyList(query) {
    return request({
        url: '/companys',
        method: 'get',
        params: query
    });
}

export function createCompany(data) {
    return request({
        url: '/companys',
        method: 'post',
        data
    });
}

export function updateCompany(data) {
    return request({
        url: `/companys/${data._id}`,
        method: 'put',
        data
    });
}

export function deleteCompany(_id) {
    return request({
        url: `/companys/${_id}`,
        method: 'delete'
    });
}
