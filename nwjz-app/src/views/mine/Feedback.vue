<template>
    <div>
        <div style="padding:10px;">
            <span>我们产品还有许多需要改进的地方，您的反馈和建议对我们非常重要，欢迎您对我们的产品功能或有问题的地方提出反馈或建议，以便我们尽快改进产品和服务</span>
        </div>
        <group :gutter="10">
            <x-textarea ref="feedback_content" v-model="feedback.feedback_content" :max="500" placeholder="请输入您的反馈意见或建议"></x-textarea>
        </group>
        <group :gutter="15">
            <x-input v-model="feedback.feedback_phone" title="手机号码" placeholder="输入手机号码(选填)" is-type="china-mobile"></x-input>
        </group>
        <x-button style="margin-top:15px;" type="warn" @click.native="submitFeedback()">提交</x-button>
    </div>
</template>

<script>
    import {
        XTextarea,
        XButton,
        Group,
        XInput
    } from 'vux'
    import {
        addFeedback
    } from 'utils/api'
    import { mapActions } from 'vuex'
    export default {
        components: {
            XTextarea,
            XButton,
            Group,
            XInput
        },
        data() {
            return {
                feedback: {
                    feedback_content: '',
                    feedback_phone: ''
                }
            }
        },
        created() {
            this.TDAPP('W003', '用户打开意见反馈')
            this.setPageTitle('意见反馈')
        },
        methods: {
            ...mapActions(['setPageTitle']),
            test() {
                console.log('click!')
            },
            async submitFeedback() {
                if (this.feedback.feedback_content !== '') {
                    const res = await addFeedback(this.feedback)
                    if (res.status === 0) {
                        console.log(res)
                        this.TDAPP('W004', '用户提交了意见反馈')
                        this.$vux.toast.show({
                            text: '提交成功，你的建议是我们最宝贵的礼物。',
                            width: '15em'
                        })
                        this.$router.go(-1)
                    } else {
                        this.$vux.toast.show({
                            type: 'cancel',
                            text: '提交失败'
                        })
                    }
                } else {
                    this.$vux.toast.show({
                        type: 'cancel',
                        text: '不能提交空的建议哦！',
                        width: '10em'
                    })
                }
            }
        }
    }
</script>

<style lang="less">

</style>
