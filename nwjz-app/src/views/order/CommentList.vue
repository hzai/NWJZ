<template>
    <!-- 用户评价列表 -->
    <scroller lock-x scrollbar-y use-pullup height="-46" :pulldown-config="pulldownConfig" :pullup-config="pulldupConfig" @on-pullup-loading="loadMore" @on-pulldown-loading="refresh" v-model="status" ref="scroller">
        <div class="divbg">
            <flexbox v-for="(comment, _id) in comments" :key="_id" :gutter="0" wrap="wrap" align="flex-start" style="padding:8px 0;border-bottom:1px solid #dfdfdf;">
                <flexbox-item :span="1/6" style="padding-left:15px;">
                    <img :src="comment.user_avatar" class="avatarimg" v-if="!comment.is_anonymous" />
                    <img src="http://ojv9my13c.bkt.clouddn.com/avatar.jpeg" class="avatarimg" v-if="comment.is_anonymous" />
                </flexbox-item>
                <flexbox-item style="padding-right:15px;">
                    <flexbox :gutter="0" orient="vertical">
                        <flexbox-item style="padding-bottom:8px;">
                            <span style="font-size:14px;font-weight:700;">{{starName(comment.user_name,comment.is_anonymous)}}</span>
                            <span style="float:right;color:#afafaf;">{{new Date(comment.created_time) | dateTimeFormatFilter}}</span>
                        </flexbox-item>
                        <flexbox-item style="padding-bottom:5px;">
                            <rater :font-size="14" :margin="1" :value="comment.score"></rater>
                        </flexbox-item>
                        <flexbox-item style="padding-right:3px;">
                            <span style="font-size:14px;">
                                {{comment.content}}
                            </span>
                        </flexbox-item>
                    </flexbox>
                </flexbox-item>
            </flexbox>
        </div>
    </scroller>
</template>

<script>
import {
    XButton,
    Flexbox,
    FlexboxItem,
    dateFormat,
    Loading,
    ViewBox,
    CheckIcon,
    Divider,
    Rater,
    XTextarea,
    Group,
    Cell,
    Scroller
} from 'vux'

import {
    fetchCommentByService
} from 'utils/api'
import { mapActions } from 'vuex'
export default {
    components: {
        XButton,
        Flexbox,
        FlexboxItem,
        Loading,
        ViewBox,
        CheckIcon,
        Divider,
        Rater,
        XTextarea,
        Group,
        Cell,
        Scroller
    },
    created() {
        this.setPageTitle('用户评价')
        this.fetchCommentData(false)
    },
    filters: {
        dateTimeFormatFilter(datetime) {
            return dateFormat(new Date(datetime), 'YYYY-MM-DD')
        }
    },
    data() {
        return {
            countPerPage: 10,
            currentPage: 1,
            comments: {},
            listQuery: {
                page: 1,
                limit: 10,
                _id: this.$route.query.serviceId
            },
            n: 10,
            n1: 10,
            pullupEnabled: true,
            status: {
                pullupStatus: 'default',
                pulldownStatus: 'default'
            },
            pulldownConfig: { downContent: ' ', upContent: ' ', loadingContent: '加载中...' },
            pulldupConfig: { content: '上拉刷新', downContent: ' ', upContent: '上拉刷新', loadingContent: '加载中...' }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.scroller.reset({ top: 0 })
        })
    },
    methods: {
        ...mapActions([
            'setPageTitle'
        ]),
        starName(name, change) {
            return change ? name.substring(0, 1) + '***' + name.substring(name.length - 1, name.length) + '（匿名）' : name.substring(0, 1) + '***' + name.substring(name.length - 1, name.length)
        },
        loadMore() {
            setTimeout(() => {
                this.n += 10
                setTimeout(() => {
                    this.$refs.scroller.donePullup()
                    this.currentPage += this.currentPage
                    this.listQuery.limit = this.countPerPage * this.currentPage
                    this.fetchCommentData()
                    this.$nextTick(() => {
                        this.$refs.scroller.reset()
                    })
                }, 10)
            }, 1000)
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
            }, 1000)
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
        async fetchCommentData() {
            const res = await fetchCommentByService(this.listQuery)
            if (res.status === 0 && res.data.comments) {
                this.comments = res.data.comments
            }
        }
    }
}
</script>

<style lang="less">
@import '../../assets/less/theme';
.avatarimg {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid #ececec;
}
.divbg {
    background-color: @colorFontWhite;
}
</style>

