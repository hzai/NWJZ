/*
 * @Author: Roy Chen 
 * @Date: 2017-12-13 00:44:25 
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-01-20 17:47:53
 */
import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import serviceCategoryCtrl from '../controllers/service.category.controller';
import config from '../../config/config';
import roles from '../helpers/roles';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'payload'
});

router.route('/')
    .get(authRequired, serviceCategoryCtrl.list)
    .post(authRequired, roles(['admin', 'editor']), serviceCategoryCtrl.create);

router.route('/active')
    .get(serviceCategoryCtrl.getActiveCategory);

router.route('/:catId')
    .get(serviceCategoryCtrl.get)
    .put(authRequired, roles(['admin', 'editor']), serviceCategoryCtrl.update)
    .delete(authRequired, roles(['admin', 'editor']), serviceCategoryCtrl.remove);

/** Load user when API with serviceId route parameter is hit */
router.param('catId', serviceCategoryCtrl.load);

export default router;
