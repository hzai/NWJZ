/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 00:44:25
 * @Last Modified by: Arnie Carter
 * @Last Modified time: 2018-09-20 21:30:52
 */
import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import orderCtrl from '../controllers/order.controller';
import appointmentsCtrl from '../controllers/appointment.controller';
import paymentCtrl from '../controllers/payment.controller';

import config from '../../config/config';
import roles from '../helpers/roles';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'payload'
});

router.route('/')
    .get(authRequired, roles(['admin', 'editor']), orderCtrl.list)
    .post(authRequired, orderCtrl.create);

router.route('/buycardpay')
    .post(authRequired, paymentCtrl.buyCardPay);

router.route('/createandpay')
    .post(authRequired, paymentCtrl.createAndPay);
router.route('/createandnopay')
    .post(authRequired, paymentCtrl.createAndNoPay);
router.route('/createeventorder')
    .post(authRequired, paymentCtrl.createEventOrder);
router.route('/createuserorder/user/:userId')
    .post(authRequired, roles(['admin', 'editor']), orderCtrl.createUserOrder);

router.route('/mine')
    .get(authRequired, orderCtrl.getMyOrderList);
router.route('/user/:userId')
    .get(authRequired, roles(['admin', 'editor']), orderCtrl.getOrderListByUser);

router.route('/appointments')
    .get(authRequired, orderCtrl.getMyAppointments);
router.route('/unappointments')
    .get(authRequired, orderCtrl.getMyUnAppointments);
router.route('/appointments/:apmId')
    .get(authRequired, appointmentsCtrl.get);

router.route('/:orderId')
    .get(authRequired, orderCtrl.get)
    .put(authRequired, orderCtrl.update)
    .delete(authRequired, roles(['admin', 'editor']), orderCtrl.remove);

// pay the order
router.route('/:orderId/pay')
    .put(authRequired, orderCtrl.payOrder);
// update order status
router.route('/:orderId/status/:status')
    .put(authRequired, orderCtrl.updateStatus);

router.route('/:orderId/preapm')
    .get(authRequired, roles(['admin']), orderCtrl.getPreApmByOrderId);

    router.route('/:orderId/apm')
    .get(authRequired, roles(['admin']), orderCtrl.getApmByOrderId);

router.param('orderId', orderCtrl.load);

router.param('status', (req, res, next, status) => {
    req.order_status = status;
    return next();
});
router.param('userId', (req, res, next, userId) => {
    req.userId = userId;
    return next();
});

export default router;
