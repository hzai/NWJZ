<template>
    <view-box ref="viewBox">
        <group :gutter="10">
            <cell>
                <span slot="title" style="font-size:14px;">订单号: {{order.order_code}}</span>
            </cell>
            <cell-box>
                <flexbox :gutter="0">
                    <flexbox-item :span="1/5">
                        <img :src="orderService.primary_pic" style="width:60px;height:60px;" />
                    </flexbox-item>
                    <flexbox-item style="background-color:white;">
                        <div style="display:flex;flex-direction: column;flex-wrap: wrap;">
                            <span style="font-size:14px;font-weight:400;padding-bottom:3px; ">{{orderService.title}}</span>
                            <span style="font-size:12px; padding-bottom:5px;"> {{orderService.sub_title}}</span>
                            <span style="font-size:14px;color:#EC615D;">¥ {{orderService.sale_price | keepTwoNum}}
                                <span style="font-size:14px;color:#4f4f4f" v-if="!orderService.is_strict_selection && orderService.need_choose_time">/小时</span>
                            </span>
                            <span style="font-size:12px;align-self:flex-end;margin-top:-20px;color:#8f8f8f">数量：x{{order.quantity}}</span>
                        </div>
                    </flexbox-item>
                </flexbox>
            </cell-box>
            <cell-box>
                <div style="width:100%;padding:5px 0;">
                    <span style="font-size:15px;">总金额</span>
                    <span style="float:right;font-size:15px;color:red;font-weight:500;color:#EC615D;">¥ {{order.amount_payable | keepTwoNum}}</span>
                    <br />
                    <span style="font-size:15px;">优惠</span>
                    <span style="float:right;font-size:15px;color:red;font-weight:500;">-¥ {{order.coupon_reduce_price | keepTwoNum}}</span>
                </div>
            </cell-box>
        </group>
        <!-- 底部预定按钮 -->
        <div class="divfooter" slot="bottom" style="height:50px;">
            <flexbox style="width:100%;height:100%;">
                <flexbox-item style="height:100%;">
                    <div style="text-align:right;line-height:50px;font-size:14px;">
                        实付款:
                        <span style="font-size:17px;color:red;font-weight:500;color:#d6171c;">¥ {{order.amount_payable - order.coupon_reduce_price | keepTwoNum}}</span>
                    </div>
                </flexbox-item>
                <flexbox-item :span="4" @click.native="payOrder(order)" style="background:#d6171c;height:100%;line-height:50px;color:white;font-size:17px;text-align:center;font-weight:800;">
                    立即支付
                </flexbox-item>
            </flexbox>
        </div>
    </view-box>
</template>

<script>
import {
    Group,
    Cell,
    CellBox,
    Flexbox,
    FlexboxItem,
    Radio,
    XButton,
    ViewBox,
    TransferDom,
    Popup,
    dateFormat,
    XInput
} from 'vux'
import {
    fetchOrder,
    wechatAppPay,
    wechatMPPay
} from 'utils/api'
import { isWechat, isMobile } from 'utils/whatdevice'
import { wexinPay } from 'utils/weixinPay'
import { getStore } from 'utils/mUtils'
import { mapActions } from 'vuex'
export default {
    directives: {
        TransferDom
    },
    components: {
        Group,
        Cell,
        CellBox,
        Flexbox,
        FlexboxItem,
        Radio,
        XButton,
        ViewBox,
        Popup,
        XInput
    },
    data() {
        return {
            order: {
                coupon_reduce_price: 0

            },
            orderService: {},
            radioOptions: [
                {
                    icon: 'icon-weixinzhifu',
                    key: '01',
                    value: '微信支付'
                }
            ],
            openId: getStore('WX_OPEN_ID')
        }
    },
    filters: {
        dateTimeFormatFilter(datetime) {
            return dateFormat(new Date(datetime), 'YYYY-MM-DD')
        },
        couponLenFilter(value) {
            if (value > 0) {
                return value + '张可用'
            } else {
                return '暂无可用'
            }
        }
    },
    created() {
        this.setPageTitle('订单支付')
        this.fetchData()
    },
    computed: {
    },
    methods: {
        ...mapActions([
            'setPageTitle'
        ]),
        onCodeChange() {
            this.coupon_code_valid = !this.$refs.coupon_code.valid
        },
        async fetchData() {
            const _id = this.$route.query.orderId
            if (_id) {
                const res = await fetchOrder(_id)
                console.log(res)
                if (res.status === 0 && res.data.order) {
                    this.order = res.data.order
                    this.orderService = res.data.order.service
                }
            }
        },
        async payOrder(order) {
            if (order) {
                // const res = await payOrder(order._id, order)
                // console.log(res)
                // if (res.status === 0 && res.data.order) {
                if (isWechat() && isMobile()) {
                    const params = {
                        out_trade_no: order.order_code,
                        body: order.service.title,
                        total_fee: order.amount_payable - order.coupon_reduce_price, // 直接以元为单位 // TODO.
                        spbill_create_ip: '127.0.0.1', // 客户端ip
                        openId: this.openId
                    }
                    const result = await wechatMPPay(params)
                    console.log(result)
                    if (result.status === 0 && result.data.params.appId) {
                        wexinPay(result.data.params, (res) => {
                            this.TDAPP('D005', '用户微信支付成功')
                            this.$vux.toast.show(
                                { text: '微信支付成功', width: '12em' }
                            )
                            console.log(res)
                            this.$router.push({
                                path: '/order'
                            })
                        }, (cancel) => {
                            this.TDAPP('D00161', '用户取消微信支付')
                            this.$vux.toast.show(
                                {
                                    type: 'cancel',
                                    text: '取消支付',
                                    width: '12em'
                                }
                            )
                        }, (err) => {
                            this.TDAPP('D00162', '用户微信支付失败')
                            this.$vux.toast.show(
                                { type: 'cancel', text: '微信支付失败', width: '12em' }
                            )
                            console.log(err)
                        })
                    } else {
                        this.TDAPP('D00163', '用户微信支付失败')
                        this.$vux.toast.show(
                            { type: 'cancel', text: '微信支付失败', width: '12em' }
                        )
                    }
                } else if (!isWechat() && isMobile()) {
                    const params = {
                        out_trade_no: order.order_code,
                        body: order.service.title,
                        total_fee: order.amount_payable - order.coupon_reduce_price, // 直接以元为单位 // TODO.
                        spbill_create_ip: '127.0.0.1' // 客户端ip
                    }
                    const result = await wechatAppPay(params)
                    console.log(result)
                    if (result.status === 0 && result.data.params) {
                        window.Wechat.sendPaymentRequest(result.data.params, () => {
                            console.log('Success')
                            this.$vux.toast.show({
                                text: '订单支付成功', width: '12em'
                            })
                            this.$router.push({
                                path: '/order'
                            })
                        }, (reason) => {
                            this.$vux.toast.show({
                                type: 'cancel',
                                text: '订单支付失败', width: '12em'
                            })
                            console.log('Failed' + reason)
                        })
                    }
                }
                // }
            }
        }
    }
}
</script>

<style lang="less">
</style>

