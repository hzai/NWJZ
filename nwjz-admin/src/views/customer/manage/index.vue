<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" style="width: 150px;" class="filter-item" placeholder="搜索公司名称" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.telephone" style="width: 150px;" class="filter-item" placeholder="搜索公司电话" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="handleReset">重置</el-button>
      <router-link style="margin-right:15px;" :to="{ path:'create'}">
        <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-plus">新增客户</el-button>
      </router-link>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" :default-sort="{prop: 'status', order: 'descending'}" element-loading-text="给我一点时间" stripe fit highlight-current-row style="width: 100%;margin-top:30px;">
      <el-table-column align="center" type="index" width="50" />
      <el-table-column align="center" min-width="100px" :label="$t('company.name')" sortable prop="name">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="130px" :label="$t('company.telephone')">
        <template slot-scope="scope">
          <span>{{ scope.row.telephone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="130px" :label="$t('company.email')">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="130px" :label="$t('company.website')">
        <template slot-scope="scope">
          <span>{{ scope.row.website }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="140px" align="center" :label="$t('common.created_time')">
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.created_time) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center" :label="$t('common.status')" width="100" sortable prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusTypeFilter">
            {{ scope.row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('common.operations')" min-width="180" class-name="small-padding" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.identifier!='admin'" type="primary" icon="el-icon-edit" @click="handleUpdate(scope.row)">{{ $t('common.edit') }}</el-button>
          <el-button v-if="scope.row.identifier!='admin' && scope.row.status!=0" type="success" icon="el-icon-circle-check" @click="handleModifyStatus(scope.row,0)">{{ $t('common.active') }}</el-button>
          <el-button v-if="scope.row.identifier!='admin' && scope.row.status!=1" type="danger" icon="el-icon-circle-close" @click="handleModifyStatus(scope.row,1)">{{ $t('common.inactive') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background :current-page.sync="listQuery.page" :page-sizes="[5, 10, 15]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <el-dialog :title="dialogType==='edit'?$t('company.edit'):$t('company.add')" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px">
        <el-form-item label="公司名称" prop="name">
          <el-input v-model="temp.name" placeholder="公司名称" />
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input v-model="temp.telephone" />
        </el-form-item>
        <el-form-item label="公司邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="公司网站" prop="website">
          <el-input v-model="temp.website" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择">
            <el-option v-for="(item, key) in statusOptions" :key="key" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogType=='new'" type="primary" @click="createData">确 定</el-button>
        <el-button v-else type="primary" @click="updateForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchCompanyList,
  fetchCompany,
  createCompany,
  updateCompany,
  deleteCompany
} from '@/api/company';

export default {
  name: 'companyManage',
  filters: {
    statusTypeFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'danger'
      };
      return statusMap[status];
    },
    statusFilter(status) {
      const statusMap = {
        0: '正常',
        1: '禁用'
      };
      return statusMap[status];
    },
    roleFilter(role) {
      return this.rolesMap[role];
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        status: 'ALL',
        name: '',
        telephone: ''
      },
      resetQuery: {
        page: 1,
        limit: 10,
        status: 'ALL',
        name: '',
        telephone: ''
      },
      rolesMap: [],
      roleOptions: [],
      statusOptions: [
        {
          value: 0,
          label: '正常'
        },
        {
          value: 1,
          label: '禁用'
        }
      ],
      dialogType: 'new',
      dialogFormVisible: false,
      temp: {
        _id: '',
        name: '',
        email: '',
        telephone: '',
        website: '',
        roles: [],
        status: 0
      },
      rules: {
        name: [
          {
            required: true,
            message: '公司名称是必填项',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  computed: {
    routesData() {
      return this.routes;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleReset() {
      this.listQuery = {};
      this.listQuery = Object.assign({}, this.resetQuery);
      this.getList();
    },
    getList() {
      this.listLoading = true;
      fetchCompanyList(this.listQuery).then(response => {
        this.list = response.data.data.companys;
        this.total = response.data.data.total;
        this.listLoading = false;
      });
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      });
      row.status = status;
      this.updateData(row);
    },
    resetTemp() {
      this.temp = {
        name: '',
        email: '',
        telephone: '',
        website: '',
        roles: [],
        status: 0
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogType = 'new';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createCompany(this.temp).then(resp => {
            if (!resp.data) {
              this.$notify({
                title: '失败',
                message: '创建失败',
                type: 'error',
                duration: 2000
              });
            } else if (resp.data.status !== 0) {
              this.$notify({
                title: '失败',
                message: '创建失败: ' + resp.data.message,
                type: 'error',
                duration: 2000
              });
            } else {
              this.temp.created_time = new Date();
              this.temp._id = resp.data.data.company._id;
              this.list.unshift(this.temp);
              this.dialogFormVisible = false;
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
            }
          });
        }
      });
    },
    handleUpdate(row) {
      //   this.temp = Object.assign({}, row); // copy obj
      //   this.dialogType = 'edit';
      //   this.dialogFormVisible = true;
      //   this.$nextTick(() => {
      //     this.$refs['dataForm'].clearValidate();
      //   });

      this.$router.push({
        path: 'edit',
        query: {
          id: row._id
        }
      });
    },
    updateForm() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          this.updateData(tempData);
        }
      });
    },
    updateData(data) {
      updateCompany(data).then(resp => {
        if (!resp.data) {
          this.$notify({
            title: '失败',
            message: '修改失败',
            type: 'error',
            duration: 2000
          });
        } else if (resp.data.status !== 0) {
          this.$notify({
            title: '失败',
            message: '修改失败: ' + resp.data.message,
            type: 'error',
            duration: 2000
          });
        } else {
          for (const v of this.list) {
            if (v._id === this.temp._id) {
              const index = this.list.indexOf(v);
              this.list.splice(index, 1, this.temp);
              break;
            }
          }
          this.dialogFormVisible = false;
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          });
        }
      });
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      });
      const index = this.list.indexOf(row);
      this.list.splice(index, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
