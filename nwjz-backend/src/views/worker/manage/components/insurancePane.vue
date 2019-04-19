<template>
  <div class="app-container">
    <el-button type="success" icon="el-icon-plus" @click="handleAdd">
      新增保险购买记录
    </el-button>
    <el-table :data="List" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" type="index" width="50" />
      <el-table-column align="center" label="保险单号" width="220">
        <template slot-scope="scope">
          {{ scope.row.insurance_no }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="保险类型" width="80">
        <template slot-scope="scope">
          {{ scope.row.insurance_type }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="可以换人" width="80">
        <template slot-scope="scope">
          {{ scope.row.can_changed? '是':'否' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="开始时间/结束时间" width="180">
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.start_date) | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span><br>
          <span>{{ new Date(scope.row.end_date) | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center" :label="$t('common.status')" width="100" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusTypeFilter">
            {{ scope.row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="140px" align="center" :label="$t('common.created_time')">
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.created_time) | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('common.operations')">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope)">
            {{ $t('common.edit') }}
          </el-button>
          <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope)">
            {{ $t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑保险记录':'新增保险记录'">
      <el-form ref="postForm" :model="model" label-width="80px" label-position="right" :rules="rules">
        <el-form-item label="保险单号" prop="insurance_no">
          <el-input v-model="model.insurance_no" placeholder="保险单号" />
        </el-form-item>
        <el-form-item label="保险类型" prop="insurance_type">
          <el-select v-model="model.insurance_type" placeholder="请选择">
            <el-option v-for="(item, key) in insuranceTypeOptions" :key="key" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="可以换人" prop="can_changed">
          <el-switch v-model="model.can_changed" active-text="是" inactive-text="否" />
        </el-form-item>
        <el-form-item label="开始时间" prop="start_date">
          <el-date-picker v-model="model.start_date" type="datetime" default-time="00:00:00" placeholder="选择时间" />
        </el-form-item>
        <el-form-item label="结束时间" prop="end_date">
          <el-date-picker v-model="model.end_date" type="datetime" default-time="23:59:59" placeholder="选择时间" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="model.status" placeholder="请选择">
            <el-option v-for="(item, key) in statusOptions" :key="key" :label="item.label" :value="item.value" />
          </el-select>
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
  </div>
</template>

<script>
import { deepClone } from '@/utils';
import { addInsurance, updateInsurance, deleteInsurance } from '@/api/insurance';
import { fetchWorkerInsurances } from '@/api/insurance';
import i18n from '@/lang';

const defaultModel = {
    // 保险单号
    insurance_no: '',
    // 保险类型 single - 个人险 group - 团体险
    insurance_type: '',
    // 是否可以换人 false - 不可换 true - 可以换
    can_changed: false,
    // 关联 worker 一对多
    worker: '',
    // 保险开始日期
    start_date: undefined,
    // 保险结束日期
    end_date: undefined,
    // 备注
    remark: '',
    // 附件
    attachment: [],
    // 状态 0 - 生效 1 - 失效 2 - 过期
    status: 0
};

export default {
    name: 'WorkerInsurance',
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
            List: [],
            model: Object.assign({}, defaultModel),
            dialogVisible: false,
            dialogType: 'new',
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
            const res = await fetchWorkerInsurances(this.workerId);
            this.List = res.data.data.insurances;
        },
        i18n(routes) {
            const app = routes.map(route => {
                route.title = i18n.t(`route.${route.title}`);
                if (route.children) {
                    route.children = this.i18n(route.children);
                }
                return route;
            });
            return app;
        },
        handleAdd() {
            this.model = Object.assign({}, defaultModel);
            this.dialogType = 'new';
            this.dialogVisible = true;
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
                .then(async() => {
                    await deleteInsurance(row._id);
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
                        updateInsurance(this.model._id, this.model).then(resp => {
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
                        addInsurance(this.model).then(resp => {
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
                                this.model = resp.data.data.insurance;
                                this.List.push(this.model);
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
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
