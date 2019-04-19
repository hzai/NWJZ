import Vue from 'vue'
import Router from 'vue-router'
import {
    setStore,
    getStore,
    removeStore
} from 'utils/mUtils'
// import { isWechat, isMobile } from 'utils/whatdevice'
import types from '../store/mutation-types.js'

Vue.use(Router)

const router = new Router({
    routes: [
        // 引导页
        {
            path: '/guide',
            name: 'guide',
            component: resolve => require(['../views/guide/Guide'], resolve), // 用这种方法引用组件可实现懒加载,
            meta: {
                status: 0,
                footerVisible: false,
                headerVisible: false,
                loginRequired: false
            }
        },
        // 首页
        {
            path: '/',
            name: '了了管家',
            component: resolve => require(['../views/home/Home'], resolve), // 用这种方法引用组件可实现懒加载,
            meta: {
                status: 1,
                footerVisible: true,
                headerVisible: true,
                loginRequired: false
            }
        },
        // 订单
        {
            path: '/order',
            name: '订单',
            component: resolve => require(['../views/order/Order'], resolve),
            meta: {
                status: 2,
                footerVisible: true,
                headerVisible: true,
                loginRequired: true
            }
        },
        // 我的
        {
            path: '/mine',
            name: '个人中心',
            component: resolve => require(['../views/mine/Mine'], resolve),
            meta: {
                status: 3,
                footerVisible: true,
                headerVisible: false,
                loginRequired: false
            }
        },
        // 登录
        {
            path: '/login',
            name: '登录',
            component: resolve => require(['../views/auth/Login'], resolve),
            meta: {
                status: 4,
                footerVisible: false,
                headerVisible: true,
                loginRequired: false
            }
        },
        {
            path: '/serdetail',
            name: '商品详情',
            component: resolve => require(['../views/servicedetail/ServiceDetail'], resolve),
            meta: {
                status: 5,
                footerVisible: false,
                headerVisible: true,
                loginRequired: false
            }
        },
        {
            path: '/submitorder',
            name: '提交订单',
            component: resolve => require(['views/servicedetail/SubmitOrder'], resolve),
            meta: {
                status: 6,
                footerVisible: false,
                headerVisible: true,
                loginRequired: true
            }
        },
        {
            path: '/addaddress',
            name: '添加地址',
            component: resolve => require(['views/servicedetail/AddAddress'], resolve),
            meta: {
                status: 7,
                footerVisible: false,
                headerVisible: true,
                loginRequired: true
            }
        },
        {
            path: '/modifyaddress',
            name: '编辑地址',
            component: resolve => require(['views/servicedetail/AddAddress'], resolve),
            meta: {
                status: 7,
                footerVisible: false,
                headerVisible: true,
                loginRequired: true
            }
        },
        {
            path: '/pay/payorder',
            name: '支付订单',
            component: resolve => require(['views/servicedetail/PayOrder'], resolve),
            meta: {
                status: 8,
                footerVisible: false,
                headerVisible: true,
                loginRequired: true
            }
        },
        {
            path: '/addresslist',
            name: '我的地址',
            component: resolve => require(['views/mine/AddressList'], resolve),
            meta: {
                status: 9,
                footerVisible: false,
                headerVisible: true,
                loginRequired: true
            }
        },
        {
            path: '/coupon',
            name: '我的优惠卷',
            component: resolve => require(['views/mine/Coupon'], resolve),
            meta: {
                status: 10,
                footerVisible: false,
                headerVisible: true,
                loginRequired: true
            }
        },
        {
            path: '/setting',
            name: '设置',
            component: resolve => require(['views/mine/Setting'], resolve),
            meta: {
                status: 11,
                footerVisible: false,
                headerVisible: true,
                loginRequired: false
            }
        },
        {
            path: '/orderdetail',
            name: '订单详情',
            component: resolve => require(['views/order/OrderDetail'], resolve),
            meta: {
                status: 12,
                footerVisible: false,
                headerVisible: true,
                loginRequired: true
            }
        },
        {
            path: '/about',
            name: '关于了了管家',
            component: resolve => require(['views/mine/about'], resolve),
            meta: {
                status: 13,
                footerVisible: false,
                headerVisible: true,
                loginRequired: false
            }
        },
        {
            path: '/feedback',
            name: '意见反馈',
            component: resolve => require(['views/mine/Feedback'], resolve),
            meta: {
                status: 14,
                footerVisible: false,
                headerVisible: true,
                loginRequired: false
            }
        },
        {
            path: '/apmdetail',
            name: '服务详情',
            component: resolve => require(['views/order/AppointmentDetail'], resolve),
            meta: {
                status: 15,
                footerVisible: false,
                headerVisible: true,
                loginRequired: false
            }
        },
        {
            path: '/preapmdetail',
            name: '未预约服务',
            component: resolve => require(['views/order/PreAppointmentDetail'], resolve),
            meta: {
                status: 16,
                footerVisible: false,
                headerVisible: true,
                loginRequired: true
            }
        },
        {
            path: '/msglist',
            name: '消息中心',
            component: resolve => require(['views/mine/MessageList'], resolve),
            meta: {
                status: 17,
                footerVisible: false,
                headerVisible: true,
                loginRequired: true
            }
        },
        {
            path: '/bindmobile',
            name: '绑定手机号',
            component: resolve => require(['views/auth/BindMobile'], resolve),
            meta: {
                status: 18,
                footerVisible: false,
                headerVisible: true,
                loginRequired: false
            }
        },
        {
            path: '/userprotocol',
            name: '用户协议',
            component: resolve => require(['views/auth/UserProtocol'], resolve),
            meta: {
                status: 19,
                footerVisible: false,
                headerVisible: true,
                loginRequired: false
            }
        },
        {
            path: '/selfpay',
            name: '自助缴费',
            component: resolve => require(['views/mine/SelfPay'], resolve),
            meta: {
                status: 20,
                footerVisible: false,
                headerVisible: true,
                loginRequired: true
            }
        },
        {
            path: '/submitres',
            name: '提交预约',
            component: resolve => require(['views/servicedetail/SubmitReserve'], resolve),
            meta: {
                status: 21,
                footerVisible: false,
                headerVisible: true,
                loginRequired: true
            }
        },
        // 评论
        {
            path: '/comment',
            name: '评价',
            component: resolve => require(['../views/order/Comment'], resolve),
            meta: {
                status: 22,
                footerVisible: false,
                headerVisible: true,
                loginRequired: true
            }
        },
        // 评论
        {
            path: '/commentlist',
            name: '服务评价',
            component: resolve => require(['../views/order/CommentList'], resolve),
            meta: {
                status: 23,
                footerVisible: false,
                headerVisible: true,
                loginRequired: false
            }
        },
        // 邀请页
        {
            path: '/invite',
            name: '邀请',
            component: resolve => require(['../views/mine/Invite'], resolve),
            meta: {
                status: 24,
                footerVisible: false,
                headerVisible: false,
                loginRequired: false
            }
        },
        // 邀请分享页
        {
            path: '/shareinvite',
            name: '邀请分享',
            component: resolve => require(['../views/mine/ShareInvite'], resolve),
            meta: {
                status: 25,
                footerVisible: false,
                headerVisible: false,
                loginRequired: false
            }
        },
        // 提交活动订单
        {
            path: '/submiteorder',
            name: '提交e订单',
            component: resolve => require(['../views/servicedetail/SubmitEventOrder'], resolve),
            meta: {
                status: 26,
                footerVisible: false,
                headerVisible: true,
                loginRequired: true
            }
        },
        {
            path: '/card',
            name: '我的保洁卡',
            component: resolve => require(['views/mine/Card'], resolve),
            meta: {
                status: 27,
                footerVisible: false,
                headerVisible: true,
                loginRequired: true
            }
        },
        {
            path: '/submitcardorder',
            name: '提交保洁卡订单',
            component: resolve => require(['views/servicedetail/SubmitCardOrder'], resolve),
            meta: {
                status: 28,
                footerVisible: false,
                headerVisible: true,
                loginRequired: true
            }
        }
    ]
})

/**
 * 判断用户是否第一次打开APP，是否启动引导页面
 * 设置路由之间的跳转动画
 * */
router.beforeEach((to, from, next) => {
    // const isMobileWechat = isWechat() && isMobile()
    const store = router.app.$store
    // const is_not_first = getStore('is_not_first')
    const token = getStore(types.TOKEN)
    // console.log('token = ', token)
    if (store) {
        if (from.meta.status > to.meta.status) {
            store.commit(types.SET_ANIMATE_NAME, 'vux-pop-out')
        } else {
            store.commit(types.SET_ANIMATE_NAME, 'vux-pop-in')
        }
        if (!token || token === '' || token === undefined) {
            store.commit(types.LOGOUT)
        }
    }
    // console.log(window.location.href.indexOf('?pathto='))
    // http:// localhost:8001/?pathto=shareinvite?inviter=5b0936b2ccc054167b797900
    // console.log('111')
    if (window.location.href.indexOf('?pathto=') !== -1) {
        const url = window.location.href.replace('#/', '').replace('?pathto=', '#/')
        console.log('222 = ', url)
        window.location.href = url
    }
    console.log('to', to.fullPath)
    console.log('from', from.fullPath)
    // 如果用户授权登录完成后，点击返回，跳回到绑定手机页面就跳转去主页。
    if (token !== null && to.fullPath.indexOf('/bindmobile') !== -1) {
        if (getStore('beforeLoginUrl').indexOf('shareinvite') !== -1) {
            next(getStore('beforeLoginUrl'))
            removeStore('beforeLoginUrl')
            return false
        } else {
            next('/')
            return false
        }
    }
    if ((!token || token === '' || token === undefined) && to.meta.loginRequired) {
        setStore('beforeLoginUrl', to.fullPath)
        console.log('route url', getStore('beforeLoginUrl'))
    //     store.commit(
    //         types.SET_PAGE_NAME_BEFORE_LOGIN,
    //         window.location.href.split('#')[1]
    //     )
    //     next('/login')
    // } else if (to.path === '/mine') {
    //     console.log(store)
    //     console.log(store.state)
    //     console.log(store.state.page_name_before_login)
    //     if (store.state.page_name_before_login !== undefined && store.state.page_name_before_login !== '') {
    //         const pageName = store.state.page_name_before_login
    //         console.log('pageName = ', pageName)
    //         store.commit(
    //             types.SET_PAGE_NAME_BEFORE_LOGIN,
    //             ''
    //         )
    //         window.location.replace(pageName)

    //         // next()
    //     } else {
    //         next()
    //     }

        next('/login')
        return false
    } else {
        next()
    }
})

export default router
