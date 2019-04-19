<template>
    <!--引导页面-->
    <div class="guide-wrap">
        <!--引导页-->
        <div class="guide-item" :key="guide_index" v-for="( guide_item , guide_index) in guide_arr" :style="{ backgroundImage: 'url(' + guide_item.img_url + ')' }" :class="{'guide-item-active': guide_active_index > guide_index}">
            <span @click="jumpGuide()" class="guide-go" v-if=" (guide_arr.length - 1) == guide_index">马上体验</span>
        </div>
        <!--/引导页-->
        <!--引导页索引-->
        <ul class="guide-trigger">
            <li class="guide-trigger-item" :key="guide_index" v-for="( guide_item , guide_index) in guide_arr" @click="guideTrigger(guide_index)" :class="{ 'guide-active-trigger': guide_active_index == (guide_index + 1) }">
            </li>
        </ul>
        <!--/引导页索引-->
        <!--跳过按钮-->
        <i class="iconfont icon-tiaoguo" @click="jumpGuide()"></i>
        <!--/跳过按钮-->
    </div>
    <!--/引导页面-->
</template>

<script>
    import GestureMobile from '../../assets/lib/GestureMobile'
    import {
        mapMutations,
        mapState
    } from 'vuex'
    export default {
        name: 'guide',
        data() {
            return {
                guide_active_index: 1,
                guide_arr: [
                    {
                        img_url: 'http://www.owulia.com/ink/static/img/guide_1.jpg'
                    },
                    {
                        img_url: 'http://www.owulia.com/ink/static/img/guide_2.jpg'
                    },
                    {
                        img_url: 'http://www.owulia.com/ink/static/img/guide_3.jpg'
                    },
                    {
                        img_url: 'http://www.owulia.com/ink/static/img/guide_4.jpg'
                    }
                ]
            }
        },
        created() {
            // this.JUDGE_IS_NOT_FIRST(true)
            this.$nextTick(() => {
                const _this = this
                GestureMobile(this.$el, {
                    leftCallBackFun() {
                        if (_this.guide_active_index === _this.guide_arr.length) return
                        _this.guide_active_index++
                    },
                    rightCallBackFun() {
                        if (_this.guide_active_index === 1) return
                        _this.guide_active_index--
                    }
                })
            })
        },
        computed: {
            ...mapState([
                'is_not_first'
            ])
        },
        methods: {
            ...mapMutations([
                'JUDGE_IS_NOT_FIRST'
            ]),
            /* *跳过引导页面 */
            jumpGuide() {
                this.JUDGE_IS_NOT_FIRST(true)
                this.$router.push('/')
            },
            /* *索引触发 */
            guideTrigger(guide_index) {
                this.guide_active_index = guide_index + 1
            }
        }
    }
</script>

<style lang="less">
    @import "../../assets/less/theme";
    .guide-wrap {
        z-index: 999;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        overflow: hidden;
        animation-duration: .5s;
        animation-fill-mode: both;
    }
    .guide-item {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        transform: translate3d(100%, 0, 0);
        transition: transform .5s;
        repeat: no-repeat;
        background-position: center;
        background-attachment: fixed; //filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='images/background.jpg', sizingMethod='scale');
        //-ms-filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='images/background.jpg', sizingMethod='scale');
        background-size: cover;
        -moz-background-size: cover;
        -webkit-background-size: cover;
        &.guide-item-active {
            transform: translate3d(0, 0, 0);
        }
    }
    .guide-trigger {
        position: absolute;
        text-align: center;
        left: 0;
        right: 0;
        font-size: 0;
        bottom: 30px;
    }
    .guide-trigger-item {
        cursor: pointer;
        display: inline-block;
        position: relative;
        width: 10px;
        height: 10px;
        border: 1px solid #58B7FF;
        border-radius: 50%;
        margin: 0 5px;
        transition: all .5s;
        &:after {
            position: absolute;
            top: 50%;
            left: 50%;
            content: '';
            width: 6px;
            height: 6px;
            margin-top: -3px;
            margin-left: -3px;
            transition: all .5s;
            border-radius: 50%;
            background-color: #fff;
        }
        &.guide-active-trigger {
            &:after {
                background-color: #58B7FF;
            }
        }
    }
    .guide-jump {
        cursor: pointer;
        position: absolute;
        width: 20px;
        height: 20px;
        top: 20px;
        right: 20px;
        fill: #1296db;
    }
    .guide-go {
        position: absolute;
        text-align: center;
        font-size: 14px;
        cursor: pointer;
        left: 50%;
        color: #fff;
        border-radius: 10px;
        width: 120px;
        height: 40px;
        bottom: 80px;
        box-shadow: 0 3px 0 0 #1D8CE0;
        margin-left: -60px;
        line-height: 40px;
        background-color: #58B7FF;
    }
    .guide-wrap-hide {
        animation-name: guide-fadeOutUp;
    }
    @keyframes guide-fadeOutUp {
        from {
            opacity: 1;
        }
        to {
            transform: translate3d(0, -100%, 0);
        }
    }
</style>
