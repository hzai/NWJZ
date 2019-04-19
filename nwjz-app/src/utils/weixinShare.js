const wx = require('weixin-js-sdk')
/*
微信分享方法
获取微信加签信息
@param{data}:获取的微信加签
@param{cb}:成功回调
*/
export const weixinShareTimeline = (data, cb, errorCb) => {
    const appId = data.signPackage.appId
    const timestamp = data.signPackage.timestamp
    const nonceStr = data.signPackage.nonceStr
    const signature = data.signPackage.signature
    // const url = data.url
    const urlp = data.urlp
    const title = data.title
    const timeLineTitle = data.tmtitle
    const desc = data.desc
    const imgUrl = data.piz

    console.log(data)
    // const packages = data.package
    // const paySign = data.paySign

    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: appId, // 必填，公众号的唯一标识
        timestamp: timestamp, // 必填，生成签名的时间戳
        nonceStr: nonceStr, // 必填，生成签名的随机串
        signature: signature, // 必填，签名，见附录1
        jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    })
    wx.ready(function() {
        wx.error(function(res) {
            console.log('in error')
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            // console.log('errorMSG:', res)
        })
        wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: desc,
            link: urlp, // 分享链接,将当前登录用户转为puid,以便于发展下线
            imgUrl: imgUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function() {
                // 用户确认分享后执行的回调函数
                // alert('分享成功')
                // console.log('success!!!!!!!!!!')
                cb('1')
            },
            cancel: function() {
                // console.log('cancel!')
                // 用户取消分享后执行的回调函数
            }
        })
        wx.onMenuShareTimeline({
            title: timeLineTitle === '' ? title : timeLineTitle, // 分享标题
            link: urlp, // 分享链接,将当前登录用户转为puid,以便于发展下线
            imgUrl: imgUrl, // 分享图标
            success: function() {
                // 用户确认分享后执行的回调函数
                // alert('分享成功')
                cb('2')
            },
            cancel: function() {
                // 用户取消分享后执行的回调函数
            }
        })
    })
}
