<template>
  <div class="app-container">
    <el-table :data="List" style="width: 100%;margin-top:10px;" border fit highlight-current-row>
      <el-table-column align="center" type="index" width="50" />
      <el-table-column align="center" label="标签" width="300">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.label" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="键值" width="300">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.value" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" width="100">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.sort" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('common.operations')">
        <template slot-scope="scope">
          <el-button v-if="scope.row.edit" type="success" size="small" icon="el-icon-check" @click="confirmEdit(scope.row)">
          </el-button>
          <el-button v-if="scope.row.edit" class="cancel-btn" size="small" icon="el-icon-close" type="warning" @click="cancelEdit(scope.row)">
          </el-button>
          <el-button v-else type="primary" size="mini" icon="el-icon-edit" @click="scope.row.edit=!scope.row.edit">
          </el-button>
          <el-button v-if="!scope.row.edit" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-button type="primary" icon="el-icon-plus" @click="handleAdd">
      新增
    </el-button>
  </div>
</template>

<script>
import { deepClone } from '@/utils';
import { fetchDictsByCat, addDict, updateDict, deleteDict } from '@/api/dictionary';
import staticOptions from '@/data/options';
const defaultModel = {
  worker: '',
  // 收入或支出
  tx_type: '',
  // 类型名称 中介费、交通费等
  finance_type: '',
  // 发生时间
  tx_time: new Date(),
  // 金额
  amount: undefined,
  // 备注
  remark: ''
};

export default {
  name: 'DictionaryTable',
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
        0: '生效',
        1: '过期'
      };
      return statusMap[status];
    }
  },
  props: {
    category: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      staticOptions,
      finTypeOptions: [],
      List: [],
      List: [],
      model: Object.assign({}, defaultModel),
      dialogVisible: false,
      dialogType: 'new',
      dialogFinTypeVisible: false,
      dialogFinTypeType: 'new',
      insuranceTypeOptions: [
        {
          value: '个人',
          label: '个人'
        },
        {
          value: '团体',
          label: '团体'
        }
      ],
      statusOptions: [
        {
          value: 0,
          label: '生效'
        },
        {
          value: 1,
          label: '过期'
        }
      ],
      rules: {
        insurance_no: [
          {
            required: true,
            message: '请输入保险单号',
            trigger: 'blur'
          }
        ],
        insurance_type: [
          {
            required: true,
            message: '请输入保险类型',
            trigger: 'blur'
          }
        ],
        start_date: [
          {
            required: true,
            message: '请输入开始时间',
            trigger: 'blur'
          }
        ],
        end_date: [
          {
            required: true,
            message: '请输入结束时间',
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
    // Mock: get all routes and roles list from server
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const { data } = await fetchDictsByCat(this.category);
      const items = data.data.dictionary;
      this.List = items.map(v => {
        this.$set(v, 'edit', false); // https://vuejs.org/v2/guide/reactivity.html
        v.originalValue = v.value; //  will be used when user click the cancel botton
        v.originalLabel = v.label;
        v.originalSort = v.sort;
        return v;
      });
      this.listLoading = false;
    },
    cancelEdit(row) {
      row.label = row.originalLabel;
      row.value = row.originalValue;
      row.sort = row.originalSort;
      row.edit = false;
    },
    confirmEdit(row) {
      row.edit = false;
      row.originalLabel = row.label;
      row.originalValue = row.value;
      row.originalSort = row.sort;
      if (!row._id) {
        addDict(row).then(resp => {
          if (!resp.data) {
            this.$notify({
              title: '失败',
              message: '更新失败',
              type: 'error',
              duration: 2000
            });
          } else if (resp.data.status !== 0) {
            this.$notify({
              title: '失败',
              message: '更新失败: ' + resp.data.message,
              type: 'error',
              duration: 2000
            });
          } else {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            });
          }
        });
      } else {
        updateDict(row._id, row).then(resp => {
          if (!resp.data) {
            this.$notify({
              title: '失败',
              message: '更新失败',
              type: 'error',
              duration: 2000
            });
          } else if (resp.data.status !== 0) {
            this.$notify({
              title: '失败',
              message: '更新失败: ' + resp.data.message,
              type: 'error',
              duration: 2000
            });
          } else {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            });
          }
        });
      }
    },
    handleAdd() {
      this.List.push({
        category: this.category,
        label: '',
        value: '',
        sort: this.List.length + 1,
        edit: true
      });
    },
    handleFinType() {
      this.model = Object.assign({}, defaultModel);
      this.dialogFinTypeType = 'new';
      this.dialogFinTypeVisible = true;
    },
    handleDelete({ $index, row }) {
      this.$confirm('确定要删除这个记录', this.$t('common.warning'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      })
        .then(async () => {
          await deleteDict(row._id);
          this.List.splice($index, 1);
          this.$message({
            type: 'success',
            message: '删除成功'
          });
        })
        .catch(err => {
          console.error(err);
        });
    },
    handleChange(val) {
      this.finTypeOptions = [];
      this.List.forEach(item => {
        if (val === item.tx_type) {
          this.finTypeOptions.push({
            value: item.finance_type,
            label: item.finance_type
          });
        }
      });
    },
    handleEdit(scope) {
      this.dialogType = 'edit';
      this.dialogVisible = true;
      this.model = deepClone(scope.row);
    },
    confirmSave() {
      this.$refs['postForm'].validate(valid => {
        if (valid) {
          const isEdit = this.dialogType === 'edit';
          this.model.worker = this.workerId;
          if (isEdit) {
            updateFinanceRecord(this.model._id, this.model).then(resp => {
              if (!resp.data) {
                this.$notify({
                  title: '失败',
                  message: '更新失败',
                  type: 'error',
                  duration: 2000
                });
              } else if (resp.data.status !== 0) {
                this.$notify({
                  title: '失败',
                  message: '更新失败: ' + resp.data.message,
                  type: 'error',
                  duration: 2000
                });
              } else {
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  duration: 2000
                });
                this.dialogVisible = false;
                for (let index = 0; index < this.List.length; index++) {
                  if (this.List[index]._id === this.model._id) {
                    this.List.splice(index, 1, Object.assign({}, this.model));
                    break;
                  }
                }
              }
            });
          } else {
            addFinanceRecord(this.model).then(resp => {
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
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
                this.dialogVisible = false;
                this.model = resp.data.data.finance;
                this.List.unshift(this.model);
              }
            });
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
