/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 00:44:25
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-21 14:18:12
 */
import express from 'express';
import expressJwt from 'express-jwt';
import workerCtrl from '../controllers/worker.controller';
import workerServiceCtrl from '../controllers/worker.service.controller';
import config from '../../config/config';
import roles from '../helpers/roles';

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
        workerCtrl.getWorkers
    )
    .post(
        authRequired,
        roles(['admin', 'company', 'editor']),
        workerCtrl.create
    );

router
    .route('/statistics')
    .get(authRequired, workerServiceCtrl.workerCountStatistics);

router
    .route('/free')
    .get(
        authRequired,
        roles(['admin', 'company', 'editor']),
        workerCtrl.getFreeWorkers
    );

router
    .route('/stat')
    .get(
        authRequired,
        roles(['admin', 'company', 'editor']),
        workerCtrl.statWorkerStatus
    );

router
    .route('/services')
    .get(
        authRequired,
        roles(['admin', 'company', 'editor']),
        workerServiceCtrl.getListByCompany
    );

router
    .route('/:workerId')
    .get(workerCtrl.get)
    .put(authRequired, roles(['admin', 'company', 'editor']), workerCtrl.update)
    .delete(
        authRequired,
        roles(['admin', 'company', 'editor']),
        workerCtrl.remove
    );

router.param('workerId', workerCtrl.load);

export default router;
