/*
 * @Author: Arnie Carter
 * @Date: 2018-01-21 21:25:06
 * @Last Modified by: Arnie Carter
 * @Last Modified time: 2018-01-21 22:42:04
 */

import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import dashboardCtrl from '../controllers/dashboard.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
  secret: config.jwtSecret,
  userProperty: 'payload'
});

router.route('/')
  .get(authRequired, dashboardCtrl.editorDashboard);

export default router;
