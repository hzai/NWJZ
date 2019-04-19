/*
 * @Author: Arnie Carter
 * @Date: 2018-01-09 21:57:41
 * @Last Modified by: Arnie Carter
 * @Last Modified time: 2018-01-11 00:41:17
 */

import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
/**
 * Preappointment Schema
 */
const PreappointmentSchema = new mongoose.Schema({
  // 关联user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // 关联 order
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  suit_title: {
    type: String
  },
  contact_person: {
    type: String,
    required: true
  },
  contact_phone: {
    type: String,
    required: true
  },
  contact_area: {
    type: [String],
    required: true
  },
  contact_detail_address: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    default: 0
  },
  times: {
    type: Number,
    required: true,
    default: 0
  },
  expired_date: {
    type: Date,
    required: true
  },
  // Preappointment状态 0 - 正常；1 - 使用完毕；2 - 过期；
  status: {
    type: Number,
    required: true,
    default: 0
  },
  created_time: {
    type: Date,
    default: Date.now
  },
  updated_time: {
    type: Date
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId
  }
}, {
  versionKey: '_v'
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
PreappointmentSchema.method({});

/**
 * Statics
 */
PreappointmentSchema.statics = {
  /**
   * Get preappointment
   * @param {ObjectId} id - The objectId of preappointment.
   * @returns {Promise<Preappointment, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((preappointment) => {
        if (preappointment) {
          return preappointment;
        }
        const err = new APIError('No such preappointment exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List preappointments in descending order of 'created_time' timestamp.
   * @param {number} skip - Number of preappointments to be skipped.
   * @param {number} limit - Limit number of preappointments to be returned.
   * @returns {Promise<Preappointment[]>}
   */
  list({
    skip = 0,
    limit = 50
  } = {}) {
    return this.find()
      .sort({
        created_time: -1
      })
      .skip(skip)
      .limit(limit)
      .exec();
  }
};

/**
 * @typedef Preappointment
 */
export default mongoose.model('Preappointment', PreappointmentSchema);
