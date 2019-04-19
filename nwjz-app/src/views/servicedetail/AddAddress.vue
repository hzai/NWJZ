<template>
    <view-box ref="viewBox">
        <div>
            <group :gutter="0">
                <x-input ref="contact_person" name="contact_person" v-model="address.contact_person" title="联系人:" :max="30" required></x-input>
                <x-input ref="contact_phone" name="contact_phone" v-model="address.contact_phone" title="联系方式:" keyboard="number" :max="11" is-type="china-mobile" required></x-input>
                <x-address ref="area" name="area" v-model="address.area" title="所在地区:" raw-value :list="addressData" required></x-address>
                <x-input ref="detail_address" name="detail_address" v-model="address.detail_address" title="详细地址:" placeholder="街道 楼牌号等" required></x-input>
                <x-input name="tap" title="标签:" placeholder="家" v-model="address.tags"></x-input>
                <x-switch title="设为默认" v-model="address.is_default" :value="address.is_default"></x-switch>
            </group>
        </div>
        <!-- 底部预定按钮 -->
        <div class="divfooter">
            <div style="display:flex;justify-content:flex-end;align-items:center;height:100%;width:100%">
                <x-button ref="submit_button" type="warn" style="font-size:14px;width:200px;" @click.native="submitAddress">保存</x-button>
            </div>
        </div>
    </view-box>
</template>

<script>
import {
    Group,
    Cell,
    XInput,
    XAddress,
    XButton,
    XSwitch,
    ViewBox
} from 'vux'
import {
    addAddress,
    updateAddress,
    fetchAddress
} from 'utils/api'
import addressData from 'data/address'
import { mapActions } from 'vuex'
export default {
    components: {
        Group,
        Cell,
        XInput,
        XAddress,
        XButton,
        XSwitch,
        ViewBox
    },
    created() {
        this.setPageTitle(this.$route.name)
        this.fetchData()
    },
    data() {
        return {
            fetchSuccess: false,
            address: {
                _id: null,
                contact_person: null,
                contact_phone: null,
                area: ['广东省', '深圳市', '福田区'],
                detail_address: null,
                is_default: false,
                tags: null
            },
            addressData
        }
    },
    methods: {
        ...mapActions([
            'setPageTitle'
        ]),
        async fetchData() {
            const _id = this.$route.query.addressId
            if (_id) {
                const res = await fetchAddress(_id)
                if (res.status === 0 && res.data.address) {
                    this.address = res.data.address
                }
            }
        },
        async submitAddress() {
            if (!this.$refs.contact_person.valid) {
                this.$vux.toast.show({
                    type: 'cancel',
                    width: '10em',
                    text: '请输入联系人'
                })
                return
            }
            if (!this.$refs.contact_phone.valid) {
                this.$vux.toast.show({
                    type: 'cancel',
                    width: '10em',
                    text: '请输入联系方式'
                })
                return
            }
            if (!this.$refs.detail_address.valid) {
                this.$vux.toast.show({
                    type: 'cancel',
                    width: '10em',
                    text: '请输入详细地址'
                })
                return
            }
            if (this.$refs.contact_person.valid) {
                if (this.address._id) {
                    const res = await updateAddress(this.address)
                    if (res.status === 0) {
                        this.TDAPP('A002', '用户更新地址')
                        console.log(res)
                        this.$router.go(-1)
                    } else {
                        this.$vux.toast.show({
                            type: 'cancel',
                            width: '10em',
                            text: '保存地址错误！'
                        })
                    }
                } else {
                    const res = await addAddress(this.address)
                    if (res.status === 0) {
                        this.TDAPP('A001', '用户创建地址')
                        console.log(res)
                        this.$router.go(-1)
                    } else {
                        this.$vux.toast.show({
                            type: 'cancel',
                            width: '10em',
                            text: '保存地址错误！'
                        })
                    }
                }
            }
        }
    }
}
</script>

<style lang="less">
.weui-input {
    font-size: 16px !important;
}
.weui-cells {
    font-size: 16px !important;
}
</style>
