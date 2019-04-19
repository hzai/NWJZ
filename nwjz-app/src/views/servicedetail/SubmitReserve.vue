<template>
    <view-box ref="viewBox">
        <div id="mine-view">
            <!-- 地址选择 -->
            <group :gutter="0">
                <cell v-if="!selectedAdd" :is-link="true" @click.native="openAddressPopup()" style="height:40px;">
                    <span slot="title" style="font-size:15px;color:#999;">选择服务地址</span>
                </cell>
                <cell-box v-if="selectedAdd" :is-link="true" @click.native="openAddressPopup()">
                    <flexbox style="background-color:white;">
                        <flexbox-item v-model="reserveForm.address">
                            <div style="display:flex;flex-direction:column;">
                                <span style="font-size:14px;padding-bottom:5px;">{{reserveForm.address.contact_person}}&nbsp;&nbsp;{{reserveForm.address.contact_phone}}&nbsp;&nbsp;
                                    <span style="border:1px solid #3CB7E3;padding:0 8px;font-size:12px;color:#3CB7E3">{{reserveForm.address.tags}}</span>&nbsp;&nbsp;
                                    <span v-if="reserveForm.address.is_default" style="border:1px solid red;padding:0 8px;font-size:12px;color:red">默认</span>
                                </span>
                                <span style="font-size:14px;">{{getAddressName(reserveForm.address.area)}}{{reserveForm.address.detail_address}}</span>
                            </div>
                        </flexbox-item>
                    </flexbox>
                </cell-box>
            </group>
            <!-- 单项保洁服务 -->

            <group v-if="reserveForm.service.category === 'ZYYS'" :gutter="10">
                <datetime v-model="reserveForm.expected_baby_date" format="YYYY-MM-DD" :start-date="startDate" :end-date="endDate" :default-selected-value="defaultDate" ref="expected_baby_date" :required="true">
                    <span slot="title" style="font-size:15px;color:#999;">预产期</span>
                </datetime>
            </group>
            <group :gutter="10">
                <divider>
                    <span style="font-size:15px;color:#999;">详细需求</span>
                </divider>
                <flexbox :gutter="10" v-for="(cat, index) in requirements" :key="index" style="padding-bottom:8px;">
                    <flexbox-item :span="2" style="text-align:right;">
                        <span style="font-size:12px;">{{cat.label}}</span>
                    </flexbox-item>
                    <flexbox-item :justify="2">
                        <checker :type="cat.type" v-model="reserveForm.requirements[index]" default-item-class="demo5-item" selected-item-class="demo5-item-selected">
                            <checker-item style="margin-top:6px;" v-for="(item, index2) in cat.item" :key="index2" :value="item.value">{{item.value}}</checker-item>
                        </checker>
                    </flexbox-item>
                </flexbox>
            </group>
            <!-- 套餐服务 -->
            <group v-if="reserveForm.service.is_strict_selection" :gutter="10">
                <cell-box>
                    <flexbox :gutter="0">
                        <flexbox-item :span="1/5">
                            <x-img :default-src="reserveForm.service.primary_pic" :offset="-200" container="#vux_view_box_body" style="width:60px;height:60px;">
                            </x-img>
                        </flexbox-item>
                        <flexbox-item style="background-color:white;">
                            <div style="display:flex;flex-direction: column;flex-wrap: wrap;padding-top:5px;">
                                <span style="font-size:14px; ">{{reserveForm.service.title}}</span>
                                <span style="font-size:14px; font-weight:500;align-self:flex-end;margin-top:-20px;color:red">¥ {{reserveForm.service.sale_price}}</span>
                                <span style="font-size:12px;color:#8f8f8f">数量：x1</span>
                            </div>
                        </flexbox-item>
                    </flexbox>
                </cell-box>
                <cell-box>
                    <flexbox orient="vertical">
                        <flexbox-item style="text-align:center;">
                            <span style="font-size:14px;">套餐包含</span>
                        </flexbox-item>
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
                                    <tr v-for="(subs,_id) in reserveForm.service.sub_services" :key="_id">
                                        <td>{{subs.service.title}}</td>
                                        <td>{{subs.duration}}小时</td>
                                        <td> x{{subs.times}}</td>
                                    </tr>
                                </tbody>
                            </x-table>
                        </flexbox-item>
                    </flexbox>
                </cell-box>
            </group>
            <!-- 优惠方式 -->
            <group :gutter="10">
                <div style="padding:15px;">
                    <span style="font-size:15px;color:#999;">我想叮嘱我的管家</span>
                    <x-textarea v-model="reserveForm.memo" :max="100" style="margin-top:10px;margin-bottom:10px;border: 1px solid #ececec;border-radius: 5px;"></x-textarea>
                    <span style="font-size:12px;color:#999;">购买即视为同意
                        <router-link :to="{path:'userprotocol'}">《了了管家用户协议》</router-link>
                    </span>
                </div>
            </group>
            <group style="border-radius: 9%;font-size:14px;">
                <cell primary="content" is-link @click.native="phoneCall()" value="0755-83222339" style="font-size:14px;">
                    <i slot="icon" class="iconfont icon-kefurexian" style="color:#3cb7e3;"></i>
                    <span slot="title" style="padding-left: 10px;font-size:15px;">服务热线</span>
                </cell>
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
        <!-- 底部预定按钮 -->
        <div class="divfooter" slot="bottom">
            <div style="display:flex;justify-content:flex-end;align-items:center;height:100%;width:100%">
                <x-button type="primary" :mini="true" style="font-size:14px;background-color:#00AF3F;" @click.native="submitOrder()">立即预定</x-button>
            </div>
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
    XButton,
    TransferDom,
    Popup,
    Divider,
    DatetimeRange,
    Datetime,
    dateFormat,
    InlineXNumber,
    Value2nameFilter as value2name,
    ViewBox,
    XImg,
    XTable,
    Checker,
    CheckerItem
} from 'vux'
import {
    fetchAddressList,
    fetchService,
    submitOrder,
    getDefaultAddress
} from 'utils/api'
import {
    addDate
} from 'utils/mUtils'
import addressData from 'data/address'
import requirementsData from 'data/requirements'
import { mapActions } from 'vuex'
export default {
    directives: {
        TransferDom
    },
    components: {
        Flexbox,
        FlexboxItem,
        Group,
        Cell,
        CellBox,
        XTextarea,
        XButton,
        Popup,
        Divider,
        DatetimeRange,
        InlineXNumber,
        Datetime,
        ViewBox,
        XImg,
        XTable,
        Checker,
        CheckerItem
    },
    filters: {
        dateTimeFormatFilter(datetime) {
            return dateFormat(new Date(datetime), 'YYYY-MM-DD')
        }
    },
    created() {
        this.initDate()
        this.getAddressData()
        this.getServiceData()
        this.getDefaultAddrData()
    },
    data() {
        return {
            addressData,
            requirementsData,
            requirements: null,
            addresses: {},
            service: {},
            chooseAddress: false,
            haveAddress: false,
            selectedAdd: false,
            startDate: '',
            endDate: '',
            endYear: '',
            defaultDate: '',
            reserveForm: {
                status: 5,
                is_reserve_order: true,
                service: {},
                address: {},
                service_time: '',
                memo: null,
                requirements: ['', '', ''],
                expected_baby_date: ''
            },
            minHour: 8

        }
    },
    methods: {
        ...mapActions([
            'setPageTitle'
        ]),
        initDate() {
            this.startDate = dateFormat(new Date(), 'YYYY-MM-DD')
            this.endDate = dateFormat(addDate(12 * 30), 'YYYY-MM-DD')
            this.defaultDate = dateFormat(new Date(), 'YYYY-MM-DD')
            // var nowhour = dateFormat(new Date(), 'HH')
            // if (parseInt(nowhour) + 2 > 18) {
            //     this.startDate = dateFormat(addDate(1), 'YYYY-MM-DD')
            //     this.endDate = dateFormat(addDate(8), 'YYYY-MM-DD')
            //     this.defaultDate = dateFormat(addDate(1), 'YYYY-MM-DD 08:00')
            // } else {
            //     // 当日
            //     this.startDate = dateFormat(new Date(), 'YYYY-MM-DD')
            //     this.endDate = dateFormat(addDate(7), 'YYYY-MM-DD')
            //     this.defaultDate = dateFormat(new Date(), 'YYYY-MM-DD ' + parseInt(nowhour) + 2 + ':00')
            //     this.minHour = parseInt(nowhour) + 2
            // }
            // console.log(this.defaultDate)
        },
        openAddressPopup() {
            this.chooseAddress = true
        },
        openCouponPopup() {
            this.chooseCoupon = true
        },
        toAddAddress() {
            this.$router.push({
                path: '/addaddress'
            })
        },
        phoneCall() {
            window.location.href = 'tel://075583222339'
        },
        async submitOrder() {
            console.log(this.reserveForm)
            // if (!this.reserveForm.service.is_strict_selection && !this.$refs.service_time.valid) {
            //     this.$vux.toast.show({
            //         width: '10em',
            //         text: '请选择服务时间'
            //     })
            //     return
            // }
            if (!this.reserveForm.address || this.reserveForm.address._id === null || this.reserveForm.address._id === undefined) {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: '请选择服务地址',
                    width: '10em'
                })
                return
            }
            if (this.reserveForm.service.category === 'ZYYS' && !this.reserveForm.service.is_strict_selection && !this.$refs.expected_baby_date.valid) {
                this.$vux.toast.show({
                    type: 'cancel',
                    width: '10em',
                    text: '请选择预产日期'
                })
                return
            }
            if (this.reserveForm.address !== null) { // TODO 这里需要优化，还要判断 duration, service_time
                const res = await submitOrder(this.reserveForm)
                if (res.status === 0) {
                    console.log(res)
                    if (res.status === 0) {
                        this.TDAPP('D007', '提交预约订单成功')
                        this.$vux.toast.show({
                            text: '提交成功'
                        })
                        this.$router.push({
                            path: '/order'
                        })
                    } else {
                        this.TDAPP('D008', '提交预约订单失败')
                        this.$vux.toast.show({
                            type: 'cancel',
                            text: '提交失败'
                        })
                    }
                } else {
                    this.TDAPP('D008', '提交预约订单失败')
                    this.$vux.toast.show({
                        type: 'cancel',
                        text: '提交失败'
                    })
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
            this.reserveForm.address = address
            this.chooseAddress = false
        },
        async getAddressData() {
            const params = {}
            const res = await fetchAddressList(params)
            console.log(res)
            if (res.status === 0) {
                this.addresses = res.data.addresses
            }
        },
        async getServiceData() {
            const _id = this.$route.query.serviceId
            if (_id) {
                const res = await fetchService(_id)
                if (res.status === 0 && res.data.service) {
                    this.service = res.data.service
                    this.reserveForm.service = res.data.service
                    this.requirements = this.requirementsData[this.service.category]
                    this.setPageTitle(this.service.title)
                }
            }
            console.log(this.reserveForm.service)
        },
        async getDefaultAddrData() {
            const params = {}
            const res = await getDefaultAddress(params)
            if (res.status === 0 && res.data.addresses.length > 0) {
                this.reserveForm.address = res.data.addresses[0]
                this.selectedAdd = true
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