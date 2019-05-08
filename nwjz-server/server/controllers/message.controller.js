/*
 * @Author = Roy Chen
 * @Date = 2017-12-13 00:36:55
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-29 21:55:14
 */
import Message from '../models/message.model';
import User from '../models/user.model';
import Auth from '../models/auth.model';
import config from '../../config/config';
import Utils from '../helpers/Utils';
const passport = require('passport');
/**
 * Load message and append to req.
 */
function load(req, res, next, id) {
    Message.get(id)
        .then(message => {
            req.message = message; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get message
 * @returns {message}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            message: req.message
        },
        message: '获取消息信息成功'
    });
}

/**
 * Create new message
 * @returns {message}
 */
function create(req, res, next) {
    //console.log(req.body)
    const message = new Message(req.body);
    message.created_by = req.payload.user;
    message
        .save()
        .then(savedMessage => {
            return res.json({
                status: 0,
                data: {
                    message: savedMessage
                },
                type: 'SUCCESS',
                message: '消息创建成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Update existing message
 * @returns {message}
 */
function update(req, res, next) {
    const message = req.body;
    message.updated_time = Date.now();
    message.updated_by = req.payload.user;
    Message.findByIdAndUpdate(req.body._id, message)
        .then(savedmessage => {
            return res.json({
                status: 0,
                data: {
                    message: savedmessage
                },
                type: 'SUCCESS',
                message: '消息更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Get message list.
 * @property {number} req.query.skip - Number of messagees to be skipped.
 * @property {number} req.query.limit - Limit number of messagees to be returned.
 * @returns {message[]}
 */
async function list(req, res, next) {
    const { status = 'ALL' } = req.query;
    let _filter = {};
    _filter = {
        $and: [
            {
                user: req.payload.user
            }
        ]
    };
    if (status !== 'ALL')
        _filter.$and.push({
            status: status
        });
    let total = await Message.count(_filter);
    const query = Utils.handleQuery(req, total);
    const limit = query.limit;
    const skip = query.skip;

    Message.find(_filter)
        .populate({
            path: 'user',
            select: 'nickname avatar'
        })
        .sort({
            created_time: -1
        })
        .skip(skip)
        .limit(limit)
        .exec()
        .then(messages =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    messages
                },
                message: '获取消息列表成功'
            })
        )
        .catch(e => next(e));
}

/**
 * Delete message.
 * @returns {Message}
 */
function remove(req, res, next) {
    const message = req.message;
    message
        .remove()
        .then(deletedMessage =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    deletedMessage
                },
                message: '删除消息成功'
            })
        )
        .catch(e => next(e));
}

export default {
    load,
    get,
    create,
    update,
    list,
    remove
};
