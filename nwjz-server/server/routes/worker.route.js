/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 00:44:25
 * @Last Modified by: Arnie Carter
 * @Last Modified time: 2019-05-08 07:26:13
 */
import express from 'express';
import expressJwt from 'express-jwt';
import workerCtrl from '../controllers/worker.controller';
import workerServiceCtrl from '../controllers/worker.service.controller';
import workerCommentCtrl from '../controllers/worker/worker.comment.controller';
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
    .route('/queryWorker')
    .get(
        authRequired,
        roles(['admin', 'company', 'editor']),
        workerCtrl.queryWorkers
    )
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

router
    .route('/:workerId/comment')
    .get(
        authRequired,
        roles(['admin', 'company', 'company_admin', 'editor']),
        workerCommentCtrl.getListByWorker
    )
    .post(
        authRequired,
        roles(['admin', 'company', 'company_admin', 'editor']),
        workerCommentCtrl.create
    );

router
    .route('/:workerId/comment/:commentId')
    .get(
        authRequired,
        roles(['admin', 'company', 'company_admin', 'editor']),
        workerCommentCtrl.get
    )
    .put(
        authRequired,
        roles(['admin', 'company', 'company_admin', 'editor']),
        workerCommentCtrl.update
    )
    .delete(
        authRequired,
        roles(['admin', 'company', 'company_admin', 'editor']),
        workerCommentCtrl.remove
    );

router.param('workerId', workerCtrl.load);
router.param('commentId', (req, res, next, commentId) => {
    req.commentId = commentId;
    return next();
});
export default router;
