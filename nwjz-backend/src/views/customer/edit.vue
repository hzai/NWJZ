<template>
  <div class="tab-container">
    <!-- <el-alert title="温馨提示" type="warning" description="'备注: ' + postForm.remark" show-icon /> -->
    <div style="border:1px solid #fff;padding:5px 15px;">
      <el-row>
        <el-col :span="8">
          <span>{{ postForm.name }}&nbsp;&nbsp;&nbsp;&nbsp;{{ postForm.contact_phone }}</span>
        </el-col>
        <el-col :span="6">
          <span>需求:{{postForm.requirements}}({{postForm.source}}) &nbsp;&nbsp;&nbsp;&nbsp;</span>
        </el-col>
        <el-col :span="2">
          <el-tag :type="postForm.status | employerStatusColorFilter">{{ postForm.status | employerStatusFilter}}</el-tag>
        </el-col>
      </el-row>
      <el-row style="padding-top:3px;">
        <el-col :span="12">
          <span>地址:&nbsp;&nbsp;{{ postForm.address_area | codeToTextFilter}}{{ postForm.detail_address }}</span>
        </el-col>
        <el-col :span="12">
          <span>备注:&nbsp;&nbsp;{{ postForm.remark }}</span>
        </el-col>
      </el-row>
    </div>

    <el-tabs v-model="activeName" @tab-click="clickParent">
      <el-tab-pane key="detail" label="需求情况" name="detail">
        <requirements-detail :is-edit="true" :employer-id="this.$route.query.id" />
      </el-tab-pane>
      <el-tab-pane key="communication" label="跟进记录" name="communication">
        <communication-pane ref="comm" :employer-id="this.$route.query.id" />
      </el-tab-pane>
      <el-tab-pane key="workersearch" label="阿姨筛选" name="workersearch">
        <worker-mapping ref="workersearch" :is-edit="true" :employer-id="this.$route.query.id" />
      </el-tab-pane>
      <el-tab-pane key="contract" label="合同管理" name="contract">
        <customer-contract :is-edit="true" :employer-id="this.$route.query.id" />
      </el-tab-pane>
      <el-tab-pane key="insurance" label="保险记录" name="insurance">
        <insurance-pane :is-edit="true" :employer-id="this.$route.query.id" />
      </el-tab-pane>
      <el-tab-pane key="moneyio" label="收支记录" name="moneyio">
        <fa-manage :is-edit="true" :employer-id="this.$route.query.id" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { fetchEmployer } from '@/api/employer';
import CommunicationPane from '@/views/customer/components/communicationDetail';
// import CustomerDetail from '@/views/customer/components/customerDetail';
import RequirementsDetail from '@/views/customer/components/requirementsDetail';
import CustomerContract from '@/views/customer/components/customerContract';
import FaManage from '@/views/customer/components/faManage';
import WorkerMapping from '@/views/customer/components/workerMapping';
import InsurancePane from '@/views/customer/components/insurancePane';
export default {
  name: 'CustomerEdit',
  components: {
    CommunicationPane,
    RequirementsDetail,
    CustomerContract,
    FaManage,
    WorkerMapping,
    InsurancePane
  },
  filters: {},
  data() {
    return {
      activeName: 'detail',
      postForm: {}
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    clickParent(tab, event) {
      switch (tab.label) {
        case '跟进记录':
          console.log('click 跟进记录');
          this.fetchData();
          this.$refs.comm.parentHandleclick(this.postForm);
          break;
        case '阿姨筛选':
          console.log('click 阿姨筛选');
          this.fetchData();
          this.$refs.workersearch.parentHandleclick(this.postForm);
          break;
      }
    },
    fetchData() {
      const _id = this.$route.query.id;
      fetchEmployer(_id)
        .then(response => {
          this.postForm = response.data.data.employer;
          //   console.log(this.postForm);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'src/styles/mixin.scss';
</style>
