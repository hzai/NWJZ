/*
 * @Author: Arnie Carter
 * @Date: 2018-01-03 18:30:18
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-03-10 14:49:32
 */

import Feedback from '../models/feedback.model';
import User from '../models/user.model';
import Auth from '../models/auth.model';
import config from '../../config/config';
import Utils from '../helpers/Utils';
const passport = require('passport');
/**
 * Load feedback and append to req.
 */
function load(req, res, next, id) {
    Feedback.get(id)
        .then(feedback => {
            req.feedback = feedback; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get feedback
 * @returns {Feedback}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            feedback: req.feedback
        },
        message: '获取建议成功'
    });
}

/**
 * Create new feedback
 * @returns {Feedback}
 */
function create(req, res, next) {
    const feedback = new Feedback({
        feedback_content: req.body.feedback_content,
        feedback_phone: req.body.feedback_phone,
        // 创建人
        created_by: req.body.feedback_phone
    });
    console.log(feedback);
    feedback
        .save()
        .then(savedFeedback => {
            return res.json({
                status: 0,
                data: {
                    feedback: savedFeedback
                },
                type: 'SUCCESS',
                message: '建议创建成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Get feedback list.
 * @property {number} req.query.skip - Number of feedbacks to be skipped.
 * @property {number} req.query.limit - Limit number of feedbacks to be returned.
 * @returns {Feedback[]}
 */
async function list(req, res, next) {
    const { status = '全部' } = req.query;
    let _filter = {};

    if (status !== '全部')
        _filter = {
            $and: [
                {
                    status: status
                }
            ]
        };
    let total = await Feedback.count(_filter);
    const query = Utils.handleQuery(req, total);
    const limit = query.limit;
    const skip = query.skip;

    Feedback.find(_filter)
        .sort({
            created_time: -1
        })
        .skip(skip)
        .limit(limit)
        .exec()
        .then(feedbacks =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    feedbacks
                },
                message: '获取意见列表成功'
            })
        )
        .catch(e => next(e));
}

function updateStatus(req, res, next) {
    const feedback = req.feedback;
    feedback.status = req.body.status;

    feedback.updated_time = Date.now();
    feedback.updated_by = req.payload.user;
    feedback
        .save()
        .then(savedFeedback => {
            return res.json({
                status: 0,
                data: {
                    feedback: savedFeedback
                },
                type: 'SUCCESS',
                message: '意见更新成功'
            });
        })
        .catch(e => next(e));
}
/**
 * Delete feedback.
 * @returns {Feedback}
 */
function remove(req, res, next) {
    const feedback = req.feedback;
    feedback
        .remove()
        .then(deletedFeedback =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    deletedFeedback
                },
                message: '删除意见成功'
            })
        )
        .catch(e => next(e));
}

export default {
    load,
    get,
    create,
    list,
    remove,
    updateStatus
};
