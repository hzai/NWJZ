/*
 * @Author: Roy Chen
 * @Date: 2019-04-01 21:14:49
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-09 21:49:13
 */

import express from 'express';
import expressJwt from 'express-jwt';
import insuranceCtrl from '../../controllers/insurance/insurance.controller';
import insCompanyCtrl from '../../controllers/inscompany.controller';
import config from '../../../config/config';
import roles from '../../helpers/roles';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'payload'
});

router
    .route('/')
    .get(
        authRequired,
        roles(['admin', 'company', 'editor']),
        insuranceCtrl.getInsurances
    )
    .post(
        authRequired,
        roles(['admin', 'company', 'editor']),
        insuranceCtrl.create
    );

router
    .route('/:insId')
    .put(
        authRequired,
        roles(['admin', 'company', 'editor']),
        insuranceCtrl.update
    )
    .delete(
        authRequired,
        roles(['admin', 'company', 'editor']),
        insuranceCtrl.remove
    );

router
    .route('/company')
    .post(
        authRequired,
        roles(['admin', 'company', 'editor']),
        insCompanyCtrl.create
    )
    .get(
        authRequired,
        roles(['admin', 'company', 'editor']),
        insCompanyCtrl.getInsCompanys
    );
router
    .route('/worker/:workerId')
    .get(
        authRequired,
        roles(['admin', 'company', 'editor']),
        insuranceCtrl.getWorkerInsurances
    );

router
    .route('/company/:inscomId')
    .put(
        authRequired,
        roles(['admin', 'company', 'editor']),
        insCompanyCtrl.update
    );

router.param('insId', insuranceCtrl.load);

router.param('inscomId', (req, res, next, inscomId) => {
    req.inscomId = inscomId;
    return next();
});
router.param('workerId', (req, res, next, workerId) => {
    req.workerId = workerId;
    return next();
});

export default router;
