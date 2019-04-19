<template>
    <div style="margin:10px;" v-html="trim(content)"></div>
</template>

<script>
import {
    userProtocol
} from '../../utils/api'
import { mapActions } from 'vuex'
export default {
    data() {
        return {
            content: ''
        }
    },
    created() {
        this.TDAPP('U001', '用户打开用户协议')
        this.setPageTitle('用户协议')
        this.getUserProtocol()
    },
    methods: {
        ...mapActions(['setPageTitle']),
        async getUserProtocol() {
            const res = await userProtocol()
            if (res.status === 0 && res.data.setting) {
                this.content = res.data.setting.user_protocol
            }
        },
        trim(str) {
            return str.replace(/\n|\r\n/g, '<br/>')
        }
    }
}
</script>
