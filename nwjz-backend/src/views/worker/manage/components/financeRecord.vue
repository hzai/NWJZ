<template>
  <div class="app-container">
    <el-button type="primary" icon="el-icon-plus" @click="handleAdd">
      新增财务记录
    </el-button>
    <!-- <el-button type="primary" icon="el-icon-edit" @click="handleFinType">
      设置财务类型
    </el-button> -->
    <el-table :data="List" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" type="index" width="50" />
      <el-table-column align="center" label="发生时间" width="130">
        <template slot-scope="scope">
          {{ scope.row.tx_time | parseTime('{y}-{m}-{d}') }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="财务类型" width="300">
        <template slot-scope="scope">
          {{ scope.row.finance_type }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="金额" width="80">
        <template slot-scope="scope">
          <span v-if="'收入' === scope.row.tx_type" style="color:green">{{ scope.row.amount }}</span>
          <span v-if="'支出' === scope.row.tx_type" style="color:red">-{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" width="250">
        <template slot-scope="scope">
          {{ scope.row.remark | ellipsis}}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('common.operations')">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope)">
          </el-button>
          <!-- <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope)">
            {{ $t('common.delete') }}
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑财务记录':'新增财务记录'" @open="openDialog">
      <el-form ref="postForm" :model="model" label-width="80px" label-position="right" :rules="rules">
        <el-form-item label="收支类型" prop="tx_type">
          <!-- <el-select v-model="model.tx_type" placeholder="请选择" @change="handleChange">
            <el-option v-for="(item, key) in staticOptions.txType" :key="key" :label="item.label" :value="item.value" />
          </el-select> -->
          <el-radio-group v-model="model.tx_type" @change="handleChange">
            <el-radio v-for="(item, key) in staticOptions.txType" :key="key" :label="item.value" border>{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="财务类型" prop="finance_type">
          <el-select v-model="model.finance_type" placeholder="请选择">
            <el-option v-for="(item, key) in finTypeOptions" :key="key" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="合计金额" prop="amount">
          <el-input v-model.number="model.amount" />
        </el-form-item>
        <el-form-item label="发生时间" prop="tx_time">
          <el-date-picker v-model="model.tx_time" type="datetime" default-time="00:00:00" placeholder="选择时间" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="model.remark" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmSave">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog :visible.sync="dialogFinTypeVisible" title="设置财务类型" @close='closeDialog'>
      <el-button type="success" icon="el-icon-plus" @click="handleAddType">
        新增财务类型
      </el-button>
      <el-table :data="typeList" style="width: 100%;margin-top:10px;" border fit highlight-current-row>
        <el-table-column align="center" label="收支类型" width="100">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-select v-if="row.edit" v-model="row.tx_type" placeholder="请选择">
                <el-option v-for="(item, key) in staticOptions.txType" :key="key" :label="item.label" :value="item.value" />
              </el-select>
            </template>
            <span v-else>{{row.tx_type}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="财务类型" width="300">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.finance_type" class="edit-input" size="small" />
            </template>
            <span v-else>{{ row.finance_type }}</span>
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
            <el-button v-if="!scope.row.edit" type="danger" size="mini" icon="el-icon-delete" @click="handleDeleteType(scope)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:right;padding-top:20px;">
        <el-button type="primary" @click="dialogFinTypeVisible=false">
          返回
        </el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { deepClone } from '@/utils';
import {
  fetchFinanceTypes,
  addFinanceType,
  updateFinanceType,
  deleteFinanceType,
  addFinanceRecord,
  updateFinanceRecord,
  deleteFinanceRecord,
  fetchFinanceRecords,
  fetchWorkerFinanceRecords
} from '@/api/finance';
import { fetchDictsByCat } from '@/api/dictionary';
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
  name: 'WorkerFinanceRecord',
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
    workerId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      staticOptions,
      finTypeOptions: [],
      incomeOptions: [],
      expensesOptions: [],
      List: [],
      typeList: [],
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
    this.getOptions();
    this.getTypeList();
  },
  methods: {
    async getList() {
      const res = await fetchWorkerFinanceRecords(this.workerId);
      this.List = res.data.data.finances;
    },
    async getOptions() {
      let res = await fetchDictsByCat('income');
      let items = res.data.data.dictionary;
      items.forEach(item => {
        this.incomeOptions.push({
          value: item.value,
          label: item.label
        });
      });
      res = await fetchDictsByCat('expenses');
      items = res.data.data.dictionary;
      items.forEach(item => {
        this.expensesOptions.push({
          value: item.value,
          label: item.label
        });
      });
    },
    async getTypeList() {
      this.listLoading = true;
      const { data } = await fetchFinanceTypes();
      const items = data.data.types;
      this.typeList = items.map(v => {
        this.$set(v, 'edit', false); // https://vuejs.org/v2/guide/reactivity.html
        v.originalFinType = v.finance_type; //  will be used when user click the cancel botton
        v.originalTxType = v.tx_type;
        return v;
      });
      this.listLoading = false;
    },
    cancelEdit(row) {
      row.finance_type = row.originalFinType;
      row.tx_type = row.originalTxType;
      row.edit = false;
    },
    confirmEdit(row) {
      row.edit = false;
      row.originalFinType = row.finance_type;
      row.originalTxType = row.tx_type;
      console.log(row);
      if (!row._id) {
        addFinanceType(row).then(resp => {
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
        updateFinanceType(row._id, row).then(resp => {
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
    handleAddType() {
      this.typeList.push({
        tx_type: '',
        finance_type: '',
        edit: true
      });
    },
    closeDialog() {
      const temp = [];
      this.typeList.forEach((item, index) => {
        item.edit = false;
        if (item._id !== null && item._id !== undefined) {
          temp.push(item);
        }
      });
      this.typeList = temp;
    },
    handleAdd() {
      this.model = Object.assign({}, defaultModel);
      this.dialogType = 'new';
      this.dialogVisible = true;
    },
    handleFinType() {
      this.model = Object.assign({}, defaultModel);
      this.dialogFinTypeType = 'new';
      this.dialogFinTypeVisible = true;
    },
    handleDeleteType({ $index, row }) {
      this.$confirm('确定要删除这个记录', this.$t('common.warning'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      })
        .then(async () => {
          await deleteFinanceType(row._id);
          this.typeList.splice($index, 1);
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
      if ('收入' === val) {
        this.finTypeOptions = this.incomeOptions;
      } else if ('支出' === val) {
        this.finTypeOptions = this.expensesOptions;
      }
    },
    openDialog() {
      if ('收入' === this.model.tx_type) {
        this.finTypeOptions = this.incomeOptions;
      } else if ('支出' === this.model.tx_type) {
        this.finTypeOptions = this.expensesOptions;
      }
    },
    handleEdit(scope) {
      this.dialogType = 'edit';
      this.dialogVisible = true;
      this.model = deepClone(scope.row);
    },
    handleDelete({ $index, row }) {
      this.$confirm('确定要删除这个记录', this.$t('common.warning'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      })
        .then(async () => {
          await deleteFinanceRecord(row._id);
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
