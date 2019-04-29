<template>
  <div class="createPost-container">
    <!-- <el-alert v-if="postForm.remark" title="温馨提示" type="warning" :description="'备注: ' + postForm.remark" show-icon /> -->
    <el-form ref="postForm" :model="postForm" :rules="rules" label-width="85px" label-position="right">
      <div class="createPost-main-container">
        <div class="tip">
          <span>
            身份信息（上传身份证自动识别或手动输入身份证号识别信息）
          </span>
        </div>
        <el-row style="padding-left:30px;">
          <el-col :span="16">
            <el-row>
              <el-form-item label="身份证号" prop="id_card" class="postInfo-container-item">
                <el-input v-model="postForm.id_card" placeholder="身份证号码" style="width:180px;" :maxlength="18" @change="id_card_change" />
                <el-button size="small" type="primary">上传身份证</el-button>
              </el-form-item>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="阿姨姓名" prop="name" class="postInfo-container-item">
                  <el-input v-model="postForm.name" placeholder="姓名" style="width:180px;" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系电话" prop="contact_phone" class="postInfo-container-item">
                  <el-input v-model="postForm.contact_phone" placeholder="联系电话" style="width:180px;" :maxlength="14" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="性别" class="postInfo-container-item">
                  <el-radio-group v-model="postForm.sex">
                    <el-radio-button label="女" border>女</el-radio-button>
                    <el-radio-button v-model="postForm.sex" label="男" border>男</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="出生日期" prop="birth" class="postInfo-container-item">
                  <el-date-picker v-model="postForm.birth" type="date" format="yyyy-MM-dd" placeholder="选择日期" style="width:180px;" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="阿姨籍贯" prop="native_place" class="postInfo-container-item">
                  <el-cascader v-model="postForm.native_place" filterable :options="provinceAndCityData" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="民族" prop="nation" class="postInfo-container-item">
                  <el-select v-model="postForm.nation" filterable style="width:180px;" placeholder="请选择">
                    <el-option v-for="(item, key) in staticOptions.nation" :key="key" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="4">
            <el-form-item label="头像" class="postInfo-container-item">
              <el-upload class="avatar-uploader" :action="img_upload_api" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <img v-if="postForm.avatar" :src="postForm.avatar" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-form-item class="postInfo-container-item">
              <el-upload class="upload-demo" drag :action="img_upload_api" multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将身份证图片拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item> -->

        <!-- <el-row style="padding-left:30px;">
            <el-col :span="16">
              <el-form-item label="身份证地址" prop="id_card_address" class="postInfo-container-item">
                <el-input v-model="postForm.id_card_address" type="textarea" class="article-textarea" :rows="1" placeholder="身份证地址" style="width:480px;" />
              </el-form-item>
            </el-col>
          </el-row> -->

        <div class="tip">
          <span>
            个人资料
          </span>
        </div>
        <el-row style="padding-left:30px;">
          <el-col :span="8">
            <el-form-item label="紧急电话" class="postInfo-container-item">
              <el-input v-model="postForm.urgent_phone" placeholder="紧急电话" style="width:180px;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="padding-left:30px;">
          <el-col :span="8">
            <el-form-item label="身高" prop="height" class="postInfo-container-item">
              <el-input v-model.number="postForm.height" placeholder="身高(厘米)" :maxlength="3" style="width:180px;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="体重" prop="weight" class="postInfo-container-item">
              <el-input v-model.number="postForm.weight" placeholder="体重(公斤)" :maxlength="3" style="width:180px;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="padding-left:30px;">
          <el-col :span="8">
            <el-form-item label="最高学历" prop="academic" class="postInfo-container-item">
              <el-select v-model="postForm.academic" filterable style="width:180px;" placeholder="请选择">
                <el-option v-for="(item, key) in staticOptions.academic" :key="key" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="婚姻状况" class="postInfo-container-item">
              <el-select v-model="postForm.marriaged" filterable style="width:180px;" placeholder="请选择">
                <el-option v-for="(item, key) in staticOptions.marriaged" :key="key" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="padding-left:30px;">
          <el-col :span="16">
            <el-form-item label="现居地址" prop="detail_address" class="postInfo-container-item">
              <el-cascader v-model="postForm.address_area" filterable :options="regionDataPlus" style="width:250px;" @change="handleChange" />
              <el-input v-model="postForm.detail_address" placeholder="详细地址，如楼层、门牌号等" style="width:250px;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="padding-left:30px;">
          <el-col :span="16">
            <el-form-item label="自我介绍">
              <el-input v-model="postForm.introduce" type="textarea" class="article-textarea" :rows="3" placeholder="一句话简单的自我介绍" style="width:500px;" />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="tip">
          <span>
            资质与技能信息
          </span>
        </div>
        <el-row style="padding-left:30px;">
          <el-col :span="16">
            <el-form-item label="语言能力" class="postInfo-container-item">
              <el-checkbox-group v-model="postForm.languages">
                <el-checkbox-button v-for="(item, key) in staticOptions.languages" :key="key" border :label="item.value">{{ item.label }}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="padding-left:30px;">
          <el-col :span="16">
            <el-form-item label="掌握菜系" class="postInfo-container-item">
              <el-checkbox-group v-model="postForm.caixi">
                <el-checkbox-button v-for="(item, key) in staticOptions.caixi" :key="key" border :label="item.value">{{ item.label }}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="padding-left:30px;">
          <el-col :span="16">
            <el-form-item label="资格证书" class="postInfo-container-item">
              <el-checkbox-group v-model="postForm.credentials">
                <el-checkbox-button v-for="(item, key) in staticOptions.credentials" :key="key" border :label="item.value">{{ item.label }}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="padding-left:30px;">
          <el-col :span="18">
            <el-form-item label="工作经历" class="postInfo-container-item">
              <el-table ref="multipleTable" :data="postForm.work_exp" stripe tooltip-effect="dark">
                <el-table-column align="center" label="从业时间" width="320">
                  <el-date-picker size="mini" v-model="scope.row.start_end" slot-scope="scope" type="monthrange" start-placeholder="开始日期" end-placeholder="结束日期" />
                </el-table-column>
                <el-table-column align="center" label="工作内容" width="200">
                  <el-input size="mini" v-model="scope.row.content" slot-scope="scope" placeholder="工作内容" />
                </el-table-column>
                <el-table-column align="center" label="操作" width="80">
                  <template slot-scope="scope">
                    <el-button type="info" size="mini" icon="el-icon-delete" @click="handleDeleteWorkExp(scope.row)" />
                  </template>
                </el-table-column>
              </el-table>
              <div style="margin-top: 10px;float:left">
                <el-button type="primary" icon="el-icon-plus" round @click="addBlankWorkExp()" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="tip">
          <span>
            求职信息
          </span>
        </div>
        <el-row style="padding-left:30px;">
          <el-col :span="8">
            <el-form-item label="在职状态" class="postInfo-container-item">
              <el-select v-model="postForm.status" filterable style="width:180px;" placeholder="请选择">
                <el-option v-for="(item, key) in staticOptions.workerStatus" :key="key" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="从业经验" class="postInfo-container-item">
              <el-select v-model="postForm.working_age" filterable style="width:180px;" placeholder="请选择">
                <el-option v-for="(item, key) in staticOptions.workingAge" :key="key" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="padding-left:30px;">
          <el-col :span="16">
            <el-form-item label="求职意向" class="postInfo-container-item">
              <el-checkbox-group v-model="postForm.work_type" class="checkbox">
                <el-checkbox-button v-for="(item, key) in staticOptions.job" :key="key" border :label="item.value">{{ item.label }}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="padding-left:30px;">
          <el-col :span="16">
            <el-form-item label="工作时间" class="postInfo-container-item">
              <el-checkbox-group v-model="postForm.work_time">
                <el-checkbox-button v-for="(item, key) in staticOptions.worktime" :key="key" border :label="item.value">{{ item.label }}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="padding-left:30px;">
          <el-col :span="16">
            <el-form-item label="薪资要求" class="postInfo-container-item">
              <el-input placeholder="薪资" style="max-width:180px;margin-right:10px;" :maxlength="5" />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="tip">
          <span>
            照片及视频
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
            <el-form-item label="视频" class="postInfo-container-item">
              <el-upload ref="attachment_uploader" :on-success="handleVideosSuccess" :file-list="videoList" :action="img_upload_api" list-type="picture-card" :on-preview="handleVideosPreview" :on-remove="handleRemoveVideo">
                <i class="el-icon-plus" />
              </el-upload>
              <el-dialog :visible.sync="dialogVideoVisible" size="tiny">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="padding:30px;">
          <el-col style="text-align:center;" :span="18">
            <el-button v-if="!isEdit" v-loading="loading" size="medium" type="success" @click="submitForm()">保存</el-button>
            <el-button v-if="isEdit" v-loading="loading" size="medium" type="success" @click="updateForm()">更新</el-button>
            <router-link style="padding-left:10px;" :to="{ path:'list'}">
              <el-button size="medium" type="info">取消</el-button>
            </router-link>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  provinceAndCityData,
  // regionData,
  // provinceAndCityDataPlus,
  regionDataPlus
  //   CodeToText
  // TextToCode
} from 'element-china-area-data';
import { createWorker, fetchWorker, updateWorker } from '@/api/worker';
import { mapGetters } from 'vuex';
import staticOptions from '@/data/options';
import city from '@/data/city';
// import nationData from '@/data/nation';
import { getShengXiao, getAstro } from '@/utils';
const img_upload_api = process.env.VUE_APP_BASE_API + '/upload/addimg';
const img_url = process.env.VUE_APP_IMG_URL;
export default {
  name: 'WorkerDetail',
  components: {},
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
      staticOptions,
      //   CodeToText,
      regionDataPlus,
      provinceAndCityData,
      selectedOptions: [],
      activeTab: 'worker',
      dialogImageUrl: '',
      dialogVisible: false,
      dialogVideoVisible: false,
      imageList: [],
      videoList: [],
      img_upload_api,
      img_url,
      city: city,
      postForm: {
        status: 0,
        // 是否受雇为员工，默认false
        is_employed: false,
        // 昵称
        // nickname: '',
        // 头像
        avatar: '',
        // 姓名
        name: '',
        // 性别
        sex: '女',
        // 籍贯
        native_place: [],
        // 民族
        nation: '',
        // 属相
        zodiac: '',
        // 星座
        astro: '',
        // 户籍地址
        address_area: [],
        detail_address: '',
        // 年龄
        age: undefined,
        // 婚姻状况
        marriaged: '已婚',
        // 生日
        birth: undefined,
        // 身份证号
        id_card: '',
        // 身份证图片
        id_card_images: [],
        id_card_address: '',
        // 学历
        academic: '初中',
        // 身高
        height: undefined,
        weight: undefined,
        // 老家电话
        town_phone: '',
        // 紧急电话
        urgent_phone: '',
        // 联系电话 本人电话
        contact_phone: '',
        // 身体状况
        healthy: '',
        // 电子邮箱
        email: '',
        // 其他证件
        other_credentials: '',
        mandarin_level: '',
        // 语言能力
        languages: [],
        // 证件
        credentials: [],
        // 工作类型
        work_type: [],
        work_time: [],
        // 其他工作类型
        zuofannengli: '',
        caixi: [],
        other_work_type: '',
        // 介绍人或担保人
        recommend_person: '',
        // 介绍人联系电话
        recommend_phone: '',
        // 家庭成员
        family: [],
        work_exp: [],
        working_age: '',
        // 工作经验
        working_experience: '',
        // 自我介绍
        introduce: '',
        // 附件
        attachment: [],
        images: [],
        videos: [],
        // 后台标记
        remark: ''
        // 角色
        // roles: ['worker']
      },
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
          label: '离职'
        },
        {
          value: 3,
          label: '黑名单'
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
        weight: [
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
        // this.postForm.native_place = city[value.substring(0, 2)];
        this.postForm.zodiac = getShengXiao(this.postForm.birth);
        this.postForm.astro = getAstro(
          parseInt(value.substring(10, 12)),
          parseInt(value.substring(12, 14))
        );
      }
    },
    // is_company() {
    //   console.log(this.roles);
    //   return this.roles.indexOf('company') !== -1;
    // },
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
    handleAvatarSuccess(res, file) {
      console.log(res);
      console.log('img_url = ', img_url);
      if (res.status === 0) {
        this.postForm.avatar = this.img_url + res.image_path;
      }
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
    addBlankWorkExp() {
      this.postForm.work_exp.push({
        start_end: [],
        content: ''
      });
    },
    handleDeleteWorkExp(row) {
      this.postForm.work_exp.splice(this.postForm.work_exp.indexOf(row), 1);
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
      fetchWorker(_id)
        .then(response => {
          this.postForm = response.data.data.worker;
          this.postForm.birth = new Date(this.postForm.birth);
          this.imageList = Object.assign([], this.postForm.images);
          this.videoList = Object.assign([], this.postForm.videos);
          this.fetchSuccess = true;
        })
        .catch(err => {
          this.fetchSuccess = false;
          console.log(err);
        });
    },
    submitForm() {
      // this.postForm.birth = parseInt(this.birth / 1000)
      this.postForm.nickname = this.postForm.name;
      console.log(this.postForm);
      this.$refs['postForm'].validate(valid => {
        if (valid) {
          this.loading = true;
          createWorker(this.postForm).then(resp => {
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
          updateWorker(this.postForm._id, this.postForm).then(resp => {
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
.el-upload__tip {
  margin-top: 0px;
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

