/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:54:27
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-09-27 20:44:26
 */

import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
/**
 * Appointment Schema
 */
const AppointmentSchema = new mongoose.Schema({
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
  preappointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Preappointment'
  },
  // 指定接单的公司
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // 指定的保姆
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker'
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  },
  total_price: {
    type: Number,
    default: 0
  },
  service_duration: {
    type: Number,
    default: 1
  },
  contact_person: {
    type: String
  },
  contact_phone: {
    type: String
  },
  suit_title: {
    type: String
  },
  service_category: {
    type: String
  },
  contact_area: {
    type: [String],
  },
  contact_detail_address: {
    type: String
  },
  service_time: {
    type: Date
  },
  memo: {
    type: String
  },
  remark: {
    type: []
  },
  // Appointment状态 0 - 已预约（未分配）；1 - 已分配；2 - 服务中；3 - 服务完成; 4 - 服务取消; 5 - 暂停服务
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
AppointmentSchema.method({});

/**
 * Statics
 */
AppointmentSchema.statics = {
  /**
   * Get appointment
   * @param {ObjectId} id - The objectId of appointment.
   * @returns {Promise<Appointment, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((appointment) => {
        if (appointment) {
          return appointment;
        }
        const err = new APIError('No such appointment exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List appointments in descending order of 'created_time' timestamp.
   * @param {number} skip - Number of appointments to be skipped.
   * @param {number} limit - Limit number of appointments to be returned.
   * @returns {Promise<Appointment[]>}
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
 * @typedef Appointment
 */
export default mongoose.model('Appointment', AppointmentSchema);
