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
// import tablePane from './components/tablePane';
export default {
    name: 'WorkerCommunicate',
    filters: {},
    props: {},
    data() {
        return {
            total: 0,
            stats: undefined,
            tabMapOptions: [],
            activeName: 'ALL'
        };
    },
    created() {
    // this.statisticsWorker();
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
        statisticsWorker() {
            statWorker().then(response => {
                console.log(response.data.data.workers);
                this.total = response.data.data.total;
                this.stats = response.data.data.workers;
                this.tabMapOptions.push({
                    label: '全部(' + this.total + ')',
                    key: 'ALL'
                });
                this.stats.forEach(item => {
                    this.tabMapOptions.push({
                        label: this.statusFilter(item._id + '') + '(' + item.count + ')',
                        key: item._id + ''
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
