<template>
  <div class="createPost-container">
    <div style="margin-top:-15px;margin-bottom:10px;">
      <!-- <router-link style="margin-right:15px;" :to="{ path:'createContract?employerId='+postForm._id}"> -->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="dialogFormVisible = true">添加收支</el-button>
      <!-- </router-link> -->
      <span style="padding-left:30px;">累计结余：4600元&nbsp;&nbsp;&nbsp;&nbsp;收入：6000元&nbsp;&nbsp;&nbsp;&nbsp;支出：1400元</span>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" border :data="list" element-loading-text="给我一点时间" stripe fit highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50" />
      <el-table-column align="center" prop="name" label="收支" min-width="100">
        <template slot-scope="scope">
          <span class="link-type" @click="gotoWorker(scope.row.worker._id)">{{ scope.row.worker.name }}</span>
          <!-- <span>{{scope.row.worker.name}}</span> -->
        </template>
      </el-table-column>
      <el-table-column align="center" label="收支方式" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="收支明细" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="120px" label="金额">
        <template slot-scope="scope">
          <span>{{ scope.row.worker.contact_phone }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" label="收支时间">
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.contract_start_date) | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" align="center" label="收支人">
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.contract_end_date) | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="备注" min-width="150">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.contract_no }}</span>
          <!-- <span>{{scope.row.worker.name}}</span> -->
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="操作" min-width="80" class-name="small-padding" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <el-dialog title="添加收支" center :visible.sync="dialogFormVisible">
      <div style="margin:0 auto;">
        <el-form :model="form" label-width="130px" label-position="right">
          <el-form-item label="收支">
            <el-radio v-model="form.iotype" label="1" border>收入</el-radio>
            <el-radio v-model="form.iotype" label="2" border>支出</el-radio>
          </el-form-item>
          <el-form-item label="收支方式">
            <el-select v-model="form.region" style="width:300px;" placeholder="请选择账号">
              <el-option label="微信" value="shanghai" />
              <el-option label="支付宝" value="beijing" />
              <el-option label="现金" value="beijing" />
              <el-option label="银行卡" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="收支明细">
            <el-select v-model="form.iodetail" style="width:300px;" placeholder="请选择收支明细">
              <el-option label="中介费" value="shanghai" />
              <el-option label="阿姨上户费" value="beijing" />
              <el-option label="保险费" value="beijing" />
              <el-option label="押金" value="beijing" />
              <el-option label="定金" value="beijing" />
              <el-option label="尾款" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="输入金额">
            <el-input v-model="form.name" style="width:300px;" />
          </el-form-item>
          <el-form-item label="收支时间">
            <el-date-picker v-model="form.value1" style="width:300px;" type="datetime" placeholder="选择日期时间" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" style="width:300px;" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import Upload from '@/components/Upload/singleImage3';
import { createEmployer, fetchEmployer, updateEmployer } from '@/api/employer';
import { getContractListByEmployer } from '@/api/contract';
import { mapGetters } from 'vuex';
import city from '@/data/city';
const img_upload_api = process.env.BASE_API + '/upload/addimg';
const img_url = process.env.IMG_URL;
export default {
  name: 'FaManage',
  components: {
    // Upload
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    employerId: {
      type: String,
      default: undefined
    }
  },
  filters: {
    statusTypeFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'danger',
        2: 'info'
      };
      return statusMap[status];
    },
    statusFilter(status) {
      const statusMap = {
        0: '生效',
        1: '过期',
        2: '无效'
      };
      return statusMap[status];
    }
  },
  data() {
    var validateIDCard = (rule, value, callback) => {
      if (value === '') {
        callback();
      } else if (value.length < 18) {
        callback(new Error('请输入正确的身份证号'));
      } else if (
        !value ||
        !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(value)
      ) {
        callback(new Error('请输入正确的身份证号'));
      } else {
        callback();
      }
    };
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      img_upload_api,
      img_url,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      dialogFormVisible: false,
      form: {},
      listQuery: {
        page: 1,
        limit: 10
      },
      postForm: {
        // 状态 0 - 未分配、1 - 已分配、2 -需更换
        status: 0,
        // 姓名
        name: '',
        // 性别
        sex: '男',
        // 籍贯
        native_place: '',
        // 年龄
        age: undefined,
        // 身份证号
        id_card: '',
        // 联系电话
        contact_phone: '',
        // 地址
        address: '',
        // 吃饭口味
        taste: '',
        // 家庭内人口
        family: undefined,
        // 面积
        area: undefined,
        // 服务类型（买菜、做饭、遛狗、接送孩子、照顾老人、手洗衣物（多选））
        service_type: [],
        // 老人类型（健康、患病、瘫痪、特殊（单选）
        old_man_type: '',
        // 婴儿或幼童数量
        childrens: undefined,
        // 宠物数量
        pets: undefined,
        // 备注（特殊需求
        remark: '',
        // 附件
        attachment: []
      },
      contractForm: null,
      fetchSuccess: true,
      loading: false,
      statusOptions: [
        {
          value: 0,
          label: '未分配'
        },
        {
          value: 1,
          label: '已分配'
        },
        {
          value: 2,
          label: '需更换'
        }
      ],
      oldManOptions: [
        {
          value: 0,
          label: '健康'
        },
        {
          value: 1,
          label: '患病'
        },
        {
          value: 2,
          label: '瘫痪'
        },
        {
          value: 3,
          label: '特殊'
        }
      ],
      rules: {
        name: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }
        ],
        age: [
          {
            type: 'number',
            message: '必须为数字值',
            trigger: 'blur'
          }
        ],
        area: [
          {
            type: 'number',
            message: '必须为数字值',
            trigger: 'blur'
          }
        ],
        family: [
          {
            type: 'number',
            message: '必须为数字值',
            trigger: 'blur'
          }
        ],
        childrens: [
          {
            type: 'number',
            message: '必须为数字值',
            trigger: 'blur'
          }
        ],
        pets: [
          {
            type: 'number',
            message: '必须为数字值',
            trigger: 'blur'
          }
        ],
        id_card: [
          {
            validator: validateIDCard,
            trigger: 'blur'
          }
        ],
        contact_phone: [
          {
            required: true,
            message: '请输入联系电话',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(['roles']),
    contentRemarkShortLength() {
      return this.postForm.remark.length;
    }
  },
  created() {
    if (this.isEdit) {
      this.fetchData();
      this.fetchContactList();
    }
  },
  methods: {
    id_card_change(value) {
      if (value.length === 18) {
        this.postForm.age = parseInt(new Date().getFullYear()) - parseInt(value.substring(6, 10));
        this.postForm.sex = parseInt(value.substring(16, 17)) % 2 === 0 ? '女' : '男';
        this.postForm.native_place = city[value.substring(0, 2)];
      }
    },
    handleRemove(file, fileList) {
      this.postForm.attachment = [];
      fileList.forEach(item => {
        this.postForm.attachment.push(item);
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handelDetailPicSuccess(res, file, fileList) {
      if (res.status === 0) {
        this.postForm.attachment.push({
          url: img_url + res.image_path
        });
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    handleUpdate(row) {
      this.$router.push({
        path: 'editContract',
        query: {
          contractId: row._id
        }
      });
    },
    gotoWorker(_id) {
      this.$router.push({
        path: '/worker/edit',
        query: {
          userId: _id
        }
      });
    },
    fetchData() {
      fetchEmployer(this.employerId)
        .then(response => {
          this.postForm = response.data.data.employer;
          this.fetchSuccess = true;
        })
        .catch(err => {
          this.fetchSuccess = false;
          console.log(err);
        });
    },
    fetchContactList() {
      this.listLoading = true;
      getContractListByEmployer(this.employerId)
        .then(response => {
          this.list = response.data.data.contracts;
          //   console.log(this.list);
          this.fetchSuccess = true;
          this.listLoading = false;
        })
        .catch(err => {
          this.fetchSuccess = false;
          this.listLoading = false;
          console.log(err);
        });
    },
    submitForm() {
      //   console.log(this.postForm);
      this.$refs['postForm'].validate(valid => {
        if (valid) {
          this.loading = true;
          createEmployer(this.postForm).then(resp => {
            console.log(resp);
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
              this.$router.push({
                path: 'manage'
              });
            }
          });
          this.loading = false;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    updateForm() {
      //   console.log(this.postForm);
      this.$refs['postForm'].validate(valid => {
        if (valid) {
          this.loading = true;
          updateEmployer(this.postForm._id, this.postForm).then(resp => {
            console.log(resp);
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
              //   this.$router.push({
              //     path: 'manage'
              //   });
            }
          });
          this.loading = false;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
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

