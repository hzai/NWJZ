<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top:0px;" tab-position="top">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <table-pane v-if="activeName==item.key" :category="item.key" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { statProspectStatus } from '@/api/employer';
import tablePane from '@/views/system/dictionary/table';
export default {
  name: 'Dictionary',
  components: { tablePane },
  filters: {},
  props: {},
  data() {
    return {
      total: 0,
      stats: undefined,
      // 状态 0 - 新建 1 - 跟进中 2 - 匹配中 3 - 待面试 4 - 待签单 5 - 已服务 6 - 已放弃 7 - 已私签 8 - 黑名单
      tabMapOptions: [{ key: 'income', label: '收入明细' }, { key: 'expenses', label: '支出明细' }],
      tempOptions: [
        {
          key: '0',
          label: '待跟进'
        },
        {
          key: '1',
          label: '跟进中'
        },
        {
          key: '2',
          label: '已面试'
        },
        {
          key: '3',
          label: '已签约'
        },
        {
          key: '4',
          label: '已失效'
        }
      ],
      activeName: 'income'
    };
  },
  created() {
    this.statisticsProspect();
  },
  mounted() {},
  methods: {
    statusFilter(status) {
      // 状态 0 - 待跟进 1 - 跟进中 2 - 已面试 3 - 已签约
      const statusMap = {
        '0': '待跟进',
        '1': '跟进中',
        '2': '已面试',
        '3': '已签约',
        '4': '已失效'
      };
      return statusMap[status];
    },
    statisticsProspect() {
      statProspectStatus().then(response => {
        this.total = response.data.data.total;
        this.stats = response.data.data.employers;
        console.log(this.stats);
        const statsMap = [];
        this.stats.forEach(item => {
          statsMap[item._id] = item.count;
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'src/styles/mixin.scss';
</style>
