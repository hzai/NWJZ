<template>
    <view-box ref="viewBox">
        <div>
            <group :gutter="0" style="">
                <cell-box style="background-color:#00AF3F;">
                    <div style="background-color:#fff;border:1px solid #fff;width:100%;text-align:center;padding:10px;border-radius:5px;">
                        <span style="color:#00AF3F;font-weight:500;">{{showOrderStatus(order.status)}}</span>
                    </div>
                </cell-box>
            </group>
            <group :gutter="0">
                <cell-box>
                    <flexbox :gutter="5">
                        <flexbox-item>
                            <div>
                                <i slot="icon" class="iconfont icon-dingwei" style="font-size:18px;color:#00AF3F"></i>
                            </div>
                        </flexbox-item>
                        <flexbox-item :span="9/10">
                            <div style="display:flex;flex-direction:column;padding-left:5px;">
                                <span style="font-size:14px;">联系人: {{orderAddress.contact_person}}</span>
                                <span style="font-size:14px;align-self:flex-end;margin-top:-20px;">{{orderAddress.contact_phone}}</span>
                                <span style="font-size:14px;padding-top:5px;">服务地址: {{getAddressDetail(orderAddress.area, orderAddress.detail_address)}}</span>
                            </div>
                        </flexbox-item>
                    </flexbox>
                </cell-box>
            </group>
            <group :gutter="10">
                <cell-box>
                    <flexbox :gutter="0">
                        <flexbox-item :span="1/5">
                            <img :src="orderService.primary_pic" style="width:60px;height:60px;">
                        </flexbox-item>
                        <flexbox-item style="background-color:white;">
                            <div style="display:flex;flex-direction: column;flex-wrap: wrap;">
                                <span style="font-size:14px;font-weight:400;padding-bottom:3px; ">{{orderService.title}}</span>
                                <span style="font-size:12px; padding-bottom:5px;"> {{orderService.sub_title}}</span>
                                <span style="font-size:14px;color:#EC615D">¥ {{orderService.sale_price | keepTwoNum}}
                                    <span style="font-size:14px;color:#4f4f4f">{{orderService.price_unit}}</span>
                                </span>
                                <span style="font-size:12px;align-self:flex-end;margin-top:-20px;color:#8f8f8f">数量：x{{order.quantity}}</span>
                            </div>
                        </flexbox-item>
                    </flexbox>
                </cell-box>
                <cell-box v-if="!orderService.is_strict_selection && order.service_time !== null">
                    <div>
                        <span style="font-size:14px;">服务时间:</span>
                        <span style="font-size:14px;padding-left:10px;">{{order.service_time | dateTimeFormatFilter}}</span>
                    </div>
                </cell-box>
                <cell-box v-if="order.service.category === 'ZYYS'">
                    <div>
                        <span style="font-size:14px;">预产日期:</span>
                        <span style="font-size:14px;padding-left:10px;">{{order.expected_baby_date | dateTimeFormatFilter3}}</span>
                    </div>
                </cell-box>
                <cell-box v-if="order.is_reserve_order">
                    <div style="width:100%">
                        <span style="font-size:14px;">详细需求:</span>
                        <flexbox :gutter="10" v-for="(cat, index) in requirementsData[order.service.category]" :key="index" style="padding-bottom:6px;">
                            <flexbox-item :span="2" style="text-align:right;">
                                <span style="font-size:12px;">{{cat.label}}</span>
                            </flexbox-item>
                            <flexbox-item :justify="2">
                                <checker :type="cat.type" v-model="order.requirements[index]" default-item-class="demo5-item" selected-item-class="demo5-item-selected">
                                    <checker-item style="margin-top:6px;" :disabled="true" v-for="(item, index2) in cat.item" :key="index2" :value="item.value">{{item.value}}</checker-item>
                                </checker>
                            </flexbox-item>
                        </flexbox>
                    </div>
                </cell-box>
                <cell-box>
                    <div>
                        <span style="font-size:14px;">服务需求:</span>
                        <span style="font-size:12px;padding-left:10px;">{{order.memo}}</span>
                    </div>
                </cell-box>
                <cell-box v-if="!order.is_reserve_order">
                    <flexbox orient="vertical" :gutter="0">
                        <flexbox-item>
                            <div style="display:flex;flex-direction: column;flex-wrap: wrap;padding-top:5px;">
                                <span style="font-size:14px;">总金额</span>
                                <span style="font-size:14px;align-self:flex-end;margin-top:-15px;">¥ {{isNaN(order.amount_payable) ? 0 : order.amount_payable | keepTwoNum}}</span>
                            </div>
                        </flexbox-item>
                        <flexbox-item>
                            <div style="display:flex;flex-direction: column;flex-wrap: wrap;padding-top:5px;">
                                <span style="font-size:12px;">优惠</span>
                                <span style="font-size:12px;align-self:flex-end;margin-top:-15px;">-¥ {{isNaN(order.coupon_reduce_price) ? 0 : order.coupon_reduce_price | keepTwoNum}}</span>
                            </div>
                        </flexbox-item>
                        <flexbox-item>
                            <div style="display:flex;flex-direction: column;flex-wrap: wrap;padding-top:5px;">
                                <span style="font-size:12px;">余额抵扣</span>
                                <span style="font-size:12px;align-self:flex-end;margin-top:-15px;">-¥ {{order.balance_reduce_price | keepTwoNum}}</span>
                            </div>
                        </flexbox-item>
                        <flexbox-item>
                            <div style="display:flex;flex-direction: column;flex-wrap: wrap;padding-top:5px;">
                                <span style="font-size:14px;">应付款</span>
                                <span style="font-size:14px;align-self:flex-end;margin-top:-19px;color:#EC615D;">¥ {{isNaN(order.amount_payable - order.coupon_reduce_price) ? 0 : order.amount_payable - order.coupon_reduce_price - order.balance_reduce_price | keepTwoNum}}</span>
                            </div>
                        </flexbox-item>
                        <flexbox-item v-if="order.status !== 0">
                            <div style="display:flex;flex-direction: column;flex-wrap: wrap;padding-top:5px;">
                                <span style="font-size:14px;">实付款</span>
                                <span style="font-size:14px;align-self:flex-end;margin-top:-18px;color:#EC615D;">¥ {{order.amount_paid | keepTwoNum}}</span>
                            </div>
                        </flexbox-item>
                    </flexbox>
                </cell-box>
            </group>

            <group :gutter="10">
                <cell-box>
                    <flexbox orient="vertical" :gutter="0">
                        <flexbox-item>
                            <span style="font-size:12px;color:#8f8f8f;">订单编号: {{order.order_code}}</span>
                        </flexbox-item>
                        <flexbox-item>
                            <span style="font-size:12px;color:#8f8f8f;">下单时间: {{order.created_time | dateTimeFormatFilter2}}</span>
                        </flexbox-item>
                    </flexbox>
                </cell-box>
            </group>
        </div>
        <!-- 底部预定按钮 -->
        <div class="divfooter" slot="bottom">
            <!-- 待支付 -->
            <div v-if="order.status === 0 && !order.is_reserve_order" style="height:100%;text-align:right;">
                <x-button type="primary" style="margin-right:8px;" class="default_button" plain mini @click.native="cancelOrder(order)">取消订单</x-button>
                <x-button type="primary" style="margin-right:8px;" class="default_button" plain mini @click.native="phoneCall()">联系客服</x-button>
                <x-button type="primary" style="margin-right:8px;" class="focus_button" plain mini @click.native="toPayOrder(order)">去支付</x-button>
            </div>
            <!-- 订单关闭 or 订单完成 -->
            <div v-if="order.status !== 0 && order.status !== 5" style="height:100%;text-align:right;">
                <x-button v-if="order.status === 2" type="primary" style="margin-right:8px;" class="focus_button" plain mini @click.native="goComment(order)">评价</x-button>
                <x-button type="primary" style="margin-right:8px;" class="default_button" plain mini @click.native="phoneCall()">联系客服</x-button>
                <x-button type="primary" style="margin-right:8px;" class="focus_button" plain mini @click.native="toSubmitOrder(orderService)">再次购买</x-button>
            </div>
            <div v-if="order.status === 5" style="height:100%;text-align:right;">
                <x-button type="primary" style="margin-right:8px;" class="default_button" plain mini @click.native="cancelOrder(order)">取消订单</x-button>
                <x-button type="primary" style="margin-right:8px;" class="default_button" plain mini @click.native="phoneCall()">联系客服</x-button>
            </div>
        </div>
    </view-box>
</template>

<script>
import {
    Group,
    CellBox,
    Cell,
    Flexbox,
    FlexboxItem,
    XButton,
    ViewBox,
    dateFormat,
    Value2nameFilter as value2name,
    Divider,
    Checker,
    CheckerItem
} from 'vux'
import {
    fetchOrder,
    updateOrderStatus
} from 'utils/api'
import addressData from 'data/address'
import requirementsData from 'data/requirements'
import { mapActions } from 'vuex'
export default {
    components: {
        Group,
        CellBox,
        Cell,
        Flexbox,
        FlexboxItem,
        XButton,
        ViewBox,
        Divider,
        Checker,
        CheckerItem
    },
    created() {
        this.TDAPP('D104', '用户打开订单详情')
        this.setPageTitle('订单详情')
    },
    mounted() {
        this.fetchData()
    },
    data() {
        return {
            addressData,
            requirementsData,
            order: {
                service: {
                    category: ''
                }
            },
            orderAddress: {
                area: []
            },
            orderService: {}
        }
    },
    filters: {
        dateTimeFormatFilter(datetime) {
            if (datetime === null) {
                return '待预约'
            }
            return dateFormat(new Date(datetime), 'YYYY-MM-DD HH:mm')
        },
        dateTimeFormatFilter2(datetime) {
            return dateFormat(new Date(datetime), 'YYYY年MM月DD日 HH:mm:ss')
        },
        dateTimeFormatFilter3(datetime) {
            return dateFormat(new Date(datetime), 'YYYY-MM-DD')
        }
    },
    methods: {
        ...mapActions([
            'setPageTitle'
        ]),
        phoneCall() {
            this.TDAPP('D200', '用户在订单详情页点击按钮: ' + '联系客服')
            window.location.href = 'tel://075583222339'
        },
        getAddressDetail(area, detail_address) {
            return value2name(area, this.addressData) + detail_address
        },
        toSubmitOrder(service) {
            this.TDAPP('D201', '用户在订单详情页点击按钮: ' + '再次购买')
            if (service.is_card) {
                this.$router.push({
                    path: 'submitcardorder',
                    query: {
                        serviceId: service._id
                    }
                })
            } else {
                this.$router.push({
                    path: 'submitorder',
                    query: {
                        serviceId: service._id
                    }
                })
            }
        },
        goComment(order) {
            if (order) {
                this.$router.push({
                    path: '/comment',
                    query: {
                        orderId: order._id
                    }
                })
            }
        },
        // 0 - 待付款； 1 - 已付款； 2 - 待评价（暂时取消）； 3 - 已完成；4 - 订单关闭
        showOrderStatus(status) {
            switch (status) {
                case 0: return '待付款'
                case 1: return '已付款'
                case 2: return '待评价'
                case 3: return '已完成'
                case 4: return '交易关闭'
                case 5: return '待回访'
                case 6: return '已回访'
                case 7: return '已退款'
            }
        },
        async fetchData() {
            const _id = this.$route.query.orderId
            if (_id) {
                const res = await fetchOrder(_id)
                console.log(res)
                if (res.status === 0 && res.data.order) {
                    this.order = res.data.order
                    if (isNaN(this.order.coupon_reduce_price)) {
                        this.order.coupon_reduce_price = 0
                    }
                    this.orderAddress = res.data.order.address
                    this.orderService = res.data.order.service
                }
            }
        },
        toPayOrder(order) {
            this.TDAPP('D203', '用户在订单详情页点击按钮: ' + '去支付')
            if (order) {
                this.$router.push({
                    path: '/pay/payorder',
                    query: {
                        orderId: order._id
                    }
                })
            }
        },
        async cancelOrder(order) {
            this.TDAPP('D204', '用户在订单详情页点击按钮: ' + '取消订单')
            const res = await updateOrderStatus(order._id, 4)
            console.log(res)
            if (res.status === 0) {
                this.$vux.toast.show({
                    text: '取消订单成功',
                    width: '10em'
                })
                this.order.status = 4
                this.$router.push({
                    path: '/order'
                })
            } else {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: '取消订单失败',
                    width: '10em'
                })
            }
        }
    }
}
</script>


<style lang="less">
@import '../../assets/less/theme';
.demo5-item {
    width: 80px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    font-size: 12px;
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: #fff;
    margin-right: 6px;
}
.demo5-item-selected {
    background: #ffffff url(../../assets/images/active.png) no-repeat right
        bottom;
    border-color: @colorOne;
}
</style>
