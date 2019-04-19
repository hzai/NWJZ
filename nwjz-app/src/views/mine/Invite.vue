<template>
    <view-box ref="viewBox">
        <div id="home-view" class="container-view">
            <div class="view-content" v-if="service._id">
                <flexbox :gutter="0" wrap="wrap" orient="vertical" class="divbgf">
                    <flexbox-item>
                        <div>
                            <x-img :default-src="service.primary_pic" :offset="-200" container="#vux_view_box_body" style="width:100%;height:auto;">
                            </x-img>
                        </div>
                    </flexbox-item>
                    <flexbox-item style="padding-top:14px;padding-bottom:5px;">
                        <span class="title" @click="shareweixin()">{{service.title}}</span>
                    </flexbox-item>
                    <flexbox-item style="">
                        <p class="subtitle">{{service.sub_title}}</p>
                    </flexbox-item>
                    <flexbox-item style="padding-top:10px;padding-bottom:10px;">
                        <div v-cloak>
                            <span class="moneyn">￥0元
                                <span class="omoney">原价 ¥{{service.sale_price | keepTwoNum}}元
                                </span>
                            </span>
                            <span style="color:#4f4f4f;font-size:10px;font-weight: 400;">{{service.sell_count}}人已免费领</span>
                        </div>

                    </flexbox-item>
                </flexbox>

                <ser-comment :commentData="this.comments" />
                <ser-suggest v-if="service.is_strict_selection || service.category === 'RCBJ' || service.category === 'DQBJ'" />
                <ser-scope :img-list="service.detail_images" />
                <ser-guide />
                <br />
                <br />
            </div>
        </div>
        <!-- 底部预定按钮 -->
        <div class="divfooter" slot="bottom" style="height:50px;line-height:50px;">
            <flexbox style="width:100%;height:100%;" :gutter="0">
                <flexbox-item :span="1/3" style="background:#00AF3F;height:100%;color:white;font-size:18px;text-align:center;font-weight:800;" @click.native="goIndex()">
                    去逛逛
                </flexbox-item>
                <!-- <flexbox-item :span="2/3" style="background:#d6171c;height:100%;color:white;font-size:18px;text-align:center;font-weight:800;">
                    活动已结束
                </flexbox-item> -->
                <flexbox-item :span="2/3" @click.native="goInvite()" style="background:#d6171c;height:100%;color:white;font-size:18px;text-align:center;font-weight:800;">
                    我也要开团
                </flexbox-item>
            </flexbox>
        </div>
    </view-box>
</template>

<script>
import SerGuide from 'serdetail/serGuide'
import SerSuggest from 'serdetail/serSuggest'
import SerScope from 'serdetail/serScope'
import SerComment from 'serdetail/serComment'
import {
    XImg,
    XButton,
    Flexbox,
    FlexboxItem,
    ViewBox
} from 'vux'
import couponLimitData from 'data/couponLimit'
import {
    fetchService,
    getWechatSign,
    fetchCommentByService,
    callLog
} from 'utils/api'
import { weixinShareTimeline } from 'utils/weixinShare'
import { mapActions, mapState } from 'vuex'
export default {
    components: {
        XImg,
        XButton,
        Flexbox,
        FlexboxItem,
        SerGuide,
        SerSuggest,
        SerScope,
        ViewBox,
        SerComment
    },
    data() {
        return {
            service: {},
            coupons: {},
            isAssistSuccess: false,
            buyed: false,
            couponLimitData,
            userCoupon: {},
            comments: this.fetchCommentData()
        }
    },
    created() {
        this.fetchData()
        // this.getSign()
    },
    computed: {
        ...mapState([
            'is_login',
            'userInfo'
        ])
    },
    methods: {
        ...mapActions([
            'setPageTitle'
        ]),
        submitOrder(service) {
            this.TDAPP('D001', '点击立即预定: ' + service.title)
            this.$router.push({
                path: '/submitorder',
                query: {
                    serviceId: service._id
                }
            })
        },
        goIndex() {
            callLog({ message: '去逛逛' })
            this.$router.push({
                path: '/'
            })
        },
        submitApp(service) {
            this.TDAPP('D002', '点击立即预约: ' + service.title)
            this.$router.push({
                path: '/submitres',
                query: {
                    serviceId: service._id
                }
            })
        },
        goInvite() {
            callLog({ message: '我也要开团' })
            this.$router.push({
                path: '/shareinvite'
            })
        },
        shareweixin() {
            // console.log(this.$wechat)
            // this.getSign()
        },

        async getSign(resdata) {
            const url = encodeURIComponent(window.location.href.split('#')[0])
            const urlp = window.location.href.split('#/')[0] + '?pathto=' + window.location.href.split('#/')[1]
            // console.log('url;', window.location.href.split('#/')[0] + '?pathto=' + window.location.href.split('#/')[1])
            // console.log('stop!!!')
            const res = await getWechatSign({ 'url': url })
            // console.log(res)
            if (res.status === 0) {
                const data = {
                    'signPackage': res.data.signPackage,
                    'url': url,
                    'urlp': urlp,
                    'title': resdata.title,
                    'tmtitle': '',
                    'desc': resdata.sub_title,
                    'piz': resdata.primary_pic
                }
                // console.log(data)
                weixinShareTimeline(data, '', '')
            }
        },
        async fetchData() {
            const _id = this.$route.query.serviceId
            if (_id) {
                const res = await fetchService(_id)
                if (res.status === 0 && res.data.service) {
                    this.service = res.data.service
                    this.setPageTitle(this.service.title)
                    this.getSign(res.data.service)
                }
            }
        },
        async fetchCommentData() {
            const listQuery = {
                page: 1,
                limit: 0,
                _id: this.$route.query.serviceId
            }
            const data = await fetchCommentByService(listQuery).then(resComment => {
                return resComment.data.comments
            })
            return data
        }
    }
}
</script>

<style lang="less">
@import '../../assets/less/theme';
[v-cloak] {
    display: none !important;
}
.divbgf {
    background-color: @colorFontWhite;
}
.divbg {
    background-color: @colorFontWhite;
    margin-top: 15px;
}
.title {
    font-size: @fontSize16;
    font-weight: 500;
    padding: 0 12px;
}
.subtitle {
    font-size: @fontSize12;
    padding: 0 12px;
}
.omoney {
    font-size: @fontSize16;
    font-weight: 500;
    color: #858585;
    padding: 0 12px;
    text-decoration: line-through;
}
.moneyn {
    color: @colorMoney;
    font-size: 20px;
    font-weight: 500;
    padding: 0 12px;
}
</style>