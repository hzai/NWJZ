/*
 * @Author: Arnie Carter
 * @Date: 2018-01-09 20:46:55
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-09-27 22:17:50
 */


import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import appointmentCtrl from '../controllers/appointment.controller';
import config from '../../config/config';
import roles from '../helpers/roles';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
  secret: config.jwtSecret,
  userProperty: 'payload'
});

router.route('/')
  .get(authRequired, appointmentCtrl.list);

router.route('/notallocated')
  .get(authRequired, appointmentCtrl.getNotAllocatedAppoinment);

router.route('/allocated')
  .get(authRequired, appointmentCtrl.getAllocatedAppoinment);

router.route('/xcxindex')
  .get(authRequired, appointmentCtrl.xcxIndexCount);

router.route('/company')
  .get(authRequired, appointmentCtrl.getAppoinmentsByCompany);

router.route('/:apmId')
  .get(authRequired, appointmentCtrl.get)
  .put(authRequired, roles(['admin','editor','company']), appointmentCtrl.update);

router.route('/:apmId/completeservice')
  .put(authRequired, roles(['admin','editor','company']), appointmentCtrl.completeService);

router.route('/:apmId/cancelservice')
  .put(authRequired, appointmentCtrl.cancelService);

  router.route('/:apmId/changetime')
  .put(authRequired, roles(['admin','editor','company']), appointmentCtrl.changeServiceTime);

router.route('/:apmId/status/:status')
    .put(authRequired, appointmentCtrl.updateStatus);

router.route('/:apmId/allocate')
    .put(authRequired, validate(paramValidation.allocateCompanyAndWorker), appointmentCtrl.allocateCompanyAndWorker);

router.route('/:apmId/cancelallocate')
    .put(authRequired, appointmentCtrl.cancelAllocateCompanyAndWorker);

router.param('status', (req, res, next, status) => {
      req.status = status;
      return next();
  });
/** Load user when API with serviceId route parameter is hit */
router.param('apmId', appointmentCtrl.load);

export default router;
