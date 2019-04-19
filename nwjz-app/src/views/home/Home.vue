<template>
    <div id="home-view" class="container-view" v-if="banners && cats && strictServices">
        <!-- 中间内容 -->
        <div class="view-content">
            <!-- 轮播广告图片 -->
            <swiper auto loop :aspect-ratio="0.35" dots-position="center">
                <swiper-item v-for="(banner, key) in banners" :key="key">
                    <img :src="banner" style="height:100%;width:100%;" @click="clickAD(key, banner)">
                </swiper-item>
            </swiper>
            <!-- 轮播广告图片 -->
            <!-- 中间服务分类 -->
            <flexbox :gutter="0" wrap="wrap" align="center" class="gridc">
                <flexbox-item :span="1/4" v-for="(cat, key) in cats" :key="key">
                    <div class="serdiv" v-on:click="detailByCat(cat.service)">
                        <i solt="icon" class="serdiv-piz iconfont" :class="cat.icon" :style="cat.color"></i>
                        <br/>
                        <span class="serdiv-title">{{cat.label}}</span>
                    </div>
                </flexbox-item>
                <!-- <flexbox-item :span="1/4" :key="key">
                    <div class="serdiv" @click="freeDetail()">
                        <i solt="icon" class="serdiv-piz iconfont icon-mianfei" style="color:red"></i>
                        <br/>
                        <span class="serdiv-title">助力享免单</span>
                    </div>
                </flexbox-item> -->
            </flexbox>
            <!-- 中间业务分类 -->
            <br/>
            <!-- 优惠活动 -->
            <grid :cols="1" class="gridc">
                <grid-item style="padding: 10px;">
                    <div style="height:30px;v-align:center">
                        <i solt="icon" class="icon-SVG- iconfont" style="color: #EC615D; font-size:26px;">
                            <span class="card-title">优惠体验套餐</span>
                        </i>
                    </div>
                </grid-item>
                <grid-item v-for="(service, key) in strictServices" :key="key" @click.native="detail(key, service)">
                    <div class="card">
                        <img :src="service.primary_pic" class="col-left">
                        <div class="col-right">
                            <h1 class="col-title">{{service.title}}</h1>
                            <h2 class="col-content">{{service.sub_title}}</h2>
                            <div style="padding-top:5px;">
                                <span class="tmoney">¥{{service.discounted_price | keepTwoNum}}
                                    <span class="ymoney" v-if="service.sale_price === 99">¥160</span>
                                    <!-- <span class="ymoney" v-else-if="service.sale_price === 120">¥200</span> -->
                                    <span class="ymoney" v-else>¥{{service.sale_price}}</span>
                                    <span class="sell_count">{{service.sell_count}}人付款</span>
                                </span>
                            </div>
                        </div>

                    </div>
                </grid-item>
            </grid>
            <br/>
            <!-- 优惠活动end -->
        </div>
        <!-- 中间内容 -->
    </div>
</template>

<script>
import {
    Swiper,
    SwiperItem,
    Grid,
    GridItem,
    Flexbox,
    FlexboxItem
} from 'vux'
import GestureMobile from '../../assets/lib/GestureMobile'
import types from '../../store/mutation-types'
import {
    fetchHomePage
} from 'utils/api'
import {
    mapActions
} from 'vuex'
export default {
    name: 'home',
    data() {
        return {
            banners: [],
            cats: null,
            strictServices: {}
        }
    },
    components: {
        Swiper,
        SwiperItem,
        Grid,
        GridItem,
        Flexbox,
        FlexboxItem
    },
    created() {
        this.TDAPP('H001', '进入首页')
        this.setPageTitle('了了管家')
        this.getHomePage()
        // this.fetchServiceCategory()
        this.gestureMobile()
        this.setNavIndex()
        // this.fetchStrictService()
        // this.fetchBanners()
    },
    methods: {
        ...mapActions([
            'setPageTitle'
        ]),
        onRightClick() { },
        onLeftClick() { },
        clickAD(key, banner) {
            this.TDAPP('B_' + key, '点击广告: ' + banner)
        },
        detail(key, service) {
            this.TDAPP('T_' + key, '点击服务: ' + service.title)
            console.log(service._id)
            this.$router.push({
                path: '/serdetail',
                query: {
                    serviceId: service._id,
                    t: new Date().getTime()
                }
            })
        },
        async detailByCat(serviceId) {
            // const res = await fetchServiceByCat(cat)
            // if (res.status === 0 && res.data.service.length >= 1) {
            //     const _id = res.data.service[0]._id
            //     this.TDAPP('C_' + cat, '点击服务: ' + res.data.service[0].title)
            this.$router.push({
                path: '/serdetail',
                query: {
                    serviceId: serviceId,
                    t: new Date().getTime()
                }
            })
            // }
        },
        freeDetail() {
            this.$router.push({
                path: '/serdetail',
                query: {
                    serviceId: '5b3672b795375a3c6373be93'
                }
            })
        },
        // 手势
        gestureMobile() {
            this.$nextTick(() => {
                const _this = this
                GestureMobile(this.$el, {
                    upCallBackFun() {
                        _this.is_open = true
                    },
                    downCallBackFun() {
                        _this.is_open = false
                    }
                })
            })
        },
        async getHomePage() {
            const res = await fetchHomePage()
            console.log('home page res = ', res)
            if (res.status === 0) {
                this.banners = res.data.banners
                this.cats = res.data.cats
                this.strictServices = res.data.strictServices
            }
        },
        // async fetchServiceCategory() {
        //     const res = await fetchServiceCategory()
        //     console.log(res)
        //     this.cats = res.data.serviceCategories
        // },
        // async fetchStrictService() {
        //     const params = {}
        //     const res = await getStrictServices(params)
        //     console.log(res)
        //     if (res.status === 0) {
        //         this.strictServices = res.data.services
        //     }
        // },
        // async fetchServiceByCat(category) {
        //     const res = await fetchServiceByCat(category)
        //     console.log(res.data.service[0])
        //     if (res.status === 0 && res.data.service) {
        //         console.log(res.data.service[0]._id)
        //         return res.data.service[0]._id
        //     }
        // },
        // async fetchBanners(category) {
        //     const res = await banners()
        //     console.log(res)
        //     if (res.status === 0 && res.data.setting) {
        //         this.banners = res.data.setting.banner
        //     }
        // },
        // 设置导航条按钮状态
        setNavIndex() {
            this.$store.commit(types.SET_NAV_INDEX, '1')
        }
    }
}
</script>

<style lang="less">
@import '../../assets/less/theme';
.gridc {
    background-color: #ffffff;
}
.gridspantitle {
    font-size: @fontSize16;
    line-height: 30px;
    vertical-align: middle;
}
.flex-demo {
    text-align: center;
    color: #fff;
    background-color: #20b907;
    border-radius: 4px;
    background-clip: padding-box;
}
.serdiv {
    padding: 10px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .serdiv-piz {
        font-size: @fontSize42;
        padding: 10px;
    }
    .serdiv-title {
        font-weight: 500;
        font-size: 13px;
    }
}
.card-title {
    font-size: 16px;
    line-height: 30px;
    vertical-align: middle;
    color: #4f4f4f;
    font-weight: 500;
}
.card {
    display: flex;
    display: -webkit-flex;
    .col-left {
        width: 110px;
        height: 80px;
        padding-right: 15px;
    }
    .col-right {
        flex: 1;
        -webkit-flex: 1;
        text-align: left;
        .col-title {
            font-size: @fontSize14;
            color: @colorFontBlack;
            padding-bottom: 5px;
        }
        .col-content {
            font-size: @fontSize12;
            color: @colorFontBlack;
            font-weight: 400;
        }
    }
}
.tmoney {
    font-size: @fontSize16;
    font-weight: 500;
    color: @colorMoney;
    // padding: 0 12px;
}
.ymoney {
    font-size: @fontSize12;
    font-weight: 500;
    color: #858585;
    text-decoration: line-through;
    // padding: 0 12px;
}
.sell_count {
    padding-left: 10px;
    color: #4f4f4f;
    font-size: 10px;
    font-weight: 400;
}
</style>