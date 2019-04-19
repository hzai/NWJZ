<template>
    <div id="order-view" class="container-view">
        <!-- 订单状态 -->
        <div style="height:44px;">
            <sticky scrollBox="vux_view_box_body" :check-sticky-support="false" :offset="46">
                <tab v-model="orderType" prevent-default @on-before-index-change="switchTabItem">
                    <tab-item>我的订单</tab-item>
                    <tab-item>我的服务</tab-item>
                    <tab-item>未预约服务</tab-item>
                </tab>
            </sticky>
        </div>
        <div v-transfer-dom>
            <loading :show="show1" text="加载中..."></loading>
        </div>
        <!-- 我的订单 -->
        <div v-if="tabIndex === 0">
            <card v-if="orders.length>0" v-for="(order, index) in orders" :key="index">
                <!-- header -->
                <div slot="header" style="display:flex;padding:8px 10px;">
                    <div style="text-align:left;">
                        <i class="iconfont icon-fenlei" style="color:#00AF3F;font-size:18px;padding:0 5px;"></i>
                    </div>
                    <div style="flex:1;text-align:left;">
                        <span style="color:#00AF3F;font-size:13px;font-weight:500;">了了管家</span>
                    </div>
                    <div style="text-align:right;">
                        <span style="font-size:13px;font-weight:500;" :style="orderStatusColor(order.status)">{{orderStatus(order.status)}}</span>
                    </div>
                </div>
                <!-- content -->
                <div slot="content" style="padding:10px;background-color:#f9f9f9;" @click="orderdetail(order)">
                    <div class="order-card">
                        <img :src="order.service.primary_pic" class="col-left">
                        <div class="col-right">
                            <h1 class="col-title"> {{order.service.title}}</h1>
                            <h2 class="col-content">{{getAddressDetail(order.address.area,order.address.detail_address)}}</h2>
                            <h2 class="col-content">数量：x{{order.quantity}}</h2>
                        </div>
                        <div class="col-price" v-if="!order.is_reserve_order">
                            <span class="col-money-span">¥ {{order.amount_payable | keepTwoNum}}</span>
                        </div>
                    </div>
                </div>
                <!-- footer -->
                <!-- 待付款 -->
                <div slot="footer" v-if="order.status === 0 && !order.is_reserve_order" style="border-top:1px solid #dfdfdf;">
                    <flexbox align="center" style="padding: 5px 0;">
                        <flexbox-item style="text-align: right">
                            <div>
                                <x-button style="margin:0 10px;" type="primary" class="focus_button" plain mini @click.native="toPayOrder(order)">支付订单</x-button>
                            </div>
                        </flexbox-item>
                    </flexbox>
                </div>
                <div slot="footer" v-if="order.status === 2 && !order.is_reserve_order" style="border-top:1px solid #dfdfdf;">
                    <flexbox align="center" style="padding: 5px 0;">
                        <flexbox-item style="text-align: right">
                            <div>
                                <x-button style="margin:0 10px;" type="primary" class="focus_button" plain mini @click.native="goComment(order)">评价</x-button>
                            </div>
                        </flexbox-item>
                    </flexbox>
                </div>
            </card>
            <br />
            <div v-if="orders.length<1" style="padding-top:150px;" @click="toHome()">
                <div style="text-align:center;">
                    <i class="iconfont icon-qunfengzanwudingdan" style="color:#cfcccc;font-size:60px;"></i>
                </div>
                <div style="text-align:center;padding-top:20px;">
                    <span style="color:#cfcccc">您还没有订单</span>
                </div>
            </div>
        </div>
        <!-- 我的服务 -->
        <div v-if="tabIndex === 1">
            <card v-if="appointments.length>0" v-for="appointment in appointments" :key="appointment._id">
                <!-- header -->
                <div slot="header" style="display:flex;padding:8px 10px;">
                    <div style="text-align:left;flex:1;">
                        <span style="color:#00AF3F;font-size:13px;font-weight:500;">{{appointment.suit_title}}</span>
                    </div>
                    <div style="text-align:right;">
                        <span style="font-size:13px;color:#4f4f4f;font-weight:500;">{{appointmentStatus(appointment.status)}}</span>
                    </div>
                </div>
                <!-- content -->
                <div slot="content" style="padding:10px;background-color:#f9f9f9;" @click="apmdetail(appointment)">
                    <div class="order-card">
                        <img :src="appointment.order.service.primary_pic" class="col-left">
                        <div class="col-right">
                            <h1 class="col-title">{{category2Label(appointment.service_category)}}</h1>
                            <h2 class="col-content"> {{getAddressDetail(appointment.contact_area,appointment.contact_detail_address)}}</h2>
                        </div>
                    </div>
                </div>
                <!-- footer -->
                <div slot="footer" style="border-top:1px solid #dfdfdf;">
                    <flexbox align="center" style="padding: 5px 0;">
                        <flexbox-item style="padding-left:10px;">
                            <span style="font-size:12px;"> {{appointment.service_time | dateTimeFormatFilter2}}</span>
                        </flexbox-item>
                        <flexbox-item v-if="appointment.status < 3" style="text-align: right">
                            <div>
                                <x-button style="margin:0 10px;" type="primary" class="focus_button" plain mini @click.native="callWorker()">联系客服</x-button>
                            </div>
                        </flexbox-item>
                    </flexbox>
                </div>
            </card>
            <br />
            <div v-if="appointments.length<1" style="padding-top:150px;" @click="toHome()">
                <div style="text-align:center;">
                    <i class="iconfont icon-qunfengzanwudingdan" style="color:#cfcccc;font-size:60px;"></i>
                </div>
                <div style="text-align:center;padding-top:20px;">
                    <span style="color:#cfcccc">您还没有已预约的服务</span>
                </div>
            </div>
        </div>
        <!-- 未预约服务 -->
        <div v-if="tabIndex === 2">
            <card v-if="preapms.length>0" v-for="preapm in preapms" :key="preapm._id">
                <!-- header -->
                <div slot="header" style="display:flex;padding:8px 10px;">
                    <div style="text-align:left;flex:1;">
                        <span style="color:#00AF3F;font-size:13px;font-weight:500;">{{preapm.suit_title}}</span>
                    </div>
                    <div style="text-align:right;">
                        <span style="font-size:13px;color:#4f4f4f;font-weight:500;">{{preapmStatus(preapm.status)}}</span>
                    </div>
                </div>
                <!-- content -->
                <div slot="content" style="padding:10px;background-color:#f9f9f9;" @click="preapmdetail(preapm)">
                    <div class="order-card">
                        <img :src="preapm.service.primary_pic" class="col-left">
                        <div class="col-right">
                            <h1 class="col-title">{{category2Label(preapm.service.category)}}</h1>
                            <h2 class="col-content">地址: {{getAddressDetail(preapm.contact_area,preapm.contact_detail_address)}}</h2>
                        </div>
                        <div class="col-price">
                            <span class="col-price-span" v-if="preapm.times !== 0">X {{preapm.times}}</span>
                        </div>
                    </div>
                </div>
                <!-- footer -->
                <div slot="footer" style="border-top:1px solid #dfdfdf;">
                    <flexbox align="center" style="padding: 5px 0;">
                        <flexbox-item style="padding-left:10px;">
                            <span style="font-size:12px;">有效期至{{preapm.expired_date | dateTimeFormatFilter2}}</span>
                        </flexbox-item>
                        <flexbox-item :span="1/3" style="text-align: right" v-if="preapm.status === 0">
                            <div>
                                <x-button style="margin:0 10px;" type="primary" class="focus_button" plain mini @click.native="preapmdetail(preapm)">立即预约</x-button>
                            </div>
                        </flexbox-item>
                    </flexbox>
                </div>
            </card>
            <br />
            <div v-if="preapms.length<1" style="padding-top:150px;" @click="toHome()">
                <div style="text-align:center;">
                    <i class="iconfont icon-qunfengzanwudingdan" style="color:#cfcccc;font-size:60px;"></i>
                </div>
                <div style="text-align:center;padding-top:20px;">
                    <span style="color:#cfcccc">您还没有未预约的服务</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    Tab,
    TabItem,
    Card,
    XButton,
    Flexbox,
    FlexboxItem,
    Sticky,
    Value2nameFilter as value2name,
    dateFormat,
    Loading,
    TransferDomDirective as TransferDom
} from 'vux'
import {
    fetchServiceCategory,
    fetchOrderList,
    fetchAppointmentList,
    fetchPreAppointmentList
} from 'utils/api'
import addressData from 'data/address'
import { mapActions } from 'vuex'
export default {
    props: {
        selected: Number
    },
    directives: {
        TransferDom
    },
    components: {
        Tab,
        TabItem,
        Card,
        XButton,
        Flexbox,
        FlexboxItem,
        Sticky,
        Loading
    },
    created() {
        this.TDAPP('D100', '用户打开订单列表')
        this.setPageTitle('我的订单')
        this.fetchServiceCategory()
        this.getMyOrderData()
        this.getAppointmentData()
        this.getPreAppointmentData()
    },
    filters: {
        dateTimeFormatFilter(datetime) {
            return dateFormat(new Date(datetime), 'YYYY-MM-DD HH:mm')
        },
        dateTimeFormatFilter2(datetime) {
            return dateFormat(new Date(datetime), 'YYYY年MM月DD日 周E HH:mm')
        }
    },
    data() {
        return {
            addressData,
            orderType: 0,
            tabIndex: 0,
            haveUnservice: true,
            catsMap: {},
            orders: {},
            appointments: {
                order: {
                    service: {}
                }
            },
            preapms: {},
            show1: false
        }
    },
    methods: {
        ...mapActions([
            'setPageTitle'
        ]),
        onRightClick() { },
        onLeftClick() { },
        getAddressDetail(area, detail_address) {
            if (detail_address === undefined) {
                return ''
            } else {
                return value2name(area, this.addressData) + detail_address
            }
        },
        switchTabItem(index) {
            this.show1 = true
            this.orderType = index
            this.tabIndex = index
            switch (index) {
                case 0:
                    this.TDAPP('D101', '用户点击我的订单')
                    this.getMyOrderData()
                    break
                case 1:
                    this.TDAPP('D102', '用户点击我的服务')
                    this.getAppointmentData()
                    break
                case 2:
                    this.TDAPP('D103', '用户点击我的未预约服务')
                    this.getPreAppointmentData()
                    break
            }
        },
        toHome() {
            this.$router.push({
                path: '/'
            })
        },
        orderdetail(order) {
            this.$router.push({
                path: '/orderdetail',
                query: {
                    orderId: order._id
                }
            })
        },
        apmdetail(apm) {
            this.$router.push({
                path: '/apmdetail',
                query: {
                    apmId: apm._id
                }
            })
        },
        preapmdetail(preapm) {
            this.$router.push({
                path: '/preapmdetail',
                query: {
                    preapmId: preapm._id
                }
            })
        },
        servicedetail(service) {
            this.$router.push({
                path: '/serdetail',
                query: {
                    serviceId: service._id
                }
            })
        },
        onItemClick(index) {
            this.tabIndex = index
            console.log('on item click:', index)
        },
        // 0 - 待付款； 1 - 已付款； 2 - 待评价（暂时取消）； 3 - 已完成；
        orderStatus(status) {
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
        appointmentStatus(status) {
            switch (status) {
                case 0:
                    return '待分配'
                case 1:
                    return '已分配'
                case 2:
                    return '服务中'
                case 3:
                    return '服务完成'
                case 4:
                    return '服务取消'
                default:
                    '订单出错啦！！！'
            }
        },
        preapmStatus(status) {
            switch (status) {
                case 0:
                    return '待预约'
                case 1:
                    return '使用完毕'
                case 2:
                    return '已过期'
                case 3:
                    return '已退款'
                default:
                    '出错啦！！！'
            }
        },
        orderStatusColor(status) {
            if (status === 0) return 'color:#e44545;'
            else return 'color:#4f4f4f;'
        },
        category2Label(code) {
            if (this.catsMap[code] === undefined) {
                return code
            } else {
                return this.catsMap[code]
            }
        },
        toPayOrder(order) {
            if (order) {
                this.$router.push({
                    path: '/pay/payorder',
                    query: {
                        orderId: order._id
                    }
                })
            }
        },
        callWorker() {
            window.location.href = 'tel://075583222339'
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
        async fetchServiceCategory() {
            const res = await fetchServiceCategory()
            console.log(res)
            const cats = res.data.serviceCategories
            cats.forEach(item => {
                this.catsMap[item.code] = item.label
            })
        },
        async getMyOrderData() {
            const res = await fetchOrderList()
            console.log(res)
            if (res.status === 0 && res.data.orders) {
                this.orders = res.data.orders
            }
            this.show1 = false
        },
        async getAppointmentData() {
            const res = await fetchAppointmentList()
            console.log(res)
            if (res.status === 0 && res.data.appointments) {
                this.appointments = res.data.appointments
            }
            this.show1 = false
        },
        async getPreAppointmentData() {
            const res = await fetchPreAppointmentList()
            console.log(res)
            if (res.status === 0 && res.data.preappointment) {
                this.preapms = res.data.preappointment
            }
            this.show1 = false
        }
    }
}
</script>

<style lang="less">
@import '../../assets/less/theme';
.card-padding {
    padding: 15px;
}
.order-card {
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    align-items: center;
    .col-left {
        width: 60px;
        height: 60px;
        padding-right: 10px;
    }
    .col-right {
        flex: 1;
        -webkit-flex: 1;
        text-align: left;
        .col-title {
            font-size: @fontSize14;
            color: @colorFontBlack;
            padding-bottom: 3px;
        }
        .col-content {
            font-size: @fontSize12;
            color: @colorFontBlack;
            font-weight: 400;
            padding-bottom: 5px;
        }
    }
    .col-price {
        .col-price-span {
            font-size: @fontSize14;
            color: @colorBlack;
        }
        .col-money-span {
            font-size: @fontSize14;
            color: @colorMoney;
        }
    }
}
</style>

