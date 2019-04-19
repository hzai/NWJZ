/*
 * @Author: Roy Chen 
 * @Date: 2017-12-13 00:06:18 
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2017-12-15 12:08:14
 */
import passport from 'passport';
import passportLocal from 'passport-local';
import mongoose from 'mongoose';

const LocalStrategy = passportLocal.Strategy;
const Auth = mongoose.model('Auth');

passport.use('local.login', new LocalStrategy({
    usernameField: 'mobile'
}, (username, password, callback) => {
    Auth.findOne({
            identifier: username
        })
        .populate('user')
        .exec((err, auth) => {
            if (err) {
                return callback(err);
            }
            if (!auth) {
                return callback(null, false, '用户不存在');
            }
            if (!auth.validPassword(password)) {
                return callback(null, false, '密码错误');
            }
            return callback(null, auth);
        });
}));
