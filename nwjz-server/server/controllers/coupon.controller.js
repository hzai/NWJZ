/*
 * @Author = Roy Chen
 * @Date = 2017-12-13 00:36:55
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-06-20 16:16:23
 */
import Coupon from '../models/coupon.model';
import UserCoupon from '../models/user.coupon.model';
import User from '../models/user.model';
import Auth from '../models/auth.model';
import config from '../../config/config';
import Utils from '../helpers/Utils';
const passport = require('passport');
/**
 * Load coupon and append to req.
 */
function load(req, res, next, id) {
  Coupon.get(id)
    .then((coupon) => {
      req.coupon = coupon; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get coupon
 * @returns {coupon}
 */
function get(req, res) {
  return res.json({
    status: 0,
    type: 'SUCCESS',
    data: {
      coupon: req.coupon
    },
    message: '获取优惠券信息成功'
  });
}

/**
 * Create new coupon
 * @returns {coupon}
 */
function create(req, res, next) {
  //console.log(req.body)
  const coupon = new Coupon(req.body);
  coupon.created_by = req.payload.user
  coupon.save()
    .then(savedCoupon => {
      return res.json({
        status: 0,
        data: {
          coupon: savedCoupon
        },
        type: 'SUCCESS',
        message: '优惠卷创建成功'
      });
    })
    .catch(e => next(e));
}

/**
 * Update existing coupon
 * @returns {coupon}
 */
function update(req, res, next) {
  const coupon = req.body;
  coupon.updated_time = Date.now();
  coupon.updated_by = req.payload.user;
  Coupon.findByIdAndUpdate(req.body._id, coupon)
    .then(savedcoupon => {
      return res.json({
        status: 0,
        data: {
          coupon: savedcoupon
        },
        type: 'SUCCESS',
        message: '优惠券更新成功'
      });
    })
    .catch(e => next(e));
}

/**
 * Get coupon list.
 * @property {number} req.query.skip - Number of coupones to be skipped.
 * @property {number} req.query.limit - Limit number of coupones to be returned.
 * @returns {coupon[]}
 */
async function list(req, res, next) {
  let _filter = {}
  if (req.query.serviceId !== undefined) {
    _filter = {
      service: req.query.serviceId
    }
  }
  let total = await Coupon.count(_filter)
  const query = Utils.handleQuery(req, total)
  const limit = query.limit
  const skip = query.skip

  Coupon.find(_filter)
    .populate({
      path: 'service'
    })
    .sort({
      created_time: -1
    })
    .skip(skip)
    .limit(limit)
    .exec().then(coupons => res.json({
      status: 0,
      type: 'SUCCESS',
      data: {
        total,
        limit: query.limit,
        skip: query.skip,
        coupons
      },
      message: '获取优惠券列表成功'
    }))
    .catch(e => next(e));
}

async function fetchServiceCouponUnLogin(req, res, next) {
  let _filter = {}
  if (req.query.serviceId !== undefined) {
    _filter = {
      $and: [{
        service: req.query.serviceId
      }, {
        end_time: {
          $gt: Date.now()
        }
      },{
        status: 0
      }]
    }
  }
  let total = await Coupon.count(_filter)
  const query = Utils.handleQuery(req, total)
  const limit = query.limit
  const skip = query.skip

  Coupon.find(_filter)
    .sort({
      created_time: -1
    })
    .skip(skip)
    .limit(limit)
  .exec().then(coupons => res.json({
    status: 0,
    type: 'SUCCESS',
    data: {
      total,
      limit: query.limit,
      skip: query.skip,
      coupons
    },
    message: '获取优惠券列表成功'
  }))
  .catch(e => next(e));
}

async function fetchServiceCoupon(req, res, next) {
  let _filter = {}
  if (req.query.serviceId !== undefined) {
    _filter = {
      $and: [{
        service: req.query.serviceId
      }, {
        end_time: {
          $gt: Date.now()
        }
      },{
        status: 0
      }]
    }
  }
  let total = await Coupon.count(_filter)
  //console.log(total)
  const query = Utils.handleQuery(req, total)
  const limit = query.limit
  const skip = query.skip

  Coupon.find(_filter)
    .sort({
      created_time: -1
    })
    .skip(skip)
    .limit(limit)
    .exec().then(async(coupons) => {
      for (var cou of coupons) {
        let ff = {
          $and: [{
            user: req.payload.user
          }, {
            coupon: cou._id
          }, {
            status: 0
          }]
        }
        const tags = await UserCoupon.count(ff)
        if(tags>0){
          cou.tags = 1
        } else {
            cou.tags = 0
            if(!cou.is_repetition_use){
             let fff = {
                $and: [{
                    user: req.payload.user
                  }, {
                    coupon: cou._id
                  }, {
                    status: 1
                  }]
             }
             const repUseCount = await UserCoupon.count(fff)
             if(repUseCount>0){
                 cou.tags = 2
             }
            }
        }
      }
      res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
          total,
          limit: query.limit,
          skip: query.skip,
          coupons,
        },
        message: '获取优惠卷列表成功'
      })
    })
    .catch(e => next(e));

  // .exec().then(coupons => res.json({
  //   status: 0,
  //   type: 'SUCCESS',
  //   data: {
  //     total,
  //     limit: query.limit,
  //     skip: query.skip,
  //     coupons
  //   },
  //   message: '获取优惠券列表成功'
  // }))
  // .catch(e => next(e));
}

/**
 * Delete coupon.
 * @returns {Coupon}
 */
function remove(req, res, next) {
  const coupon = req.coupon;
  coupon.remove()
    .then(deletedCoupon => res.json({
      status: 0,
      type: 'SUCCESS',
      data: {
        deletedCoupon
      },
      message: '删除优惠券成功'
    }))
    .catch(e => next(e));
}

export default {
  load,
  get,
  create,
  update,
  list,
  remove,
  fetchServiceCoupon,
  fetchServiceCouponUnLogin
};
