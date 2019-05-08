<template>
  <div class="createPost-container">
    <el-form ref="postForm" style="padding:15px;" :model="model" label-width="85px" label-position="right" :rules="rules">
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="18">
            <el-form-item prop="status" label="在职状态" class="postInfo-container-item">
              <el-select v-model="model.status" style="width:120px;" placeholder="请选择">
                <el-option v-for="(item, key) in staticOptions.workerStatus" :key="key" :label="item.label" :value="item.value" />
              </el-select>
              <!-- <el-radio-group v-model="model.status" size="mini">
                <el-radio v-for="(item, key) in staticOptions.workerStatus" :key="key" border :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="content" label="沟通内容" class="postInfo-container-item">
              <el-input v-model="model.content" :row="3" type="textarea" style="width:350px;" placeholder="输入沟通记录，字数限制200字" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="confirmSave">
              {{ $t('common.confirm') }}
            </el-button>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <!-- <div class="tip">
      <span>
        沟通记录
      </span>
    </div> -->
    <!-- <el-form ref="postForm2" :model="model" label-position="top" :rules="rules"> -->
    <el-timeline>
      <el-timeline-item v-for="(item, index) in List" :key="index" type="primary" :timestamp="timelinetitle(item.author,item.created_time)" placement="top">
        <!-- <el-card> -->
        <div>
          <el-row>
            <el-col :span="13">
              <el-card>
                <span style="font-size:14px;font-weight:400;">{{ item.content }}</span>
                <el-tag style="float:right;" :type="item.status | workerStatusColorFilter">{{ item.status | workerStatusFilter }}</el-tag>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-timeline-item>
    </el-timeline>
    <!-- </el-form> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { deepClone, parseTime } from '@/utils';
import staticOptions from '@/data/options';
import { addComm, updateComm, deleteComm, fetchWorkerComms } from '@/api/communication';
import { updateWorker } from '@/api/worker';

const defaultModel = {
  worker: undefined,
  employer: undefined,
  content: '',
  attachment: [],
  author: '',
  status: 0
};

export default {
  name: 'CommunicationRecord',
  filters: {},
  props: {
    workerId: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      staticOptions,
      worker: undefined,
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
    ...mapGetters(['name'])
  },
  created() {
    this.getList();
  },
  methods: {
    parentHandleclick(workerFromParent) {
      //   console.log(workerFromParent);
      this.worker = workerFromParent;
      this.model.status = workerFromParent.status;
    },
    timelinetitle(author, createtime) {
      return author + '  ' + parseTime(createtime, '{y}-{m}-{d} {h}:{i}');
    },
    async getList() {
      // if (this.type === 'worker') {
      const res = await fetchWorkerComms(this.workerId);
      this.List = res.data.data.communications;
      //   console.log(this.List);
      //   this.model.status = res.data.data.communications[0].status;
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
        .then(async () => {
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
              this.List.unshift(resp.data.data.communication);
              this.model.content = '';
              this.worker.status = this.model.status;
              updateWorker(this.worker._id, this.worker);
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
