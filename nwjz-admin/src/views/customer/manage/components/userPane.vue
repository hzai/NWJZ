<template>
  <div class="app-container">
    <el-button v-if="list!==null && list.length<1" type="primary" icon="el-icon-plus" @click="handleCreate(true)">
      新增管理员账号
    </el-button>
    <el-button v-if="list!==null && list.length>0" type="primary" icon="el-icon-plus" @click="handleCreate(false)">
      新增子账号
    </el-button>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" :default-sort="{prop: 'status', order: 'descending'}" element-loading-text="给我一点时间" stripe fit highlight-current-row style="width: 100%;margin-top:30px;">
      <el-table-column align="center" type="index" width="50" />
      <el-table-column align="center" :label="$t('user.identifier')" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.identifier }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center" :label="$t('common.status')" width="100" sortable prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusTypeFilter">
            {{ scope.row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('user.role')" width="200">
        <template slot-scope="scope">
          <el-tag v-for="role in scope.row.roles" :key="role">
            {{ role2name(role)}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100px" :label="$t('user.name')" sortable prop="name">
        <template slot-scope="scope">
          <span v-if="scope.row.identifier!='admin'" class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.name }}</span>
          <span v-if="scope.row.identifier=='admin'">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="130px" :label="$t('user.contact_phone')">
        <template slot-scope="scope">
          <span>{{ scope.row.contact_phone }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="140px" align="center" :label="$t('common.created_time')">
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.created_time) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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

    <el-dialog :title="dialogType==='edit'?$t('user.editUser'):$t('user.addUser')" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px">
        <el-form-item v-if="dialogType =='new'" label="账号" prop="identifier">
          <el-col :span="10">
            <el-input v-model="temp.identifier" placeholder="账号" />
          </el-col>
          <el-col :span="4" style="text-align:center;">密码</el-col>
          <el-col :span="10">
            <el-input v-model="temp.password" placeholder="密码" />
          </el-col>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" placeholder="姓名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="联系电话" prop="contact_phone">
          <el-input v-model="temp.contact_phone" />
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-checkbox-group v-model="temp.roles">
            <el-checkbox v-for="(item, key) in roleOptions" :key="key" :label="item.value" disabled>{{ item.label }}</el-checkbox>
          </el-checkbox-group>
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
import path from 'path';
import { getRoles } from '@/api/role';
import { fetchCompanyUserList, createCompanyUser, updateCompanyUser } from '@/api/user';

export default {
  name: 'CustomerUser',
  props: {
    companyId: {
      type: String,
      default: undefined
    }
  },
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
        companyId: this.companyId
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
        identifier: '',
        password: '',
        name: '',
        sex: 0,
        email: '',
        contact_phone: '',
        birth: new Date(),
        roles: [],
        status: 0
      },
      rules: {
        identifier: [
          {
            required: true,
            message: '账号是必填项',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '密码是必填项',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '姓名是必填项',
            trigger: 'blur'
          }
        ],
        contact_phone: [
          {
            required: true,
            message: '联系电话是必填项',
            trigger: 'blur'
          }
        ],
        birth: [
          {
            type: 'date',
            required: true,
            message: '日期格式不正确',
            trigger: 'change'
          }
        ],
        roles: [
          {
            required: true,
            message: '角色是必填项',
            trigger: 'change'
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
    this.getRoles();
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchCompanyUserList(this.listQuery).then(response => {
        this.list = response.data.data.users;
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
        company: this.companyId,
        identifier: '',
        name: '',
        sex: 0,
        email: '',
        contact_phone: '',
        birth: new Date(),
        roles: [],
        status: 0
      };
    },
    handleCreate(isAdmin) {
      this.resetTemp();
      if (isAdmin) {
        this.temp.roles.push('company_admin');
        this.temp.roles.push('company');
      } else {
        this.temp.roles.push('company');
      }
      this.dialogType = 'new';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
      console.log(this.temp);
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createCompanyUser(this.temp).then(resp => {
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
              this.temp.nickname = this.temp.name;
              this.temp.created_time = new Date();
              this.temp._id = resp.data.data.user._id;
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
      this.temp = Object.assign({}, row); // copy obj
      this.temp.birth = new Date(this.temp.birth);
      this.dialogType = 'edit';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
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
      updateCompanyUser(data).then(resp => {
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
    },
    // handleDownload() {
    //   require.ensure([], () => {
    //     const { export_json_to_excel } = require('vendor/Export2Excel');
    //     const tHeader = ['时间', '地区', '类型', '标题', '重要性'];
    //     const filterVal = ['timestamp', 'province', 'type', 'title', 'importance'];
    //     const data = this.formatJson(filterVal, this.list);
    //     export_json_to_excel(tHeader, data, 'table数据');
    //   });
    // },
    // formatJson(filterVal, jsonData) {
    //   return jsonData.map(v =>
    //     filterVal.map(j => {
    //       if (j === 'timestamp') {
    //         return parseTime(v[j]);
    //       } else {
    //         return v[j];
    //       }
    //     })
    //   );
    // },
    async getRoles() {
      const res = await getRoles();
      this.rolesList = res.data.data.roles;
      this.rolesList.forEach(item => {
        this.roleOptions.push({
          value: item.key,
          label: item.name
        });
        this.rolesMap[item.key] = item.name;
      });
    },
    role2name(role) {
      return this.rolesMap[role];
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
