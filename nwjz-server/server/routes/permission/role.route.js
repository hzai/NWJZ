/*
 * @Author: Roy Chen
 * @Date: 2019-04-01 21:14:49
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-06 03:15:31
 */

import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../../config/param-validation';
import roleCtl from '../../controllers/permission/role.controller';
import menuCtl from '../../controllers/permission/menu.controller';
import config from '../../../config/config';
import roles from '../../helpers/roles';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'payload'
});

router
    .route('/')
    .get(authRequired, roleCtl.getRoles)
    .post(authRequired, roles(['admin']), roleCtl.create);

router.route('/routes').post(authRequired, menuCtl.getRoutes);

router
    .route('/:roleId')
    .put(authRequired, roles(['admin']), roleCtl.update)
    .delete(authRequired, roles(['admin']), roleCtl.remove);

router.param('roleId', roleCtl.load);

export default router;
