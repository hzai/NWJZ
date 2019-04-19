/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 00:36:55
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-12 00:32:09
 */
import Employer from '../models/employer.model';
import Utils from '../helpers/Utils';
/**
 * Load employer and append to req.
 */
function load(req, res, next, id) {
    Employer.get(id)
        .then(employer => {
            req.employer = employer; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get employer
 * @returns {Employer}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            employer: req.employer
        },
        message: '获取信息成功'
    });
}

/**
 * Create new employer
 * @returns {Employer}
 */
function create(req, res, next) {
    //console.log(req.body)
    const employer = new Employer(req.body);
    employer.create_by = req.payload.user;
    employer
        .save()
        .then(savedEmployer => {
            return res.json({
                status: 0,
                data: {
                    employer: savedEmployer
                },
                type: 'SUCCESS',
                message: '创建成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Update existing employer
 * @returns {Employer}
 */
function update(req, res, next) {
    const employer = req.body;
    employer.updated_time = Date.now();
    employer.updated_by = req.payload.user;
    Employer.findByIdAndUpdate(req.body._id, employer)
        .then(savedEmployer => {
            return res.json({
                status: 0,
                data: {
                    employer: savedEmployer
                },
                type: 'SUCCESS',
                message: '更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Get employer list.
 * @property {number} req.query.skip - Number of employers to be skipped.
 * @property {number} req.query.limit - Limit number of employers to be returned.
 * @returns {Employer[]}
 */
async function list(req, res, next) {
    const {
        status = 'ALL',
        type = undefined,
        name = '',
        contact_phone = '',
        requirements = undefined
    } = req.query;
    let _filter = req._filter;

    if (!_filter || _filter == 'undefined') {
        _filter = {
            $and: [
                {
                    name: {
                        $regex: name,
                        $options: '$i'
                    }
                },
                {
                    contact_phone: {
                        $regex: contact_phone,
                        $options: '$i'
                    }
                }
            ]
        };
    } else {
        _filter.$and.push({
            name: {
                $regex: name,
                $options: '$i'
            },
            contact_phone: {
                $regex: contact_phone,
                $options: '$i'
            }
        });
    }
    if (type !== undefined) {
        _filter.$and.push({
            type: type
        });
    }
    if (requirements !== undefined) {
        _filter.$and.push({
            requirements: { $in: requirements }
        });
    }
    if (status !== 'ALL')
        _filter.$and.push({
            status: status
        });
    let total = await Employer.count(_filter);
    const query = Utils.handleQuery(req, total);
    Employer.find(_filter)
        .limit(query.limit)
        .skip(query.skip)
        .sort({
            created_time: -1
        })
        .exec()
        .then(employers => {
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total,
                    limit: query.limit,
                    skip: query.skip,
                    employers
                },
                message: '获取雇主列表成功'
            });
        })
        .catch(e => next(e));
}

/**
 * 统计status
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function statProspectStatus(req, res, next) {
    let _filter = { type: 'prospect' };
    let total = await Employer.count(_filter);
    Employer.aggregate([
        { $match: _filter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ])
        .exec()
        .then(employers => {
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    total: total,
                    employers
                },
                message: '获取列表成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Delete employer.
 * @returns {Employer}
 */
function remove(req, res, next) {
    const employer = req.employer;
    employer
        .remove()
        .then(deletedEmployer => res.json(deletedEmployer))
        .catch(e => next(e));
}

export default {
    load,
    get,
    create,
    update,
    list,
    statProspectStatus,
    remove
};
