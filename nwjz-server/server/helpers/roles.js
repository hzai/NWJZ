/*
 * @Author: Roy Chen 
 * @Date: 2017-12-13 00:58:33 
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2017-12-13 01:37:54
 */
module.exports = roles => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return function(req, res, next) {
        if (!req || !req.payload) {
            next();
        }

        const userRoles = req.payload.roles || [];
        console.log(userRoles);
        const foundRoles = roles.filter(r => userRoles.some(ur => ur === r));

        if (!foundRoles.length) {
            return res.status(403).json({
                status: 403,
                type: 'ERROR_FORBIDDEN',
                message: '您没有权限访问资源'
            });
        }

        return next();
    };
};
