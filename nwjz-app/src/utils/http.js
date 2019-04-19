/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 17:01:10
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-01-25 22:26:46
 */
import axios from 'axios'
import qs from 'qs'
import types from '../store/mutation-types'
import { getStore, removeStore } from './mUtils'

const baseURL = process.env.BASE_API

axios.interceptors.request.use(config => {
    // loading
    return config
}, error => {
    return Promise.reject(error)
})

axios.interceptors.response.use(response => {
    return response
}, error => {
    return Promise.resolve(error.response)
})

function checkStatus(response) {
    // loading
    // 如果http状态码正常，则直接返回数据
    if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
        return response.data
            // 如果不需要除了data之外的数据，可以直接 return response.data
    }
    if (response && response.status === 401) {
        removeStore(types.TOKEN)
    }
    // 异常状态下，把错误信息返回去
    return {
        status: response.status,
        msg: response
    }
}

function checkCode(res) {
    // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
    if (res && res.status === -404) {
        console.log(res.message)
    }
    if (res && res.data && (res.status !== 0)) {
        console.log(res.message)
    }
    return res
}

export default {
    delete(url, data) {
        return axios({
            method: 'delete',
            baseURL: baseURL,
            url,
            data: qs.stringify(data),
            timeout: 10000,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': 'bearer ' + getStore(types.TOKEN)
            }
        }).then(
            (response) => {
                return checkStatus(response)
            }
        ).then(
            (res) => {
                return checkCode(res)
            }
        )
    },
    put(url, data) {
        return axios({
            method: 'put',
            baseURL: baseURL,
            url,
            data: qs.stringify(data),
            timeout: 10000,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': 'bearer ' + getStore(types.TOKEN)
            }
        }).then(
            (response) => {
                return checkStatus(response)
            }
        ).then(
            (res) => {
                return checkCode(res)
            }
        )
    },
    post(url, data) {
        return axios({
            method: 'post',
            baseURL: baseURL,
            url,
            data: qs.stringify(data),
            timeout: 10000,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': 'bearer ' + getStore(types.TOKEN)
            }
        }).then(
            (response) => {
                return checkStatus(response)
            }
        ).then(
            (res) => {
                return checkCode(res)
            }
        )
    },
    get(url, params) {
        return axios({
            method: 'get',
            baseURL: baseURL,
            url,
            params, // get 请求时带的参数
            timeout: 10000,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': 'bearer ' + getStore(types.TOKEN)
            }
        }).then(
            (response) => {
                return checkStatus(response)
            }
        ).then(
            (res) => {
                return checkCode(res)
            }
        )
    }
}
