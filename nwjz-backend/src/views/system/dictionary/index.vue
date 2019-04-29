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
      tabMapOptions: [
        { key: 'income', label: '收入明细' },
        { key: 'expenses', label: '支出明细' },
        { key: 'source', label: '客户来源' }
      ],
      activeName: 'income'
    };
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'src/styles/mixin.scss';
</style>
