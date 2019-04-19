/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 00:44:25
 * @Last Modified by: Arnie Carter
 * @Last Modified time: 2018-08-31 19:19:51
 */
import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import authCtrl from '../controllers/auth.controller';
import paymentCtrl from '../controllers/payment.controller';
import wechatCtrl from '../controllers/wechat.controller';
import config from '../../config/config';
import roles from '../helpers/roles';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'payload'
});

/**
 * 获取授权页面的URL地址
 */
router.route('/authorize/url').get(authCtrl.getWechatAuthorizeURL);

router.route('/authxcx').post(authCtrl.loginbyXCX);

/**
 * 获取授权页面的URL地址 - 静默模式
 */
router.route('/authorize/s/url').post(authCtrl.getWechatAuthorizeURL2);

/**
 * 静默模式 - 处理openid
 */
router.route('/mp/s/callback').get(authCtrl.handleSilenceCallback);

router.route('/xcxdecode').post(authCtrl.decodeData);

router.route('/app/pay').post(authRequired, roles('user'), paymentCtrl.getWechatAppPaymentParams);

router.route('/mp/pay').post(authRequired, roles('user'), paymentCtrl.getWechatMPPaymentParams);

router.route('/xcx/pay').post(authRequired, roles('user'), paymentCtrl.getWechatXcxPaymentParams);

router.route('/sign').post(wechatCtrl.getWechatSignPackage);

router.route('/xcx').post(wechatCtrl.getXcxOpenId);

router.route('/xcxcard').post(wechatCtrl.getXcxCardOpenId);

router.route('/xcxcard/pay').post(authRequired, roles('user'), paymentCtrl.getWechatXcxCardPaymentParams);

router.route('/authxcxcard').post(authCtrl.loginbyXCX);

export default router;
