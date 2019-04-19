/*
 * @Author: Roy Chen
 * @Date: 2019-04-01 21:14:49
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-06 03:15:07
 */

import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../../config/param-validation';
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
    .get(authRequired, menuCtl.getMenus)
    .post(authRequired, roles(['admin']), menuCtl.create);

router
    .route('/:menuId')
    .put(authRequired, roles(['admin']), menuCtl.update)
    .delete(authRequired, roles(['admin']), menuCtl.remove);

router.param('menuId', menuCtl.load);

export default router;
