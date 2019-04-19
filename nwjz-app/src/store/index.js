/**
 * vuex数据控制中心
 * */
import Vue from 'vue'
import Vuex from 'vuex'
import actions from './action'
import types from './mutation-types.js'
import vuexAlong from 'vuex-along'
import { setStore, removeStore } from 'utils/mUtils'

Vue.use(Vuex)

vuexAlong.watch(['localNum', 'userInfo', 'is_login'], true)

/**
 * 数据存储
 * */
const state = {
    page_title: '',
    is_not_first: true,
    animate_name: 'vux-pop-in',
    nav_index: 1,
    is_login: null, // 是否登录
    userInfo: null, // 用户信息,
    page_name_before_login: '',
    localNum: 0,
    sessionNum: 0
}

/**
 * 模块
 * */
const modules = {}

/**
 * 提交同步请求
 * */
const mutations = {
    addNumLocal(state, ad) {
        state.localNum++
    },
    [types.SET_PAGE_TITLE](state, title) {
        state.page_title = title
    },
    /* *全局判断是否是第一次进入*/
    [types.JUDGE_IS_NOT_FIRST](state, is_not_first) {
        state.is_not_first = is_not_first
        setStore('is_not_first', is_not_first)
    },
    /* *全局判断前进回退的动画*/
    [types.SET_ANIMATE_NAME](state, animate_name) {
        state.animate_name = animate_name
    },
    /* *判断菜单栏选择情况*/
    [types.SET_NAV_INDEX](state, nav_index) {
        state.nav_index = nav_index
    },
    // 记录用户信息
    [types.RECORD_USERINFO](state, info) {
        state.userInfo = info.auth.user
        state.is_login = true
        setStore(types.TOKEN, info.token)
    },
    // 记录openId
    [types.RECORD_OPEN_ID](state, openId) {
        setStore(types.WX_OPEN_ID, openId)
    },
    // 退出登录
    [types.LOGOUT](state) {
        state.userInfo = {}
        state.is_login = false
        removeStore(types.TOKEN)
        removeStore(types.WX_OPEN_ID)
    },
    // 保存登录前的页面
    [types.SET_PAGE_NAME_BEFORE_LOGIN](state, pageName) {
        state.page_name_before_login = pageName
    },
    // 获取用户信息存入vuex
    [types.GET_USERINFO](state, info) {
        // TODO
        console.log('GET_USERINFO info = ', info)
        console.log('GET_USERINFO state.userInfo = ', state.userInfo)
        console.log('GET_USERINFO state.is_login = ', state.is_login)
        if (info.status !== 0) {
            // no token or token failed then set state = null
            state.userInfo = null
            state.is_login = false
            removeStore(types.TOKEN)
            removeStore(types.WX_OPEN_ID)
            return
        }
        if (state.userInfo && state.userInfo._id !== info.data.user._id) {
            return
        }
        if (!state.is_login && info.data.user._id) {
            state.userInfo = { ...info.data.user }
            state.is_login = true
        }
        if (!state.is_login) {
            return
        }
        if (info.status === 0) {
            state.userInfo = { ...info.data.user }
            state.is_login = true
        } else {
            state.userInfo = null
        }
    }
}

export default new Vuex.Store({
    state,
    modules,
    actions,
    mutations,
    plugins: [vuexAlong]
})
