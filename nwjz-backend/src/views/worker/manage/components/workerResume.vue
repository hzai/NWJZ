<template>
  <div class="cv-content">
    <div class="grid-content bg-blue">
      <el-row style="padding-top:20px;margin-left:30px;">
        <el-col :span="4">
          <img v-if="postForm.avatar" :src="postForm.avatar" class="avatar">
        </el-col>
        <el-col :span="12" style="padding-top:8px;">
          <div style="font-size:20px;font-weight:500;color:white;">{{ postForm.name }}</div>
          <div style="font-size:14px;font-weight:500;margin-top:8px;color:white;">{{ postForm.age }}岁&nbsp;&nbsp; {{ postForm.working_age }}</div>
          <div style="font-size:14px;font-weight:500;margin-top:8px;color:white;">{{ postForm.native_place | codeToTextFilter }}</div>
        </el-col>
        <el-col :span="4" style="float:right;margin-right:15px;">
          <router-link style="margin-right:15px;" :to="{ path:'detail?id='+workerId}">
            <el-button>编辑</el-button>
          </router-link>
          <p>
            <span style="font-size:20px;font-weight:500;color:white;">{{postForm.status | workerStatusFilter}}</span>
          </p>
        </el-col>
      </el-row>
    </div>
    <div style="padding-left:10px;height:40px;line-height:36px;">
      <el-tag v-for="tag in postForm.credentials" :key="tag" style="margin-left:10px;">
        {{ tag }}
      </el-tag>
    </div>
    <!-- -------------------- -->
    <div class="tip">
      <span>
        个人简介
      </span>
    </div>
    <div style="padding:12px 20px;">
      <el-row class="content-info">{{ postForm.introduce }}</el-row>
    </div>
    <!-- -------------------- -->
    <div class="tip">
      <span>
        基本信息
      </span>
    </div>
    <div style="padding:12px 20px;">
      <el-row class="content-info">籍贯民族:&nbsp;&nbsp;&nbsp;&nbsp;{{ postForm.native_place | codeToTextFilter }} {{ postForm.nation }}</el-row>
      <el-row class="content-info">工作经验:&nbsp;&nbsp;&nbsp;&nbsp;{{ postForm.working_age }}</el-row>
      <el-row class="content-info">学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;历:&nbsp;&nbsp;&nbsp;&nbsp;{{ postForm.academic }}</el-row>
      <el-row class="content-info">身份证号:&nbsp;&nbsp;&nbsp;&nbsp;{{ postForm.id_card }}</el-row>
      <el-row style="border-bottom:1px dashed #CCCCCC;margin-bottom:15px;" />
      <el-row class="content-info">属&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;相:&nbsp;&nbsp;&nbsp;&nbsp;{{ postForm.zodiac }}</el-row>
      <el-row class="content-info">星&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;座:&nbsp;&nbsp;&nbsp;&nbsp;{{ postForm.astro }}</el-row>
      <el-row class="content-info">身&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;高:&nbsp;&nbsp;&nbsp;&nbsp;{{ postForm.height }}</el-row>
      <el-row class="content-info">体&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;重:&nbsp;&nbsp;&nbsp;&nbsp;</el-row>
      <el-row style="border-bottom:1px dashed #CCCCCC;margin-bottom:15px;" />
      <el-row class="content-info">专业技能:&nbsp;&nbsp;&nbsp;&nbsp;</el-row>
      <el-row style="border-bottom:1px dashed #CCCCCC;margin-bottom:15px;" />
      <el-row class="content-info">所属门店:&nbsp;&nbsp;&nbsp;&nbsp;从company里取公司名字</el-row>
      <el-row class="content-info">常住地址:&nbsp;&nbsp;&nbsp;&nbsp;{{ postForm.address_area | codeToTextFilter }}{{ postForm.detail_address }}</el-row>
    </div>
    <!-- -------------------- -->
    <div class="tip">
      <span>
        照片视频
      </span>
    </div>
    <div style="padding:12px 20px;">
      <el-row>
        <el-col v-for="item in postForm.images" :key="item.uid" :span="8">
          <a style="margin:5px;display:block;position:relative;" @click="handlePictureCardPreview(item.url)">
            <img :src="item.url" class="photo">
          </a>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-for="item in postForm.videos" :key="item.uid" :span="8">
          <a :href="item.url" style="margin:5px;display:block;position:relative;">
            <img :src="item.url" class="photo">
          </a>
        </el-col>
      </el-row>
    </div>
    <el-dialog width="50%" top="5vh" :visible.sync="dialogVisible">
      <div style="text-align:center;">
        <img style="max-height:480px;max-width:500px;" :src="dialogImageUrl" alt="">
      </div>
    </el-dialog>
    <!-- -------------------- -->
    <div class="tip">
      <span>
        工作经历
      </span>
    </div>
    <div style="padding:12px 20px;">
      <el-row v-for="item in postForm.work_exp" :key="item._id" class="content-info">
        {{ new Date(item.start_end[0]) | parseTime('{y}-{m}-{d}') }} - {{ new Date(item.start_end[1]) | parseTime('{y}-{m}-{d}') }} &nbsp;&nbsp;&nbsp;&nbsp;{{ item.content }}
      </el-row>
    </div>

  </div>
</template>

<script>
import { fetchWorker } from '@/api/worker';
import { mapGetters } from 'vuex';
export default {
  name: 'WorkerResume',
  components: {},
  props: {
    workerId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
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
        marriaged: true,
        // 生日
        birth: undefined,
        // 身份证号
        id_card: '',
        // 身份证图片
        id_card_images: [],
        id_card_address: '',
        // 学历
        academic: '',
        // 身高
        height: undefined,
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
      dialogImageUrl: '',
      dialogVisible: false
    };
  },
  computed: {
    ...mapGetters(['roles'])
  },
  created() {
    this.fetchData();
  },
  methods: {
    parentHandleclick(workerFromParent) {
      console.log(workerFromParent);
      this.fetchData();
    },
    fetchData() {
      fetchWorker(this.workerId)
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
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.cv-content {
  max-width: 640px;
  min-width: 320px;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
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
.tip {
  margin: 0px;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
  border: 3px solid #2db7f5;
  border-radius: 5px;
  object-fit: cover;
}
.photo {
  object-fit: cover;
  width: 100%;
  max-height: 160px;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  // display: block;
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
.bg-blue {
  // background: #50bfff;
  background: #0ba1e4;
  // background: #43b0ff;
  // background:#2db7f5;
}
.grid-content {
  border-radius: 4px;
  min-height: 120px;
}
.content-info {
  line-height: 25px;
  margin-bottom: 12px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>

