/*
 * @Author: Arnie Carter 
 * @Date: 2018-01-03 18:30:18 
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-01-25 17:24:01
 */

import Appointment from '../models/appointment.model';
import Service from '../models/service.model';
import Feedback from '../models/feedback.model';
import User from '../models/user.model';
import Auth from '../models/auth.model';
import config from '../../config/config';
import Utils from '../helpers/Utils';
import mongoose from 'mongoose';
const appointment = mongoose.model('Appointment');
const user = mongoose.model('User');

const passport = require('passport');
/**
 * Load feedback and append to req.
 */
function load(req, res, next, id) {
    Feedback.get(id)
        .then((feedback) => {
            req.feedback = feedback; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

async function editorDashboard(req, res, next) {
    let dashboardCount = []
    console.log('userId:', req.payload.user)
    let apmCount = await appointment.count({
        status: 0
    })
    dashboardCount.push({
        'apmCount': apmCount
    })
    let workerCount = await user.count({
        user_type: 'worker',
        employed_to: req.payload.user,
        status: 0
    })
    dashboardCount.push({
        'workerCount': workerCount
    })
    let getApmCount = await appointment.count({
        company: req.payload.user,
        status: 1,
        created_time: {
            $gt: Utils.addDate(-30)
        }
    })
    dashboardCount.push({
        'getApmCount': getApmCount
    })
    console.log(dashboardCount)

    console.log('==========统计开始 1 ====公司接单数==================')

    Appointment.aggregate([
            {
                $group: {
                    _id: '$company',
                    count: {$sum: 1}
                }
            }],
        function(err, result) {
          console.log(result)
                // User.populate(result, {path: '_id'}, (e2, populatedUser) => {
                //     console.log(populatedUser)
                // })
        }
    );
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
    console.log(feedback)
    feedback.save()
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
    const {
        status = '全部'
    } = req.query;
    let _filter = '';

    if (status !== '全部') _filter = {
        $and: [{
            'status': status
  }]
    }
    let total = await Feedback.count(_filter)
    const query = Utils.handleQuery(req, total)
    const limit = query.limit
    const skip = query.skip

    Feedback.find(_filter)
        .sort({
            created_time: -1
        })
        .skip(skip)
        .limit(limit)
        .exec().then(feedbacks => res.json({
            status: 0,
            type: 'SUCCESS',
            data: {
                total,
                limit: query.limit,
                skip: query.skip,
                feedbacks
            },
            message: '获取意见列表成功'
        }))
        .catch(e => next(e));
}

function updateStatus(req, res, next) {
    const feedback = req.feedback;
    feedback.status = req.body.status

    feedback.updated_time = Date.now();
    feedback.updated_by = req.payload.user;
    feedback.save()
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
        .catch(e => next(e))
}
/**
 * Delete feedback.
 * @returns {Feedback}
 */
function remove(req, res, next) {
    const feedback = req.feedback;
    feedback.remove()
        .then(deletedFeedback => res.json({
            status: 0,
            type: 'SUCCESS',
            data: {
                deletedFeedback
            },
            message: '删除意见成功'
        }))
        .catch(e => next(e));
}

export default {
    //   load,
    //   get,
    //   create,
    //   list,
    //   remove,
    //   updateStatus
    editorDashboard
};
