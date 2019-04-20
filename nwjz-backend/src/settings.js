/*
 * @Author: Roy Chen
 * @Date: 2019-04-19 20:20:37
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-20 19:56:55
 */
module.exports = {
    title: '鸟窝家政管理系统',

    /**
     * @type {boolean} true | false
     * @description Whether show the settings right-panel
     */
    showSettings: false,

    /**
     * @type {boolean} true | false
     * @description Whether need tagsView
     */
    tagsView: false,

    /**
     * @type {boolean} true | false
     * @description Whether fix the header
     */
    fixedHeader: false,

    /**
     * @type {boolean} true | false
     * @description Whether show the logo in sidebar
     */
    sidebarLogo: false,

    /**
     * @type {string | array} 'production' | ['production', 'development']
     * @description Need show err logs component.
     * The default is only used in the production env
     * If you want to also use it in dev, you can pass ['production', 'development']
     */
    errorLog: 'production'
};
