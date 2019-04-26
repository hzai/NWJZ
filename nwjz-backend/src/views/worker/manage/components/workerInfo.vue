<template>
  <div class="createPost-container">
    <!-- <el-alert v-if="postForm.remark" title="温馨提示" type="warning" :description="'备注: ' + postForm.remark" show-icon /> -->
    <el-tabs v-model="activeTab" style="margin-top:15px;">
      <el-tab-pane label="阿姨简历" name="resume">
        <worker-resume :worker-id="this.$route.query.id" />
      </el-tab-pane>
      <el-tab-pane v-if="isEdit" label="沟通记录" name="communication">
        <communication-pane :worker-id="this.$route.query.id" />
      </el-tab-pane>
      <el-tab-pane v-if="isEdit" label="合同管理" name="contract">
        <insurance-pane :worker-id="this.$route.query.id" />
      </el-tab-pane>
      <el-tab-pane v-if="isEdit" label="保险记录" name="insurance">
        <insurance-pane :worker-id="this.$route.query.id" />
      </el-tab-pane>
      <el-tab-pane v-if="isEdit" label="评价备注" name="comment">
        <insurance-pane :worker-id="this.$route.query.id" />
      </el-tab-pane>
      <el-tab-pane v-if="isEdit" label="资金记录" name="money">
        <finance-record :worker-id="this.$route.query.id" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import WorkerResume from './workerResume';
import insurancePane from './insurancePane';
import CommunicationPane from './communication';
import FinanceRecord from './financeRecord';

export default {
  name: 'WorkerInfo',
  components: { WorkerResume, insurancePane, CommunicationPane, FinanceRecord },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeTab: 'resume'
    };
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
</style>
