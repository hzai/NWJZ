/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 00:44:25
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-08-14 16:50:08
 */
import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import addressCtrl from '../controllers/address.controller';
import config from '../../config/config';
import roles from '../helpers/roles';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'payload'
});

router.route('/')
    .get(authRequired, addressCtrl.list)
    .post(authRequired, validate(paramValidation.createAddress), addressCtrl.create);

router.route('/default')
    .get(authRequired, addressCtrl.geiDefaultAddress);

router.route('/user/:userId')
    .get(authRequired, roles('admin'), addressCtrl.getUserAddress)
    .post(authRequired, roles('admin'), addressCtrl.createUserAddress);

router.route('/:addressId')
    .get(addressCtrl.get)
    .put(authRequired, validate(paramValidation.updateAddress), addressCtrl.update)
    .delete(authRequired, addressCtrl.remove);

/** Load user when API with serviceId route parameter is hit */
router.param('addressId', addressCtrl.load);

router.param('userId', (req, res, next, userId) => {
    req.userId = userId;
    return next();
});

export default router;
