/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 00:44:25
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-06-20 17:02:45
 */
import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import commentCtrl from '../controllers/comment.controller';

import config from '../../config/config';
import roles from '../helpers/roles';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'payload'
});

router.route('/')
    .get(authRequired, commentCtrl.list)
    .post(authRequired, commentCtrl.create);

router.route('/:commentId')
    .get(authRequired, commentCtrl.get)
    .put(authRequired, commentCtrl.update)
    .delete(authRequired, commentCtrl.remove);

router.route('/service/:serviceId')
    .get(commentCtrl.getCommentByService);

/** Load user when API with serviceId route parameter is hit */
router.param('commentId', commentCtrl.load);

router.param('serviceId', (req, res, next, serviceId) => {
    req.serviceId = serviceId;
    return next();
});
export default router;
