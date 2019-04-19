/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 00:34:27
 * @Last Modified by: Arnie Carter
 * @Last Modified time: 2018-09-19 20:37:32
 */
import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import authCtrl from '../controllers/auth.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/register */
router.route('/register').post(validate(paramValidation.register), authCtrl.register);

router.route('/login').post(validate(paramValidation.login), authCtrl.login);

/**
 * 手机号码登录
 */
router.route('/login/mobile').post(validate(paramValidation.loginByMobile), authCtrl.loginByMobile);
/**
 * 微信登录
 */
router.route('/login/wechat').post(validate(paramValidation.loginByWechat), authCtrl.loginByWechat);

router.route('/logout').post(authCtrl.logout);

/**
 * 微信公众号授权登录（获取是否关注公众号）
 */
router.route('/mp').post(authCtrl.wechatAuthorizeByMP);

/**
 * 微信APP授权登录
 */
router.route('/wx').post(authCtrl.wechatAuthorizeByWX);

/** GET /api/auth/random-number - Protected route,
 * needs token returned by the above as header. Authorization: Bearer {token} */
router.route('/random-number').get(
    expressJwt({
        secret: config.jwtSecret
    }),
    authCtrl.getRandomNumber
);

export default router;
