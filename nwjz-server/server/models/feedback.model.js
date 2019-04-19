/*
 * @Author: Arnie Carter 
 * @Date: 2018-01-03 18:26:11 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-01-03 20:57:21
 */


import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
/**
 * feedback Schema
 */
const FeedbackSchema = new mongoose.Schema({
  // 关联user
  feedback_content: {
    type: String,
    required: true
  },
  feedback_phone: {
    type: String
  },
  created_time: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: '未处理'
  },
  updated_time: {
    type: Date
  },
  created_by: {
    type: String
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
FeedbackSchema.method({});

/**
 * Statics
 */
FeedbackSchema.statics = {
  /**
   * Get feedback
   * @param {ObjectId} id - The objectId of feedback.
   * @returns {Promise<feedback, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((feedback) => {
        if (feedback) {
          return feedback;
        }
        const err = new APIError('No such feedback exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List feedbackes in descending order of 'created_time' timestamp.
   * @param {number} skip - Number of feedbacks to be skipped.
   * @param {number} limit - Limit number of feedbackes to be returned.
   * @returns {Promise<feedback[]>}
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
 * @typedef feedback
 */
export default mongoose.model('Feedback', FeedbackSchema);
