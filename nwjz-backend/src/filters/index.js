/*
 * @Author: Roy Chen
 * @Date: 2019-04-22 21:12:49
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-05-08 19:44:56
 */
// import parseTime, formatTime and set to filter

import { CodeToText, provinceAndCityData } from 'element-china-area-data';
import staticOptions from '@/data/options';
export { parseTime, formatTime } from '@/utils';

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
    if (time === 1) {
        return time + label;
    }
    return time + label + 's';
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
    const between = Date.now() / 1000 - Number(time);
    if (between < 3600) {
        return pluralize(~~(between / 60), ' minute');
    } else if (between < 86400) {
        return pluralize(~~(between / 3600), ' hour');
    } else {
        return pluralize(~~(between / 86400), ' day');
    }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
    const si = [
        { value: 1e18, symbol: 'E' },
        { value: 1e15, symbol: 'P' },
        { value: 1e12, symbol: 'T' },
        { value: 1e9, symbol: 'G' },
        { value: 1e6, symbol: 'M' },
        { value: 1e3, symbol: 'k' }
    ];
    for (let i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
            return (
                (num / si[i].value + 0.1)
                    .toFixed(digits)
                    .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
            );
        }
    }
    return num.toString();
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
    return (+num || 0)
        .toString()
        .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
}

export function codeToTextFilter(value) {
    let result = '';
    if (value && value[0]) result = CodeToText[value[0]];
    if (value && value[1]) result += CodeToText[value[1]];
    if (value && value[2]) result += CodeToText[value[2]];
    return result;
}

export function ellipsis(value) {
    if (!value) return '';
    if (value.length > 10) {
        return value.slice(0, 10) + '...';
    }
    return value;
}

export function arrayToText(arr) {
    var result = '';
    for (var i = 0; i < arr.length; i++) {
        result += arr[i] + ', ';
    }
    // 去掉最后一个逗号(如果不需要去掉，就不用写)
    if (result.length > 0) {
        result = result.substr(0, result.length - 2);
    }
    // if (result.length > 10) {
    //     result = result.slice(0, 10) + '...';
    // }
    return result;
}

export function nativePlaceFilter(native_place) {
    const map = [];
    provinceAndCityData.forEach(item => {
        map[item.value] = item.label;
    });
    return map[native_place];
}

export function workerStatusFilter(status) {
    const statusMap = [];
    staticOptions.workerStatus.forEach(item => {
        statusMap[item.value] = item.label;
    });
    return statusMap[status];
}

export function workerStatusColorFilter(status) {
    const colorMap = [];
    staticOptions.workerStatus.forEach(item => {
        colorMap[item.value] = item.color;
    });
    return colorMap[status];
}

export function employerStatusFilter(status) {
    const statusMap = [];
    staticOptions.employerStatus.forEach(item => {
        statusMap[item.value] = item.label;
    });
    return statusMap[status];
}

export function employerStatusColorFilter(status) {
    const colorMap = [];
    staticOptions.employerStatus.forEach(item => {
        colorMap[item.value] = item.color;
    });
    return colorMap[status];
}
