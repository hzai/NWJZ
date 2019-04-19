<template>
    <div id="app" style="height:100%;">
        <view-box ref="viewBox" :body-padding-top="headerVisibleTopPadding()" :body-padding-bottom="footerVisibleBottomPadding()">
            <!-- header -->
            <app-header slot="header" v-if="headerVisible()"></app-header>
            <!-- header -->
            <!--主体内容视图-->
            <transition :name="animateName" @after-enter="$vux.bus && $vux.bus.$emit('vux:after-view-enter')">
                <!--<keep-alive>-->
                <router-view class="main" slot="default"></router-view>
                <!--</keep-alive>-->
            </transition>
            <!--/主体内容视图-->
            <!--导航条-->
            <app-footer slot="bottom" v-if="footerVisible()"></app-footer>
            <!--/导航条-->
        </view-box>
    </div>
</template>

<script>
import AppHeader from './components/common/header'
import AppFooter from './components/common/footer'
import {
    ViewBox
} from 'vux'
import {
    mapState,
    mapActions
} from 'vuex'
import { isiOS, isAndroid } from 'utils/whatdevice'
export default {
    name: 'app',
    components: {
        ViewBox,
        AppHeader,
        AppFooter
    },
    beforeMount() {
        console.log('app before mount1')
        this.getUserInfo()
    },
    created() {
        this.handleJpush()
    },
    mounted() {
        // 获取用户信息
        // if (this.is_login) {
        //
        // }
    },
    computed: {
        ...mapState([
            'is_login',
            'userInfo'
        ]),
        animateName() {
            return this.$store.state.animate_name
        }
    },
    methods: {
        ...mapActions([
            'getUserInfo'
        ]),
        footerVisible() {
            return this.$route.meta.footerVisible
        },
        headerVisible() {
            return this.$route.meta.headerVisible
        },
        headerVisibleTopPadding() {
            if (this.$route.meta.headerVisible) {
                return '43px'
            } else {
                return '0px'
            }
        },
        footerVisibleBottomPadding() {
            if (this.$route.meta.footerVisible) {
                return '56px'
            } else {
                return '0px'
            }
        },
        handleJpush() {
            if (window.JPush) {
                let device = ''
                if (isiOS()) device = 'ios'
                if (isAndroid()) device = 'android'
                window.JPush.setTags({ sequence: 0, tags: [device] },
                    (result) => {
                        console.log(result)
                    }, (error) => {
                        console.log(error)
                    })
            }
        }
    }
}
</script>

<style lang="less">
@import './assets/less/reset.less';
@import './assets/less/main.less';
@import './assets/less/theme.less';
body {
    background: @colorBackground;
    color: @colorFontBlack;
}
html,
body {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
}
.main {
    -webkit-overflow-scrolling: touch;
}
.divfooter {
    background-color: @colorFontWhite;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 60px;
    width: 100%;
    z-index: 500;
}
// .vux-pop-out-enter-active,
// .vux-pop-out-leave-active,
// .vux-pop-in-enter-active,
// .vux-pop-in-leave-active {
//     will-change: transform;
//     transition: all 250ms;
//     height: 100%;
//     top: 0;
//     position: absolute;
//     backface-visibility: hidden;
//     perspective: 1000;
// }

// .vux-pop-out-enter {
//     opacity: 0;
//     transform: translate3d(-100%, 0, 0);
// }

// .vux-pop-out-leave-active {
//     opacity: 0;
//     transform: translate3d(100%, 0, 0);
// }

// .vux-pop-in-enter {
//     opacity: 0;
//     transform: translate3d(100%, 0, 0);
// }

// .vux-pop-in-leave-active {
//     opacity: 0;
//     transform: translate3d(-100%, 0, 0);
// }
</style>