<template>
  <div>
    <div class="grid-content bg-blue">
      <el-row style="padding-top:30px;margin-left:30px">
        <el-col :span="2">
          <img v-if="postForm.avatar" :src="postForm.avatar" class="avatar">
        </el-col>
        <el-col :span="6">
          <p><span>{{postForm.name}}</span></p>
          <p><span>{{postForm.age}}岁 {{postForm.working_age}}</span></p>
          <p><span>{{postForm.native_place | codeToTextFilter}}</span></p>
        </el-col>
        <el-col>
          <router-link style="margin-right:15px;" :to="{ path:'detail?id='+workerId}">
            <el-button type="primary">编辑</el-button>
          </router-link>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-tag :key="tag" v-for="tag in postForm.credentials">
        {{tag}}
      </el-tag>
    </div>
    <!-- -------------------- -->
    <div class="tip">
      <span>
        个人简介
      </span>
    </div>
    <div>
      <p><span>{{postForm.introduce}}</span></p>
    </div>
    <!-- -------------------- -->
    <div class="tip">
      <span>
        基本信息
      </span>
    </div>
    <el-row>
      <el-col :span='3'>
        <p><span>籍贯民族:</span></p>
        <p><span>工作经验:</span></p>
        <p><span>学　　历:</span></p>
        <p><span>身份证号:</span></p>
      </el-col>
      <el-col :span='8'>
        <p><span>{{postForm.native_place | codeToTextFilter}} {{postForm.nation}}</span></p>
        <p><span>{{postForm.working_age}}</span></p>
        <p><span>{{postForm.academic}}</span></p>
        <p><span>{{postForm.id_card}}</span></p>
      </el-col>
    </el-row>
    <hr>
    <el-row>
      <el-col :span='3'>
        <p><span>属　　相:</span></p>
        <p><span>星　　座:</span></p>
        <p><span>身　　高:</span></p>
        <p><span>体　　重:</span></p>
      </el-col>
      <el-col :span='8'>
        <p><span>{{postForm.zodiac}}</span></p>
        <p><span>{{postForm.astro}}</span></p>
        <p><span>{{postForm.height}}</span></p>
        <p><span></span></p>
      </el-col>
    </el-row>
    <hr>
    <el-row>
      <el-col :span='3'>
        <p><span>专业技能:</span></p>
      </el-col>
      <el-col :span='8'>
        <p><span></span></p>
      </el-col>
    </el-row>
    <hr>
    <el-row>
      <el-col :span='3'>
        <p><span>所属门店:</span></p>
        <p><span>常住地址:</span></p>
      </el-col>
      <el-col :span='8'>
        <p><span>从company里取公司名字</span></p>
        <p><span>{{postForm.address_area | codeToTextFilter}}{{postForm.detail_address}}</span></p>
      </el-col>
    </el-row>
    <hr>
    <!-- -------------------- -->
    <div class="tip">
      <span>
        照片视频
      </span>
    </div>
    <el-row>
      <el-col :span="6" v-for="item in postForm.images" :key="item.uid">
        <img :src="item.url" class="photo" />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6" v-for="item in postForm.videos" :key="item.uid">
        <img :src="item.url" class="photo" />
      </el-col>
    </el-row>
    <!-- -------------------- -->
    <div class="tip">
      <span>
        工作经历
      </span>
    </div>
    <p v-for="item in postForm.work_exp" :key="item._id">
      <span>{{new Date(item.start_end[0]) | parseTime('{y}-{m}-{d}')}} - {{new Date(item.start_end[1]) | parseTime('{y}-{m}-{d}')}} {{item.content}}</span>
    </p>
  </div>
</template>

<script>
import { fetchWorker } from '@/api/worker';
import { mapGetters } from 'vuex';
export default {
  name: 'worker-resume',
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
      loading: false
    };
  },
  computed: {
    ...mapGetters(['roles'])
  },
  created() {
    this.fetchData();
  },
  methods: {
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
  width: 80px;
  height: 80px;
  display: block;
}
.photo {
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
.bg-blue {
  background: #50bfff;
}
.grid-content {
  border-radius: 4px;
  min-height: 150px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>

