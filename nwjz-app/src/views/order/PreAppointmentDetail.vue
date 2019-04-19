<template>
    <view-box ref="viewBox">
        <div>
            <group :gutter="0" style="">
                <cell-box style="background-color:#00AF3F;">
                    <div style="background-color:#fff;border:1px solid #fff;width:100%;text-align:center;padding:10px;border-radius:5px;">
                        <span style="color:#00AF3F;font-weight:500;">{{showPreapmStatus(preapm.status)}}</span>
                    </div>
                </cell-box>
            </group>
            <group :gutter="0">
                <cell-box>
                    <flexbox :gutter="5">
                        <flexbox-item>
                            <div>
                                <i slot="icon" class="iconfont icon-dingwei" style="font-size:18px;color:#8f8f8f"></i>
                            </div>
                        </flexbox-item>
                        <flexbox-item :span="9/10">
                            <div style="display:flex;flex-direction:column;padding-left:5px;">
                                <span style="font-size:14px;">联系人: {{preapm.contact_person}}</span>
                                <span style="font-size:14px;align-self:flex-end;margin-top:-20px;">{{preapm.contact_phone}}</span>
                                <span style="font-size:14px;padding-top:5px;">服务地址: {{getAddressDetail(preapm.contact_area, preapm.contact_detail_address)}}</span>
                            </div>
                        </flexbox-item>
                    </flexbox>
                </cell-box>
                <cell-box>
                    <flexbox :gutter="0">
                        <flexbox-item :span="1/5">
                            <img :src="preapm.service.primary_pic" style="width:60px;height:60px;">
                        </flexbox-item>
                        <flexbox-item style="background-color:white;">
                            <div style="display:flex;flex-direction: column;flex-wrap: wrap;padding-top:5px;">
                                <span style="font-size:16px;font-weight:500; ">{{preapm.service.title}}</span>
                                <span style="font-size:12px;color:#8f8f8ff;padding-top:5px;">剩余次数：x{{preapm.times}}</span>
                                <span style="font-size:12px;padding-top:5px;">有效期至{{preapm.expired_date | dateTimeFormatFilter2}}</span>
                            </div>
                        </flexbox-item>
                    </flexbox>
                </cell-box>
            </group>
            <group :gutter="10" v-if="preapm.status < 1">
                <datetime v-model="apm.service_time" format="YYYY-MM-DD HH:mm" :start-date="startDate" :end-date="endDate" :min-hour="minHour" :max-hour="18" :minute-list="['00','30']" :default-selected-value="defaultDate" ref="service_time" :required="true" year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点" minute-row="{value}分" confirm-text="完成" cancel-text="取消">
                    <span slot="title" style="font-size:15px;color:#999;">选择服务时间</span>
                </datetime>
                <cell-box>
                    <div style="width:100%;">
                        <span style="font-size:16px;color:#4f4f4f;">服务需求</span>
                        <x-textarea v-model="apm.memo" :max="100" style="margin-top:10px;margin-bottom:20px;border: 1px solid #ececec;border-radius: 5px;"></x-textarea>
                    </div>
                </cell-box>
            </group>
        </div>
        <!-- 底部预定按钮 -->
        <div class="divfooter">
            <!-- 待支付 -->
            <flexbox v-if="preapm.status < 1" :gutter="0" align="center" style="height:100%;">
                <flexbox-item>
                    <div style="padding:5px;">
                        <x-button type="primary" style="font-size:16px;width:80%" @click.native="createApm()">预约本次服务</x-button>
                    </div>
                </flexbox-item>
            </flexbox>
            <!-- 订单关闭 or 订单完成 -->
            <!-- <div v-if="preapm.status > 0" style="display:flex;justify-content:flex-end;align-items:center;height:100%;width:100%">
                <x-button type="primary" style="font-size:16px;width:200px;">再次购买</x-button>
            </div> -->
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
    Datetime,
    XTextarea,
    Value2nameFilter as value2name
} from 'vux'
import {
    fetchPreAppointment,
    createAppointment
} from 'utils/api'
import {
    addDate
} from 'utils/mUtils'
import addressData from 'data/address'
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
        Datetime,
        XTextarea
    },
    created() {
        this.setPageTitle('未预约服务')
        this.initDate()
    },
    mounted() {
        this.fetchData()
    },
    data() {
        return {
            addressData,
            minHour: 8,
            startDate: '',
            endDate: '',
            defaultDate: '',
            preapm: {
                order: {}
            },
            apm: {}
        }
    },
    filters: {
        dateTimeFormatFilter(datetime) {
            return dateFormat(new Date(datetime), 'YYYY-MM-DD HH:mm')
        },
        dateTimeFormatFilter2(datetime) {
            return dateFormat(new Date(datetime), 'YYYY年MM月DD日 HH:mm:ss')
        }
    },
    methods: {
        ...mapActions([
            'setPageTitle'
        ]),
        initDate() {
            var nowhour = dateFormat(new Date(), 'HH')
            if (parseInt(nowhour) > 22) {
                this.startDate = dateFormat(addDate(2), 'YYYY-MM-DD')
                this.endDate = dateFormat(addDate(16), 'YYYY-MM-DD')
                this.defaultDate = dateFormat(addDate(2), 'YYYY-MM-DD 08:00')
                console.log(this.defaultDate)
            } else {
                // 当日
                this.startDate = dateFormat(addDate(1), 'YYYY-MM-DD')
                this.endDate = dateFormat(addDate(15), 'YYYY-MM-DD')
                this.defaultDate = dateFormat(addDate(1), 'YYYY-MM-DD 08:00')
            }
        },
        getAddressDetail(area, detail_address) {
            return value2name(area, this.addressData) + detail_address
        },
        toSubmitOrder(service) {
            this.$router.push({
                path: 'submitorder',
                query: {
                    serviceId: service._id
                }
            })
        },
        // 状态 0 - 正常；1 - 使用完毕；2 - 过期；
        showPreapmStatus(status) {
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
        async fetchData() {
            const _id = this.$route.query.preapmId
            if (_id) {
                const res = await fetchPreAppointment(_id)
                console.log(res.data.preappointment)
                if (res.status === 0 && res.data.preappointment) {
                    this.preapm = res.data.preappointment
                }
            }
        },
        async createApm() {
            if (!this.$refs.service_time.valid) {
                this.$vux.toast.show({
                    type: 'cancel',
                    width: '10em',
                    text: '请选择服务时间'
                })
            }
            if (this.$refs.service_time.valid) {
                this.TDAPP('D401', '用户在未预约服务详情页点击按钮: ' + '预约本次服务')
                const data = {
                    preappointment: this.preapm,
                    appointment: this.apm
                }
                const res = await createAppointment(data)
                console.log(res)
                if (res.status === 0) {
                    this.$vux.toast.show({
                        text: '预约成功'
                    })
                    this.$router.go(-1)
                } else {
                    this.$vux.toast.show({
                        type: 'cancel',
                        text: '提交失败'
                    })
                }
            }
        },
        callWorker() {
            this.TDAPP('D400', '用户在未预约服务详情页点击按钮: ' + '联系客服')
            window.location.href = 'tel://075583222339'
        }
    }
}
</script>


<style lang="less">

</style>
