<template>
    <view-box ref="viewBox" v-cloak>
        <div id="special-service-view">
            <!-- 地址选择 -->
            <group :gutter="0">
                <cell v-if="!selectedAdd" :is-link="true" @click.native="openAddressPopup()" style="height:25px;">
                    <span slot="title" style="font-size:15px;color:#999;">选择服务地址</span>
                </cell>
                <cell-box v-if="selectedAdd" :is-link="true" @click.native="openAddressPopup()">
                    <flexbox style="background-color:white;">
                        <flexbox-item v-model="orderForm.address">
                            <div style="display:flex;flex-direction:column;">
                                <span style="font-size:14px;padding-bottom:5px;">{{orderForm.address.contact_person}}&nbsp;&nbsp;{{orderForm.address.contact_phone}}&nbsp;&nbsp;
                                    <span style="border:1px solid #3CB7E3;padding:0 8px;font-size:12px;color:#3CB7E3">{{orderForm.address.tags}}</span>&nbsp;&nbsp;
                                    <span v-if="orderForm.address.is_default" style="border:1px solid red;padding:0 8px;font-size:12px;color:red">默认</span>·
                                </span>
                                <span style="font-size:14px;">{{getAddressName(orderForm.address.area)}}{{orderForm.address.detail_address}}</span>
                            </div>
                        </flexbox-item>
                    </flexbox>
                </cell-box>
            </group>

            <group :gutter="10">
                <cell-box>
                    <flexbox :gutter="0">
                        <flexbox-item :span="1/5">
                            <img :src="orderForm.service.primary_pic" style="width:60px;height:60px;">
                        </flexbox-item>
                        <flexbox-item style="background-color:white;">
                            <div style="display:flex;flex-direction: column;flex-wrap: wrap;">
                                <span style="font-size:14px;font-weight:400;padding-bottom:3px; ">{{orderForm.service.title}}</span>
                                <span style="font-size:12px; padding-bottom:5px;"> {{orderForm.service.sub_title}}</span>
                                <span style="font-size:14px;color:#EC615D;">¥ {{orderForm.service.sale_price | keepTwoNum}}
                                    <span style="font-size:14px;color:#4f4f4f" v-if="!orderForm.service.is_strict_selection && orderForm.service.need_choose_time">/小时</span>
                                </span>
                                <span style="font-size:12px;align-self:flex-end;margin-top:-20px;color:#8f8f8f">数量：x{{orderForm.service.default_times}}</span>
                            </div>
                        </flexbox-item>
                    </flexbox>
                </cell-box>
            </group>
            <group :gutter="10">
                <divider style="font-size:15px;color:#999;">请选择明天的服务时间</divider>
                <flexbox orient="vertical">
                    <flexbox-item>
                        <div style="text-align:center;padding-left:5px;">
                            <checker v-model="selectTime" default-item-class="demo5-item" selected-item-class="demo5-item-selected" disabled-item-class="demo5-item-disabled" :radio-required="true">
                                <checker-item :value="item" v-for="(item, index) in time_periods" :key="index" :disabled="item.counter <= 0">
                                    <span style="font-size:15px;">{{item.name}}</span><br/>
                                    <span style="font-size:15px;" v-if="item.counter <= 0">已约满</span>
                                    &nbsp;
                                </checker-item>
                            </checker>
                        </div>
                    </flexbox-item>
                    <flexbox-item>
                        <p style="padding:5px 15px;">预约服务仅支持预约明天的服务时间，如服务时间已约满，可于第二天上午10点后进行预约。每日名额有限。</p>
                    </flexbox-item>
                </flexbox>
            </group>
        </div>

        <div v-transfer-dom>
            <popup v-model="chooseAddress">
                <div style="padding-bottom:15px;height:400px;">
                    <div style="text-align:center;padding:25px 0;border-bottom:1px solid #efeef3;background-color:white;" @click="toAddAddress()">
                        <i solt="icon" class="icon-jiahao iconfont" style="font-size:14px;color:#00AF3F;padding-right:5px;"></i>
                        <span style="font-size:14px;">新建服务地址</span>
                    </div>
                    <div id="noaddress" style="padding-top:10px;text-align:center;" v-if="haveAddress">
                        <span>还没有服务地址，请先添加</span>
                    </div>
                    <div id="address" v-if="!haveAddress">
                        <flexbox style="border-bottom:1px solid #efeef3;padding:15px;background-color:white;" @click.native="selectAddress(address)" v-for="(address, key) in addresses" :key="key">
                            <flexbox-item :span="8/10">
                                <div style="display:flex;flex-direction:column;">
                                    <span style="font-size:14px;padding-bottom:5px;">{{address.contact_person}}&nbsp;&nbsp;{{address.contact_phone}}&nbsp;&nbsp;
                                        <span style="border:1px solid #3CB7E3;padding:0 8px;font-size:12px;color:#3CB7E3">{{address.tags}}</span>&nbsp;&nbsp;
                                        <span v-if="address.is_default" style="border:1px solid red;padding:0 8px;font-size:12px;color:red">默认</span>
                                    </span>
                                    <span style="font-size:14px;">{{getAddressName(address.area)}}{{address.detail_address}}</span>
                                </div>
                            </flexbox-item>
                            <flexbox-item>
                                <div style="border:1px solid #999;width:40px;border-radius:10px;text-align:center;">
                                    <span style="font-size:13px;color:#999" @click="addressModify(address)">编辑</span>
                                </div>
                            </flexbox-item>
                        </flexbox>
                    </div>
                </div>
            </popup>
        </div>

        <!-- 底部预定按钮 -->
        <div class="divfooter" slot="bottom" style="height:50px;">
            <flexbox style="width:100%;height:100%;">
                <flexbox-item style="height:100%;">
                    <div style="text-align:right;line-height:50px;font-size:14px;">
                        实付款:
                        <span style="font-size:17px;color:red;font-weight:500;color:#d6171c;">¥ 0.00</span>
                    </div>
                </flexbox-item>
                <flexbox-item :span="4" @click.native="submitOrderAndPay()" style="background:#d6171c;height:100%;line-height:50px;color:white;font-size:17px;text-align:center;font-weight:800;">
                    提交订单
                </flexbox-item>
            </flexbox>
        </div>
    </view-box>
</template>

<script>
import {
    Flexbox,
    FlexboxItem,
    Group,
    Cell,
    CellBox,
    XTextarea,
    XInput,
    XButton,
    TransferDom,
    Popup,
    Datetime,
    dateFormat,
    XNumber,
    Checker,
    CheckerItem,
    Divider,
    Value2nameFilter as value2name,
    ViewBox,
    XImg,
    XTable,
    PopupPicker
} from 'vux'
import {
    submitEventOrder,
    fetchLoginService,
    checkUserEvent
} from 'utils/api'
import {
    getStore
} from 'utils/mUtils'
import addressData from 'data/address'
import { mapActions } from 'vuex'
import { addDate } from '../../utils/mUtils'
export default {
    directives: {
        TransferDom
    },
    components: {
        Flexbox,
        FlexboxItem,
        Group,
        Cell,
        Checker,
        CheckerItem,
        XInput,
        CellBox,
        XTextarea,
        XButton,
        Popup,
        XNumber,
        Datetime,
        ViewBox,
        XImg,
        XTable,
        PopupPicker,
        Divider
    },
    filters: {
        dateTimeFormatFilter(datetime) {
            return dateFormat(new Date(datetime), 'YYYY-MM-DD')
        }
    },
    created() {

    },
    mounted() {
        this.getServiceData()
    },
    data() {
        return {
            addressData,
            addresses: {},
            chooseAddress: false,
            haveAddress: false,
            selectedAdd: false,
            startDate: '',
            endDate: '',
            couponLength: 0,
            defaultDate: '',
            isAssistSuccess: false,
            assisted: 0,
            orderForm: {
                status: 0,
                service: {},
                address: {},
                user_coupon: {},
                service_time: '',
                memo: null,
                tags: null,
                is_default: false,
                openId: getStore('WX_OPEN_ID')
            },
            minHour: 8,
            coupon_face_value: 0,
            selectedCp: false, // 是否已选择优惠券
            chooseCoupon: false,
            userCoupones: {},
            selectedCoupon: '',
            coupon_code: '',
            coupon_code_valid: true,
            selectTime: {},
            time_periods: []
        }
    },
    methods: {
        ...mapActions([
            'setPageTitle'
        ]),
        openAddressPopup() {
            this.chooseAddress = true
        },
        toAddAddress() {
            this.$router.push({
                path: '/addaddress'
            })
        },
        test() {
            if (this.selectTime.name === undefined) {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: '请选择服务时间',
                    width: '10em'
                })
            } else {
                this.orderForm.service_time = dateFormat(addDate(1), 'YYYY-MM-DD ' + this.selectTime.name.split('点')[0] + ':00')
                this.orderForm.selectTime = this.selectTime.value
                console.log(this.orderForm.service_time)
            }
        },
        async submitOrderAndPay() {
            console.log(this.orderForm.service_time)
            const that = this
            if (!this.isAssistSuccess) {
                let left = 8 - this.assisted
                if (left < 0) {
                    left = 0
                }
                this.$vux.confirm.show({
                    title: '助力未达成',
                    content: '还差' + left + '位好友为你助力, ' + '去邀请',
                    onShow() {
                    },
                    onHide() {
                    },
                    onCancel() {
                    },
                    onConfirm() {
                        that.$router.push({
                            path: '/shareinvite'
                        })
                    }
                })
            } else if (this.buyed) {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: '您已享受过此优惠了！',
                    width: '15em'
                })
            } else {
                if (!this.orderForm.address || this.orderForm.address._id === null || this.orderForm.address._id === undefined) {
                    this.$vux.toast.show({
                        type: 'cancel',
                        text: '请选择服务地址',
                        width: '10em'
                    })
                    return
                }
                if (this.selectTime.name === undefined) {
                    this.$vux.toast.show({
                        type: 'cancel',
                        text: '请选择服务时间',
                        width: '10em'
                    })
                    return
                } else {
                    this.orderForm.service_time = dateFormat(addDate(1), 'YYYY-MM-DD ' + this.selectTime.name.split('点')[0] + ':00')
                    this.orderForm.selectTime = this.selectTime.value
                    console.log(this.orderForm.service_time)
                }
                if (this.orderForm.address !== null) { // TODO 这里需要优化，还要判断 duration, service_time
                    this.orderForm.order_from = '01' // 公众号创建订单
                    if (window.Wechat) {
                        this.orderForm.order_from = '03' // app 创建订单
                    }
                    if (this.orderForm.service.is_strict_selection && this.orderForm.service.is_buy_and_order) { // 严选服务（没有preappointment）subservice 只要一个
                        let temp_service_duration = 0
                        let temp_service_times = 0
                        this.orderForm.service.sub_services.forEach(item => {
                            temp_service_duration += item.duration
                            temp_service_times += item.times
                        })
                        this.orderForm.service_duration = temp_service_duration                 // 严选服务（没有preappointment），每次服务时长为用户选择的时长
                        this.orderForm.total_service_duration = this.orderForm.service_duration // 严选服务（没有preappointment），总时长为用户选择的时长
                        this.orderForm.quantity = 1 // this.orderForm.service.default_times  // 严选服务（没有preappointment），购买数量为用户选择的时长（默认为1）
                        this.orderForm.total_service_times = temp_service_times  // 严选服务（没有preappointment），总服务次数默认为 1
                    } else if (this.orderForm.service.is_strict_selection && !this.orderForm.service.is_buy_and_order) { // 严选服务（有preappointment）subservice 可以一个或多个
                        let temp_service_duration = 0
                        let temp_service_times = 0
                        let temp_total_service_duration = 0
                        this.orderForm.service.sub_services.forEach(item => {
                            temp_service_duration += item.duration
                            temp_service_times += item.times
                            temp_total_service_duration += item.duration * item.times
                        })
                        this.orderForm.service_duration = temp_service_duration                 // 严选服务（有preappointment），每次服务时长为用户选择的时长
                        this.orderForm.total_service_duration = temp_total_service_duration // 严选服务（有preappointment），总时长为用户选择的时长
                        this.orderForm.quantity = 1 // this.orderForm.service.default_times  // 严选服务（有preappointment），购买数量为用户选择的时长（默认为1）
                        this.orderForm.total_service_times = temp_service_times  // 严选服务（有preappointment），总服务次数默认为 1
                    } else {
                        this.orderForm.service_duration = this.orderForm.service.default_times  // 单项服务，每次服务时长为用户选择的时长
                        this.orderForm.total_service_duration = this.orderForm.service_duration // 单项服务，总时长为用户选择的时长
                        this.orderForm.quantity = this.orderForm.service.default_times  // 单项服务，购买数量为用户选择的时长
                        this.orderForm.total_service_times = 1  // 单项服务，总服务次数默认为 1
                    }
                    console.log('this.orderForm = ', this.orderForm)
                    const result = await submitEventOrder(this.orderForm)
                    console.log('submitEventOrder = ', result)
                    if (result.status === 0) {
                        this.$vux.toast.show(
                            {
                                text: '提交订单成功',
                                width: '12em'
                            }
                        )
                        this.$router.push({
                            path: '/order'
                        })
                    } else {
                        this.$vux.toast.show(
                            {
                                type: 'cancel',
                                text: '提交订单失败',
                                width: '12em'
                            }
                        )
                        this.$router.push({
                            path: '/order'
                        })
                    }
                } else {
                    this.$vux.toast.show({
                        type: 'cancel',
                        text: '验证没通过' // TODO 这里需要优化，还要判断 duration, service_time
                    })
                }
            }
        },
        getAddressName(value) {
            return value2name(value, this.addressData)
        },
        addressModify(address) {
            this.$router.push({
                path: '/modifyaddress',
                query: {
                    addressId: address._id
                }
            })
        },
        selectAddress(address) {
            this.selectedAdd = true
            this.orderForm.address = address
            this.chooseAddress = false
        },
        async getServiceData() {
            const _id = this.$route.query.serviceId
            if (_id) {
                // const res = await fetchService(_id)
                const res = await fetchLoginService(_id)
                console.log('new', res)
                if (res.status === 0 && res.data.service) {
                    this.orderForm.service = res.data.service
                    this.time_periods = res.data.service.time_periods
                    this.addresses = res.data.address
                    if (res.data.address.length > 0) {
                        this.orderForm.address = res.data.address[0]
                        this.selectedAdd = true
                    }
                    this.userCoupones = res.data.userCoupones
                    this.couponLength = res.data.userCoupones.length
                    this.orderForm.amount_payable = res.data.service.sale_price * res.data.service.default_times
                    this.setPageTitle(this.orderForm.service.title)
                    if (this.$route.query.userCoupon !== '') {
                        this.userCoupones.forEach(coupon => {
                            if (coupon._id === this.$route.query.userCoupon) {
                                this.selectedCp = true
                                this.orderForm.user_coupon = coupon
                                this.selectedCoupon = '[' + coupon.service.title + ']' + coupon.coupon.name
                                this.coupon_face_value = coupon.coupon.face_value
                            }
                        })
                    }
                }
                const resUe = await checkUserEvent(_id)
                console.log('checkUserEvent res = ', resUe)
                if (resUe.status === 0) {
                    this.createdUE = resUe.data.createdUE
                    this.isAssistSuccess = resUe.data.success
                    this.assisted = resUe.data.assisted
                }
                if (resUe.status === 0 && resUe.data.buyed) {
                    this.buyed = true
                }
            }
            console.log(this.orderForm.service)
            console.log(this.time_periods)
        }
    }
}
</script>

<style lang="less">
@import '../../assets/less/theme';
.demo5-item {
    width: 78px;
    height: 60px;
    line-height: 26px;
    text-align: center;
    font-size: 12px;
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: #fff;
    margin-right: 8px;
}
.demo5-item-selected {
    background: #ffffff url(../../assets/images/active.png) no-repeat right
        bottom;
    border-color: @colorOne;
}
.demo5-item-disabled {
    border-color: @colorFiv;
}
</style>