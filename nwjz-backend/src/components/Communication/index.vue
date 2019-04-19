<template>
  <div class="app-container">
    <el-form ref="postForm" :model="model" label-width="45px" label-position="right" :rules="rules">
      <el-form-item prop="content">
        <el-input v-model="model.content" type="textarea" :rows="3" placeholder="输入沟通记录，字数限制200字" />
      </el-form-item>
    </el-form>
    <div style="text-align:right;">
      <el-button type="primary" @click="confirmSave">
        {{ $t('common.confirm') }}
      </el-button>
    </div>
    <el-form ref="postForm2" :model="model" label-width="45px" label-position="right" :rules="rules">
      <el-timeline>
        <el-timeline-item v-for="(item, index) in List" :key="index" type="primary" :timestamp="new Date(item.created_time) | parseTime('{y}-{m}-{d}')" placement="top">
          <!-- <el-card> -->
          <div @mouseover="test(index)" @mouseleave="test('')">
            <el-row>
              <el-col :span="16">
                <el-card>
                  <el-input v-if="itemName === index&&itemEdit" v-model="item.content" type="textarea" />
                  <h4 v-else>{{ item.content }}</h4>
                  <p>
                    <span v-if="item.updated_time" style="font-size:6px;">{{ item.author }} 修改于 {{ new Date(item.updated_time) | parseTime('{y}/{m}/{d} {h}:{i}') }}</span>
                    <span v-else style="font-size:6px;">{{ item.author }} 提交于 {{ new Date(item.created_time) | parseTime('{y}/{m}/{d} {h}:{i}') }}</span>
                  </p>
                </el-card>
              </el-col>
              <el-col :span="4" style="padding-left:10px">
                <el-button v-if="itemName === index && !itemEdit" type="primary" icon="el-icon-edit" @click="itemEdit=true" />
                <el-button v-if="itemName === index && !itemEdit" type="danger" icon="el-icon-delete" @click="handleDelete(index, item)" />
                <el-button v-if="itemName === index && itemEdit" type="success" icon="el-icon-check" @click="confirmSaveItem(item)" />
                <el-button v-if="itemName === index && itemEdit" type="primary" icon="el-icon-close" @click="itemEdit=false" />
              </el-col>
            </el-row>
          </div>
          <!-- </el-card> -->
        </el-timeline-item>
      </el-timeline>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { deepClone } from '@/utils';
import {
    addComm,
    updateComm,
    deleteComm,
    fetchWorkerComms,
    fetchEmployerComms
} from '@/api/communication';

const defaultModel = {
    worker: undefined,
    employer: undefined,
    content: '',
    attachment: [],
    author: ''
};

export default {
    name: 'CommunicationRecord',
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
        type: {
            type: String,
            default: undefined
        },
        workerId: {
            type: String,
            default: undefined
        },
        employerId: {
            type: String,
            default: undefined
        }
    },
    data() {
        return {
            List: [],
            model: Object.assign({}, defaultModel),
            dialogVisible: false,
            dialogType: 'new',
            itemName: '',
            itemEdit: false,
            rules: {
                content: [
                    {
                        required: true,
                        message: '请输入沟通记录',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    computed: {
        ...mapGetters(['name']),
        routesData() {
            return this.routes;
        }
    },
    created() {
    // Mock: get all routes and roles list from server
        this.getList();
    },
    methods: {
        test(index) {
            if (!this.itemEdit) {
                this.itemName = index;
            }
        },
        async getList() {
            if (this.type === 'worker') {
                const res = await fetchWorkerComms(this.workerId);
                this.List = res.data.data.communications;
            } else if (this.type === 'employer') {
                const res = await fetchEmployerComms(this.employerId);
                this.List = res.data.data.communications;
            }
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
        handleDelete(index, item) {
            this.$confirm('确定要删除这个记录', this.$t('common.warning'), {
                confirmButtonText: this.$t('common.confirm'),
                cancelButtonText: this.$t('common.cancel'),
                type: 'warning'
            })
                .then(async() => {
                    await deleteComm(item._id);
                    this.List.splice(index, 1);
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
                    if (this.type === 'worker') {
                        this.model.worker = this.workerId;
                    } else if (this.type === 'employer') {
                        this.model.employer = this.employerId;
                    }
                    this.model.author = this.name;
                    addComm(this.model).then(resp => {
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
                            this.model = Object.assign({}, defaultModel);
                            this.List.unshift(resp.data.data.communication);
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        confirmSaveItem(item) {
            if (item.content !== '' && item.content !== undefined) {
                item.author = this.name;
                updateComm(item._id, item).then(resp => {
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
                        this.itemEdit = false;
                    }
                });
            } else {
                this.$message.error('沟通记录不能为空哦，请输入！');
                return false;
            }
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
