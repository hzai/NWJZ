/*
 * @Author: Roy Chen
 * @Date: 2017-12-28 23:02:11
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-06-01 04:02:51
 */

/* *全局判断前进回退的动画*/
const SET_PAGE_TITLE = 'SET_PAGE_TITLE'

const SET_ANIMATE_NAME = 'SET_ANIMATE_NAME'
    /* *判断菜单栏选择情况*/
const SET_NAV_INDEX = 'SET_NAV_INDEX'
    /* *判断是否是第一次进入应用*/
const JUDGE_IS_NOT_FIRST = 'JUDGE_IS_NOT_FIRST'
// TOKEN
const TOKEN = 'TOKEN'
// 微信openid
const WX_OPEN_ID = 'WX_OPEN_ID'

const RECORD_OPEN_ID = 'RECORD_OPEN_ID'
// 用户信息
const RECORD_USERINFO = 'RECORD_USERINFO'
// 退出登录
const LOGOUT = 'LOGOUT'
// 获取用户信息存入vuex
const GET_USERINFO = 'GET_USERINFO'
// 保存登录前的页面
const SET_PAGE_NAME_BEFORE_LOGIN = 'SET_PAGE_NAME_BEFORE_LOGIN'

export default {
    SET_PAGE_TITLE,
    SET_ANIMATE_NAME,
    SET_NAV_INDEX,
    JUDGE_IS_NOT_FIRST,
    TOKEN,
    RECORD_OPEN_ID,
    WX_OPEN_ID,
    RECORD_USERINFO,
    LOGOUT,
    GET_USERINFO,
    SET_PAGE_NAME_BEFORE_LOGIN
}
