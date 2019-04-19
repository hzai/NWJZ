/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 00:44:25
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-03-26 20:41:52
 */
import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import messageCtrl from '../controllers/message.controller';

import config from '../../config/config';
import roles from '../helpers/roles';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'payload'
});

router.route('/')
    .post(authRequired, messageCtrl.create);

router.route('/:messageId')
    .get(authRequired, messageCtrl.get)
    .put(authRequired, messageCtrl.update)
    .delete(authRequired, messageCtrl.remove);

/** Load user when API with serviceId route parameter is hit */
router.param('messageId', messageCtrl.load);

export default router;
