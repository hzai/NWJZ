<template>
    <div>
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
        <div v-for="(userCoupon,_id) in userCoupones" :key="_id" id="address" style="border-top:3px solid #00AF3F;margin:10px 15px;background-color:white;">
            <flexbox style="padding:15px 5px;" :gutter="0">
                <flexbox-item :span="1/5" style="border-right:1px solid #efeef3;">
                    <div style="text-align:center;">
                        <span style="font-size:16px;font-weight:500;color:#EC615D;">¥ {{userCoupon.coupon.face_value}}</span>
                        <br />
                        <span style="color:#999">{{userCoupon.coupon.coupon_type[0]}}</span>
                    </div>
                </flexbox-item>
                <flexbox-item style="padding-left:20px;text-align:left;">
                    <div>
                        <p style="font-size:12px;padding-bottom:5px;color:#00AF3F">{{userCoupon.service.title}}</p>
                        <p style="font-size:14px;">{{userCoupon.coupon.name}}</p>
                    </div>
                    <div style="float: right;padding-right:30px;margin-top:-45px;">
                        <i slot="icon" v-if="userCoupon.status === 1" class="iconfont icon-yishiyong" style="color:#999;font-size:55px;"></i>
                        <i slot="icon" v-if="userCoupon.status === 2" class="iconfont icon-yiguoqi" style="color:#999;font-size:55px;"></i>
                        <x-button type="primary" v-if="userCoupon.status === 0" :mini="true" @click.native="useCoupon(userCoupon)">去使用</x-button>
                    </div>
                </flexbox-item>
            </flexbox>
            <div style="border-top:1px dotted #efeef3;">
                <span style="padding-left:10px;color:#999;">满{{userCoupon.coupon.enough_money}}元使用</span>
                <span style="float:right;padding-right:10px;color:#999;">有效期至: {{userCoupon.expire_date | dateTimeFormatFilter}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import {
    Flexbox,
    FlexboxItem,
    Group,
    XTextarea,
    XInput,
    XButton,
    dateFormat
} from 'vux'
import {
    fetchAllMyCoupon,
    getCouponFromCouponCode
} from 'utils/api'
import { mapActions } from 'vuex'
import { removeAllSpace } from 'utils/mUtils'
export default {
    components: {
        Flexbox,
        FlexboxItem,
        Group,
        XTextarea,
        XButton,
        XInput
    },
    created() {
        this.TDAPP('W002', '用户打开我的优惠卷')
        this.setPageTitle('我的优惠卷')
        this.getAllCoupon()
    },
    filters: {
        dateTimeFormatFilter(datetime) {
            return dateFormat(new Date(datetime), 'YYYY-MM-DD')
        }
    },
    data() {
        return {
            userCoupones: {},
            coupon_code: '',
            coupon_code_valid: true
        }
    },
    methods: {
        ...mapActions(['setPageTitle']),
        onCodeChange() {
            this.coupon_code_valid = !this.$refs.coupon_code.valid
        },
        async getAllCoupon() {
            const params = {}
            const res = await fetchAllMyCoupon(params)
            console.log(res)
            if (res.status === 0) {
                this.userCoupones = res.data.userCoupones
            }
        },
        useCoupon(userCoupon) {
            this.$router.push({
                path: '/submitorder',
                query: {
                    serviceId: userCoupon.service._id,
                    userCoupon: userCoupon._id
                }
            })
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
                this.getAllCoupon()
            } else {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: res.message
                })
            }
        }
    }
}
</script>

<style lang="less">

</style>