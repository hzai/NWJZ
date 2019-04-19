/*
 * @Author = Roy Chen
 * @Date = 2017-12-13 00:36:55
 * @Last Modified by: Arnie Carter
 * @Last Modified time: 2018-06-07 23:04:52
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-09-23 01:39:32
 */
import Comment from '../models/comment.model';
import Order from '../models/order.model';
import Counters from '../models/counters.model';
import config from '../../config/config';
import Utils from '../helpers/Utils';
const passport = require('passport');
var wc = require('sensitive-word-filter');
import { create_comment_reminder_for_admin } from '../../config/reminder';
/**
 * Load comment and append to req.
 */
function load(req, res, next, id) {
    Comment.findById(id)
        .populate({
            path: 'user service'
        })
        // .populate('address', '_id contact_person contact_phone detail_address area')
        .then(comment => {
            req.comment = comment; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get Comment
 * @returns {Comment}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            comment: req.comment
        },
        message: '获取评论信息成功'
    });
}

/**
 * Create new comment
 * @returns {Comment}
 */
async function create(req, res, next) {
    const comment = new Comment(req.body);
    comment.user = req.payload.user;
    comment.created_by = req.payload.user;
    if (comment.content !== null || comment.content !== undefined) {
        comment.org_content = comment.content;
        comment.content = wc.filter(comment.content);
    }
    if (comment.content === null || comment.content === undefined) {
        comment.sort = 9999999;
    } else {
        const counter = await Counters.getNextServiceSort(req.body.service);
        comment.sort = counter.comment_sort;
    }
    comment
        .save()
        .then(savedComment => {
            // 通知后台管理员
            create_comment_reminder_for_admin(savedComment)

            Order.findByIdAndUpdate(savedComment.order, {
                status: 3,
                updated_time: Date.now(),
                updated_by: req.payload.user
            })
                .then(resp => {})
                .catch(e => next(e));
            return res.json({
                status: 0,
                data: {
                    comment: savedComment
                },
                type: 'SUCCESS',
                message: '评论创建成功'
            });
        })
        .catch(e => next(e));
}
/**
 * Update existing comment
 * @returns {comment}
 */
function update(req, res, next) {
    const comment = req.body;
    comment.updated_time = Date.now();
    comment.updated_by = req.payload.user;
    Comment.findByIdAndUpdate(req.body._id, comment)
        .then(savedcomment => {
            return res.json({
                status: 0,
                data: {
                    comment: savedcomment
                },
                type: 'SUCCESS',
                message: '评论更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Get comment list by service
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getCommentByService(req, res, next) {
    const serviceId = req.serviceId;
    console.log('getCommentByService serviceId = ', req.serviceId);
    if (serviceId === null || serviceId === undefined) {
        res.json({
            status: 0,
            type: 'SUCCESS',
            data: {
                total,
                limit: 0,
                skip: 0,
                comments: null
            },
            message: '获取评论列表成功'
        });
    }
    let _filter = {
        $and: [
            {
                service: serviceId
            }
        ]
    };
    req._filter = _filter;
    return list(req, res, next);
}

/**
 * Get comment list.
 * @property {number} req.query.skip - Number of commentes to be skipped.
 * @property {number} req.query.limit - Limit number of commentes to be returned.
 * @returns {Comment[]}
 */
async function list(req, res, next) {
    const { status = 'ALL', service = '' } = req.query;
    let _filter = req._filter;
    if (!_filter || _filter == 'undefined') {
        _filter = {
            $and: [{}]
        };
    }
    if (service !== '') {
        _filter.$and.push({
            service: service
        });
    }
    let total = await Comment.count(_filter);
    const query = Utils.handleQuery(req, total);
    const limit = query.limit;
    const skip = query.skip;
    console.log('comment _filter = ', _filter);
    Comment.find(_filter)
        .sort({
            is_top: -1,
            created_time: -1,
            sort: 1
        })
        .skip(skip)
        .limit(limit)
        .exec()
        .then(comments =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    comments
                },
                message: '获取评论列表成功'
            })
        )
        .catch(e => next(e));
}
/**
 * Delete comment.
 * @returns {Comment}
 */
function remove(req, res, next) {
    const comment = req.comment;
    comment
        .remove()
        .then(deletedComment =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    deletedComment
                },
                message: '删除评论成功'
            })
        )
        .catch(e => next(e));
}

export default {
    load,
    get,
    create,
    update,
    getCommentByService,
    list,
    remove
};
