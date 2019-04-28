<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top:0px;">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <keep-alive>
          <table-pane v-if="activeName==item.key" :status="item.key" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { statWorker } from '@/api/worker';
import staticOptions from '@/data/options';
import tablePane from './components/tablePane';
export default {
  name: 'WorkerManage',
  components: { tablePane },
  filters: {},
  props: {},
  data() {
    return {
      staticOptions,
      total: 0,
      stats: undefined,
      tabMap: [],
      tabMapOptions: [],
      activeName: 'ALL'
    };
  },
  created() {
    this.statisticsWorker();
  },
  mounted() {},
  methods: {
    statusFilter(status) {
      const statusMap = {
        0: '待岗',
        1: '在岗',
        2: '离职',
        3: '黑名单'
      };
      return statusMap[status];
    },
    initTabMapMap() {
      const workerStatus = this.staticOptions.workerStatus;
      workerStatus.forEach(item => {
        this.tabMap[item.value] = item.label;
      });
    },
    statisticsWorker() {
      statWorker().then(response => {
        this.total = response.data.data.total;
        this.stats = response.data.data.workers;
        this.tabMapOptions.push({
          label: '全部' + '(' + this.total + ')',
          key: 'ALL'
        });
        const countMap = [];
        this.stats.forEach(item => {
          countMap[item._id] = item.count;
        });
        const workerStatus = this.staticOptions.workerStatus;
        workerStatus.forEach(item => {
          this.tabMap[item.value] = item.label;
          this.tabMapOptions.push({
            label: countMap[item.value]
              ? item.label + '(' + countMap[item.value] + ')'
              : item.label + '(0)',
            key: item.value + ''
          });
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'src/styles/mixin.scss';
</style>
