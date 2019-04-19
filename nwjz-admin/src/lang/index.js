/*
 * @Author: Roy Chen
 * @Date: 2019-04-02 21:53:13
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-02 21:54:22
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN' // element-ui lang
import enLocale from './en'
import zhLocale from './zh'

Vue.use(VueI18n)

const messages = {
    en: {
        ...enLocale,
        ...elementEnLocale
    },
    zh: {
        ...zhLocale,
        ...elementZhLocale
    }
}

const i18n = new VueI18n({
    // set locale
    // options: en | zh | es
    locale: Cookies.get('language') || 'zh',
    // set locale messages
    messages
})

export default i18n
