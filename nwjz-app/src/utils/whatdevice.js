/*
 * @Author: Roy Chen
 * @Date: 2018-03-16 11:49:51
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2018-09-03 20:59:45
 */

const ua = window.navigator.userAgent.toLowerCase()

/**
 * 是否微信浏览器：返回Boolean。
 */
export const isWechat = () => {
    console.log(ua)
    return /(?:micromessenger)/.test(ua)
}
/**
 * 是否移动设备：返回Boolean。
 */
export const isMobile = () => {
    return /(?:micromessenger|mobile|iphone|ipod|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|windows phone|win ce)/.test(
        ua
    )
}
// export const go2mob = () => {
//     var mobUrl = arguments[0] // 参数1
//     var myArg = []
//     myArg = window.location.search.substr(1).match(/(^|&)itsme=([^&]*)(&|$)/i) // 获取URL参数itsme
//     var itsme = (myArg != null && myArg[2] != null) ? myArg[2] : 0
//     if (itsme != 1 && mobUrl != null && isMobile) {
//         window.location.href = mobUrl
//     }
// }

/*
* 是否苹果手机：返回Boolean。
*/
export const isiPad = () => {
    return /(?:ipad)/.test(ua)
}

/*
* 是否苹果手机：返回Boolean。
*/
export const isiOS = () => {
    return /(?:iphone|ipad)/.test(ua)
}
/*
* 是否安卓手机：返回Boolean。
*/
export const isAndroid = () => {
    return /(?:android)/.test(ua)
}
/**
* 是否微信小程序：返回Boolean。
*/
export const isMiniProgram = () => {
    return window.__wxjs_environment === 'miniprogram'
}
