<template>
    <div>
        <div style="margin:10px 15px;">
            <flexbox :gutter="5">
                <flexbox-item>
                    <x-button type="primary" @click.native="goCharge()">充值</x-button>
                </flexbox-item>
            </flexbox>
        </div>
        <div v-transfer-dom>
            <popup v-model="show7" height="270px" is-transparent>
                <div style="width: 95%;background-color:#fff;height:250px;margin:0 auto;border-radius:5px;padding-top:10px;">
                    <group>
                        <x-input title="卡号" v-model="card_number" ref="card_number" placeholder="请输入卡号" style="font-size:14px;" :show-counter="false" :rows="1" required @on-change="onNumberChange"></x-input>
                        <x-input title="密码" v-model="card_pwd" ref="card_pwd" placeholder="请输入密码" style="font-size:14px;" :show-counter="false" :rows="1" required @on-change="onCodeChange"></x-input>
                    </group>
                    <div style="padding:20px 15px;">
                        <x-button type="primary" :disabled="card_pwd_valid && card_number_valid" @click.native="activeCard(card_number, card_pwd)">兑换</x-button>
                        <x-button @click.native="show7 = false">取消</x-button>
                    </div>
                </div>
            </popup>
        </div>

        <div v-for="(userCard,_id) in userCards" :key="_id" id="address" style="border-top:3px solid #00AF3F;margin:10px 15px;background-color:white;">
            <flexbox style="padding:5px 5px;" :gutter="0">
                <flexbox-item :span="1/5">
                    <div style="text-align:center;">
                        <img style="width:100px;height:60px;" :src="userCard.card_entity.card.front_image">
                    </div>
                </flexbox-item>
                <flexbox-item style="padding-left:40px;text-align:left;">
                    <div>
                        <p style="font-size:14px;padding-bottom:5px;color:#00AF3F;font-weight:500;">{{userCard.card_entity.card.face_value}}元了了保洁卡</p>
                        <p style="font-size:14px;">卡号:{{userCard.card_entity.card_number}}</p>
                        <p style="font-size:14px;" v-if="userCard.card_entity.actived === 0">密码:
                            <span style="font-size:14px;">{{userCard.card_entity.card_org_pwd}}</span>
                        </p>
                    </div>
                    <div style="float: right;padding-right:30px;margin-top:-45px;">
                        <i slot="icon" v-if="userCard.card_entity.actived === 1" class="iconfont icon-yishiyong" style="color:#999;font-size:55px;"></i>
                    </div>
                </flexbox-item>
            </flexbox>
            <div style="border-top:1px dotted #efeef3;">
                <span style="padding-left:10px;color:#999;"></span>
                <span style="float:right;padding-right:10px;color:#999;">有效期为: {{userCard.created_time | dateTimeFormatFilter}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import {
    Flexbox,
    FlexboxItem,
    Group,
    Cell,
    XTextarea,
    XInput,
    XButton,
    dateFormat,
    Popup,
    TransferDom
} from 'vux'
import {
    fetchAllMyCard,
    activeAndChargeCard
} from 'utils/api'
import { mapActions } from 'vuex'
import { removeAllSpace, md5 } from 'utils/mUtils'
export default {
    directives: {
        TransferDom
    },
    components: {
        Flexbox,
        FlexboxItem,
        Group,
        Cell,
        XTextarea,
        XButton,
        Popup,
        XInput
    },
    created() {
        this.TDAPP('W002', '用户打开我的优惠卷')
        this.setPageTitle('我的保洁卡')
        this.getAllCards()
    },
    filters: {
        dateTimeFormatFilter(datetime) {
            return dateFormat(new Date(datetime), 'YYYY-MM-DD HH:mm')
        }
    },
    data() {
        return {
            userCards: {},
            show7: false,
            card_pwd: '',
            card_pwd_valid: true,
            card_number: '',
            card_number_valid: true
        }
    },
    methods: {
        ...mapActions(['setPageTitle']),
        async getAllCards() {
            const params = {}
            const res = await fetchAllMyCard(params)
            console.log(res)
            if (res.status === 0) {
                this.userCards = res.data.userCards
            }
        },
        goCharge() {
            this.card_pwd = ''
            this.card_number = ''
            this.show7 = true
        },
        onNumberChange() {
            this.card_number_valid = !this.$refs.card_number.valid
        },
        onCodeChange() {
            this.card_pwd_valid = !this.$refs.card_pwd.valid
        },
        async activeCard(card_number, card_pwd) {
            const params = {
                card_number: removeAllSpace(card_number),
                card_pwd: md5(removeAllSpace(card_pwd).toLowerCase())
            }
            const res = await activeAndChargeCard(params)
            console.log(res)
            if (res.status === 0) {
                this.$vux.toast.show({
                    text: '了了保洁卡充值成功！',
                    width: '18em'
                })
                this.getAllCards()
                this.show7 = false
            } else {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: res.message,
                    width: '18em'
                })
            }
        }
    }
}
</script>

<style lang="less">
</style>