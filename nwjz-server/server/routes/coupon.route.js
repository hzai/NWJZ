/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 00:44:25
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-10 19:42:51
 */
import express from 'express';
import expressJwt from 'express-jwt';
import couponCtrl from '../controllers/coupon.controller';
import userCouponCtrl from '../controllers/usercoupon.controller';

import config from '../../config/config';
import roles from '../helpers/roles';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'payload'
});

router
    .route('/')
    .get(authRequired, couponCtrl.list)
    .post(authRequired, roles(['admin', 'editor']), couponCtrl.create);

router.route('/scouponunlogin').get(couponCtrl.fetchServiceCouponUnLogin);

router.route('/scoupon').get(authRequired, couponCtrl.fetchServiceCoupon);

router
    .route('/:couponId')
    .get(authRequired, couponCtrl.get)
    .put(authRequired, roles(['admin', 'editor']), couponCtrl.update)
    .delete(authRequired, roles(['admin', 'editor']), couponCtrl.remove);

router.route('/user/:userId').get(authRequired, userCouponCtrl.getCouponByUser);

/** Load user when API with serviceId route parameter is hit */
router.param('couponId', couponCtrl.load);

router.param('userId', (req, res, next, userId) => {
    req.userId = userId;
    return next();
});

export default router;
