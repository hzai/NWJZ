/*
 * @Author: Roy Chen
 * @Date: 2019-04-01 21:14:49
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-27 00:21:57
 */

import express from 'express';
import expressJwt from 'express-jwt';
import financeCtrl from '../../controllers/finance/finance.controller';
import config from '../../../config/config';
import roles from '../../helpers/roles';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'payload'
});

router
    .route('/')
    .post(authRequired, roles(['company']), financeCtrl.create)
    .get(authRequired, roles(['company']), financeCtrl.getCompanyFinanceRecord);
router
    .route('/:finrecId')
    .put(authRequired, roles(['company']), financeCtrl.update)
    .delete(authRequired, roles(['company']), financeCtrl.remove);

router
    .route('/type')
    .get(authRequired, roles(['company']), financeCtrl.getCompanyFinanceType)
    .post(authRequired, roles(['company']), financeCtrl.createFinType);

router
    .route('/type/:typeId')
    .put(authRequired, roles(['company']), financeCtrl.updateFinType)
    .delete(authRequired, roles(['company']), financeCtrl.removeType);

router
    .route('/worker/:workerId')
    .get(authRequired, roles(['company']), financeCtrl.getWorkerFinanceRecord);

router.param('finrecId', financeCtrl.load);
router.param('workerId', (req, res, next, workerId) => {
    req.workerId = workerId;
    return next();
});
router.param('typeId', (req, res, next, typeId) => {
    req.typeId = typeId;
    return next();
});

export default router;
