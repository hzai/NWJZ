/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:54:27
 * @Last Modified by: Arnie Carter
 * @Last Modified time: 2019-05-08 07:02:26
 */
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
/**
 * 保姆更换记录表
 */
const WorkerRecordSchema = new mongoose.Schema({
    // 关联worker
    worker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
        required: true
    },
    // 合同劳务报酬  元/月
    service_payment: {
        type: Number,
        required: false
    },
    // 每月休息天数
    rest_day: {
        type: Number
    },
     // 加班费用 每天
     overtime_expenses: {
        type: Number
    },
    // 阿姨中介费用
    worker_intermediaty_cost: {
        type: Number
    },
    // 开始日期
    start_date: {
        type: Date
    },
    // 结束日期
    end_date: {
        type: Date
    },
    // 备注
    remark: {
        type: String
    }
});
/**
 * 客户回访记录表
 */
const ReviewRecordSchema = new mongoose.Schema({
    // 回访日期
    review_date: {
        type: Date,
        default: Date.now
    },
    // 回访方式
    review_type: {
        type: String
    },
    // 满意度
    review_race: {
        type: String
    },
    // 回访内容
    review_content: {
        type: String
    },
    // 回访人
    review_person: {
        type: String
    },
    // 备注
    remark: {
        type: String
    }
});
/**
 * Contract Schema
 */
const ContractSchema = new mongoose.Schema(
    {
        // 合同编号
        contract_no: {
            type: String,
        },
        /* ** 隶属于的公司 */
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        },
        // 关联 contract
        employer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employer',
            required: true
        },
        // 关联 worker
        worker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Worker',
            required: true
        },
        // 合同类型 1 - 合同 2 - 订单
        contact_type: {
            type: Number
        },
        // 合同详细类型
        contact_detail_type: {
            type: String
        },
        // 地址
        address: {
            type: String,
            required: false
        },
        // 合同开始日期
        contract_start_date: {
            type: Date,
            required: true
        },
        // 合同结束日期
        contract_end_date: {
            type: Date,
            required: true
        },
        // 合同期限
        contract_time_limit: {
            type: Number
        },
        // 合同劳务报酬  元/月
        service_payment: {
            type: Number,
            required: false
        },
        // 钟点工订单应收费用
        order_payment: {
            type: Number
        },
        // 每月休息天数
        rest_day: {
            type: Number
        },
        // 加班费用 每天
        overtime_expenses: {
            type: Number
        },
        // 保险费用 每年
        insurance_cost: {
            type: Number
        },
        // 合同中介费用
        contract_intermediary_cost: {
            type: Number
        },
        // 阿姨中介费用
        worker_intermediaty_cost: {
            type: Number
        },
        // 每次中介费用
        per_ntermediary_cost: {
            type: Number
        },
        // 保证金
        bond: {
            type: Number
        },
        // 备注（特殊需求)
        remark: {
            type: String
        },
        // 附件
        attachment: {
            type: []
        },
        // 保姆更换记录
        worker_record: {
            type: [WorkerRecordSchema]
        },
        // 客户回访记录
        review_record: {
            type: [ReviewRecordSchema]
        },
        // 状态 0 - 生效 1 - 过期
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
            type: Date,
            default: Date.now
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId
        },
        updated_by: {
            type: mongoose.Schema.Types.ObjectId
        }
    },
    {
        versionKey: '_v'
    }
);

/**
 * Methods
 */
ContractSchema.method({});

/**
 * Statics
 */
ContractSchema.statics = {
    /**
     * Get contract
     * @param {ObjectId} id - The objectId of contract.
     * @returns {Promise<Contract, APIError>}
     */
    get(id) {
        return this.findById(id)
            .exec()
            .then((contract) => {
                if (contract) {
                    return contract;
                }
                const err = new APIError('No such contract exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });
    },

    /**
     * List contracts in descending order of 'created_time' timestamp.
     * @param {number} skip - Number of contracts to be skipped.
     * @param {number} limit - Limit number of contracts to be returned.
     * @returns {Promise<Contract[]>}
     */
    list({ skip = 0, limit = 50 } = {}) {
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
 * @typedef Contract
 */
export default mongoose.model('Contract', ContractSchema);
