<template>
  <div class="createPost-container">
    <!-- <el-alert v-if="postForm.remark" title="温馨提示" type="warning" :description="'备注: ' + postForm.remark" show-icon /> -->
    <el-tabs v-model="activeTab" style="margin-top:15px;" @tab-click="clickParent">
      <el-tab-pane label="阿姨简历" name="resume">
        <worker-resume ref="resume" :worker-id="this.$route.query.id" />
      </el-tab-pane>
      <el-tab-pane v-if="isEdit" label="沟通记录" name="communication">
        <communication-pane ref="comm" :worker-id="this.$route.query.id" />
      </el-tab-pane>
      <el-tab-pane v-if="isEdit" label="合同管理" name="contract">
        <worker-contract :worker-id="this.$route.query.id" />
      </el-tab-pane>
      <el-tab-pane v-if="isEdit" label="保险记录" name="insurance">
        <insurance-pane :worker-id="this.$route.query.id" />
      </el-tab-pane>
      <el-tab-pane v-if="isEdit" label="评价备注" name="comment">
        <worker-reviews :worker-id="this.$route.query.id" />
      </el-tab-pane>
      <el-tab-pane v-if="isEdit" label="资金记录" name="money">
        <finance-record :worker-id="this.$route.query.id" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { fetchWorker } from '@/api/worker';
import WorkerResume from './workerResume';
import insurancePane from './insurancePane';
import CommunicationPane from './communication';
import FinanceRecord from './financeRecord';
import WorkerContract from './workerContract';
import WorkerReviews from './workerReviews';

export default {
  name: 'WorkerInfo',
  components: {
    WorkerResume,
    insurancePane,
    CommunicationPane,
    FinanceRecord,
    WorkerContract,
    WorkerReviews
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeTab: 'resume',
      worker: undefined
    };
  },
  created() {
    this.fetchData();
  },
  mounted() {},
  methods: {
    clickParent(tab, event) {
      switch (tab.label) {
        case '沟通记录':
          this.$refs.comm.parentHandleclick(this.worker);
          break;
        case '阿姨简历':
          this.$refs.resume.parentHandleclick(this.worker);
          break;
      }
    },
    fetchData() {
      const _id = this.$route.query.id;
      fetchWorker(_id)
        .then(response => {
          this.worker = response.data.data.worker;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
