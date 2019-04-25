<template>
  <div class="app-container">
    <el-form ref="postForm" style="padding:15px;" :model="model" label-width="45px" label-position="top" :rules="rules">
      <el-row type="flex">
        <el-col :span="4">
          <el-form-item prop="status">
            <el-select v-model="model.status" style="width:120px;" placeholder="请选择">
              <el-option v-for="(item, key) in statusOptions" :key="key" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="content">
            <el-input v-model="model.content" type="textarea" style="width:400px;" :autosize="{ minRows: 1, maxRows: 3}" placeholder="输入跟进记录，字数限制200字" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="confirmSave">
            {{ $t('common.confirm') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-form ref="postForm2" :model="model" label-position="top" :rules="rules">
      <el-timeline>
        <el-timeline-item v-for="(item, index) in List" :key="index" type="primary" :timestamp="timelinetitle(item.author,item.created_time)" placement="top">
          <!-- <el-card> -->
          <div @mouseover="test(index)" @mouseleave="test('')">
            <el-row>
              <el-col :span="13">
                <el-card>
                  <span style="font-size:18px;font-weight:400;">{{ item.content }}</span>
                  <el-tag style="float:right;" :type="tagtype(item.status)">{{ item.status }}</el-tag>

                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-timeline-item>
      </el-timeline>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { deepClone, parseTime } from '@/utils';
import {
    addComm,
    updateComm,
    deleteComm,
    fetchWorkerComms
} from '@/api/communication';

const defaultModel = {
    worker: undefined,
    employer: undefined,
    content: '',
    attachment: [],
    author: '',
    status: '待岗'
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
        workerId: {
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
            statusOptions: [
                {
                    value: '待岗',
                    label: '待岗'
                },
                {
                    value: '上户',
                    label: '上户'
                },
                {
                    value: '培训中',
                    label: '培训中'
                },
                {
                    value: '休假',
                    label: '休假'
                },
                {
                    value: '离职',
                    label: '离职'
                },
                {
                    value: '转行',
                    label: '转行'
                },
                {
                    value: '黑名单',
                    label: '黑名单'
                }
            ],
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
        timelinetitle(author, createtime) {
            return author + '  ' + parseTime(createtime, '{y}-{m}-{d} {h}:{i}');
        },
        tagtype(status) {
            switch (status) {
                case '待岗':
                    return '';
                case '上户':
                    return 'success';
                case '培训中':
                    return 'warning';
                case '休假':
                    return 'warning';
                case '离职':
                    return 'info';
                case '转行':
                    return 'info';
                case '黑名单':
                    return 'danger';
            }
        },
        test(index) {
            if (!this.itemEdit) {
                this.itemName = index;
            }
        },
        async getList() {
            // if (this.type === 'worker') {
            const res = await fetchWorkerComms(this.workerId);
            this.List = res.data.data.communications;
            console.log(this.List);
            this.model.status = res.data.data.communications[0].status;
            // } else if (this.type === 'employer') {
            //     const res = await fetchEmployerComms(this.employerId);
            //     this.List = res.data.data.communications;
            // }
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
                    this.model.worker = this.workerId;
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
