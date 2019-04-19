<template>
    <flexbox :gutter="0" wrap="wrap" orient="vertical" class="divbg">
        <!-- <flexbox-item>
            <divider style="padding:15px 0;">服务范围</divider>
        </flexbox-item>
        <flexbox-item>
            <span>介绍介绍</span>
        </flexbox-item>
        <flexbox-item @click.native="test()">
            <div style="display:flex;flex-wrap:wrap;justify-content:center">
                <div class="circle">
                    <span class="cspan">厨房</span>
                </div>
                <div class="circle">
                    <span class="cspan">卫生间</span>
                </div>
                <div class="circle">
                    <span class="cspan">客厅</span>
                </div>
            </div>
            <div style="display:flex;flex-wrap:wrap;justify-content:center">
                <div class="circle">
                    <span class="cspan">卧室</span>
                </div>
                <div class="circle">
                    <span class="cspan">餐厅</span>
                </div>
                <div class="circle">
                    <span class="cspan">阳台</span>
                </div>
            </div>
            <br />
        </flexbox-item> -->
        <flexbox-item>
            <div v-for="(image, key) in imgList" :key="key">
                <x-img :src="image.url" @on-success="success" :offset="-100" container="#vux_view_box_body" style="width:100%;height:auto;">
                </x-img>
            </div>
        </flexbox-item>
    </flexbox>
</template>

<script>
    import {
        Flexbox,
        FlexboxItem,
        Divider,
        XImg
    } from 'vux'
    export default {
        components: {
            Flexbox,
            FlexboxItem,
            Divider,
            XImg
        },
        props: {
            imgList: Array
        },
        methods: {
            success(src, ele) {
                console.log('success load', src)
            }
        }
    }
</script>

<style lang="less">
    @import "../../assets/less/theme";
    .circle {
        width: 80px;
        height: 80px;
        border-color: #F00;
        border-radius: 50%;
        border: 1px;
        border-style: solid;
        margin: 5px 12px;
        .cspan {
            height: 80px;
            line-height: 80px;
            display: block;
            text-align: center;
            font-size: 14px;
            font-weight: 500px;
        }
    }
</style>