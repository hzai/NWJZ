/*
 * @Author: Roy Chen
 * @Date: 2019-04-01 21:14:49
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-20 14:28:18
 */

import express from 'express';
import expressJwt from 'express-jwt';
import companyCtrl from '../../controllers/company/company.controller';
import config from '../../../config/config';
import roles from '../../helpers/roles';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'payload'
});

router
    .route('/')
    .get(authRequired, roles(['admin']), companyCtrl.getCompanys)
    .post(authRequired, roles(['admin']), companyCtrl.create);

router
    .route('/:companyId')
    .get(authRequired, roles(['admin']), companyCtrl.get)
    .put(authRequired, roles(['admin']), companyCtrl.update)
    .delete(authRequired, roles(['admin']), companyCtrl.remove);

router.param('companyId', companyCtrl.load);

export default router;
