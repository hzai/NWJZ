<template>
    <view-box ref="viewBox" v-cloak>
        <div id="normal-service-view">
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
                                    <span v-if="orderForm.address.is_default" style="border:1px solid red;padding:0 8px;font-size:12px;color:red">默认</span>
                                </span>
                                <span style="font-size:14px;">{{getAddressName(orderForm.address.area)}}{{orderForm.address.detail_address}}</span>
                            </div>
                        </flexbox-item>
                    </flexbox>
                </cell-box>
                <datetime v-if="orderForm.service.is_buy_and_order || !orderForm.service.is_strict_selection" v-model="orderForm.service_time" format="YYYY-MM-DD HH:mm" :start-date="startDate" :end-date="endDate" :min-hour="8" :max-hour="18" :minute-list="['00','30']" year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点" minute-row="{value}分" confirm-text="完成" cancel-text="取消" :default-selected-value="defaultDate" ref="service_time" :required="true">
                    <span slot="title" style="font-size:15px;">选择服务时间</span>
                </datetime>
            </group>
            <!-- 单项保洁服务 -->
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
                <cell-box v-if="orderForm.service.is_strict_selection">
                    <flexbox orient="vertical">
                        <!-- <flexbox-item style="text-align:center;">
                            <span style="font-size:14px;">套餐包含</span>
                        </flexbox-item> -->
                        <flexbox-item>
                            <x-table :cell-bordered="false" style="font-size:12px;">
                                <thead>
                                    <tr style="background-color: #F7F7F7">
                                        <th>服务类型</th>
                                        <th>服务时长</th>
                                        <th>服务次数</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(subs,_id) in orderForm.service.sub_services" :key="_id">
                                        <td>{{subs.service.title}}</td>
                                        <td>{{subs.duration}}小时</td>
                                        <td>{{subs.times}}次</td>
                                    </tr>
                                </tbody>
                            </x-table>
                        </flexbox-item>
                    </flexbox>
                </cell-box>
                <!-- <cell v-if="orderForm.service.need_choose_time"> -->
                <!-- <span slot="title" style="font-size:15px;color:#999">选择服务时长</span> -->
                <x-number v-if="orderForm.service.need_choose_time" title="选择服务时长" @on-change="numberchange" :min="3" :max="6" v-model="orderForm.service.default_times" button-style="round"></x-number>
                <!-- </cell> -->
                <!-- <cell-box>
                    <div style="width:100%;padding:5px 0;">
                    <span style="font-size:15px;">总金额</span>
                    <span style="float:right;font-size:15px;color:red;font-weight:500;color:#EC615D;">¥ {{orderForm.amount_payable = orderForm.service.sale_price * orderForm.service.default_times | keepTwoNum}}</span>
                    <br />
                    <span style="font-size:15px;">优惠</span>
                    <span style="float:right;font-size:15px;color:red;font-weight:500;">-¥ </span>
                </div>
                </cell-box> -->
            </group>

            <!-- 优惠方式 -->
            <group :gutter="10">
                <cell v-if="!selectedCp" :is-link="true" @click.native="openCouponPopup()" :value="couponLength|couponLenFilter" style="font-size: 12px">
                    <span slot="title" style="font-size:15px;color:#999;">选择优惠方式</span>
                </cell>
                <cell v-if="selectedCp" :is-link="true" @click.native="openCouponPopup()">
                    <span slot="title" style="font-size:15px;color:#FF8E32;">{{selectedCoupon}}</span>
                </cell>
                <x-switch title="使用余额" style="font-size:15px;" :inline-desc="balance" v-model="useBalance" @on-change="useBa()"></x-switch>
                <cell v-if="useBalance">
                    <span slot="title" style="font-size:15px;color:#FF8E32;">最多可使用 {{canUseBalance}}元</span>
                </cell>
            </group>
            <!-- 备注 -->
            <group :gutter="10">
                <div style="padding:10px 15px;">
                    <x-textarea v-model="orderForm.memo" placeholder="我想叮嘱我的管家" :height="50" :show-counter="false" :max="100" style="margin:5px 0;border: 1px solid #ececec;border-radius: 5px;"></x-textarea>
                    <span style="font-size:12px;">购买即视为同意
                        <router-link :to="{path:'userprotocol'}">《了了管家用户协议》</router-link>
                    </span>
                </div>
            </group>
            <br />
            <br />
            <!-- popup -->
            <!-- 服务地址 -->
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
        </div>
        <!-- 优惠卷 -->
        <div v-transfer-dom>
            <popup v-model="chooseCoupon">
                <div style="padding-bottom:15px;height:400px;">
                    <div id="noaddress" style="padding-top:10px;padding-left:15px;padding-bottom:5px;">
                        <span style="font-weight:500;">可使用优惠卷({{couponLength}}张)</span>
                    </div>
                    <div style="margin:10px 15px;">
                        <flexbox :gutter="5">
                            <flexbox-item :span="8/10">
                                <group :gutter="0">
                                    <x-input v-model="coupon_code" ref="coupon_code" placeholder="请输入券兑换码" style="font-size:14px;" :show-counter="false" :rows="1" required @on-change="onCodeChange"></x-input>
                                </group>
                            </flexbox-item>
                            <flexbox-item>
                                <x-button type="primary" :mini="true" @click.native="getCouponByCode(coupon_code)" :disabled="coupon_code_valid">兑换</x-button>
                            </flexbox-item>
                        </flexbox>
                    </div>
                    <div v-if="userCoupones.length>0" style="text-align:center; height:30px; margin:10px 15px;background-color:white;border:1px dotted #000000;" @click="unSelectCoupon()">
                        <span style="display:block;padding-top:6px;">不使用优惠券</span>
                    </div>
                    <div v-for="(userCoupon,_id) in userCoupones" :key="_id" id="address" style="border-top:3px solid #00AF3F;margin:10px 15px;background-color:white;" v-if="userCoupon.coupon.enough_money <= (orderForm.service.sale_price * orderForm.service.default_times)">
                        <flexbox style="padding:15px 5px;" :gutter="0" @click.native="selectCoupon(userCoupon)">
                            <flexbox-item :span="1/5" style="border-right:1px solid #efeef3;">
                                <div style="text-align:center;">
                                    <span style="font-size:16px;font-weight:500;color:#EC615D;">¥ {{userCoupon.coupon.face_value}}</span>
                                    <br />
                                    <span style="color:#999">{{userCoupon.coupon.coupon_type[0]}}</span>
                                </div>
                            </flexbox-item>
                            <flexbox-item style="padding-right:10px;text-align:right;">
                                <div>
                                    <p style="font-size:12px;padding-bottom:5px;color:#00AF3F">{{userCoupon.service.title}}</p>
                                    <p style="font-size:14px;">{{userCoupon.coupon.name}}</p>
                                </div>
                            </flexbox-item>
                        </flexbox>
                        <div style="border-top:1px dotted #efeef3;">
                            <span style="padding-left:10px;color:#999;">满{{userCoupon.coupon.enough_money}}元使用</span>
                            <span style="float:right;padding-right:10px;font-size:10px;color:#999;">有效期至{{userCoupon.expire_date | dateTimeFormatFilter}}</span>
                        </div>
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
                        <span style="font-size:17px;color:red;font-weight:500;color:#d6171c;">¥ {{ (orderForm.service.sale_price * orderForm.service.default_times) - coupon_face_value - canUseBalance | keepTwoNum}}</span>
                    </div>
                </flexbox-item>
                <flexbox-item :span="4" @click.native="submitOrderAndPay()" style="background:#d6171c;height:100%;line-height:50px;color:white;font-size:17px;text-align:center;font-weight:800;">
                    立即支付
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
    PopupPicker,
    XSwitch
} from 'vux'
import {
    submitOrder,
    submitOrderAndPay,
    submitOrderAndNoPay,
    fetchLoginService,
    fetchAllMyCoupon,
    getCouponFromCouponCode
} from 'utils/api'
import {
    addDate, removeAllSpace, getStore
} from 'utils/mUtils'
import addressData from 'data/address'
import { mapActions } from 'vuex'
import { wexinPay } from 'utils/weixinPay'
import {
    mapState
} from 'vuex'
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
        Divider,
        XSwitch
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

    },
    mounted() {
        this.initDate()
        this.getServiceData()
    },
    computed: {
        ...mapState([
            'is_login',
            'userInfo'
        ])
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
            time_periods: [],
            balance: 0,
            useBalance: false,
            canUseBalance: 0

        }
    },
    methods: {
        ...mapActions([
            'setPageTitle',
            'getUserInfo'
        ]),
        initDate() {
            var nowhour = dateFormat(new Date(), 'HH')
            if (parseInt(nowhour) >= 22) {
                this.startDate = dateFormat(addDate(2), 'YYYY-MM-DD')
                this.endDate = dateFormat(addDate(9), 'YYYY-MM-DD')
                this.defaultDate = dateFormat(addDate(2), 'YYYY-MM-DD 08:00')
                console.log(this.defaultDate)
            } else {
                // 当日
                this.startDate = dateFormat(addDate(1), 'YYYY-MM-DD')
                this.endDate = dateFormat(addDate(8), 'YYYY-MM-DD')
                this.defaultDate = dateFormat(addDate(1), 'YYYY-MM-DD 08:00')
            }
            if (this.userInfo && this.userInfo._id) {
                this.balance = '当前余额为：' + this.userInfo.balance + '元'
            }
        },
        onCodeChange() {
            this.coupon_code_valid = !this.$refs.coupon_code.valid
        },
        openAddressPopup() {
            this.chooseAddress = true
        },
        openCouponPopup() {
            this.chooseCoupon = true
        },
        useBa() {
            if (this.useBalance === true) {
                const maxbalance = (this.orderForm.service.sale_price * this.orderForm.service.default_times) - this.coupon_face_value
                if (maxbalance >= this.userInfo.balance) {
                    this.canUseBalance = this.userInfo.balance
                } else {
                    this.canUseBalance = maxbalance
                }
            } else {
                this.canUseBalance = 0
            }
        },
        numberchange(value) {
            const amount_pay = this.orderForm.service.sale_price * value
            this.orderForm.amount_payable = amount_pay
            if (this.selectedCp) {
                if (this.orderForm.user_coupon.coupon.enough_money > amount_pay) {
                    this.selectedCp = false
                    this.orderForm.user_coupon = undefined
                    this.coupon_face_value = 0
                    this.selectedCoupon = ''
                }
            }
            this.couponLength = 0
            this.userCoupones.forEach(cou => {
                if (cou.coupon.enough_money <= amount_pay) {
                    this.couponLength = this.couponLength + 1
                }
            })
            this.useBa()
        },
        selectCoupon(coupon) {
            if (coupon.coupon.enough_money <= (this.orderForm.service.sale_price * this.orderForm.service.default_times)) {
                this.selectedCp = true
                this.orderForm.user_coupon = coupon
                this.selectedCoupon = '[' + coupon.service.title + ']' + coupon.coupon.name
                this.coupon_face_value = coupon.coupon.face_value
                this.chooseCoupon = false
                this.useBa()
            } else {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: '不足' + coupon.coupon.enough_money + '元无法使用',
                    width: '15em'
                })
            }
        },
        unSelectCoupon() {
            this.selectedCp = false
            this.coupon_face_value = 0
            this.orderForm.user_coupon = undefined
            this.selectedCoupon = ''
            this.chooseCoupon = false
            this.useBa()
        },
        toAddAddress() {
            this.$router.push({
                path: '/addaddress'
            })
        },
        handleItemClick(item) {
            console.log(item)
        },
        async submitOrderAndPay() {
            console.log(this.orderForm)
            if (!this.orderForm.address || this.orderForm.address._id === null || this.orderForm.address._id === undefined) {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: '请选择服务地址',
                    width: '10em'
                })
                return
            }
            if (!this.orderForm.service.is_strict_selection && !this.$refs.service_time.valid) {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: '请选择服务时间',
                    width: '10em'
                })
                return
            }
            if (this.orderForm.service.is_buy_and_order && !this.$refs.service_time.valid) {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: '请选择服务时间',
                    width: '10em'
                })
                return
            }
            if (this.orderForm.address !== null) { // TODO 这里需要优化，还要判断 duration, service_time
                this.orderForm.canUseBalance = this.canUseBalance
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

                if (((this.orderForm.service.sale_price * this.orderForm.service.default_times) - this.coupon_face_value - this.canUseBalance) === 0) {
                    const resultNoPay = await submitOrderAndNoPay(this.orderForm)
                    console.log('resultNoPay = ', resultNoPay)
                    if (resultNoPay.status === 0) {
                        this.getUserInfo()
                        this.$vux.toast.show(
                            {
                                text: '支付成功',
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
                                text: resultNoPay.message,
                                width: '15em'
                            }
                        )
                        this.$router.push({
                            path: '/order'
                        })
                    }
                } else {
                    const result = await submitOrderAndPay(this.orderForm)
                    console.log('submitOrderAndPay = ', result)
                    if (result.status === 0) {
                        if (this.orderForm.order_from === '01') {
                            wexinPay(result.data.params, (res) => {
                                this.TDAPP('D005', '用户微信支付成功')
                                this.$vux.toast.show(
                                    {
                                        text: '微信支付成功',
                                        width: '12em'
                                    }
                                )
                                console.log(res)
                                this.$router.push({
                                    path: '/order'
                                })
                            }, (cancel) => {
                                this.TDAPP('D0061', '用户取消微信支付')
                                this.$vux.toast.show(
                                    {
                                        type: 'cancel',
                                        text: '取消支付',
                                        width: '12em'
                                    }
                                )
                                console.log(cancel)
                                this.$router.push({
                                    path: '/order'
                                })
                            },
                                (err) => {
                                    this.TDAPP('D0062', '用户微信支付失败')
                                    this.$vux.toast.show(
                                        {
                                            type: 'cancel',
                                            text: '微信支付失败',
                                            width: '12em'
                                        }
                                    )
                                    console.log(err)
                                    this.$router.push({
                                        path: '/order'
                                    })
                                })
                        } else if (this.orderForm.order_from === '03') {
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
                                this.$router.push({
                                    path: '/order'
                                })
                            })
                        }
                    } else {
                        this.TDAPP('D0063', '用户微信支付失败')
                        this.$vux.toast.show(
                            {
                                type: 'cancel',
                                text: result.message,
                                width: '15em'
                            }
                        )
                        this.$router.push({
                            path: '/order'
                        })
                    }
                }
            } else {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: '验证没通过' // TODO 这里需要优化，还要判断 duration, service_time
                })
            }
        },
        async submitOrder() {
            console.log(this.orderForm)
            if (!this.orderForm.address || this.orderForm.address._id === null || this.orderForm.address._id === undefined) {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: '请选择服务地址',
                    width: '10em'
                })
                return
            }
            if (!this.orderForm.service.is_strict_selection && !this.$refs.service_time.valid) {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: '请选择服务时间',
                    width: '10em'
                })
                return
            }
            if (this.orderForm.service.is_buy_and_order && !this.$refs.service_time.valid) {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: '请选择服务时间',
                    width: '10em'
                })
                return
            }
            if (this.orderForm.address !== null) { // TODO 这里需要优化，还要判断 duration, service_time
                this.orderForm.order_from = '01' // 公众号创建订单
                if (window.Wechat) {
                    this.orderForm.order_from = '03' // app 创建订单
                }
                const res = await submitOrder(this.orderForm)
                console.log(res)

                if (res.status === 0) {
                    // this.$vux.toast.show({
                    //     text: '提交成功'
                    // })
                    this.TDAPP('D003', '提交订单成功')
                    this.$router.push({
                        path: '/pay/payorder',
                        query: {
                            orderId: res.data.order._id
                        }
                    })
                } else {
                    if (res.status === 1) {
                        this.$vux.toast.show({
                            type: res.type,
                            text: res.message
                        })
                    } else {
                        this.$vux.toast.show({
                            type: 'cancel',
                            text: '提交失败'
                        })
                    }
                }
            } else {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: '验证没通过' // TODO 这里需要优化，还要判断 duration, service_time
                })
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
        async getCouponByCode(code) {
            const params = {
                coupon_code: removeAllSpace(code)
            }
            const res = await getCouponFromCouponCode(params)
            console.log(res)
            if (res.status === 0) {
                this.$vux.toast.show({
                    text: '领取成功！'
                })
                const ress = await fetchAllMyCoupon({
                    serviceId: this.orderService._id
                })
                if (ress.status === 0) {
                    console.log('uc', ress.data)
                    const ucc = []
                    ress.data.userCoupones.forEach(cou => {
                        if (cou.coupon.enough_money <= this.order.amount_payable) {
                            ucc.push(cou)
                        }
                    })
                    this.userCoupones = ucc
                }
            } else {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: res.message, width: '12em'
                })
            }
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
    width: 80px;
    height: 60px;
    line-height: 26px;
    text-align: center;
    font-size: 12px;
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: #fff;
    margin-right: 30px;
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