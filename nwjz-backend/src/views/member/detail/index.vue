<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top:0px;">
      <el-tab-pane key="info" label="基本资料" name="info">
        <member-info />
      </el-tab-pane>
      <el-tab-pane key="order" label="订单" name="order">
        <member-order />
      </el-tab-pane>
      <el-tab-pane key="address" label="地址" name="address">
        <member-address />
      </el-tab-pane>
      <el-tab-pane key="coupon" label="优惠券" name="coupon">
        <member-coupon />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import memberInfo from '@/views/member/components/memberInfo';
import memberOrder from '@/views/member/components/memberOrder';
import memberAddress from '@/views/member/components/memberAddress';
import memberCoupon from '@/views/member/components/memberCoupon';
export default {
    name: 'MemberDetail',
    components: { memberInfo, memberOrder, memberAddress, memberCoupon },
    filters: {},
    props: {},
    data() {
        return {
            total: 0,
            stats: undefined,
            tabMapOptions: [
                { label: '基本资料', key: 'info' },
                { label: '订单', key: 'order' },
                { label: '合同', key: 'contract' },
                { label: '地址', key: 'address' },
                { label: '优惠券', key: 'coupon' }
            ],
            activeName: 'info'
        };
    },
    created() {},
    mounted() {},
    methods: {
        statusFilter(status) {
            const statusMap = {
                '0': '待岗',
                '1': '在岗',
                '2': '离职',
                '3': '黑名单'
            };
            return statusMap[status];
        }
    }
};
</script>

<style lang="scss" scoped>
@import 'src/styles/mixin.scss';
</style>
