<template>
    <div class="divbg" v-if="this.commentData.length>0">
        <divider style="padding:15px 0;border-bottom;font-size:14px;color:#00AF3F">服务评价</divider>
        <!-- <div>
            <span>服务评价</span>
        </div> -->
        <flexbox :gutter="0" wrap="wrap" align="flex-start" style="padding:8px 0;border-bottom:1px solid #dfdfdf;">
            <flexbox-item :span="1/6" style="padding-left:15px;">
                <img :src="this.commentData[0].user_avatar" class="avatarimg" v-if="!this.commentData[0].is_anonymous" />
                <img src="http://ojv9my13c.bkt.clouddn.com/avatar.jpeg" class="avatarimg" v-if="this.commentData[0].is_anonymous" />
            </flexbox-item>
            <flexbox-item style="padding-right:15px;">
                <flexbox :gutter="0" orient="vertical">
                    <flexbox-item style="padding-bottom:8px;">
                        <span style="font-size:14px;font-weight:700;">{{ starName(this.commentData[0].user_name,this.commentData[0].is_anonymous)}}</span>
                        <span style="float:right;color:#afafaf;">{{new Date(this.commentData[0].created_time) | dateTimeFormatFilter}}</span>
                    </flexbox-item>
                    <flexbox-item style="padding-bottom:5px;">
                        <rater :font-size="14" :margin="1" :value="this.commentData[0].score"></rater>
                    </flexbox-item>
                    <flexbox-item style="padding-right:3px;">
                        <span style="font-size:14px;">
                            {{this.commentData[0].content}}
                        </span>
                    </flexbox-item>
                </flexbox>
            </flexbox-item>
        </flexbox>
        <div style="height:35px;line-height:35px;" v-if="this.commentData.length>1" @click="goList()">
            <span style="font-size:13px;color:#00AF3F">查看{{this.commentData.length}}条评论</span>
        </div>

    </div>
</template>

<script>
import {
    Flexbox,
    FlexboxItem,
    XImg,
    Divider,
    Rater,
    XTable,
    Group,
    Cell,
    dateFormat
} from 'vux'
export default {
    props: {
        commentData: Array
    },
    components: {
        Flexbox,
        FlexboxItem,
        XImg,
        Divider,
        Rater,
        XTable,
        Group,
        Cell
    },
    filters: {
        dateTimeFormatFilter(datetime) {
            return dateFormat(new Date(datetime), 'YYYY-MM-DD')
        }
    },
    methods: {
        starName(name, change) {
            return change ? name.substring(0, 1) + '***' + name.substring(name.length - 1, name.length) + '（匿名）' : name.substring(0, 1) + '***' + name.substring(name.length - 1, name.length)
        },
        goList() {
            this.$router.push({
                path: '/commentlist',
                query: {
                    serviceId: this.commentData[0].service
                }
            })
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
</style>
