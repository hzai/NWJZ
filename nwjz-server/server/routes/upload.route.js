/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 00:44:25
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-05-24 13:45:06
 */
import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import config from '../../config/config';
import roles from '../helpers/roles';
import uploadCtrl from '../controllers/upload.controller';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'payload'
});

router.route('/addimg')
    .post(uploadCtrl.uploadImg);

router.route('/addimg/qn')
    .post(uploadCtrl.uploadImgByQiniu);

export default router;
