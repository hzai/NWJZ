/*
 * @Author: Roy Chen
 * @Date: 2019-04-03 20:44:52
 * @Last Modified by:   Roy Chen
 * @Last Modified time: 2019-04-03 20:44:52
 */
const viewGenerator = require('./plop-templates/view/prompt');
const componentGenerator = require('./plop-templates/component/prompt');

module.exports = function(plop) {
    plop.setGenerator('view', viewGenerator);
    plop.setGenerator('component', componentGenerator);
};
