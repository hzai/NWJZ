<template>
  <div class="tab-container">
    <el-alert title="温馨提示" type="warning" description="'备注: ' + postForm.remark" show-icon />
    <el-tabs v-model="activeName">
      <el-tab-pane key="detail" label="基本资料" name="detail">
        <customer-detail :is-edit="true" />
      </el-tab-pane>
      <el-tab-pane key="contract" label="合同管理" name="contract">
        <customer-contract :is-edit="true" />
      </el-tab-pane>
      <el-tab-pane key="track" label="跟进记录" name="track" />
      <el-tab-pane label="沟通记录" name="communication">
        <communication-pane type="employer" :employer-id="this.$route.query.employerId" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CommunicationPane from '@/components/Communication';
import CustomerDetail from '@/views/customer/components/customerDetail';
import CustomerContract from '@/views/customer/components/customerContract';
export default {
    name: 'CustomerEdit',
    components: {
        CommunicationPane,
        CustomerDetail,
        CustomerContract
    },
    filters: {},
    data() {
        return {
            activeName: 'detail'
        };
    }
};
</script>

<style lang="scss" scoped>
@import 'src/styles/mixin.scss';
</style>
