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
                <el-select v-model="postForm.service_time" style="width:180px;" placeholder="请选择">
                  <el-option v-for="(item, key) in staticOptions.serviceTime" :key="key" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row style="padding-left:30px;">
            <el-col :span="10">
              <el-form-item label="年龄要求" class="postInfo-container-item">
                <el-input v-model="postForm.age_min" placeholder="最低" style="max-width:100px;margin-right:10px;" :maxlength="2" />
                <span> - </span>
                <el-input v-model="postForm.age_max" placeholder="最高" style="max-width:100px;margin-left:10px;" :maxlength="2" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="籍贯要求" class="postInfo-container-item">
                <el-select v-model="postForm.worker_native_place" filterable style="width:180px;" placeholder="请选择">
                  <!-- <el-option key="1" label="无要求" value="" /> -->
                  <el-option v-for="(item, key) in provinceAndCityDataPlus" :key="key" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row style="padding-left:30px;">
            <el-col :span="10">
              <el-form-item label="薪资范围" class="postInfo-container-item">
                <el-input v-model="postForm.salary_min" placeholder="最低薪资" style="max-width:100px;margin-right:10px;" :maxlength="5" />
                <span> - </span>
                <el-input v-model="postForm.salary_max" placeholder="最高薪资" style="max-width:100px;margin-left:10px;" :maxlength="5" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="从业经验" class="postInfo-container-item" prop="worker_exp">
                <el-select v-model="postForm.worker_exp" style="width:180px;" placeholder="请选择">
                  <el-option v-for="(item, key) in staticOptions.workingAge" :key="key" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="padding-left:30px;">
            <el-col :span="16">
              <el-form-item label="吃饭口味" prop="taste" class="postInfo-container-item">
                <el-checkbox-group v-model="postForm.taste">
                  <el-checkbox-button v-for="(item, key) in staticOptions.caixi" :key="key" :label="item.value">{{ item.label }}</el-checkbox-button>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>

          <div class="tip">
            <span>
              客户家庭情况
            </span>
          </div>
          <el-row style="padding-left:30px;">
            <el-col :span="8">
              <el-form-item label="家庭人口" prop="family" class="postInfo-container-item">
                <el-input v-model.number="postForm.family" placeholder="家庭人口" style="min-width:150px;" :maxlength="2" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="面积" prop="area" class="postInfo-container-item">
                <el-input v-model.number="postForm.area" placeholder="面积(平方米)" style="min-width:150px;" :maxlength="5" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="padding-left:30px;">
            <el-col :span="8">
              <el-form-item label="宝宝数量" class="postInfo-container-item" prop="childrens">
                <el-input v-model.number="postForm.childrens" placeholder="宝宝数量" style="min-width:150px;" :maxlength="10" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="预产期" class="postInfo-container-item" prop="childrens">
                <el-date-picker v-model="postForm.childbirth" type="date" format="yyyy-MM-dd" placeholder="选择日期" style="width:180px;" />
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
              <el-form-item label="照片" class="postInfo-container-item">
                <el-upload ref="attachment_uploader" :on-success="handleImagesSuccess" :file-list="imageList" :action="img_upload_api" list-type="picture-card" :on-preview="handleImagesPreview" :on-remove="handleRemoveImage">
                  <i class="el-icon-plus" />
                </el-upload>
                <el-dialog :visible.sync="dialogVisible" size="tiny">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </el-form-item>
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
import {
  regionDataPlus,
  provinceAndCityData,
  provinceAndCityDataPlus
} from 'element-china-area-data';
import { fetchEmployer, updateEmployer } from '@/api/employer';
// import requirementsData from '@/data/requirements';
import { mapGetters } from 'vuex';
import staticOptions from '@/data/options';
const img_upload_api = process.env.VUE_APP_BASE_API + '/upload/addimg';
const img_url = process.env.VUE_APP_IMG_URL;
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
    },
    employerId: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      staticOptions,
      regionDataPlus,
      provinceAndCityData,
      provinceAndCityDataPlus,
      dialogImageUrl: '',
      dialogVisible: false,
      dialogVideoVisible: false,
      imageList: [],
      videoList: [],
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
        /* ** 隶属于的公司 */
        company: '',
        // 来源
        source: '',
        // 姓名
        name: '',
        // 联系电话
        contact_phone: '',
        // 现居地址 省市区
        address_area: [],
        // 现居详细地址
        detail_address: '',
        // 备注（特殊需求
        remark: '',
        // 性别
        sex: '',
        // 籍贯
        native_place: [],
        // 年龄
        age: undefined,
        // 身份证号
        id_card: '',
        // 身份证号图片
        id_card_images: [],
        requirements: '',
        service_time: '',
        worker_age: '',
        worker_native_place: [],
        worker_exp: '',
        salary_range: '',
        // 吃饭口味
        taste: [],
        // 家庭内人口
        family: undefined,
        // 面积
        area: undefined,
        // 婴儿或幼童数量
        childrens: undefined,
        // 宠物数量
        pets: undefined,
        childbirth: new Date(),
        // 附件
        attachment: [],
        images: [],
        videos: [],
        // 状态 0: '待跟进' 1: '跟进中' 2: '已面试'  3: '已签约' 4: '已失效'
        status: 0
      },
      contractForm: null,
      fetchSuccess: true,
      loading: false,
      rules: {}
    };
  },
  computed: {
    ...mapGetters(['roles'])
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
    handleRemoveImage(file, fileList) {
      //   this.postForm.images = [];
      //   fileList.forEach(item => {
      //     this.postForm.images.push(item);
      //   });
      this.postForm.images.splice(this.postForm.images.indexOf(file), 1);
    },
    handleImagesPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleImagesSuccess(res, file, fileList) {
      if (res.status === 0) {
        this.postForm.images.push({
          url: img_url + res.image_path
        });
      }
    },
    handleRemoveVideo(file, fileList) {
      //   this.postForm.videos = [];
      //   fileList.forEach(item => {
      //     this.postForm.videos.push(item);
      //   });
      this.postForm.videos.splice(this.postForm.videos.indexOf(file), 1);
    },
    handleVideosPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVideoVisible = true;
    },
    handleVideosSuccess(res, file, fileList) {
      if (res.status === 0) {
        this.postForm.videos.push({
          url: img_url + res.image_path
        });
      }
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
          this.imageList = Object.assign([], this.postForm.images);
          this.videoList = Object.assign([], this.postForm.videos);
          this.fetchSuccess = true;
          //   console.log(this.postForm);
        })
        .catch(err => {
          this.fetchSuccess = false;
          console.log(err);
        });
    },

    updateForm() {
      //   console.log(this.postForm);
      this.$refs['postForm'].validate(valid => {
        if (valid) {
          this.loading = true;
          updateEmployer(this.postForm._id, this.postForm).then(resp => {
            // console.log(resp);
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

