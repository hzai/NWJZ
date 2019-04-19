/*
 * @Author: Roy Chen
 * @Date: 2017-12-29 22:12:55
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-06-29 22:16:12
 */
import { me } from 'utils/api'
import types from './mutation-types.js'

export default {
    async getUserInfo({ commit, state }) {
        const res = await me()
        console.log(
            'getUserInfo from database res = ',
            res
        ) // TODO
        this.commit(types.GET_USERINFO, res)
    },
    setPageTitle({ commit, state }, title) {
        // console.log('title= ', title)
        this.commit(types.SET_PAGE_TITLE, title)
    },
    sysncAddNum(c) {
        setTimeout(() => {
            c.commit('addNumLocal')
        }, 500)
    }
}
