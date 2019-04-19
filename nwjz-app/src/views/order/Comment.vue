<template>
    <div id="comment-view" class="container-view">
        <!-- 我的订单 -->
        <!-- 我的服务 -->
        <card v-if="order" style="margin:10px">
            <!-- header -->
            <div slot="header" style="display:flex;padding:8px 10px;">
                <div style="text-align:left;flex:1;">
                    <span style="color:#00AF3F;font-size:13px;font-weight:500;">{{new Date(order.service_time) | dateTimeFormatFilter}}</span>
                </div>
                <div style="text-align:right;">
                    <check-icon :value.sync="postForm.is_anonymous" type="plain">匿名评价</check-icon>
                </div>
            </div>
            <!-- content -->
            <div slot="content" style="padding:10px;background-color:#f9f9f9;">
                <div class="comment-card">
                    <img :src="order.service.primary_pic" class="col-left">
                    <div class="col-right">
                        <h1 class="col-title">{{order.service.title}}</h1>
                    </div>
                </div>
                <divider>评分</divider>
                <div>
                    <rater v-model="postForm.score"></rater>
                </div>
                <div>
                    <group :gutter="15">
                        <x-textarea ref="content" v-model="postForm.content" :max="100" placeholder="亲，对我们的服务还满意吗？"></x-textarea>
                    </group>
                </div>
                <div class="weui-cells weui-cells_form" id="uploaderCustom" v-if="false">
                    <div class="weui-cell">
                        <div class="weui-cell__bd">
                            <div class="weui-uploader">
                                <div class="weui-uploader__hd">
                                    <p class="weui-uploader__title">图片上传</p>
                                </div>
                                <div class="weui-uploader__bd">
                                    <ul class="weui-uploader__files" id="uploaderCustomFiles"></ul>
                                    <div class="weui-uploader__input-box">
                                        <input id="uploaderCustomInput" class="weui-uploader__input js_file" type="file">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </card>
        <div class="divfooter" slot="bottom">
            <div style="display:flex;justify-content:center;align-items:center;height:100%;width:100%">
                <x-button @click.native="submitForm()" :style="this.postForm.score>0?'margin:7px 10px;color:#FFFFFF;background-color:#00AF3F;':''">提交</x-button>
            </div>
        </div>
    </div>
</template>

<script>
import {
    Tab,
    TabItem,
    Card,
    XButton,
    Flexbox,
    FlexboxItem,
    Sticky,
    Value2nameFilter as value2name,
    dateFormat,
    Loading,
    TransferDomDirective as TransferDom,
    CheckIcon,
    Divider,
    Rater,
    XTextarea,
    Group,
    Cell
} from 'vux'
import {
    fetchServiceCategory,
    fetchOrder,
    submitComment
} from 'utils/api'
import addressData from 'data/address'
import { mapActions } from 'vuex'
export default {
    props: {
        selected: Number
    },
    directives: {
        TransferDom
    },
    components: {
        Tab,
        TabItem,
        Card,
        XButton,
        Flexbox,
        FlexboxItem,
        Sticky,
        Loading,
        CheckIcon,
        Divider,
        Rater,
        XTextarea,
        Group,
        Cell
    },
    created() {
        this.setPageTitle('评价')
        this.fetchServiceCategory()
        this.fetchData()
    },
    filters: {
        dateTimeFormatFilter(datetime) {
            return dateFormat(new Date(datetime), 'YYYY-MM-DD HH:mm')
        },
        dateTimeFormatFilter2(datetime) {
            return dateFormat(new Date(datetime), 'MM月DD日 周E HH:mm')
        }
    },
    data() {
        return {
            addressData,
            orderType: 0,
            tabIndex: 0,
            haveUnservice: true,
            catsMap: {},
            order: {
                service: {},
                address: {
                    area: []
                }
            },
            show1: false,
            postForm: {
                is_anonymous: false,
                score: 0,
                user_avatar: '',
                user_name: ''
            }
        }
    },
    methods: {
        ...mapActions([
            'setPageTitle'
        ]),
        onRightClick() { },
        onLeftClick() { },
        getAddressDetail(area, detail_address) {
            return value2name(area, this.addressData) + detail_address
        },
        category2Label(code) {
            if (this.catsMap[code] === undefined) {
                return code
            } else {
                return this.catsMap[code]
            }
        },
        async fetchData() {
            const _id = this.$route.query.orderId
            if (_id) {
                const res = await fetchOrder(_id)
                console.log('res.data.order = ', res.data)
                if (res.status === 0 && res.data.order) {
                    this.order = res.data.order
                    this.postForm.service = this.order.service._id
                    this.postForm.order = this.order._id
                    this.postForm.user_avatar = res.data.order.user.avatar
                    this.postForm.user_name = res.data.order.user.nickname
                }
            }
        },
        async submitForm() {
            console.log(this.postForm)
            if (!this.postForm.score || this.postForm.score === 0) {
                this.$vux.toast.show({
                    type: 'text',
                    text: '亲，给个好评呗!',
                    width: '12em'
                })
                return
            }
            const res = await submitComment(this.postForm)
            console.log(res)
            if (res.status === 0) {
                this.$vux.toast.show({
                    text: '提交成功'
                })
                this.TDAPP('COMMENT001', '提交评价成功')
                this.$router.push({
                    path: '/order'
                })
            } else {
                if (res.status === 1) {
                    this.$vux.toast.show({
                        type: res.type,
                        text: res.message
                    })
                } else {
                    this.$vux.toast.show({
                        type: 'cancel',
                        text: '提交失败'
                    })
                }
            }
        },
        async fetchServiceCategory() {
            const res = await fetchServiceCategory()
            console.log(res)
            const cats = res.data.serviceCategories
            cats.forEach(item => {
                this.catsMap[item.code] = item.label
            })
        }
    }
}
</script>

<style lang="less">
@import '../../assets/less/theme';
.weui-icon-circle {
    font-size: 16px !important;
}
.weui-icon-success-circle {
    font-size: 16px !important;
}
.card-padding {
    padding: 15px;
}
.comment-card {
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    align-items: center;
    .col-left {
        width: 60px;
        height: 60px;
        padding-right: 10px;
    }
    .col-right {
        flex: 1;
        -webkit-flex: 1;
        text-align: left;
        .col-title {
            font-size: @fontSize14;
            color: @colorFontBlack;
            padding-bottom: 3px;
        }
        .col-content {
            font-size: @fontSize12;
            color: @colorFontBlack;
            font-weight: 400;
            padding-bottom: 5px;
        }
    }
    .col-price {
        .col-price-span {
            font-size: @fontSize14;
            color: @colorBlack;
        }
        .col-money-span {
            font-size: @fontSize14;
            color: @colorMoney;
        }
    }
}
.vux-demo {
    text-align: center;
}

.logo {
    width: 100px;
    height: 100px;
}

.weui-uploader__bd {
    margin-bottom: -4px;
    margin-right: -9px;
    overflow: hidden;
}

.weui-uploader__input-box {
    float: left;
    position: relative;
    margin-right: 9px;
    margin-bottom: 9px;
    width: 77px;
    height: 77px;
    border: 1px solid #d9d9d9;
}

.weui_uploader_file {
    float: left;
    margin-right: 9px;
    margin-bottom: 9px;
    width: 79px;
    height: 79px;
    background: no-repeat center center;
    background-size: cover;
    list-style: none;
}

.weui-uploader__input {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.weui-uploader__input-box:before {
    width: 2px;
    height: 39.5px;
}

.weui-uploader__input-box:after {
    width: 39.5px;
    height: 2px;
}

.weui-uploader__input-box:after,
.weui-uploader__input-box:before {
    content: ' ';
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background-color: #d9d9d9;
}
</style>

