<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" style="width: 150px;" class="filter-item" placeholder="姓名" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.contact_phone" style="width: 150px;" class="filter-item" placeholder="联系电话" @keyup.enter.native="handleFilter" />
      <el-select v-if="status==='ALL'" v-model="listQuery.requirements" multiple class="filter-item" style="width: 130px" placeholder="需求" @change="handleFilter">
        <el-option v-for="item in staticOptions.requirements" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-if="status==='ALL'" v-model="listQuery.status" class="filter-item" style="width: 130px" placeholder="状态" @change="handleFilter">
        <el-option key="ALL" label="所有状态" value="ALL" />
        <el-option v-for="item in staticOptions.employerStatus" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button class="filter-item" style="margin-right:5px;margin-left: 5px;" type="primary" icon="el-icon-search" @click="handleFilter()">查询</el-button>
      <!-- <el-button :loading="downloadLoading" class="filter-item" style="margin-right:5px;margin-left: 5px;" type="primary" icon="el-icon-download" @click="handleDownload()">导出</el-button> -->
      <router-link style="margin-right:5px;" :to="{ path:'create'}">
        <el-button class="filter-item" style="margin-left: 5px;" type="success" icon="el-icon-plus">新建客户</el-button>
      </router-link>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :border="true" :data="list" element-loading-text="给我一点时间" stripe fit highlight-current-row style="width: 100%">
      <el-table-column align="center" prop="name" label="姓名" width="100">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="需求" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.requirements}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="110px" label="联系电话">
        <template slot-scope="scope">
          <span>{{ scope.row.contact_phone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="地址" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.address_area | codeToTextFilter}}{{scope.row.detail_address}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="备注" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" align="center" label="状态" width="80" sortable prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | employerStatusColorFilter">
            {{ scope.row.status | employerStatusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="来源" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.source}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="80px" label="跟进人">
        <template slot-scope="scope">
          <span>{{ scope.row.created_by?scope.row.created_by.name:'' }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="操作" min-width="80" class-name="small-padding">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" type="primary" size="mini" @click="handleUpdate(scope.row)" />
        </template>
      </el-table-column> -->
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background :current-page.sync="listQuery.page" :page-sizes="[10, 15, 20]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

  </div>
</template>

<script>
import staticOptions from '@/data/options';
import { fetchEmployerList, updateEmployer } from '@/api/employer';
export default {
  name: 'CustomerList',
  filters: {},
  props: {
    status: {
      type: String,
      default: 'ALL'
    }
  },
  data() {
    return {
      staticOptions,
      quick_search: 0,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        status: this.status,
        name: undefined,
        contact_phone: undefined,
        requirements: []
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    async handleModifyStatus(row, status) {
      this.listLoading = true;
      row.status = status;
      await updateEmployer(row._id, row).then(resp => {
        if (resp.data.status === 0) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.listLoading = false;
        }
      });
    },
    getList() {
      this.listLoading = true;
      fetchEmployerList(this.listQuery).then(response => {
        this.list = response.data.data.employers;
        this.total = response.data.data.total;
        this.listLoading = false;
        // console.log(this.list);
      });
    },
    handleUpdate(row) {
      this.$router.push({
        path: 'edit',
        query: {
          id: row._id
        }
      });
    }
    // async handleDownload() {
    //     this.downloadLoading = true;
    //     const ExportJsonExcel = require('js-export-excel');
    //     const option = {};
    //     option.fileName = '雇主列表';
    //     option.datas = [];
    //     const toExcel = new ExportJsonExcel(option);
    //     toExcel.saveExcel(); // 保存
    //     this.downloadLoading = false;
    // }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.title-prompt {
  position: absolute;
  right: 0px;
  font-size: 12px;
  top: 10px;
  color: #ff4949;
}
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
</style>
