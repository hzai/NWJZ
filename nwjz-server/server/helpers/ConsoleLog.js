import moment from 'moment';
const chalk = require('chalk');

function getHeader(extra) {
    // const methodFile = '-[' + info['method'] + ']-<' + info['file'] + ':' + info['line'] + '>-: '
    // const methodFile = `-<${info.file}:${info.line}>-: `;
    return `[${moment().format('YYYY-MM-DD HH:mm:ss')}]${extra}`;
}

function stackInfo() {
    const path = require('path');
    const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
    const stackReg2 = /at\s+()(.*):(\d*):(\d*)/i;
    const stacklist = new Error().stack.split('\n').slice(3);
    const s = stacklist[0];
    const sp = stackReg.exec(s) || stackReg2.exec(s);
    const data = {};
    if (sp && sp.length === 5) {
        data.method = sp[1];
        data.path = sp[2];
        data.line = sp[3];
        data.pos = sp[4];
        data.file = path.basename(data.path);
    }
    return data;
}

console.oldlog = console.log;
console.oldtrace = console.trace;
console.olddebug = console.debug;
console.oldinfo = console.info;
console.oldwarn = console.warn;
console.olderror = console.error;

function log() {
    // const info = stackInfo();
    process.stdout.write(getHeader('-[LOG]-'));
    console.oldlog(...arguments);
}

function trace() {
    // const info = stackInfo();
    process.stdout.write(getHeader('-[TRACE]-'));
    console.oldtrace(...arguments);
}

function info() {
    // const info = stackInfo();
    process.stdout.write(getHeader('-[INFO]-'));
    console.oldinfo(...arguments);
}

function warn() {
    // const info = stackInfo();
    process.stdout.write(getHeader('-[WARN]-'));
    console.oldwarn(chalk.yellow(...arguments));
}

function error() {
    // const info = stackInfo();
    process.stderr.write(getHeader('-[ERROR]-'));
    console.olderror(chalk.red(...arguments));
}

function debug() {
    // const info = stackInfo();
    process.stdout.write(getHeader('-[DEBUG]-'));
    console.olddebug(...arguments);
}

console.log = log;
console.debug = debug;
console.trace = trace;
console.info = info;
console.warn = warn;
console.error = error;

global.log = log;
global.debug = debug;
global.trace = trace;
global.info = info;
global.warn = warn;
global.error = error;
