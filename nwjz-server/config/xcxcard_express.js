import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import httpStatus from 'http-status';
import expressWinston from 'express-winston';
import expressValidation from 'express-validation';
import helmet from 'helmet';
import winstonInstance from './winston';
import config from './config';
import APIError from '../server/helpers/APIError';
import { handlePayOrder } from './order';

const tenpay = require('tenpay');

const passport = require('passport');
require('./passport');

const app = express();

if (config.env === 'development') {
    app.use(logger('dev'));
}

// parse body params and attache them to req.body
app.use(bodyParser.text({ type: '*/xml' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// 引入EventEmitter事件对象
const Events = require('events').EventEmitter;

// 设置全局所有已实例化EventEmitter事件对象的变量的可注册最大数，默认为：10个
Events.defaultMaxListeners = 50;

// enable detailed API logging in dev env
// if (config.env === 'development') {
//   expressWinston.requestWhitelist.push('body');
//   expressWinston.responseWhitelist.push('body');
//   app.use(expressWinston.logger({
//     winstonInstance,
//     meta: false, // optional: log meta data about request (defaults to true)
//     msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
//     colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
//   }));
// }

app.use(passport.initialize());

const router = express.Router();

const app_wechat_config = {
    appid: config.wechat.wx_xcxcard_appid, // app的appid
    mchid: config.wechat.wx_mp_mch_id, // 商户Id
    partnerKey: config.wechat.wx_mp_mch_key, // 商户密钥
    notify_url: config.wechat.wx_xcxcard_payment_notify_url, // 通知地址
    spbill_create_ip: '127.0.0.1'
    // pfx: fs.readFileSync('<location-of-your-apiclient-cert.p12>') // 可选, 退款等情况时需要用到
};

const Tenpay = new tenpay(app_wechat_config);

router.post('/pay/notify', Tenpay.middlewareForExpress('pay'), (req, res) => {
    const info = req.weixin;
    //     { appid: 'wxa3f0a849e754785c',
    //   bank_type: 'CFT',
    //   cash_fee: '1',
    //   fee_type: 'CNY',
    //   is_subscribe: 'N',
    //   mch_id: '1499346172',
    //   nonce_str: 'yimo7nz2t5Ofh5lU',
    //   openid: 'odOa11Q1JjmKO6qBie3vk1-_FpkA',
    //   out_trade_no: '20180319223802653904',
    //   result_code: 'SUCCESS',
    //   return_code: 'SUCCESS',
    //   sign: '29348AD10A146EC52350592CCAEC4770',
    //   time_end: '20180319223816',
    //   total_fee: '1',
    //   trade_type: 'APP',
    //   transaction_id: '4200000093201803191889529573' }
    // 业务逻辑...
    handlePayOrder(info);
    // 回复成功消息
    res.reply();
    // 回复错误消息
    // res.reply('错误信息');
});

// mount all routes on /api path
app.use('/xcxcard', router);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
    if (err instanceof expressValidation.ValidationError) {
        // validation error contains errors which is an array of error each containing message[]
        const unifiedErrorMessage = err.errors
            .map(error => error.messages.join('. '))
            .join(' and ');
        const error = new APIError(unifiedErrorMessage, err.status, true);
        return next(error);
    } else if (!(err instanceof APIError)) {
        const apiError = new APIError(err.message, err.status, err.isPublic);
        return next(apiError);
    }
    return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new APIError('API not found', httpStatus.NOT_FOUND);
    return next(err);
});

// log error in winston transports except when executing test suite
if (config.env !== 'test') {
    app.use(
        expressWinston.errorLogger({
            winstonInstance
        })
    );
}

// error handler, send stacktrace only during development
app.use((
    err,
    req,
    res,
    next // eslint-disable-line no-unused-vars
) =>
    res.status(err.status).json({
        status: err.status,
        type: 'ERROR',
        message: err.isPublic ? err.message : httpStatus[err.status],
        stack: config.env === 'development' ? err.stack : {}
    })
);

export default app;
