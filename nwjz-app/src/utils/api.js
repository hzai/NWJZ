/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 16:35:02
 * @Last Modified by: Arnie Carter
 * @Last Modified time: 2018-09-20 21:35:30
 */
import http from './http'

/**
 * SMS
 */
export const sms = params => http.post('/sms/register', params)
/**
 * 注册
 */
export const register = params => http.post('/auth/register', params)

/**
 * 手机号码登录
 */
export const loginByMobile = params => http.post('/auth/login/mobile', params)

/**
 * 手机号码登录
 */
export const loginByWechat = params => http.post('/auth/login/wechat', params)

/**
 * 退出
 */
export const logout = () => http.post('/auth/logout')

/** 获取公众号授权URL */
export const wx_mp_authorize_url = () => http.get('/wechat/authorize/url')

/** 获取公众号授权URL - 静默 */
export const wx_mp_authorize_silence_url = params =>
    http.post('/wechat/authorize/s/url', params)

/** redirect */
export const redirect_silence_url = url => http.get(url)

/** 获取公众号授权用户资料 */
export const wx_mp_authorize = params => http.post('/auth/mp', params)

/** 获取微信APP授权用户资料 */
export const wx_app_authorize = params => http.post('/auth/wx', params)

/**
 * 获取自己用户的信息
 */
export const me = () => http.get('/users/me')

/**
 * 获取我邀请的用户
 * @param {*} params
 */
export const fetchMyInviteList = params => http.get('/users/invited', params)

/**
 * 获取邀请人的信息和被邀请人列表
 * @param {*} params
 */
export const fetchInviterInfo = params =>
    http.get('/users/inviter/' + params._id + '/' + params.eventId)

/**
 * 助力好友
 * @param {*} data
 */
export const assistEvent = data => http.post('/events/' + data.eventId + '/assist/' + data.inviterId, data)

/**
 * 助力好友
 * @param {*} data
 */
export const getInviteList = data => http.get('/events/' + data.eventId + '/invitelist/' + data.inviterId)

/**
 * 助力好友
 * @param {*} data
 */
export const callLog = data => http.post('/events/log/', data)
/**
 * 检查是否助力成功
 * @param {*} data
 */
export const checkUserEvent = _id => http.get('/events/success/' + _id)
/**
 * 获取用户的地址列表
 */
export const fetchAddressList = params => http.get('/addresses', params)

/**
 * 新建地址
 */
export const addAddress = data => http.post('/addresses', data)

/**
 * 更新地址
 */
export const updateAddress = data => http.put('/addresses/' + data._id, data)

/**
 * 删除地址
 */
export const deleteAddress = data => http.delete('/addresses/' + data._id, data)

/**
 * 获取打个地址
 */
export const fetchAddress = _id => http.get('/addresses/' + _id)
/**
 * 获取默认地址
 */
export const getDefaultAddress = () => http.get('/addresses/default')
/**
 * 获取服务类型
 */
export const fetchServiceCategory = () => http.get('/servcates/active')

/**
 * 获取首页信息列表
 * @param {*} params
 */
export const fetchHomePage = params => http.get('/services/home', params)

/**
 * 获取严选服务列表
 * @param {*} params
 */
export const getStrictServices = params => http.get('/services/strict', params)

/**
 * 获取单个服务
 * @param {*} _id
 */
export const fetchService = _id => http.get('/services/' + _id)

/**
 * 获取单个服务
 * @param {*} _id
 */
export const fetchLoginService = _id => http.get('/services/mp/' + _id)

/**
 * 获取单个服务byCategory
 * @param {*} category
 */
export const fetchServiceByCat = category =>
    http.get('/services/cat/' + category)

/**
 * 新增建议
 */
export const addFeedback = data => http.post('/feedback', data)
/**
 * 获取我的订单
 */
export const fetchOrderList = () => http.get('/orders/mine')
/**
 * 获取单个订单
 * @param {*} _id
 */
export const fetchOrder = _id => http.get('/orders/' + _id)
/**
 * 提交订单
 */
export const submitOrder = data => http.post('/orders', data)
/**
 * 提交订单并支付
 */
export const submitOrderAndPay = data => http.post('/orders/createandpay', data)
/**
 * 提交订单并购买保洁卡
 */
export const buyCardPay = data => http.post('/orders/buycardpay', data)
/**
 * 提交订单并支付 - 使用余额
 */
export const submitOrderAndNoPay = data => http.post('/orders/createandnopay', data)

/**
 * 助力活动-提交订单-创建预约服务
 * @param {*} data
 */
export const submitEventOrder = data => http.post('/orders/createeventorder', data)

/**
 * 支付订单
 */
export const payOrder = (_id, data) => http.put('/orders/' + _id + '/pay', data)
/**
 * 获取我的已预约服务
 */
export const fetchAppointmentList = () => http.get('/orders/appointments')
/**
 * 获取我的未已预约服务
 */
export const fetchUnAppointmentList = () => http.get('/orders/unappointments')
/**
 * 修改订单状态
 */
export const updateOrderStatus = (_id, status) =>
    http.put('/orders/' + _id + '/status/' + status)
/**
 * 获取单个我的服务
 * @param {*} _id
 */
export const fetchAppointment = _id => http.get('/appointments/' + _id)
/**
 * 修改服务状态
 */
export const updateAppointmentStatus = (_id, status) =>
    http.put('/appointments/' + _id + '/status/' + status)
/**
 * 获取未预约服务
 */
export const fetchPreAppointmentList = () => http.get('/preappointments')
/**
 * 获取单个未预约服务
 */
export const fetchPreAppointment = _id => http.get('/preappointments/' + _id)
/**
 * 预约服务
 */
export const createAppointment = data =>
    http.put('/preappointments/' + data.preappointment._id, data)
/**
 * 取消套餐的本次服务
 */
export const cancelService = data =>
    http.put('/appointments/' + data._id + '/cancelservice', data)
/**
 * 获取优惠卷
 */
export const fetchCoupon = params => http.get('/coupons', params)
/**
 * 领取优惠卷
 */
export const getCoupon = params => http.post('/users/coupons', params)
/**
 * 获取已领取的优惠卷
 */
export const fetchMyCoupon = params => http.get('/coupons/scoupon', params)

export const fetchCouponByService = params =>
    http.get('/coupons/scouponunlogin', params)
/**
 * 获取个人所有的优惠卷
 */
export const fetchAllMyCoupon = params => http.get('/users/coupons', params)
/**
 * 通过优惠卷码获取优惠卷
 */
export const getCouponFromCouponCode = params =>
    http.post('/users/couponbycode', params)

/**
 * 获取个人所有的保洁卡
 */
export const fetchAllMyCard = params => http.get('/users/cards', params)
/**
 * 通过保洁卡密码充值
 */
export const activeAndChargeCard = params => http.post('/users/cards', params)
/**
 * 微信APP支付
 * @param {*} params
 */
export const wechatAppPay = params => http.post('/wechat/app/pay', params)

/**
 * 微信APP支付
 * @param {*} params
 */
export const getWechatSign = params => http.post('/wechat/sign', params)

/**
 * 微信公众号支付
 * @param {*} params
 */
export const wechatMPPay = params => http.post('/wechat/mp/pay', params)

/**
 * 获取自己的消息
 */
export const getMessage = params => http.get('/users/msgs', params)

/**
 * 更新消息
 */
export const updateMessage = params => http.put('/msgs/' + params._id, params)
/**
 * 删除消息
 */
export const deleteMessage = data => http.delete('/msgs/' + data._id, data)

/**
 * 用户协议
 */
export const userProtocol = () => http.get('/setting/userprotocol')

/**
 * 广告轮播图
 */
export const banners = () => http.get('/setting/banners')

export const submitReserve = data => http.post('/reserves', data)

/**
 * 创建评论
 * @param {*} data
 */
export const submitComment = data => http.post('/comments', data)
/**
 * 获取评论 - service
 * @param {*} params
 */
export const fetchCommentByService = params =>
    http.get('/comments/service/' + params._id, params)
