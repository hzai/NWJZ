/*
 * @Author: Roy Chen
 * @Date: 2019-04-03 13:27:51
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-03 20:58:13
 */
const getters = {
    sidebar: state => state.app.sidebar,
    language: state => state.app.language,
    size: state => state.app.size,
    device: state => state.app.device,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    introduction: state => state.user.introduction,
    roles: state => state.user.roles,
    permission_routes: state => state.permission.routes,
    addRoutes: state => state.permission.addRoutes,
    errorLogs: state => state.errorLog.logs
};
export default getters;
