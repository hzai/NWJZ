<template>
    <div>
        <scroller lock-x scrollbar-y use-pullup use-pulldown height="-46" :pulldown-config="pulldownConfig" :pullup-config="pulldupConfig" @on-pullup-loading="loadMore" @on-pulldown-loading="refresh" v-model="status" ref="scroller">
            <div class="box2">
                <swipeout>
                    <swipeout-item transition-mode="follow" v-for="(msg, index) in messages" :key="index">
                        <div slot="right-menu">
                            <swipeout-button @click.native="onDeleteButtonClick(msg, index)" type="warn">删除</swipeout-button>
                        </div>
                        <div slot="content" class="demo-content vux-1px-t">
                            <card>
                                <!-- header -->
                                <!-- content -->
                                <div slot="content" style="padding:10px;background-color:#f9f9f9;" @click="toPage(msg.redirect_url, msg)">
                                    <div class="order-card">
                                        <i class="iconfont icon-xitongxiaoxi" style="color:#f0a76c;font-size:30px;padding:0 5px;"></i>
                                        <div class="col-right">
                                            <h1 class="col-title">{{msg.title}}
                                                <badge v-if="msg.status===0" style="vertical-align: top;"></badge>
                                            </h1>
                                            <h1 class="col-time">{{msg.created_time | dateTimeFormatFilter}}</h1>
                                            <div class="col-content">
                                                <span style="margin:2">{{msg.content}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </card>
                        </div>
                    </swipeout-item>
                </swipeout>

            </div>
            <!--pullup slot-->
            <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
                <span v-show="status.pullupStatus === 'default'"></span>
                <span class="pullup-arrow" v-show="status.pullupStatus === 'down' || status.pullupStatus === 'up'" :class="{'rotate': status.pullupStatus === 'up'}">↑</span>
                <span v-show="status.pullupStatus === 'loading'">
                    <spinner type="ios-small"></spinner>
                </span>
            </div>
        </scroller>
    </div>
</template>

<script>
import {
    Badge,
    Scroller,
    Divider,
    XSwitch,
    Group,
    Spinner,
    Card,
    dateFormat,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton
} from 'vux'
import {
    getMessage,
    updateMessage,
    deleteMessage
} from 'utils/api'
import { mapActions } from 'vuex'
export default {
    components: {
        Badge,
        Scroller,
        Divider,
        XSwitch,
        Group,
        Spinner,
        Card,
        Swipeout,
        SwipeoutItem,
        SwipeoutButton
    },
    data() {
        return {
            orders: {},
            messages: {},
            n: 10,
            n1: 10,
            pullupEnabled: true,
            status: {
                pullupStatus: 'default',
                pulldownStatus: 'default'
            },
            pulldownConfig: { downContent: ' ', upContent: ' ', loadingContent: '加载中...' },
            pulldupConfig: { downContent: ' ', upContent: ' ', loadingContent: '加载中...' }
        }
    },
    created() {
        this.TDAPP('M001', '进入消息中心')
        this.setPageTitle('消息中心')
        this.getMyMessageData()
    },
    filters: {
        dateTimeFormatFilter(datetime) {
            return dateFormat(new Date(datetime), 'YYYY-MM-DD hh:mm')
        }
    },
    methods: {
        ...mapActions(['setPageTitle']),
        loadMore() {
            setTimeout(() => {
                this.n += 10
                setTimeout(() => {
                    this.$refs.scroller.donePullup()
                }, 10)
            }, 2000)
        },
        refresh() {
            setTimeout(() => {
                this.n = 10
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.$refs.scroller.donePulldown()
                        this.pullupEnabled && this.$refs.scroller.enablePullup()
                    }, 10)
                })
            }, 2000)
        },
        changePullupStatus(enabled) {
            if (enabled) {
                this.$refs.scroller.enablePullup()
                this.pullupEnabled = true
            } else {
                this.$refs.scroller.disablePullup()
                this.pullupEnabled = false
            }
        },
        loadMore1() {
            setTimeout(() => {
                this.n1 += 10
                this.$nextTick(() => {
                    this.$refs.scroller1.donePullup()
                    if (this.n1 >= 30) {
                        this.$refs.scroller1.disablePullup()
                        console.log('No more data, Pullup disabled!')
                    }
                })
            }, 2000)
        },
        toPage(path, msg) {
            msg.status = 1
            this.updateStatue(msg)
            this.$router.push({
                path: path
            })
        },
        async onDeleteButtonClick(msg, key) {
            const res = await deleteMessage(msg)
            if (res.status === 0) {
                this.messages.splice(key, 1)
            }
        },
        async getMyMessageData() {
            const res = await getMessage()
            console.log(res)
            if (res.status === 0 && res.data.messages) {
                this.messages = res.data.messages
            }
        },
        async updateStatue(msg) {
            const res = await updateMessage(msg)
            console.log(res)
            if (res.status === 0) {
                if (window.JPush) {
                    window.JPush.getApplicationIconBadgeNumber((badgeNum) => {
                        console.log(badgeNum)
                        badgeNum = (badgeNum - 1) < 0 ? 0 : badgeNum - 1
                        console.log('start to set local and server badgeNum: ', badgeNum)
                        window.JPush.setApplicationIconBadgeNumber(badgeNum)
                        window.JPush.setBadge(badgeNum)
                    })
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../assets/less/theme';
.card-padding {
    padding: 15px;
}
.order-card {
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
        .col-time {
            font-size: 8px;
            color: @colorFontBlack;
            font-weight: 100;
            padding-bottom: 5px;
        }
        .col-content {
            font-size: @fontSize12;
            color: @colorFontBlack;
            font-weight: 300;
            padding-bottom: 5px;
            background-color: #ececec;
            border-radius: 3px;
        }
    }
    .col-price {
        .col-price-span {
            font-size: @fontSize14;
            color: @colorBlack;
        }
    }
}
.box2-wrap {
    height: 300px;
    overflow: hidden;
}
.rotate {
    display: inline-block;
    transform: rotate(-180deg);
}
.pullup-arrow {
    transition: all linear 0.2s;
    color: #666;
    font-size: 25px;
}
</style>