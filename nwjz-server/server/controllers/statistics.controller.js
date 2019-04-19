/*
 * @Author = Roy Chen
 * @Date = 2017-12-13 00:36:55
 * @Last Modified by: Arnie Carter
 * @Last Modified time: 2018-06-07 23:04:52
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-08-20 15:50:55
 */
import User from '../models/user.model';
import Order from '../models/order.model';
import Address from '../models/address.model';
import Service from '../models/service.model';
import Appointment from '../models/appointment.model';
import UserEvent from '../models/user.event.model';
import calendar from '../helpers/calendar';
const passport = require('passport');

/**
 * 首页统计
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function dashboardStatistics(req, res, next) {
    let _filter = {
        status: 1,
        service_time: {
            $gt: new Date()
        }
    };
    let unAtotal = await Appointment.count({ status: 0 });
    let atotal = await Appointment.count(_filter);
    let order = await Order.count({ status: 5 });
    let autoCLoseOrder = await Order.count({ status: 4 });
    let payOrder = await Order.count({ status: 1 });
    let events = await UserEvent.count({ status: { $gt: 0 } });
    _filter = {
        user_type: 'member',
        created_time: {
            $gt: new Date().toLocaleDateString()
        }
    };
    let newUser = await User.count(_filter);
    // 上月开始结束日期
    let lastMonth = calendar.getLastMonthDays();
    // 当月开始结束日期
    let currMonth = calendar.getCurrMonthDays();
    // 统计上月用户数
    let lastMonthUser = await User.count({
        user_type: 'member',
        created_time: {
            $gte: new Date(lastMonth[0]),
            $lte: new Date(lastMonth[1])
        }
    });
    // 统计当月用户数
    let currMonthUser = await User.count({
        user_type: 'member',
        created_time: {
            $gte: new Date(currMonth[0]),
            $lte: new Date(currMonth[1])
        }
    });
    // 统计用户总数
    let totalUser = await User.count({
        user_type: 'member'
    });
    let resultJson = {
        status: 0,
        data: {
            unAtotal: unAtotal,
            atotal: atotal,
            order: order,
            newUser: newUser,
            lastMonthUser: lastMonthUser,
            currMonthUser: currMonthUser,
            totalUser: totalUser,
            autoCLoseOrder: autoCLoseOrder,
            payOrder: payOrder,
            events: events
        },
        type: 'SUCCESS',
        message: '获取首页信息成功！'
    }
    console.log('dashboard statistics:', resultJson);
    return res.json(resultJson);
}

/**
 * 订单统计
 * @property {number} req.query.skip - Number of orderes to be skipped.
 * @property {number} req.query.limit - Limit number of orderes to be returned.
 * @returns {Order[]}
 */
async function orderStatistics(req, res, next) {
    const { start_end = undefined } = req.query;
    let _filter = req._filter;
    if (!_filter || _filter == 'undefined') {
        _filter = {
            $and: [{}]
        };
    }
    if (start_end !== undefined) {
        _filter.$and.push({
            created_time: {
                $gte: new Date(start_end[0]),
                $lte: new Date(start_end[1])
            }
        });
    }

    // 按状态
    const by_status = await Order.aggregate([
        { $match: _filter },
        { $group: { _id: { status: '$status' }, number: { $sum: 1 } } },
        {
            $project: {
                number: 1,
                status: '$_id.status',
                _id: 0
            }
        },
        { $sort: { _id: 1, number: 1 } }
    ]).then(result => {
        return result;
    });

    // 按服务
    const by_service = await Order.aggregate([
        { $match: _filter },
        { $group: { _id: { service: '$service' }, number: { $sum: 1 } } },
        {
            $project: {
                number: 1,
                service: '$_id.service',
                _id: 0
            }
        },
        { $sort: { number: 1 } }
    ]).then(result => {
        return Service.populate(result, { path: 'service', select: 'title' }).then(result2 => {
            // console.log('result2 = ', result2);
            return result2;
        });
    });

    // console.log('by_service = ', by_service)

    // 按是否购买或预约
    const by_is_reserve_order = await Order.aggregate([
        { $match: _filter },
        { $group: { _id: { reserve: '$is_reserve_order' }, number: { $sum: 1 } } },
        {
            $project: {
                number: 1,
                reserve: '$_id.reserve',
                _id: 0
            }
        },
        { $sort: { number: 1 } }
    ]).then(result => {
        return result;
    });

    // 按月
    const by_month = await Order.aggregate([
        { $group: { _id: { month: { $month: '$created_time' } }, number: { $sum: 1 } } },
        {
            $project: {
                number: 1,
                month: '$_id.month',
                _id: 0
            }
        },
        { $sort: { month: 1 } }
    ]).then(result => {
        let data = {
            label: '按月统计',
            months: [
                '一月',
                '二月',
                '三月',
                '四月',
                '五月',
                '六月',
                '七月',
                '八月',
                '九月',
                '十月',
                '十一月',
                '十二月'
            ],
            stats: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        };
        result.forEach(element => {
            data.stats[parseInt(element.month) - 1] = element.number;
        });
        return data;
    });

    // 按地区
    const by_area = await Order.aggregate([
        { $group: { _id: { area: '$address' }, subT: { $sum: 1 } } },
        {
            $project: {
                subT: 1,
                area: '$_id.area',
                _id: 0
            }
        }
    ]).then(result => {
        return Address.populate(result, { path: 'area', select: 'area' }).then(result2 => {
            let temp = {};
            let stats = [];
            result2.forEach(item => {
                // console.log(item)
                if (temp[item.area.area[2]]) {
                    temp[item.area.area[2]] += item.subT;
                } else {
                    temp[item.area.area[2]] = item.subT;
                }
            });
            for (let k in temp) {
                stats.push({ key: k, value: temp[k] });
            }
            return stats;
        });
    });

    res.json({
        status: 0,
        type: 'SUCCESS',
        data: {
            by_status,
            by_service,
            by_is_reserve_order,
            by_month,
            by_area
        },
        message: '订单统计'
    });
}

export default {
    orderStatistics,
    dashboardStatistics
};
