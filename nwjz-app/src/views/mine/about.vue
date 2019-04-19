<template>
    <div style="background-color:#FFFFFF;height:100%">
        <flexbox orient="vertical">
            <flexbox-item style="text-align:center;padding-top:100px;">
                <img src="../../assets/images/Logo2.png" class="yj" alt="">
            </flexbox-item>
            <flexbox-item style="text-align:center;">
                <span class="appname">了了管家</span>
            </flexbox-item>
            <flexbox-item style="text-align:center;">
                <span class="version">当前版本: v1.3.3</span>
            </flexbox-item>
            <flexbox-item style="text-align:center;padding-top:80px;">
                <span class="item">官方网址: http://www.llguanjia.com</span>
            </flexbox-item>
            <flexbox-item style="text-align:center;">
                <span class="item">公众号: 了了管家</span>
            </flexbox-item>
            <flexbox-item style="text-align:center;">
                <span class="item">客服电话: 0755-83222339</span>
            </flexbox-item>
        </flexbox>
    </div>
</template>

<script>
import {
    Flexbox,
    FlexboxItem
} from 'vux'
import { mapActions } from 'vuex'
export default {
    created() {
        this.setPageTitle('关于了了管家')
        this.TDAPP('W005', '用户打开关于了了管家')
    },
    methods: {
        ...mapActions(['setPageTitle'])
    },
    components: {
        Flexbox,
        FlexboxItem
    }
}
</script>
<style lang="less">
@import '../../assets/less/theme.less';
.yj {
    width: 100px;
    height: 100px;
    -moz-border-radius: 20px;
    -webkit-border-radius: 20px;
    border-radius: 20px;
}
.appname {
    font-size: 20px;
    color: @colorOne;
}
.version {
    font-size: 14px;
}
.item {
    font-size: 14px;
}
</style>
