<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top:0px;">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <table-pane v-if="activeName==item.key" :status="item.key" type="prospect" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { statProspectStatus } from '@/api/employer';
import tablePane from '@/views/customer/components/tablePane';
export default {
    name: 'CustomerProspect',
    components: { tablePane },
    filters: {},
    props: {},
    data() {
        return {
            total: 0,
            stats: undefined,
            // 状态 0 - 新建 1 - 跟进中 2 - 匹配中 3 - 待面试 4 - 待签单 5 - 已服务 6 - 已放弃 7 - 已私签 8 - 黑名单
            tabMapOptions: [],
            tempOptions: [
                {
                    key: '0',
                    label: '新建'
                },
                {
                    key: '1',
                    label: '跟进中'
                },
                {
                    key: '2',
                    label: '匹配中'
                },
                {
                    key: '3',
                    label: '待面试'
                },
                {
                    key: '4',
                    label: '待签单'
                },
                {
                    key: '5',
                    label: '已服务'
                },
                {
                    key: '6',
                    label: '已放弃'
                },
                {
                    key: '7',
                    label: '已私签'
                },
                {
                    key: '8',
                    label: '黑名单'
                }
            ],
            activeName: 'ALL'
        };
    },
    created() {
        this.statisticsProspect();
    },
    mounted() {},
    methods: {
        statusFilter(status) {
            // 状态 0 - 新建 1 - 跟进中 2 - 匹配中 3 - 待面试 4 - 待签单 5 - 已服务 6 - 已放弃 7 - 已私签 8 - 黑名单
            const statusMap = {
                '0': '新建',
                '1': '跟进中',
                '2': '匹配中',
                '3': '待面试',
                '4': '待签单',
                '5': '已服务',
                '6': '已放弃',
                '7': '已私签',
                '8': '黑名单'
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
                this.tabMapOptions.push({
                    label: '全部(' + this.total + ')',
                    key: 'ALL'
                });
                this.tempOptions.forEach(item => {
                    const temp = statsMap[item.key];
                    const count = temp || 0;
                    this.tabMapOptions.push({
                        label: this.statusFilter(item.key + '') + '(' + count + ')',
                        key: item.key + ''
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
