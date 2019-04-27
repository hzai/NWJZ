/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 00:44:25
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-27 10:55:12
 */
import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import contractCtrl from '../controllers/contract.controller';

import config from '../../config/config';
import roles from '../helpers/roles';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'payload'
});

router
    .route('/')
    .get(authRequired, contractCtrl.list)
    .post(authRequired, roles(['admin', 'company']), contractCtrl.create);

router
    .route('/employer/:employerId')
    .get(
        authRequired,
        roles(['admin', 'company']),
        contractCtrl.getContractListByEmployer
    );

router
    .route('/:contractId')
    .get(authRequired, contractCtrl.get)
    .put(authRequired, roles(['admin', 'company']), contractCtrl.update);

router
    .route('/:contractId/wr')
    .put(
        authRequired,
        roles(['admin', 'company']),
        contractCtrl.updateWorkerRecord
    );

router
    .route('/:contractId/rr')
    .put(
        authRequired,
        roles(['admin', 'company']),
        contractCtrl.updateReviewRecord
    );

router.param('employerId', (req, res, next, employerId) => {
    req.employerId = employerId;
    return next();
});

/** Load user when API with serviceId route parameter is hit */
router.param('contractId', contractCtrl.load);

export default router;
