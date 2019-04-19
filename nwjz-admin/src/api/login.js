/*
 * @Author: Roy Chen
 * @Date: 2019-04-02 23:42:09
 * @Last Modified by:   Roy Chen
 * @Last Modified time: 2019-04-02 23:42:09
 */
import request from '@/utils/request'

export function loginByUsername(username, password) {
    const data = {
        mobile: username,
        password: password
    }
    return request({
        url: '/auth/login',
        method: 'post',
        data
    })
}

export function logout() {
    return request({
        url: '/login/logout',
        method: 'post'
    })
}

export function getUserInfo(token) {
    return request({
        url: '/users/me',
        method: 'get'
    })
}
