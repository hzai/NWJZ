import request from '@/utils/request';

export function login(data) {
    return request({
        url: '/auth/login',
        method: 'post',
        data
    });
}

export function getInfo(token) {
    return request({
        url: '/users/me',
        method: 'get'
    });
}

export function logout() {
    return request({
        url: '/auth/logout',
        method: 'post'
    });
}
export function fetchMemberList(query) {
    return request({
        url: '/users/members',
        method: 'get',
        params: query
    });
}

export function fetchUserList(query) {
    return request({
        url: '/users/system',
        method: 'get',
        params: query
    });
}

export function fetchUserOrderList(_id, query) {
    return request({
        url: '/orders/user/' + _id,
        method: 'get',
        params: query
    });
}

export function fetchMember(_id) {
    return request({
        url: '/users/' + _id,
        method: 'get'
    });
}
export function updateMember(data) {
    return request({
        url: '/users/' + data._id,
        method: 'put',
        data
    });
}

export function createUser(data) {
    return request({
        url: '/users/system',
        method: 'post',
        data
    });
}

export function updateUser(data) {
    return request({
        url: '/users/system/' + data._id,
        method: 'put',
        data
    });
}

export function fetchCompanyUserList(query) {
    return request({
        url: '/users/company',
        method: 'get',
        params: query
    });
}

export function createCompanyUser(data) {
    return request({
        url: '/users/company',
        method: 'post',
        data
    });
}

export function updateCompanyUser(data) {
    return request({
        url: '/users/company/' + data._id,
        method: 'put',
        data
    });
}
