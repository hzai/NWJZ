/*
 * @Author: Roy Chen
 * @Date: 2019-04-03 13:27:59
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-03 20:58:08
 */
import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import errorLog from './modules/errorLog';
import permission from './modules/permission';
import tagsView from './modules/tagsView';
import settings from './modules/settings';
import user from './modules/user';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        app,
        errorLog,
        permission,
        tagsView,
        settings,
        user
    },
    getters
});

export default store;
