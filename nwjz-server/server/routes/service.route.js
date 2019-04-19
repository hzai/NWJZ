/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 00:44:25
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-07-05 14:59:55
 */
import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import serviceCtrl from '../controllers/service.controller';
import config from '../../config/config';
import roles from '../helpers/roles';
import serviceController from '../controllers/service.controller';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'payload'
});

router.route('/')
    .get(serviceCtrl.list)
    .post(authRequired, serviceCtrl.create);

router.route('/home')
    .get(serviceCtrl.getHomePage);

router.route('/strict')
    .get(serviceCtrl.getStrictSerivces);
router.route('/special')
    .get(serviceCtrl.getSpecialSerivces);
router.route('/include')
    .get(serviceCtrl.getIncludedSerivces);

router.route('/mp/:serviceId')
    .get(authRequired, serviceCtrl.getSubmitOrder);

router.route('/:serviceId')
    .get(serviceCtrl.get)
    .put(authRequired, roles('admin'), serviceCtrl.update)
    .delete(authRequired, roles('admin'), serviceCtrl.remove);

router.route('/cat/:category')
    .get(serviceCtrl.getSerivceByCat);

/** Load user when API with serviceId route parameter is hit */
router.param('serviceId', serviceCtrl.load);

router.param('category', (req, res, next, category) => {
    req.category = category;
    return next();
});

export default router;
