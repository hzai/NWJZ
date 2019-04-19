/*
 * @Author: Roy Chen
 * @Date: 2018-01-12 17:31:49
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-01-12 19:07:27
 */

import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import smsCtrl from '../controllers/sms.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/register')
  .post(smsCtrl.sendRegisterSMS);
  
export default router;