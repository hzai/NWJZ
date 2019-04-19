import moment from 'moment';

// 获取昨天的开始结束时间
function getYesterday() {
    const date = [];
    date.push(
        moment()
            .subtract(1, 'days')
            .format('YYYY-MM-DD')
    );
    date.push(
        moment()
            .subtract(1, 'days')
            .format('YYYY-MM-DD')
    );
    return date;
}
// 获取最近七天的开始结束时间
function getLast7Days() {
    const date = [];
    date.push(
        moment()
            .subtract(7, 'days')
            .format('YYYY-MM-DD')
    );
    date.push(
        moment()
            .subtract(1, 'days')
            .format('YYYY-MM-DD')
    );
    return date;
}
// 获取最近30天的开始结束时间
function getLast30Days() {
    const date = [];
    date.push(
        moment()
            .subtract(30, 'days')
            .format('YYYY-MM-DD')
    );
    date.push(
        moment()
            .subtract(1, 'days')
            .format('YYYY-MM-DD')
    );
    return date;
}
// 获取上一周的开始结束时间
function getLastWeekDays() {
    debugger;
    const date = [];
    const weekOfday = parseInt(moment().format('d')); // 计算今天是这周第几天  周日为一周中的第一天
    const start = moment()
        .subtract(weekOfday + 7, 'days')
        .format('YYYY-MM-DD'); // 周一日期
    const end = moment()
        .subtract(weekOfday + 1, 'days')
        .format('YYYY-MM-DD'); // 周日日期
    date.push(start);
    date.push(end);
    return date;
}
// 获取上一个月的开始结束时间
function getLastMonthDays() {
    const date = [];
    const start =
        `${moment()
            .subtract(1, 'month')
            .format('YYYY-MM')}-01`;
    const end = moment(start)
        .subtract(-1, 'month')
        .add(-1, 'days')
        .format('YYYY-MM-DD');
    date.push(start);
    date.push(end);
    return date;
}
// 获取当前周的开始结束时间
function getCurrWeekDays() {
    const date = [];
    const weekOfday = parseInt(moment().format('d')); // 计算今天是这周第几天 周日为一周中的第一天
    const start = moment()
        .subtract(weekOfday, 'days')
        .format('YYYY-MM-DD'); // 周一日期
    const end = moment()
        .add(7 - weekOfday - 1, 'days')
        .format('YYYY-MM-DD'); // 周日日期
    date.push(start);
    date.push(end);
    return date;
}
// 获取当前月的开始结束时间
function getCurrMonthDays() {
    const date = [];
    const start =
        `${moment()
            .add(0, 'month')
            .format('YYYY-MM')}-01`;
    const end = moment(start)
        .add(1, 'month')
        .add(-1, 'days')
        .format('YYYY-MM-DD');
    date.push(start);
    date.push(end);
    return date;
}

// 获取指定月的开始结束时间
function getSpecifyMonthDays(month) {
    const date = [];
    const start =
        `${moment()
            .month(month)
            .format('YYYY-MM')}-01`;
    const end = moment(start)
        .add(1, 'month')
        .add(-1, 'days')
        .format('YYYY-MM-DD');
    date.push(start);
    date.push(end);
    return date;
}


export default {
    getYesterday,
    getLast7Days,
    getLast30Days,
    getLastWeekDays,
    getLastMonthDays,
    getCurrWeekDays,
    getCurrMonthDays,
    getSpecifyMonthDays
};
