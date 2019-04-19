/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 00:44:25
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-04-05 13:42:16
 */
import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import settingCtrl from '../controllers/setting.controller';

import config from '../../config/config';
import roles from '../helpers/roles';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'payload'
});

router.route('/userprotocol').get(settingCtrl.getUserProtocol);

router.route('/banners').get(settingCtrl.getBanners);

/** Load user when API with serviceId route parameter is hit */
router.param('settingId', settingCtrl.load);

export default router;
