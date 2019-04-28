/*
 * @Author: Roy Chen
 * @Date: 2019-04-27 16:27:40
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-28 12:46:44
 */

import request from '@/utils/request';

export function fetchDicts() {
    return request({
        url: '/dict',
        method: 'get'
    });
}
export function fetchDictsByCat(cat) {
    return request({
        url: '/dict/cat/' + cat,
        method: 'get',
        data: cat
    });
}
export function addDict(data) {
    return request({
        url: '/dict',
        method: 'post',
        data
    });
}

export function updateDict(id, data) {
    return request({
        url: `/dict/${id}`,
        method: 'put',
        data
    });
}

export function deleteDict(id) {
    return request({
        url: `/dict/${id}`,
        method: 'delete'
    });
}
