<template>
  <div class="createPost-container">
    <el-tabs v-model="activeTab" style="margin-top:15px;">
      <el-tab-pane label="基本信息" name="company">
        <el-form ref="postForm" :model="postForm" :rules="rules" label-width="85px" label-position="right" style="padding-top:10px;">
          <div class="createPost-main-container">
            <el-row>
              <el-col :span="12">
                <el-form-item label="公司名称" prop="name">
                  <el-input v-model="postForm.name" placeholder="公司名称" />
                </el-form-item>
                <el-form-item label="联系电话" prop="telephone">
                  <el-input v-model="postForm.telephone" />
                </el-form-item>
                <el-form-item label="公司邮箱" prop="email">
                  <el-input v-model="postForm.email" />
                </el-form-item>
                <el-form-item label="公司网站" prop="website">
                  <el-input v-model="postForm.website" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                  <el-select v-model="postForm.status" class="filter-item" placeholder="请选择">
                    <el-option v-for="(item, key) in statusOptions" :key="key" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="营业执照" prop="business_license_image">
                  <el-upload class="avatar-uploader" :action="img_upload_api" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="postForm.business_license_image" :src="postForm.business_license_image" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-left:85px">
              <el-col>
                <el-button v-if="!isEdit" v-loading="loading" size="medium" type="success" @click="submitForm()">保存</el-button>
                <el-button v-if="isEdit" v-loading="loading" size="medium" type="success" @click="updateForm()">更新</el-button>
                <router-link style="padding-left:10px;" :to="{ path:'list'}">
                  <el-button size="medium" type="info">取消</el-button>
                </router-link>
              </el-col>
            </el-row>
          </div>

        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="isEdit" label="账号列表" name="account">
        <user-pane :company-id="this.$route.query.id" />
      </el-tab-pane>
      <!-- <el-tab-pane label="沟通记录" name="communication">
        <communication-pane type="worker" :worker-id="this.$route.query.id" />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import {
  fetchCompanyList,
  fetchCompany,
  createCompany,
  updateCompany,
  deleteCompany
} from '@/api/company';
import { mapGetters } from 'vuex';
import city from '@/data/city';
import nationData from '@/data/nation';
import { getShengXiao } from '@/utils';
import CommunicationPane from '@/components/Communication';
import UserPane from './userPane';

const img_upload_api = process.env.VUE_APP_BASE_API + '/upload/addimg';
const img_url = process.env.VUE_APP_IMG_URL;
const nationOptions = Object.assign([], nationData);
export default {
  name: 'CompanyDetail',
  components: {
    CommunicationPane,
    UserPane
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var validateIDCard = (rule, value, callback) => {
      if (value === '') {
        callback();
      } else if (value.length < 18) {
        callback(new Error('请输入正确的身份证号'));
      } else if (!value || !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/i.test(value)) {
        callback(new Error('请输入正确的身份证号'));
      } else {
        callback();
      }
    };
    return {
      activeTab: 'company',
      dialogImageUrl: '',
      dialogVisible: false,
      img_upload_api,
      img_url,
      city: city,
      postForm: {
        name: '',
        email: '',
        telephone: '',
        website: '',
        roles: [],
        business_license_image: '',
        status: 0
      },
      fetchSuccess: true,
      loading: false,
      statusOptions: [
        {
          value: 0,
          label: '正常'
        },
        {
          value: 1,
          label: '禁用'
        }
      ],
      nationOptions,
      academicOptions: [
        {
          value: '小学',
          label: '小学'
        },
        {
          value: '初中',
          label: '初中'
        },
        {
          value: '高中',
          label: '高中'
        },
        {
          value: '中专',
          label: '中专'
        },
        {
          value: '大专',
          label: '大专'
        },
        {
          value: '大学',
          label: '大学'
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
            required: true,
            message: '请输入年龄',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '必须为数字值',
            trigger: 'blur'
          }
        ],
        birth: [
          {
            required: true,
            message: '请选择日期',
            trigger: 'blur'
          }
        ],
        id_card: [
          {
            validator: validateIDCard,
            trigger: 'blur'
          },
          {
            required: false,
            message: '请输入身份证号',
            trigger: 'blur'
          }
        ],
        height: [
          {
            type: 'number',
            message: '必须为数字值',
            trigger: 'blur'
          }
        ],
        contact_phone: [
          {
            required: true,
            message: '请输入联系电话',
            trigger: 'blur'
          }
        ],
        native_place: [
          {
            required: true,
            message: '请输入籍贯',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(['roles']),
    contentExperienceShortLength() {
      return this.postForm.working_experience.length;
    },
    contentIntroduceShortLength() {
      return this.postForm.introduce.length;
    }
  },
  created() {
    if (this.isEdit) {
      this.fetchData();
    }
  },
  methods: {
    id_card_change(value) {
      if (value.length === 18) {
        const birthStr =
          value.substring(6, 10) + '-' + value.substring(10, 12) + '-' + value.substring(12, 14);
        this.postForm.birth = new Date(birthStr);
        this.postForm.age = parseInt(new Date().getFullYear()) - parseInt(value.substring(6, 10));
        this.postForm.sex = parseInt(value.substring(16, 17)) % 2 === 0 ? '女' : '男';
        this.postForm.native_place = city[value.substring(0, 2)];
        this.postForm.zodiac = getShengXiao(this.postForm.birth);
      }
    },
    is_company() {
      console.log(this.roles);
      return this.roles.indexOf('company') !== -1;
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
    handleAvatarSuccess(res, file) {
      console.log(res);
      console.log(img_url);
      if (res.status === 0) {
        this.postForm.business_license_image = img_url + res.image_path;
      }
      console.log(this.postForm);
      // this.postForm.avatar = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return (isJPG || isPNG) && isLt2M;
    },
    addBlankFamily() {
      this.postForm.family.push({
        name: '',
        sex: '',
        relationship: '',
        age: '',
        company: '',
        tel: ''
      });
    },
    handleDeleteFamily(row) {
      this.postForm.family.splice(this.postForm.family.indexOf(row), 1);
    },
    fetchData() {
      const _id = this.$route.query.id;
      console.log('_id = ', _id);
      fetchCompany(_id)
        .then(response => {
          this.postForm = response.data.data.company;
          console.log(this.postForm);
          this.fetchSuccess = true;
        })
        .catch(err => {
          this.fetchSuccess = false;
          console.log(err);
        });
    },
    submitForm() {
      this.$refs['postForm'].validate(valid => {
        if (valid) {
          this.loading = true;
          createCompany(this.postForm).then(resp => {
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
                path: 'list'
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
      this.postForm.nickname = this.postForm.name;
      console.log(this.postForm);
      this.$refs['postForm'].validate(valid => {
        if (valid) {
          this.loading = true;
          updateCompany(this.postForm).then(resp => {
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
              this.$router.push({
                path: 'list'
              });
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
  width: 200px;
  height: 200px;
  line-height: 200px;
  text-align: center;
}
.avatar {
  width: 200px;
  height: 200px;
  display: block;
}
.title-prompt {
  position: absolute;
  right: 0px;
  font-size: 12px;
  top: 10px;
  color: #ff4949;
}
.el-row {
  margin-bottom: 0px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>

