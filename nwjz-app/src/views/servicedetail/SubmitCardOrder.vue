<template>
    <view-box ref="viewBox" v-cloak>
        <div id="normal-service-view">
            <!-- 单项保洁服务 -->
            <group :gutter="0">
                <cell-box>
                    <flexbox :gutter="0">
                        <flexbox-item :span="2/6">
                            <img :src="card_detail[scard_type.id].piz_url" style="width:105px;height:70px;">
                        </flexbox-item>
                        <flexbox-item style="background-color:white;">
                            <div style="display:flex;flex-direction: column;flex-wrap: wrap;">
                                <span style="font-size:14px;font-weight:400;padding-bottom:3px; ">{{card_detail[scard_type.id].title}}</span>
                                <span style="font-size:12px; padding-bottom:5px;"> {{card_detail[scard_type.id].sub_title}}</span>
                                <span class="tmoney">¥ {{card_detail[scard_type.id].discounted_price | keepTwoNum}}&nbsp;&nbsp;
                                    <span class="ymoney">¥ {{card_detail[scard_type.id].sale_price | keepTwoNum}}</span>
                                </span>
                                <span style="font-size:12px;align-self:flex-end;margin-top:-20px;color:#8f8f8f">数量：x{{orderForm.service.default_times}}</span>
                            </div>
                        </flexbox-item>
                    </flexbox>
                </cell-box>
                <x-number title="购买数量" :min="1" :max="10" v-model="orderForm.service.default_times" button-style="round"></x-number>
            </group>

            <!-- 面额 -->
            <group :gutter="10">
                <divider style="font-size:15px;color:#999;">请选择保洁卡面额</divider>
                <flexbox>
                    <flexbox-item>
                        <div style="text-align:center;padding-left:5px;padding-bottom:15px;">
                            <checker v-model="scard_type" default-item-class="demo6-item" selected-item-class="demo6-item-selected" disabled-item-class="demo6-item-disabled" :radio-required="true">
                                <checker-item :value="item" v-for="(item, index) in card_type" :key="index">
                                    <span style="font-size:15px;">{{item.name}}</span>
                                </checker-item>
                            </checker>
                        </div>
                    </flexbox-item>
                </flexbox>
            </group>

            <!-- 领取方式 -->
            <group :gutter="10">
                <divider style="font-size:15px;color:#999;">请选择领取方式</divider>
                <flexbox>
                    <flexbox-item>
                        <div style="text-align:center;padding-left:5px;padding-bottom:15px;">
                            <checker v-model="sbuy_type" default-item-class="demo5-item" selected-item-class="demo5-item-selected" disabled-item-class="demo5-item-disabled" :radio-required="true">
                                <checker-item :value="item" v-for="(item, index) in buy_type" :key="index">
                                    <span style="font-size:15px;">{{item.name}}</span>
                                </checker-item>
                            </checker>
                        </div>
                    </flexbox-item>
                </flexbox>
            </group>

            <!-- 地址选择 -->
            <group :gutter="0" v-if="sbuy_type.id === 1">
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
        <div class="divfooter" slot="bottom" style="height:50px;">
            <flexbox style="width:100%;height:100%;">
                <flexbox-item style="height:100%;">
                    <div style="text-align:right;line-height:50px;font-size:14px;">
                        <span style="text-align:left;" v-if="sbuy_type.id === 1">邮费 ¥8.00</span>
                        实付款:
                        <span style="font-size:17px;color:red;font-weight:500;color:#d6171c;" v-if="sbuy_type.id === 1">¥ {{ (card_detail[scard_type.id - 1].discounted_price * orderForm.service.default_times) + 8 | keepTwoNum}}</span>
                        <span style="font-size:17px;color:red;font-weight:500;color:#d6171c;" v-else>¥ {{ (card_detail[scard_type.id - 1].discounted_price * orderForm.service.default_times) | keepTwoNum}}</span>
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
    XInput,
    XButton,
    TransferDom,
    Popup,
    XNumber,
    Checker,
    CheckerItem,
    Divider,
    Value2nameFilter as value2name,
    ViewBox,
    XImg
} from 'vux'
import {
    fetchLoginService,
    buyCardPay
} from 'utils/api'
import {
    getStore
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
        XButton,
        Popup,
        XNumber,
        ViewBox,
        XImg,
        Divider
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
            buy_type: [{ id: 1, name: '实物卡' }, { id: 2, name: '虚拟卡' }, { id: 3, name: '当前账户直冲' }],
            card_type: [{ id: 1, name: '120元' }, { id: 2, name: '300元' }, { id: 3, name: '500元' }, { id: 4, name: '1000元' }],
            card_detail: [{ id: 1, title: '120元了了保洁卡', sub_title: '限时特惠价！97折优惠。大量采购的可与客服联系。', discounted_price: 0.01, sale_price: 120, piz_url: 'http://images.llguanjia.com/e516ddb2-d9de-b063-c964-ade5866e7bae.png' },
            { id: 2, title: '300元了了保洁卡', sub_title: '限时特惠价！97折优惠。大量采购的可与客服联系。', discounted_price: 291, sale_price: 300, piz_url: 'http://images.llguanjia.com/906aaed5-7cfd-a2b9-8e22-1d4656142869.png' },
            { id: 3, title: '500元了了保洁卡', sub_title: '限时特惠价！97折优惠。大量采购的可与客服联系。', discounted_price: 485, sale_price: 500, piz_url: 'http://images.llguanjia.com/02f35d20-0ae6-eacb-6d42-d68a2422e5c0.png' },
            { id: 4, title: '1000元了了保洁卡', sub_title: '限时特惠价！97折优惠。大量采购的可与客服联系。', discounted_price: 970, sale_price: 1000, piz_url: 'http://images.llguanjia.com/ac9e9386-9e06-f214-84f8-e6d442407a86.png' }],
            sbuy_type: {},
            scard_type: { id: 1, name: '120元' },
            addresses: {},
            chooseAddress: false,
            haveAddress: false,
            selectedAdd: false,
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
            minHour: 8
        }
    },
    methods: {
        ...mapActions([
            'setPageTitle',
            'getUserInfo'
        ]),
        initDate() {

        },
        openAddressPopup() {
            this.chooseAddress = true
        },
        toAddAddress() {
            this.$router.push({
                path: '/addaddress'
            })
        },
        async submitOrderAndPay() {
            if (this.sbuy_type.name === undefined) {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: '请选择领取方式',
                    width: '10em'
                })
                return
            }
            if (this.sbuy_type.id === 1) {
                if (!this.orderForm.address || this.orderForm.address._id === null || this.orderForm.address._id === undefined) {
                    this.$vux.toast.show({
                        type: 'cancel',
                        text: '请选择服务地址',
                        width: '10em'
                    })
                    return
                }
            }
            this.orderForm.order_from = '01' // 公众号创建订单
            if (window.Wechat) {
                this.orderForm.order_from = '03' // app 创建订单
            }
            this.orderForm.quantity = this.orderForm.service.default_times
            this.orderForm.buy_type = this.sbuy_type.id
            this.orderForm.card_type = this.scard_type.id
            this.orderForm.remark = '购买：' + this.scard_type.name + '了了保洁卡 x' + this.orderForm.service.default_times + '张,' + ' 领取方式：' + this.sbuy_type.name
            if (this.sbuy_type.id === 1) {
                this.orderForm.amount_payable = (this.card_detail[this.scard_type.id - 1].discounted_price * this.orderForm.service.default_times) + 8
            } else {
                this.orderForm.amount_payable = this.card_detail[this.scard_type.id - 1].discounted_price * this.orderForm.service.default_times
            }
            console.log(this.orderForm)
            const result = await buyCardPay(this.orderForm)
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
                        if (this.orderForm.buy_type === 1) {
                            this.$router.push({
                                path: '/order'
                            })
                        } else if (this.orderForm.buy_type === 2) {
                            this.$router.push({
                                path: '/card'
                            })
                        } else {
                            this.$router.push({
                                path: '/mine'
                            })
                        }
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
                } else if (this.orderForm === '03') {
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
                    this.addresses = res.data.address
                    if (res.data.address.length > 0) {
                        this.orderForm.address = res.data.address[0]
                        this.selectedAdd = true
                    }
                    this.setPageTitle(this.orderForm.service.title)
                }
            }
        }
    }
}
</script>

<style lang="less">
@import '../../assets/less/theme';
.demo5-item {
    width: 110px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 12px;
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: #fff;
    margin-right: 10px;
}
.demo5-item-selected {
    background: #ffffff url(../../assets/images/active.png) no-repeat right
        bottom;
    border-color: @colorOne;
}
.demo5-item-disabled {
    border-color: @colorFiv;
}
.demo6-item {
    width: 150px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 12px;
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: #fff;
    margin-right: 10px;
    margin-bottom: 10px;
}
.demo6-item-selected {
    background: #ffffff url(../../assets/images/active.png) no-repeat right
        bottom;
    border-color: @colorOne;
}
.demo6-item-disabled {
    border-color: @colorFiv;
}
.tmoney {
    font-size: @fontSize16;
    font-weight: 500;
    color: @colorMoney;
    // padding: 0 12px;
}
.ymoney {
    font-size: @fontSize12;
    font-weight: 500;
    color: #858585;
    text-decoration: line-through;
    // padding: 0 12px;
}
</style>