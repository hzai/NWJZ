/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 00:44:25
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-29 15:34:54
 */
import express from 'express';
import expressJwt from 'express-jwt';
import employerCtrl from '../controllers/employer.controller';

import config from '../../config/config';
import roles from '../helpers/roles';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'payload'
});

router
    .route('/')
    .get(authRequired, employerCtrl.list)
    .post(
        authRequired,
        roles(['admin', 'company', 'company_admin', 'editor']),
        employerCtrl.create
    );

router
    .route('/stat')
    .get(
        authRequired,
        roles(['admin', 'company', 'company_admin', 'editor']),
        employerCtrl.statEmployerStatus
    );

router
    .route('/:employerId')
    .get(authRequired, employerCtrl.get)
    .put(
        authRequired,
        roles(['admin', 'company', 'company_admin', 'editor']),
        employerCtrl.update
    );

/** Load user when API with serviceId route parameter is hit */
router.param('employerId', employerCtrl.load);

export default router;
