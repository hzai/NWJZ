

/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 00:44:25
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-08-20 16:02:49
 */
import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import orderCtrl from '../controllers/order.controller';
import statsCtrl from '../controllers/statistics.controller';

import config from '../../config/config';
import roles from '../helpers/roles';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'payload'
});


router.route('/order')
    .get(authRequired, statsCtrl.orderStatistics);
router.route('/dashboard')
    .get(authRequired, roles(['admin','editor']), statsCtrl.dashboardStatistics);

export default router;
