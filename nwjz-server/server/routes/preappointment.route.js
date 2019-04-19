/*
 * @Author: Arnie Carter
 * @Date: 2018-01-10 21:31:22
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-07-09 18:20:00
 */


import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import preappointmentCtrl from '../controllers/preappointment.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
  secret: config.jwtSecret,
  userProperty: 'payload'
});

router.route('/')
  .get(authRequired, preappointmentCtrl.list);

router.route('/:preapmId')
  .get(authRequired, preappointmentCtrl.get)
  .put(authRequired, preappointmentCtrl.createAppointment);

router.route('/:preapmId/allocate')
  .put(authRequired, preappointmentCtrl.allocateAppointment);

/** Load user when API with serviceId route parameter is hit */
router.param('preapmId', preappointmentCtrl.load);

export default router;
