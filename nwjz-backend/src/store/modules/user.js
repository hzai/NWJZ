import { login, logout, getInfo } from '@/api/user';
import { getToken, setToken, removeToken } from '@/utils/auth';
import router, { resetRouter } from '@/router';

const state = {
    token: getToken(),
    name: '',
    company_name: '',
    avatar: '',
    introduction: '',
    roles: []
};

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token;
    },
    SET_INTRODUCTION: (state, introduction) => {
        state.introduction = introduction;
    },
    SET_NAME: (state, name) => {
        state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles;
    },
    SET_COMMPANY_NAME: (state, company_name) => {
        state.company_name = company_name;
    }
};

const actions = {
    login({ commit }, userInfo) {
        const { username, password } = userInfo;
        return new Promise((resolve, reject) => {
            login({ mobile: username.trim(), password: password })
                .then(response => {
                    const { data } = response.data;
                    commit('SET_TOKEN', data.token);
                    setToken(data.token);
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token)
                .then(response => {
                    const { data } = response.data;

                    if (!data) {
                        reject('Verification failed, please Login again.');
                    }

                    const { roles, name, avatar } = data.user;

                    // roles must be a non-empty array
                    if (!roles || roles.length <= 0) {
                        reject('getInfo: roles must be a non-null array!');
                    }

                    commit('SET_ROLES', roles);
                    commit('SET_NAME', name);
                    commit('SET_AVATAR', avatar);
                    commit('SET_INTRODUCTION', 'introduction');
                    commit('SET_COMMPANY_NAME', data.user.company.name);
                    resolve(data.user);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token)
                .then(() => {
                    commit('SET_TOKEN', '');
                    commit('SET_ROLES', []);
                    commit('SET_COMMPANY_NAME', '');
                    removeToken();
                    resetRouter();
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '');
            commit('SET_ROLES', []);
            removeToken();
            resolve();
        });
    },

    // Dynamically modify permissions
    changeRoles({ commit, dispatch }, role) {
        return new Promise(async resolve => {
            const token = role + '-token';

            commit('SET_TOKEN', token);
            setToken(token);

            const { roles } = await dispatch('getInfo');

            resetRouter();

            // generate accessible routes map based on roles
            const accessRoutes = await dispatch(
                'permission/generateRoutes',
                roles,
                { root: true }
            );

            // dynamically add accessible routes
            router.addRoutes(accessRoutes);

            resolve();
        });
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
