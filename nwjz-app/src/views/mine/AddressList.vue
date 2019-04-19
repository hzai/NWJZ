<template>
    <div style="background-color:white">
        <div style="width:100%;text-align:center;padding:15px 0;border-bottom:1px solid #efeef3;" @click="addAddress()">
            <span style="font-size:16px;">新增地址</span>
        </div>
        <swipeout v-if="addresses">
            <swipeout-item transition-mode="follow" v-for="(address, key) in addresses" :key="key">
                <div slot="right-menu">
                    <swipeout-button @click.native="onDeleteButtonClick(address, key)" type="warn">删除</swipeout-button>
                </div>
                <div slot="content" class="demo-content vux-1px-t">
                    <flexbox style="border-bottom:1px solid #efeef3;padding:15px;" @click.native="addressModify(address)">
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
            </swipeout-item>
        </swipeout>
        <!-- <div id="noaddress" v-if="addresses.length<1" style="font-size:16px;width:100%;text-align:center;padding-top:20px;">
            <span>无地址</span>
        </div> -->
    </div>
</template>

<script>
import {
    Flexbox,
    FlexboxItem,
    Value2nameFilter as value2name,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    Alert
} from 'vux'
import {
    fetchOrderList,
    fetchAddressList,
    deleteAddress
} from 'utils/api'
import addressData from 'data/address'
import { mapActions } from 'vuex'
export default {
    components: {
        Flexbox,
        FlexboxItem,
        Swipeout,
        SwipeoutItem,
        SwipeoutButton,
        Alert
    },
    created() {
        this.TDAPP('A003', '用户打开地址列表')
        this.setPageTitle('我的地址')
        this.getData()
    },
    data() {
        return {
            haveAddress: false,
            addresses: {},
            addressData
        }
    },
    methods: {
        ...mapActions([
            'setPageTitle'
        ]),
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
        addAddress() {
            this.$router.push({
                path: '/addaddress'
            })
        },
        async getData() {
            const params = {}
            const res = await fetchAddressList(params)
            console.log(res)
            if (res.status === 0) {
                this.addresses = res.data.addresses
            }
        },
        async onDeleteButtonClick(address, key) {
            // this.$vux.alert.show({
            //     title: '了了管家',
            //     content: '确认删除该地址吗?',
            //     onShow() {
            //         // console.log('Plugin: I\'m showing')
            //     },
            //     onHide() {
            //         // console.log('Plugin: I\'m hiding now')
            //     }
            // })
            const that = this
            let canBeDeleted = true
            const myOrders = await fetchOrderList()
            if (myOrders.status === 0 && myOrders.data.orders) {
                const orders = myOrders.data.orders
                orders.forEach(item => {
                    if (item.address._id === address._id) {
                        canBeDeleted = false
                    }
                })
            }
            console.log('canBeDeleted = ', canBeDeleted)
            if (canBeDeleted) {
                this.$vux.confirm.show({
                    title: '温馨提示',
                    content: '是否删除地址？',
                    onShow() {
                    },
                    onHide() {
                    },
                    onCancel() {
                    },
                    async onConfirm() {
                        const res = await deleteAddress(address)
                        if (res.status === 0) {
                            that.addresses.splice(key, 1)
                        }
                    }
                })
            } else {
                this.$vux.toast.show({
                    type: 'cancel',
                    width: '12em',
                    text: '该地址已关联了订单，不能删除!'
                })
            }
        }
    }
}
</script>

<style lang="less">
</style>
