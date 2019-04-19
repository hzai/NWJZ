/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:56:05
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-02-25 00:30:00
 */

import Joi from 'joi';

export default {
  // POST /api/auth/register
  register: {
    body: {
      mobile: Joi.string().required(),
      password: Joi.string().required()
    }
  },
  // CREATE /api/users
  createUser: {

  },
  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      nickname: Joi.string().required(),
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      mobile: Joi.string().required(),
      password: Joi.string().required()
    }
  },
  // POST /api/auth/login/mobile
  loginByMobile: {
    body: {
      mobile: Joi.string().required(),
      verify_code: Joi.string().required()
    }
  },
  loginByWechat: {
    body: {
      openid: Joi.string().required(),
      mobile: Joi.string().required(),
      verify_code: Joi.string().required()
    }
  },

  createAddress: {
    body: {
      contact_person: Joi.string().required(),
      contact_phone: Joi.string().required(),
      detail_address: Joi.string().required(),
    }
  },
  updateAddress: {
    body: {
      contact_person: Joi.string().required(),
      contact_phone: Joi.string().required(),
      detail_address: Joi.string().required(),
    },
    params: {
      addressId: Joi.string().hex().required()
    }
  },
  createFeedback: {
    body: {
      feedback_content: Joi.string().required()
    }
  },
  allocateCompanyAndWorker: {
    body: {
      worker: Joi.string().hex().required()
    }
  }
};
