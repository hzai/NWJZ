<template>
    <flexbox :gutter="0" wrap="wrap" orient="vertical" class="divbg" >
        <flexbox-item>
            <divider style="padding:15px 0;font-size:14px;color:#00AF3F">服务不包含范围</divider>
        </flexbox-item>
        <flexbox-item >
            <div style="padding:0 15px;">
            <i class="iconfont icon-dot1" style="color:#00AF3F; font-size" /> <span style="font-szie:14px;color:#4f4f4f;">做饭、洗衣、鱼缸清洗换水、宠物清洗溜宠物。</span>
            </div>
        </flexbox-item>
        <flexbox-item >
            <div style="padding:0 15px;">
            <i class="iconfont icon-dot1" style="color:#00AF3F; font-size" /> <span style="font-szie:14px;color:#4f4f4f;">贵重物品清洁（含字画、古董、宗教品、易碎易损物品及放置贵重物品的柜子内部）</span>
            </div>
        </flexbox-item>
        <flexbox-item >
            <div style="padding:0 15px;">
            <i class="iconfont icon-dot1" style="color:#00AF3F; font-size" /> <span style="font-szie:14px;color:#4f4f4f;">外窗清洗、外墙清洗。</span>
            </div>
        </flexbox-item>
        <flexbox-item >
            <div style="padding:0 15px;">
            <i class="iconfont icon-dot1" style="color:#00AF3F; font-size" /> <span style="font-szie:14px;color:#4f4f4f;">家电拆洗（空调、冰箱、抽油烟机清洗）、窗帘拆洗（窗帘床上用品及沙发清洗）、地板打蜡、天花板及附属品如吊灯吊顶。</span>
            </div>
        </flexbox-item>

        <flexbox-item>
            <divider style="padding:15px 0;font-size:14px;color:#00AF3F">服务预定须知</divider>
        </flexbox-item>
        <flexbox-item >
            <div style="padding:0 15px;">
            <i class="iconfont icon-dot1" style="color:#00AF3F; font-size" /> <span style="font-szie:14px;color:#4f4f4f;">预定服务</span>
            </div>
        </flexbox-item>
        <flexbox-item >
            <div style="padding:0 15px;">
             <span style="font-szie:12px;color:#4f4f4f;padding-left:20px;">晚上10点前可预约第二天的服务，晚上10点后只预约第三天的服务。预定成功后，付款选择在线支付，服务订单会为您保留30分钟（从预定时间算起），30分钟后还未付款成功，系统将自动取消该服务订单。</span>
            </div>
        </flexbox-item>
        <flexbox-item >
            <div style="padding:0 15px;">
            <i class="iconfont icon-dot1" style="color:#00AF3F; font-size" /> <span style="font-szie:14px;color:#4f4f4f;">更改或取消</span>
            </div>
        </flexbox-item>
        <flexbox-item >
            <div style="padding:0 15px;">
             <span style="font-szie:12px;color:#4f4f4f;padding-left:20px;">服务开始前2小时，可通过了了管家微信公众号的在线客服或拨打了了管家服务热线；如有其他疑问可在工作时间拨打 0755-8322 2339 客服热线或联系在线客服。</span>
             </div>
        </flexbox-item>

        <flexbox-item>
            <divider style="padding:15px 0;font-size:14px;color:#00AF3F">产生临时退改费</divider>
        </flexbox-item>
        <flexbox-item >
            <div style="padding:0 15px;">
            <i class="iconfont icon-dot1" style="color:#00AF3F; font-size" /> <span style="font-szie:14px;color:#4f4f4f;">提前变更服务时间</span>
            </div>
        </flexbox-item>
        <flexbox-item >
            <div style="padding:0 15px;">
             <span style="font-szie:12px;color:#4f4f4f;padding-left:20px;">如您需要更改服务时间。只需提前2小时通过了了管家公众号联系在线客服或者拨打客服热线更改。但如果服务更改至您的非固定服务时间，此次服务可能需要更换保洁师，因在该时间您的保洁师可能已有其他客户需要服务。</span>
             </div>
        </flexbox-item>
        <flexbox-item >
            <div style="padding:0 15px;">
            <i class="iconfont icon-dot1" style="color:#00AF3F; font-size" /> <span style="font-szie:14px;color:#4f4f4f;">临时变更服务时间</span>
            </div>
        </flexbox-item>
        <flexbox-item >
            <div style="padding:0 15px;">
             <span style="font-szie:12px;color:#4f4f4f;padding-left:20px;">服务开始前2小时至服务开始前1小时内，如遇特殊情况您仍然可以更改服务时间，只需要支付50元（时长为4小时的服务）即每小时12.5元的临时退改费。</span>
        </div>
        </flexbox-item>
        <flexbox-item >
            <div style="padding:0 15px;">
            <i class="iconfont icon-dot1" style="color:#00AF3F; font-size" /> <span style="font-szie:14px;color:#4f4f4f;">无法开始服务</span>
            </div>
        </flexbox-item>
        <flexbox-item >
            <div style="padding:0 15px;">
             <span style="font-szie:12px;color:#4f4f4f;padding-left:20px;">因停水或您的个人原因导致服务时间开始1小时后保洁师仍然无法开始服务的，只需要支付50元（时长为4小时的服务）即每小时12.5元的临时退改费。</span>
             </div>
        </flexbox-item>

        <flexbox-item>
            <divider style="padding:15px 0;font-size:14px;color:#00AF3F">订单停休日期说明</divider>
        </flexbox-item>
        <flexbox-item >
            <div style="padding:0 15px;">
             <span style="font-szie:12px;color:#4f4f4f;padding-left:20px;">春节（除夕前一周至初八）、了了管家所有服务休停。休停期间不提供服务、休停期间服务次数将顺延至下一次保洁服务。国家法定节假日：元旦（1月1日）、五一（5月1日）、国庆节（10月1日）只服务包年顾客，如果您的固定保洁师请假未能提供服务，了了管家将提前以短信或电话告知您。</span>
        </div>
        </flexbox-item>


    </flexbox>
</template>

<script>
    import {
        Group,
        Flexbox,
        FlexboxItem,
        Divider
    } from 'vux'
    export default {
        components: {
            Group,
            Flexbox,
            FlexboxItem,
            Divider
        }
    }
</script>

<style lang="less">
    @import "../../assets/less/theme";

</style>