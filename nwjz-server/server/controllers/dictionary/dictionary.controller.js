/*
 * @Author: Roy Chen
 * @Date: 2019-04-01 21:07:26
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-27 22:55:00
 */

import Dictionary from '../../models/dictionary/dictionary.model';
import Utils from '../../helpers/Utils';
/**
 * Load finance and append to req.
 */
function load(req, res, next, id) {
    Dictionary.get(id)
        .then(dictionary => {
            req.dictionary = dictionary; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get finance
 * @returns {Dictionary}
 */
function get(req, res) {
    return res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            dictionary: req.dictionary
        },
        message: '获取信息成功'
    });
}

/**
 * Create new finance
 * @returns {Dictionary}
 */
function create(req, res, next) {
    const dictionary = new Dictionary(req.body);
    dictionary.company = req.payload.company;
    dictionary.created_by = req.payload.user;
    dictionary
        .save()
        .then(savedDictionary => {
            return res.json({
                status: 0,
                data: {
                    finance: savedDictionary
                },
                type: 'SUCCESS',
                message: '创建成功'
            });
        })
        .catch(e => next(e));
}

/**
 * Update existing finance
 * @returns {Dictionary}
 */
function update(req, res, next) {
    const dictionary = req.body;
    dictionary.updated_time = Date.now();
    dictionary.updated_by = req.payload.user;
    Dictionary.findByIdAndUpdate(req.dictionary._id, dictionary)
        .then(savedDictionary => {
            return res.json({
                status: 0,
                data: {
                    finance: savedDictionary
                },
                type: 'SUCCESS',
                message: '更新成功'
            });
        })
        .catch(e => next(e));
}

/**
 * getCompanyDictionary
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getCompanyDictionary(req, res, next) {
    let _filter = { company: req.payload.company };
    Dictionary.find(_filter)
        .sort({
            created_time: -1
        })
        .exec()
        .then(dictionary => {
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    dictionary
                },
                message: '获取列表成功'
            });
        })
        .catch(e => next(e));
}

/**
 * getDictionaryByCat
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getDictionaryByCat(req, res, next) {
    let _filter = { company: req.payload.company, category: req.category };
    Dictionary.find(_filter)
        .sort({
            sort: 1
        })
        .exec()
        .then(dictionary => {
            res.json({
                status: 0,
                type: 'SUCCESS',
                data: {
                    dictionary
                },
                message: '获取列表成功'
            });
        })
        .catch(e => next(e));
}
/**
 * Delete finance.
 * @returns {Dictionary}
 */
function remove(req, res, next) {
    const dictionary = req.dictionary;
    dictionary
        .remove()
        .then(deletedDictionary => res.json(deletedDictionary))
        .catch(e => next(e));
}

export default {
    load,
    get,
    create,
    update,
    getCompanyDictionary,
    getDictionaryByCat,
    remove
};
