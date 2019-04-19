// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import router from './router'
import {
    ToastPlugin,
    LoadingPlugin,
    WechatPlugin,
    AlertPlugin,
    ConfirmPlugin
} from 'vux'
import App from './App'
import store from './store/index.js'
import * as filters from './filters'

// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

// icon-font
import './assets/iconfont/iconfont.css'
import './assets/iconfont/iconfont.js'

Vue.use(VueRouter)
Vue.use(WechatPlugin)
// 引入VUX插件
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)

FastClick.attach(document.body)

Vue.config.productionTip = false

Vue.prototype.TDAPP = function(EventId, Label, MapKv) {
    try {
        window.TDAPP.onEvent(EventId, Label, MapKv)
    } catch (err) {
        console.log(err)
    }
}

/* eslint-disable no-new */
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

var onDeviceReady = () => {
    document.addEventListener(
        'jpush.receiveRegistrationId',
        event => {
            console.log(event)
            console.log(event.registrationId)
        },
        false
    )
    initiateUI()
}
var getRegistrationID = () => {
    window.JPush.getRegistrationID(onGetRegistrationID)
}
var onGetRegistrationID = data => {
    try {
        console.log('JPushPlugin:registrationID is: ', data)
        if (data.length === 0) {
            var t1 = window.setTimeout(getRegistrationID, 1000)
            console.log(t1)
        }
        console.log(data)
    } catch (exception) {
        console.log(exception)
    }
}
var onOpenNotification = event => {
    try {
        let alertContent
        if (window.device.platform === 'Android') {
            alertContent = event.alert
        } else {
            alertContent = event.aps.alert
        }
        console.log('open Notification event: ')
        console.log(event)
        console.log('open Notification: ', alertContent)

        if (event && event.extras) {
            const type = event.extras.type
            console.log('type = ', type)
            if (type === 'COUPON_REMINDER' || type === 'ORDER_REMINDER') {
                router.push({ path: '/msglist' })
            }
        }
    } catch (exception) {
        console.log('JPushPlugin:onOpenNotification', exception)
    }
}
var onReceiveNotification = event => {
    try {
        let alertContent
        if (window.device.platform === 'Android') {
            alertContent = event.alert
        } else {
            alertContent = event.aps.alert
        }
        console.log('receive Notification event: ')
        console.log(event)
        console.log('receive Notification: ', alertContent)
    } catch (exception) {
        console.log(exception)
    }
}

var onReceiveMessage = event => {
    try {
        let message
        if (window.device.platform === 'Android') {
            message = event.message
        } else {
            message = event.content
        }
        console.log('receive Message event: ')
        console.log(event)
        console.log('receive Message = ', message)
        // $("#messageResult").html(message);
    } catch (exception) {
        console.log('JPushPlugin:onReceiveMessage', exception)
    }
}

var initiateUI = () => {
    try {
        window.JPush.init()
        window.JPush.setDebugMode(true)
        window.setTimeout(getRegistrationID, 1000)
        // window.JPush.setBadge(+1)
        if (window.device.platform !== 'Android') {
            window.JPush.setApplicationIconBadgeNumber(0)
        }
    } catch (exception) {
        console.log(exception)
    }
}

document.addEventListener('deviceready', onDeviceReady, false)
document.addEventListener('jpush.openNotification', onOpenNotification, false)
document.addEventListener(
    'jpush.receiveNotification',
    onReceiveNotification,
    false
)
document.addEventListener('jpush.receiveMessage', onReceiveMessage, false)
