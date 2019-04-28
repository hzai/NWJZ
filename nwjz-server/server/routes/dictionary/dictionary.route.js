/*
 * @Author: Roy Chen
 * @Date: 2019-04-01 21:14:49
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-27 22:54:53
 */

import express from 'express';
import expressJwt from 'express-jwt';
import dictCtl from '../../controllers/dictionary/dictionary.controller';
import config from '../../../config/config';
import roles from '../../helpers/roles';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'payload'
});

router
    .route('/')
    .post(authRequired, roles(['company_admin', 'company']), dictCtl.create)
    .get(
        authRequired,
        roles(['company_admin', 'company']),
        dictCtl.getCompanyDictionary
    );
router
    .route('/:dictId')
    .put(authRequired, roles(['company_admin', 'company']), dictCtl.update)
    .delete(authRequired, roles(['company_admin', 'company']), dictCtl.remove);

router
    .route('/cat/:category')
    .get(
        authRequired,
        roles(['company_admin', 'company']),
        dictCtl.getDictionaryByCat
    );

router.param('dictId', dictCtl.load);
router.param('category', (req, res, next, category) => {
    req.category = category;
    return next();
});
export default router;
