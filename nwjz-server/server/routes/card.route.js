/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 00:44:25
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-08-31 19:55:31
 */
import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import cardCtrl from '../controllers/card.controller';

import config from '../../config/config';
import roles from '../helpers/roles';

const router = express.Router(); // eslint-disable-line new-cap
const authRequired = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'payload'
});

router.route('/')
    .get(authRequired, roles(['admin', 'editor']), cardCtrl.list)
    .post(authRequired, roles(['admin', 'editor']), cardCtrl.create);

router.route('/:cardId')
    .get(authRequired, roles(['admin', 'editor']), cardCtrl.get)
    .put(authRequired, roles(['admin', 'editor']), cardCtrl.update)
    .delete(authRequired, roles(['admin', 'editor']), cardCtrl.remove);

router.route('/:cardId/entitys')
    .get(authRequired, roles(['admin', 'editor']), cardCtrl.getCardEntitys)

router.route('/entity/:entityId')
    .put(authRequired, roles(['admin', 'editor']), cardCtrl.updateCardEntity)

router.route('/batch/sell')
    .put(authRequired, roles(['admin', 'editor']), cardCtrl.batchSellCards)

/** Load user when API with serviceId route parameter is hit */
router.param('cardId', cardCtrl.load);

export default router;
