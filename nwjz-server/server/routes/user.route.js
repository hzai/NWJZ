/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 00:44:25
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-20 16:14:36
 */
import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import userCtrl from '../controllers/user.controller';
import userCouponCtrl from '../controllers/usercoupon.controller';
import userCardCtrl from '../controllers/usercard.controller';
import messageCtrl from '../controllers/message.controller';
import config from '../../config/config';
import roles from '../helpers/roles';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'payload'
});

router
    .route('/')
    /** GET /api/users - Get list of users */
    .get(authRequired, roles('admin'), userCtrl.list)
    // .get(userCtrl.list);
    /** POST /api/users - Create new user */
    .post(authRequired, userCtrl.create);

router
    .route('/memberxcx')
    .get(authRequired, roles('admin'), userCtrl.getMembersXcx);

router
    .route('/members')
    /** GET /api/users - Get list of users */
    .get(authRequired, roles('admin'), userCtrl.getMembers);

// -------------------------------  system ----------------------------------
router
    .route('/system')
    /** GET /api/users - Get list of users */
    .get(authRequired, roles('admin'), userCtrl.getSystemUsers)
    .post(authRequired, roles('admin'), userCtrl.createSystemUser);
router
    .route('/system/:userId')
    .put(authRequired, roles('admin'), userCtrl.updateSystemUser);
// -------------------------------  system ----------------------------------

// -------------------------------  company ----------------------------------
router
    .route('/company')
    /** GET /api/users - Get list of users */
    .get(authRequired, roles('admin'), userCtrl.getCompanyUsers)
    .post(authRequired, roles('admin'), userCtrl.createCompanyUser);
router
    .route('/company/:userId')
    .put(authRequired, roles('admin'), userCtrl.updateCompanyUser);
// -------------------------------  company ----------------------------------

router.route('/me').get(authRequired, userCtrl.me);

router
    .route('/coupons')
    .get(authRequired, userCouponCtrl.getMyCouponList)
    .post(authRequired, userCouponCtrl.create);

router
    .route('/cards')
    .get(authRequired, userCardCtrl.getMyCardList)
    .post(authRequired, userCardCtrl.activeAndChargeCard);

router.route('/invited').get(authRequired, userCtrl.getMyInviteList);

router.route('/inviter/:inviterId/:eventId').get(userCtrl.getInviteInfo);

router.route('/msgs').get(authRequired, messageCtrl.list);

router
    .route('/couponbycode')
    .post(authRequired, userCouponCtrl.getCouponFromCouponCode);

router
    .route('/:userId')
    /** GET /api/users/:userId - Get user */
    .get(authRequired, roles('admin'), userCtrl.get)
    /** POST /api/users/:userId - Update user */
    .put(
        authRequired,
        roles('user'),
        validate(paramValidation.updateUser),
        userCtrl.update
    )
    /** DELETE /api/users/:userId - Delete user */
    .delete(authRequired, roles('admin'), userCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

router.param('inviterId', (req, res, next, inviterId) => {
    req.inviterId = inviterId;
    return next();
});
router.param('eventId', (req, res, next, eventId) => {
    req.eventId = eventId;
    return next();
});

export default router;
