/*
 * @Author: Roy Chen
 * @Date: 2019-04-01 21:14:49
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-13 23:44:08
 */

import express from 'express';
import expressJwt from 'express-jwt';
import communicationCtrl from '../../controllers/communication/communication.controller';
import config from '../../../config/config';
import roles from '../../helpers/roles';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'payload'
});

router
    .route('/')
    .post(
        authRequired,
        roles(['admin', 'company', 'editor']),
        communicationCtrl.create
    );

router
    .route('/:commId')
    .put(
        authRequired,
        roles(['admin', 'company', 'editor']),
        communicationCtrl.update
    )
    .delete(
        authRequired,
        roles(['admin', 'company', 'editor']),
        communicationCtrl.remove
    );

router
    .route('/worker/:workerId')
    .get(
        authRequired,
        roles(['admin', 'company', 'editor']),
        communicationCtrl.getWorkerComms
    );

router
    .route('/employer/:employerId')
    .get(
        authRequired,
        roles(['admin', 'company', 'editor']),
        communicationCtrl.getEmployerComms
    );

router.param('commId', communicationCtrl.load);

router.param('employerId', (req, res, next, employerId) => {
    req.employerId = employerId;
    return next();
});
router.param('workerId', (req, res, next, workerId) => {
    req.workerId = workerId;
    return next();
});

export default router;
