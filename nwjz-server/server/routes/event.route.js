/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 00:44:25
 * @Last Modified by: Arnie Carter
 * @Last Modified time: 2018-07-08 19:16:19
 */
import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import eventCtrl from '../controllers/event.controller';
import config from '../../config/config';
import roles from '../helpers/roles';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'payload'
});

router
    .route('/')
    .get(authRequired, roles(['admin', 'editor']), eventCtrl.list)
    .post(authRequired, roles(['admin', 'editor']), eventCtrl.create);

router.route('/log')
    .post(authRequired, eventCtrl.callLog);

router.route('/success/:serviceId').get(authRequired, eventCtrl.checkUserEvent);

router.route('/xcx').get(authRequired, eventCtrl.fetchInviteListForXcx);

router
    .route('/:eventId')
    .get(eventCtrl.get)
    .put(authRequired, roles(['admin', 'editor']), eventCtrl.update)
    .delete(authRequired, roles(['admin', 'editor']), eventCtrl.remove);

// 登录状态获为他人助力
router.route('/:eventId/assist/:inviterId').post(authRequired, eventCtrl.eventAssist);

// 获取邀请人的列表
router.route('/:eventId/invitelist/:inviterId').get(eventCtrl.getInviteList);


/** Load user when API with serviceId route parameter is hit */
router.param('eventId', eventCtrl.load);

router.param('inviterId', (req, res, next, inviterId) => {
    req.inviterId = inviterId;
    return next();
});

router.param('serviceId', (req, res, next, serviceId) => {
    req.serviceId = serviceId;
    return next();
});

export default router;
