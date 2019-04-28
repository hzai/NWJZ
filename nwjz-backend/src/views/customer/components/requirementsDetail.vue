<template>
  <div class="createPost-container">
    <!-- <back-corner class="github-corner" /> -->
    <el-form ref="postForm" :model="postForm" :rules="rules" label-width="78px" label-position="left" size="medium">
      <div class="createPost-main-container">
        <div class="postInfo-container">
          <div class="tip">
            <span>
              用工需求
            </span>
          </div>
          <el-row style="padding-left:30px;">
            <el-col :span="10">
              <el-form-item label="客户需求" prop="requirements">
                <el-select v-model="postForm.requirements" style="width:180px;" placeholder="请选择">
                  <el-option v-for="(item, key) in staticOptions.requirements" :key="key" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="服务时段" class="postInfo-container-item" prop="work_time">
                <el-select v-model="postForm.work_time" style="width:180px;" placeholder="请选择">
                  <el-option v-for="(item, key) in staticOptions.serviceTime" :key="key" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row style="padding-left:30px;">
            <el-col :span="10">
              <el-form-item label="年龄要求" class="postInfo-container-item">
                <el-input placeholder="最低" style="max-width:100px;margin-right:10px;" :maxlength="2" />
                <span> - </span>
                <el-input placeholder="最高" style="max-width:100px;margin-left:10px;" :maxlength="2" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="籍贯要求" class="postInfo-container-item">
                <el-input v-model="postForm.name" placeholder="籍贯要求" style="width:180px;" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row style="padding-left:30px;">
            <el-col :span="10">
              <el-form-item label="薪资范围" class="postInfo-container-item">
                <el-input placeholder="最低薪资" style="max-width:100px;margin-right:10px;" :maxlength="5" />
                <span> - </span>
                <el-input placeholder="最高薪资" style="max-width:100px;margin-left:10px;" :maxlength="5" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="从业经验" class="postInfo-container-item" prop="working_age">
                <el-select v-model="postForm.working_age" style="width:180px;" placeholder="请选择">
                  <el-option v-for="(item, key) in staticOptions.workingAge" :key="key" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="padding-left:30px;">
            <el-col :span="10">
              <el-form-item label="吃饭口味" prop="taste" class="postInfo-container-item">
                <el-input v-model="postForm.taste" placeholder="吃饭口味" style="min-width:150px;" />
              </el-form-item>
            </el-col>
          </el-row>

          <div class="tip">
            <span>
              客户家庭情况
            </span>
          </div>
          <el-row style="padding-left:30px;">
            <el-col :span="10">
              <el-form-item label="家庭人口" prop="family" class="postInfo-container-item">
                <el-input v-model.number="postForm.family" placeholder="家庭人口" style="min-width:150px;" :maxlength="2" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="面积" prop="area" class="postInfo-container-item">
                <el-input v-model.number="postForm.area" placeholder="面积" style="min-width:150px;" :maxlength="5" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="padding-left:30px;">
            <el-col :span="10">
              <el-form-item label="预产期" class="postInfo-container-item" prop="childrens">
                <el-input v-model.number="postForm.childrens" placeholder="幼童数量" style="min-width:150px;" :maxlength="10" />
              </el-form-item>
            </el-col>
          </el-row>

          <div class="tip">
            <span>
              照片
            </span>
          </div>

          <el-row style="padding-left:30px;">
            <el-col :span="18">
              <el-upload ref="attachment_uploader" :on-success="handelDetailPicSuccess" :file-list="postForm.attachment" :action="img_upload_api" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                <i class="el-icon-plus" />
              </el-upload>
              <el-dialog :visible.sync="dialogVisible" size="tiny">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-col>
          </el-row>

          <el-row style="padding:30px;">
            <el-col :span="18" style="text-align:center;">
              <!-- <el-button v-if="!isEdit" v-loading="loading" size="medium" type="success" @click="submitForm()">保存</el-button> -->
              <el-button v-if="isEdit" v-loading="loading" size="medium" type="success" @click="updateForm()">更新</el-button>
              <router-link style="padding-left:10px;" :to="{ path:'client'}">
                <el-button size="medium" type="info">取消</el-button>
              </router-link>
            </el-col>
          </el-row>

        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
// import Upload from '@/components/Upload/singleImage3';
// import BackCorner from '@/components/BackCorner';
import { fetchEmployer, updateEmployer } from '@/api/employer';
import requirementsData from '@/data/requirements';
import { mapGetters } from 'vuex';
import staticOptions from '@/data/options';
// import city from '@/data/city';
const img_upload_api = process.env.BASE_API + '/upload/addimg';
const img_url = process.env.IMG_URL;
export default {
  name: 'RequirementsDetail',
  components: {
    // Upload,
    // BackCorner
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
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      staticOptions,
      dialogImageUrl: '',
      dialogVisible: false,
      requirementsData,
      img_upload_api,
      img_url,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
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
        requirements: '',
        work_time: '',
        working_age: '',
        salary_range: '',
        // 备注（特殊需求
        remark: '',
        // 附件
        attachment: []
      },
      contractForm: null,
      fetchSuccess: true,
      loading: false,
      rules: {},
      statusOptions: [
        {
          value: 0,
          label: '待跟进'
        },
        {
          value: 1,
          label: '跟进中'
        },
        {
          value: 2,
          label: '已面试'
        },
        {
          value: 3,
          label: '已签约'
        },
        {
          value: 4,
          label: '已失效'
        },
        {
          value: 5,
          label: '黑名单'
        }
      ],
      workEspOptions: [
        {
          value: '1年',
          label: '1年'
        },
        {
          value: '2年',
          label: '2年'
        },
        {
          value: '3年',
          label: '3年'
        },
        {
          value: '4年',
          label: '4年'
        },
        {
          value: '5年',
          label: '5年'
        },
        {
          value: '6年',
          label: '6年'
        },
        {
          value: '7年',
          label: '7年'
        },
        {
          value: '8年',
          label: '8年'
        },
        {
          value: '9年',
          label: '9年'
        },
        {
          value: '10年以上',
          label: '10年以上'
        }
      ],

      sourceOption: [
        {
          value: '0',
          label: '线上'
        },
        {
          value: '1',
          label: '线下'
        },
        {
          value: '2',
          label: '客户转介绍'
        }
      ],
      oldManOptions: [
        {
          value: '0',
          label: '健康'
        },
        {
          value: '1',
          label: '患病'
        },
        {
          value: '2',
          label: '瘫痪'
        },
        {
          value: '3',
          label: '特殊'
        }
      ]
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
    }
  },
  methods: {
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
      const _id = this.$route.query.employerId;
      fetchEmployer(_id)
        .then(response => {
          this.postForm = response.data.data.employer;
          this.fetchSuccess = true;
        })
        .catch(err => {
          this.fetchSuccess = false;
          console.log(err);
        });
    },

    updateForm() {
      console.log(this.postForm);
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
.github-corner {
  position: absolute;
  top: 0px;
  border: 0;
  right: 0;
}
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

