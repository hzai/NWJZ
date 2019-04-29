<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top:0px;">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <table-pane v-if="activeName==item.key" :status="item.key" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { statEmployerStatus } from '@/api/employer';
import staticOptions from '@/data/options';
import tablePane from '@/views/customer/components/tablePane';
export default {
  name: 'CustomerList',
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
    this.initTabMapMap();
    this.statisticsCustomer();
  },
  mounted() {},
  methods: {
    initTabMapMap() {
      const employerStatus = this.staticOptions.employerStatus;
      employerStatus.forEach(item => {
        this.tabMap[item.value] = item.label;
      });
    },
    statisticsCustomer() {
      statEmployerStatus().then(response => {
        this.total = response.data.data.total;
        this.stats = response.data.data.employers;
        this.tabMapOptions.push({
          label: '全部(' + this.total + ')',
          key: 'ALL'
        });

        const countMap = [];
        this.stats.forEach(item => {
          countMap[item._id] = item.count;
        });
        const employerStatus = this.staticOptions.employerStatus;
        employerStatus.forEach(item => {
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
