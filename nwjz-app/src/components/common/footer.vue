<template>
    <tabbar  style="width:100%;" v-if="isNotFirst">
        <tabbar-item :selected="this.$route.path === '/'" link="/">
            <i slot="icon" class="iconfont icon-shouye"></i>
            <span slot="label">首页</span>
        </tabbar-item>
        <tabbar-item :selected="this.$route.path === '/order'" link="/order" @click.native="goToLogin">
            <i slot="icon" class="iconfont icon-dingdan"></i>
            <span slot="label">订单</span>
        </tabbar-item>
        <tabbar-item :selected="this.$route.path === '/mine'" link="/mine">
            <i slot="icon" class="iconfont icon-wode"></i>
            <span slot="label">我的</span>
        </tabbar-item>
    </tabbar>
</template>

<script>
    import {
        Tabbar,
        TabbarItem
    } from 'vux'
    import {
        mapState
    } from 'vuex'
    export default {
        components: {
            Tabbar,
            TabbarItem,
            mapState
        },
        computed: {
            ...mapState([
                'is_login'
            ]),
            isNotFirst() {
                return this.$store.state.is_not_first
            }
        },
        methods: {
            goToLogin() {
                if (!this.is_login) {
                    this.$router.push({
                        path: '/login'
                    })
                }
            }
        }
    }
</script>

<style lang="less">
    @import '../../assets/less/theme.less';
    .weui-tabbar {
        background-color: @colorWhite !important;
    }
    .weui-tabbar__item {
        color: @colorFontNav !important;
    }
    .weui-bar__item_on {
        color: @colorOne !important;
    }
</style>