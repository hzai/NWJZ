/*
 * @Author: Arnie Carter 
 * @Date: 2018-01-03 18:40:07 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-01-03 21:20:16
 */

import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import feedbackCtrl from '../controllers/feedback.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
  secret: config.jwtSecret,
  userProperty: 'payload'
});

router.route('/')
  .get(feedbackCtrl.list)
  .post(validate(paramValidation.createFeedback), feedbackCtrl.create);

router.route('/:feedbackId')
  .get(feedbackCtrl.get)
  .put(authRequired, feedbackCtrl.updateStatus)
  .delete(authRequired, feedbackCtrl.remove);


/** Load user when API with serviceId route parameter is hit */
router.param('feedbackId', feedbackCtrl.load);

export default router;
