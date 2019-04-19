/*
 * @Author: Roy Chen
 * @Date: 2019-04-02 23:42:37
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-03 01:00:54
 */
import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: []
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
        state.introduction = introduction
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    }
}

const actions = {
    // user login
    login({ commit }, userInfo) {
        const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            login({ mobile: username.trim(), password: password })
                .then(response => {
                    const { data } = response.data
                    commit('SET_TOKEN', data.token)
                    setToken(data.token)
                    resolve()
                })
                .catch(error => {
                    reject(error)
                })
        })
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token)
                .then(response => {
                    const { data } = response.data
                    if (!data) {
                        reject('Verification failed, please Login again.')
                    }

                    const { roles, nickname, avatar } = data.user
                    // roles must be a non-empty array
                    if (!roles || roles.length <= 0) {
                        reject('getInfo: roles must be a non-null array!')
                    }

                    commit('SET_ROLES', roles)
                    commit('SET_NAME', nickname)
                    commit('SET_AVATAR', avatar)
                    commit('SET_INTRODUCTION', 'introduction')
                    resolve(data.user)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token)
                .then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    removeToken()
                    resetRouter()
                    resolve()
                })
                .catch(error => {
                    reject(error)
                })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            resolve()
        })
    },

    // Dynamically modify permissions
    changeRoles({ commit, dispatch }, role) {
        return new Promise(async resolve => {
            const token = role + '-token'

            commit('SET_TOKEN', token)
            setToken(token)

            const { roles } = await dispatch('getInfo')

            resetRouter()

            // generate accessible routes map based on roles
            const accessRoutes = await dispatch(
                'permission/generateRoutes',
                roles,
                { root: true }
            )

            // dynamically add accessible routes
            router.addRoutes(accessRoutes)

            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
