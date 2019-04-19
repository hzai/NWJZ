/*
 * @Author: Roy Chen
 * @Date: 2017-12-12 23:53:48
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-03-27 14:45:36
 */
import mongoose from 'mongoose';

/**
 * Counters Schema
 */
const CountersSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    code: {
        type: String
    },
    contract_no_seq: {
        type: Number,
        default: 0
    },
    worker_code_seq: {
        type: Number,
        default: 0
    },
    comment_sort: {
        type: Number,
        default: 0
    },
    card_number_seq: {
        type: Number,
        default: 0
    }
});

CountersSchema.statics.getNextWorkerCode = async function(code) {
    return this.findOneAndUpdate(
        { code: code },
        { $inc: { worker_code_seq: 1 } },
        { new: true, upsert: true }
    );
};

CountersSchema.statics.getNextServiceSort = async function(service) {
    console.log('serv ==== ', service);
    return this.findByIdAndUpdate(
        { _id: service },
        { $inc: { comment_sort: 1 } },
        { new: true, upsert: true }
    );
};

CountersSchema.statics.getNextVirtualCardNum = async function(card) {
    console.log('card ==== ', card);
    return this.findByIdAndUpdate(
        { _id: card },
        { $inc: { card_number_seq: 1 } },
        { new: true, upsert: true }
    );
};

CountersSchema.statics.getNextContractNo = async function(code) {
    return this.findOneAndUpdate(
        { code: code },
        { $inc: { contract_no_seq: 1 } },
        { new: true, upsert: true }
    );
};

/**
 * @typedef Counters
 */
export default mongoose.model('Counters', CountersSchema);
