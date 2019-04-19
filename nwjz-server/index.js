import mongoose from 'mongoose';
import util from 'util';

// config should be imported before importing any other file
import config from './config/config';
import app from './config/express';
import wx_app from './config/wx_express';
import mp_app from './config/mp_express';
import xcx_app from './config/xcx_express';
import xcxcard_app from './config/xcxcard_express';

const debug = require('debug')('express-mongoose-es6-rest-api:index');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.connect(mongoUri, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${mongoUri}`);
});

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
    mongoose.set('debug', (collectionName, method, query, doc) => {
        debug(
            `${collectionName}.${method}`,
            util.inspect(query, false, 20),
            doc
        );
    });
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
    // listen on port config.port
    app.listen(config.port, () => {
        console.info(
            `NWJZ API server started on port ${config.port} (${config.env})`
        ); // eslint-disable-line no-console
    });
    // wx_app.listen(config.wx_port, () => {
    //     console.info(
    //         `APP payment notify server started on port ${config.wx_port} (${
    //             config.env
    //         })`
    //     ); // eslint-disable-line no-console
    // });
    // mp_app.listen(config.mp_port, () => {
    //     console.info(
    //         `MP payment notify server started on port ${config.mp_port} (${
    //             config.env
    //         })`
    //     ); // eslint-disable-line no-console
    // });
    // xcx_app.listen(config.xcx_port, () => {
    //     console.info(
    //         `XCX payment notify server started on port ${config.xcx_port} (${
    //             config.env
    //         })`
    //     ); // eslint-disable-line no-console
    // });
    // xcxcard_app.listen(config.xcxcard_port, () => {
    //     console.info(
    //         `XCXCARD payment notify server started on port ${
    //             config.xcxcard_port
    //         } (${config.env})`
    //     ); // eslint-disable-line no-console
    // });
}

export default app;
