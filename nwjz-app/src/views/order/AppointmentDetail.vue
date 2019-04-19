<template>
    <view-box ref="viewBox">
        <div>
            <group :gutter="0" style="">
                <cell-box style="background-color:#00AF3F;">
                    <div style="background-color:#fff;border:1px solid #fff;width:100%;text-align:center;padding:10px;border-radius:5px;">
                        <span style="color:#00AF3F;font-weight:500;">{{showApmStatus(apm.status)}}</span>
                    </div>
                </cell-box>
            </group>
            <group :gutter="0">
                <cell-box v-if="apm.status === 0">
                    <div>
                        <span style="font-size:14px;">服务人员:</span>
                        <span style="font-size:14px;padding-left:10px;">待确认</span>
                    </div>
                </cell-box>
                <cell-box v-if="apm.status !== 0">
                    <div>
                        <span style="font-size:14px;">服务人员:</span>
                        <span style="font-size:14px;padding-left:10px;">{{apm.worker === undefined ? '' : apm.worker.name}}</span>
                    </div>
                </cell-box>
                <cell-box>
                    <div>
                        <span style="font-size:14px;">服务时间:</span>
                        <span style="font-size:14px;padding-left:10px;">{{apm.service_time | dateTimeFormatFilter}}</span>
                        <!-- 服务时间不对 -->
                    </div>
                </cell-box>
            </group>
            <group :gutter="10">
                <cell-box>
                    <flexbox :gutter="5">
                        <flexbox-item>
                            <div>
                                <i slot="icon" class="iconfont icon-dingwei" style="font-size:18px;color:#8f8f8f"></i>
                            </div>
                        </flexbox-item>
                        <flexbox-item :span="9/10">
                            <div style="display:flex;flex-direction:column;padding-left:5px;">
                                <span style="font-size:14px;">联系人: {{apm.contact_person}}</span>
                                <span style="font-size:14px;align-self:flex-end;margin-top:-20px;">{{apm.contact_phone}}</span>
                                <span style="font-size:14px;padding-top:8px;">服务地址: {{getAddressDetail(apm.contact_area, apm.contact_detail_address)}}</span>
                            </div>
                        </flexbox-item>
                    </flexbox>
                </cell-box>
                <cell-box>
                    <div>
                        <span style="font-size:15px;">服务需求:</span>
                        <span style="font-size:15px;padding-left:10px;">{{apm.memo === '' ? '无' : apm.memo}}</span>
                    </div>
                </cell-box>
            </group>
            <group :gutter="10">
                <cell-box>
                    <flexbox orient="vertical" :gutter="0">
                        <flexbox-item>
                            <span style="font-size:12px;color:#8f8f8f;">服务编号: {{apm.order.order_code}}</span>
                        </flexbox-item>
                        <flexbox-item>
                            <span style="font-size:12px;color:#8f8f8f;">订单编号: {{apm.order.order_code}}</span>
                        </flexbox-item>
                        <flexbox-item>
                            <span style="font-size:12px;color:#8f8f8f;">下单时间: {{apm.created_time | dateTimeFormatFilter2}}</span>
                        </flexbox-item>
                    </flexbox>
                </cell-box>
            </group>
        </div>
        <!-- 底部预定按钮 -->
        <div class="divfooter">
            <!-- 待支付 -->
            <flexbox v-if="apm.status < 2 && apm.preappointment !== undefined" :gutter="0" align="center" style="height:100%;">
                <flexbox-item :span="1/3">
                    <!-- <div style="padding:5px;">
                        <x-button type="warn" style="font-size:16px;" @click.native="cancelApm(apm)">取消服务</x-button>
                    </div> -->
                </flexbox-item>
                <flexbox-item :span="1/3">
                    <div style="padding:5px;">
                        <x-button type="default" style="font-size:16px;" @click.native="callWorker()">联系客服</x-button>
                    </div>
                </flexbox-item>
                <flexbox-item :span="1/3">
                    <!-- <div style="padding:5px;a">
                        <x-button type="primary" style="font-size:16px;" @click.native="callWorker()">联系保洁师</x-button>
                    </div> -->
                </flexbox-item>
            </flexbox>
            <flexbox v-if="apm.status < 2 && apm.preappointment === undefined" :gutter="0" align="center" style="height:100%;">
               <flexbox-item :span="1/3">
               </flexbox-item>
                <flexbox-item :span="1/3">
                    <div style="padding:5px;">
                        <x-button type="default" style="font-size:16px;" @click.native="callWorker()">联系客服</x-button>
                    </div>
                </flexbox-item>
                <flexbox-item :span="1/3">
                    <!-- <div style="padding:5px;a">
                        <x-button type="primary" style="font-size:16px;" @click.native="callWorker()">联系保洁师</x-button>
                    </div> -->
                </flexbox-item>
            </flexbox>
            <!-- 订单关闭 or 订单完成 -->
            <flexbox v-if="apm.status > 1 && apm.preappointment !== undefined" :gutter="0" align="center" style="height:100%;">
                <flexbox-item :span="1/2">
                    <div style="padding:5px;">
                        <x-button type="default" style="font-size:16px;width:80%" @click.native="callWorker()">联系客服</x-button>
                    </div>
                </flexbox-item>
                <flexbox-item :span="1/2">
                    <div style="padding:5px;">
                        <x-button type="primary" style="font-size:16px;width:150px;" @click.native="toPerapmDetail(apm)">再次预约</x-button>
                    </div>
                </flexbox-item>
            </flexbox>
            <flexbox v-if="apm.status > 1 && apm.preappointment === undefined" :gutter="0" align="center" style="height:100%;">
                <flexbox-item :span="1/2">
                    <div style="padding:5px;">
                        <x-button type="default" style="font-size:16px;width:80%" @click.native="callWorker()">联系客服</x-button>
                    </div>
                </flexbox-item>
                <flexbox-item :span="1/2">
                    <div style="padding:5px;">
                        <x-button type="primary" style="font-size:16px;width:150px;" @click.native="toSubmitOrder(apm.order.service)">再次购买</x-button>
                    </div>
                </flexbox-item>
            </flexbox>
        </div>
        <!-- popup -->
        <!-- 服务地址 -->
        <div v-transfer-dom>
            <popup v-model="workerDetail">
                <div style="padding-bottom:15px;height:220px;">
                    <div style="text-align:center;padding:15px 0;border-bottom:1px solid #efeef3;background-color:white;">
                        <img style="width:60px;height:60px;border-radius:50%;border: 2px solid #ececec;" :src="apm.worker === undefined ? '': apm.worker.ava" />
                        <br/>
                        <span style="font-size:14px;">{{apm.worker === undefined ? '' :apm.worker.name}}</span>
                    </div>
                    <!-- <div id="address">
                        <flexbox orient="vertical" style="text-align:center;border-bottom:1px solid #efeef3;padding:15px 0;background-color:white;">

                            <flexbox-item>
                                <span>年龄：{{apm.worker === undefined ? '' : apm.worker.age}}</span>
                            </flexbox-item>
                            <flexbox-item>
                                <span>籍贯：{{apm.worker === undefined ? '' :apm.worker.native_place}}</span>
                            </flexbox-item>
                            <flexbox-item>
                                <span>身份证：{{apm.worker === undefined ? '' : apm.worker.id_card.substring(0,6) + '********' + apm.worker.id_card.substring(14,18)}} </span>&nbsp;
                                <span style="border: 1px solid #00AF3F;color:#00AF3F;padding:0 3px;">验</span>
                            </flexbox-item>
                            <flexbox-item>
                                <span>最近服务：322</span>
                            </flexbox-item>
                        </flexbox>
                    </div> -->
                </div>
            </popup>
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
    Value2nameFilter as value2name,
    TransferDom,
    Popup
} from 'vux'
import {
    fetchAppointment,
    updateAppointmentStatus,
    cancelService
} from 'utils/api'
import addressData from 'data/address'
import { mapActions } from 'vuex'
export default {
    directives: {
        TransferDom
    },
    components: {
        Group,
        CellBox,
        Cell,
        Flexbox,
        FlexboxItem,
        XButton,
        ViewBox,
        Popup
    },
    created() {
        this.setPageTitle('服务详情')
    },
    mounted() {
        this.fetchData()
    },
    data() {
        return {
            addressData,
            apm: {
                contact_area: [],
                contact_detail_address: '',
                order: {},
                worker: {}
            },
            workerDetail: false
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
        openWorkerDetail() {
            this.workerDetail = true
        },
        getAddressDetail(area, detail_address) {
            // console.log(area)
            // console.log(detail_address)
            return value2name(area, this.addressData) + detail_address
        },
        toPerapmDetail(apm) {
            this.TDAPP('D302', '用户在预约服务详情页点击按钮: ' + '再次预约')
            this.$router.push({
                path: 'preapmdetail',
                query: {
                    preapm: apm.preappointment._id
                }
            })
        },
        toSubmitOrder(service) {
            this.TDAPP('D300', '用户在预约服务详情页点击按钮: ' + '再次购买')
            this.$router.push({
                path: 'submitorder',
                query: {
                    serviceId: service._id
                }
            })
        },
        // 0 - 已预约（未分配）；1 - 已分配；2 - 服务中；3 - 服务完成; 4 - 服务取消;
        showApmStatus(status) {
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
        async fetchData() {
            const _id = this.$route.query.apmId
            if (_id) {
                const res = await fetchAppointment(_id)
                console.log(res.data.appointment)
                if (res.status === 0 && res.data.appointment) {
                    this.apm = res.data.appointment
                }
            }
        },
        callWorker() {
            this.TDAPP('D301', '用户在预约服务详情页点击按钮: ' + '联系客服')
            window.location.href = 'tel://075583222339'
        },
        async cancelApm(apm) {
            let res = null
            if (apm.preappointment !== '') {
                res = await cancelService(apm)
            } else {
                res = await updateAppointmentStatus(apm._id, 4)
            }
            console.log(res)
            if (res.status === 0) {
                this.$vux.toast.show({
                    text: '取消服务成功'
                })
                this.apm.status = 4
            } else {
                this.$vux.toast.show({
                    type: 'cancel',
                    text: '取消服务失败'
                })
            }
        }
    }
}
</script>


<style lang="less">

</style>
