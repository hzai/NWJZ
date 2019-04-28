/*
 * @Author = Roy Chen
 * @Date = 2017-12-13 00:36:55
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-28 16:49:17
 */
import WorkerComment from '../../models/worker/worker.comment.model';
import Utils from '../../helpers/Utils';
/**
 * Load workerComment and append to req.
 */
function load(req, res, next, id) {
    WorkerComment.findById(id)
        .then(workerComment => {
            req.workerComment = workerComment; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get workerComment
 * @returns {WorkerComment}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            workerComment: req.workerComment
        },
        message: '获取信息成功'
    });
}

/**
 * Create new workerComment
 * @returns {WorkerComment}
 */
async function create(req, res, next) {
    const workerComment = new WorkerComment(req.body);
    workerComment.company = req.payload.company;
    workerComment.created_by = req.payload.user;
    workerComment
        .save()
        .then(savedComment => {
            return res.json({
                status: 0,
                data: {
                    workerComment: savedComment
                },
                type: 'SUCCESS',
                message: '创建成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Update existing workerComment
 * @returns {WorkerComment}
 */
async function update(req, res, next) {
    const workerComment = req.body;
    workerComment.updated_time = Date.now();
    workerComment.updated_by = req.payload.user;
    WorkerComment.findByIdAndUpdate(req.commentId, workerComment)
        .then(savedComment => {
            return res.json({
                status: 0,
                data: {
                    workerComment: savedComment
                },
                type: 'SUCCESS',
                message: '更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * getListByWorker
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getListByWorker(req, res, next) {
    req._filter = {
        worker: req.worker._id
    };
    return list(req, res, next);
}

/**
 * Get workerComment list.
 * @property {number} req.query.skip - Number of workerComments to be skipped.
 * @property {number} req.query.limit - Limit number of workerComments to be returned.
 * @returns {WorkerComment[]}
 */
async function list(req, res, next) {
    let _filter = req._filter;
    let total = await WorkerComment.count(_filter);
    const query = Utils.handleQuery(req, total);
    const limit = query.limit;
    const skip = query.skip;

    WorkerComment.find(_filter)
        // .populate({
        //     path: 'worker'
        // })
        .sort({
            created_time: -1
        })
        .skip(skip)
        .limit(limit)
        .exec()
        .then(workerComments =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    workerComments
                },
                message: '获取保姆服务信息列表成功'
            })
        )
        .catch(e => next(e));
}

/**
 * Delete workerComment.
 * @returns {WorkerComment}
 */
function remove(req, res, next) {
    const workerComment = req.workerComment;
    workerComment
        .remove()
        .then(deletedWorkerComment =>
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    deletedWorkerComment
                },
                message: '删除信息成功'
            })
        )
        .catch(e => next(e));
}

export default {
    load,
    get,
    create,
    update,
    getListByWorker,
    remove
};
