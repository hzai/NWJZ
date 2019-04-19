import Joi from 'joi';

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string()
        .allow(['development', 'production', 'test', 'provision'])
        .default('development'),
    PORT: Joi.number().default(4040),
    MONGOOSE_DEBUG: Joi.boolean().when('NODE_ENV', {
        is: Joi.string().equal('development'),
        then: Joi.boolean().default(true),
        otherwise: Joi.boolean().default(false)
    }),
    JWT_SECRET: Joi.string()
        .required()
        .description('JWT Secret required to sign'),
    MONGO_HOST: Joi.string()
        .required()
        .description('Mongo DB host url'),
    MONGO_PORT: Joi.number().default(27017)
})
    .unknown()
    .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    wx_port: envVars.WX_PORT,
    mp_port: envVars.MP_PORT,
    xcx_port: envVars.XCX_PORT,
    xcxcard_port: envVars.XCXCARD_PORT,
    mongooseDebug: envVars.MONGOOSE_DEBUG,
    jwtSecret: envVars.JWT_SECRET,
    mongo: {
        host: envVars.MONGO_HOST,
        port: envVars.MONGO_PORT
    },
    identity_type: {
        system: envVars.IDENTITY_TYPE_SYSTEM,
        mobile: envVars.IDENTITY_TYPE_MOBILE,
        wechat: envVars.IDENTITY_TYPE_WECHAT,
        company: envVars.IDENTITY_TYPE_COMPANY
    },
    redis: {
        rhost: envVars.REDIS_SERVER_HOST,
        port: envVars.REDIS_SERVER_PORT,
        pwd: envVars.REDIS_SERVER_PWD,
        smd_db: envVars.REDIS_DB_NUM_SMS
    },
    sms: {
        switch: envVars.SMS_SEND_SWITCH,
        accessKeyId: envVars.ALIDAYU_APP_KEY,
        secretAccessKey: envVars.ALIDAYU_APP_SECRET,
        expiredTime: envVars.SMS_EXPIRED_TIME,
        registerTemplateCode: envVars.REGISTER_SMS_TEMPLATE_CODE,
        forgetTemplateCode: envVars.FORGET_SMS_TEMPLATE_CODE,
        pickOrderTemplateCode: envVars.PICK_ORDER_SMS_TEMPLATE_CODE,
        expiredPapmReminderTemplateCode: envVars.EXPIRED_PAPM_SMS_TEMPLATE_CODE
    },
    wechat: {
        wx_mp_appid: envVars.WX_MP_APPID,
        wx_mp_secret: envVars.WX_MP_SECRET,
        wx_mp_redirect_url: envVars.WX_MP_REDIRECT_URL,
        wx_mp_redirect_silence_url: envVars.WX_MP_REDIRECT_SILENCE_URL,
        wx_mp_mch_id: envVars.WX_MP_MCH_ID,
        wx_mp_mch_key: envVars.WX_MP_MCH_KEY,
        wx_mp_payment_notify_url: envVars.WX_MP_PAYMENT_NOTIFY_URL,
        wx_payment_return_url: envVars.WX_PAYMENT_RETURN_URL,
        wx_app_appid: envVars.WX_APP_APPID,
        wx_app_secret: envVars.WX_APP_SECRET,
        wx_app_mch_id: envVars.WX_APP_MCH_ID,
        wx_app_mch_key: envVars.WX_APP_MCH_KEY,
        wx_app_payment_notify_url: envVars.WX_APP_PAYMENT_NOTIFY_URL,
        wx_xcx_appid: envVars.WX_XCX_APPID,
        wx_xcx_secret: envVars.WX_XCX_SECRET,
        wx_xcx_payment_notify_url: envVars.WX_XCX_PAYMENT_NOTIFY_URL,
        wx_xcxcard_appid: envVars.WX_XCXCARD_APPID,
        wx_xcxcard_secret: envVars.WX_XCXCARD_SECRET,
        wx_xcxcard_payment_notify_url: envVars.WX_XCXCARD_PAYMENT_NOTIFY_URL,
        wx_admin_xcx_appid: envVars.WX_ADMIN_XCX_APPID,
        wx_admin_xcx_secret: envVars.WX_ADMIN_XCX_SECRET,
    },
    jpush: {
        app_key: envVars.JPUSH_APP_KEY,
        app_secret: envVars.JPUSH_APP_SECRET
    },
    qiniu: {
        access_key: envVars.QN_ACCESS_KEY,
        secret_key: envVars.QN_SECRET_KEY,
        bucket: envVars.QN_BUCKET
    }
};

export default config;
