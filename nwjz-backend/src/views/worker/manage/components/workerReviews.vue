<template>
  <div class="createPost-container">
    <div style="margin-top:-15px;margin-bottom:10px;">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加老师评价</el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" border :data="list" element-loading-text="给我一点时间" stripe fit highlight-current-row style="width: 100%">
      <el-table-column type="index" align="center" width="50" />
      <el-table-column align="center" prop="name" label="评价方" min-width="100">
        <!-- <template slot-scope="scope"> -->
        <!-- <span class="link-type" @click="gotoWorker(scope.row.worker._id)">{{ scope.row.worker.name }}</span> -->
        <!-- <span>{{scope.row.worker.name}}</span> -->
        <!-- </template> -->
      </el-table-column>
      <el-table-column align="center" label="工作技能" min-width="100px">
        <template slot-scope="scope">
          <el-rate disabled v-model="scope.row.skill" :colors="colors" show-text :texts="texts" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="工作态度" min-width="100px">
        <template slot-scope="scope">
          <el-rate disabled v-model="scope.row.attitude" :colors="colors" show-text :texts="texts" />
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100px" label="责任心">
        <template slot-scope="scope">
          <el-rate disabled v-model="scope.row.responsibility" :colors="colors" show-text :texts="texts" />
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="人品">
        <template slot-scope="scope">
          <el-rate disabled v-model="scope.row.character" :colors="colors" show-text :texts="texts" />
        </template>
      </el-table-column>
      <el-table-column min-width="200px" align="center" label="评价内容">
        <template slot-scope="scope">
          <span>{{ scope.row.comment | ellipsis}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" align="center" label="评价时间">
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.created_time) | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="是否展示" min-width="80">
        <template slot-scope="scope">
          <span class="link-type" v-if="scope.row.isDisplay" @click="handleModifyStatus(scope.row,false)">是</span>
          <span class="link-type" v-if="!scope.row.isDisplay" @click="handleModifyStatus(scope.row,true)">否</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="80" class-name="small-padding" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加老师评价" center :visible.sync="dialogFormVisible">
      <div style="margin:0 auto;">
        <el-form ref="postForm" :model="postForm" label-width="100px" label-position="right" :rules="rules">
          <el-form-item label="工作技能">
            <el-rate v-model="postForm.skill" :colors="colors" show-text :texts="texts" />
          </el-form-item>
          <el-form-item label="工作态度">
            <el-rate v-model="postForm.attitude" :colors="colors" show-text :texts="texts" />
          </el-form-item>
          <el-form-item label="责任心">
            <el-rate v-model="postForm.responsibility" :colors="colors" show-text :texts="texts" />
          </el-form-item>
          <el-form-item label="人品">
            <el-rate v-model="postForm.character" :colors="colors" show-text :texts="texts" />
          </el-form-item>
          <el-form-item label="评价内容" prop="comment">
            <el-input v-model="postForm.comment" style="width:300px;" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogType==='new'" type="primary" @click="createData">确 定</el-button>
        <el-button v-else type="primary" @click="updateForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchWorkerCommentList,
  fetchWorkerComment,
  createWorkerComment,
  updateWorkerComment,
  deleteWorkerComment
} from '@/api/worker';
import { mapGetters } from 'vuex';
export default {
  name: 'WorkerReviews',
  components: {
    // Upload
  },
  props: {
    workerId: {
      type: String,
      default: ''
    }
  },
  filters: {},
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      dialogType: 'new',
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      postForm: {
        worker: '',
        // 工作技能
        skill: undefined,
        // 工作态度
        attitude: undefined,
        // 责任心
        responsibility: undefined,
        // 人品
        character: undefined,
        // 评价内容
        comment: '',
        remark: ''
      },
      fetchSuccess: true,
      loading: false,
      rules: {
        comment: [
          {
            required: true,
            message: '请输入评价内容',
            trigger: 'blur'
          }
        ]
      },
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      texts: ['非常不满', '不满意', '一般', '满意', '非常满意']
    };
  },
  computed: {
    ...mapGetters(['roles'])
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchWorkerCommentList(this.workerId)
        .then(response => {
          this.list = response.data.data.workerComments;
          console.log(this.list);
          this.fetchSuccess = true;
          this.listLoading = false;
        })
        .catch(err => {
          this.fetchSuccess = false;
          this.listLoading = false;
          console.log(err);
        });
    },
    resetTemp() {
      this.postForm = {
        worker: '',
        // 工作技能
        skill: undefined,
        // 工作态度
        attitude: undefined,
        // 责任心
        responsibility: undefined,
        // 人品
        character: undefined,
        // 评价内容
        comment: '',
        remark: ''
      };
    },
    handleCreate() {
      this.resetTemp();
      this.postForm.worker = this.workerId;
      this.dialogType = 'new';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['postForm'].clearValidate();
      });
    },
    createData() {
      this.$refs['postForm'].validate(valid => {
        if (valid) {
          createWorkerComment(this.postForm).then(resp => {
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
              this.postForm = resp.data.data.workerComment;
              this.list.unshift(this.postForm);
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
      this.postForm = Object.assign({}, row); // copy obj
      this.dialogType = 'edit';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['postForm'].clearValidate();
      });
    },
    updateForm() {
      this.$refs['postForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.postForm);
          this.updateData(tempData);
        }
      });
    },
    updateData(data) {
      updateWorkerComment(data).then(resp => {
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
            if (v._id === this.postForm._id) {
              const index = this.list.indexOf(v);
              this.list.splice(index, 1, this.postForm);
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
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      });
      row.isDisplay = status;
      this.updateData(row);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.avatar-uploader .el-upload {
  border: 1px dashed #ff4949;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  border: 1px dashed;
  font-size: 28px;
  color: #e2e0e2;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.title-prompt {
  position: absolute;
  right: 0px;
  font-size: 12px;
  top: 10px;
  color: #ff4949;
}
</style>

