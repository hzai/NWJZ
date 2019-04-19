<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" label-width="85px" label-position="right" style="padding-top:10px;">
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="85px" label="头像" class="postInfo-container-item">
              <img v-if="postForm.avatar" :src="postForm.avatar" class="avatar">
            </el-form-item>
            <el-form-item label-width="85px" label="Open ID" prop="wechat_openid" class="postInfo-container-item">
              <el-input v-model="postForm.wechat_openid" :disabled="true" placeholder="Open ID" style="min-width:150px;" />
            </el-form-item>
            <el-form-item label-width="85px" label="昵称" prop="nickname" class="postInfo-container-item">
              <el-input v-model="postForm.nickname" :disabled="true" placeholder="昵称" style="min-width:150px;" />
            </el-form-item>
            <el-form-item label-width="85px" label="联系电话" prop="contact_phone" class="postInfo-container-item">
              <el-input v-model="postForm.contact_phone" placeholder="联系电话" style="min-width:150px;" :maxlength="14" />
            </el-form-item>
            <el-form-item label-width="85px" label="状态" class="postInfo-container-item">
              <el-select v-model="postForm.status" style="width:160px;" placeholder="请选择">
                <el-option v-for="(item, key) in statusOptions" :key="key" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label-width="85px" label="注册时间:" class="postInfo-container-item">
              <el-date-picker v-model="postForm.created_time" :disabled="true" style="width:180px;" type="datetime" placeholder="选择日期" />
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;" label-width="85px" label="备注">
              <!-- <el-input v-model="postForm.remark" type="textarea" :rows="3" autosize placeholder="请输入内容" /> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-left:85px">
          <el-col :span="24">
            <el-button v-loading="loading" size="medium" type="success" @click="updateForm()">更新</el-button>
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
import { fetchMember, updateMember } from '@/api/user';
import { mapGetters } from 'vuex';

export default {
    name: 'MemberInfo',
    components: {},
    props: {},
    data() {
        return {
            postForm: {
                status: 0,
                // 昵称
                nickname: '',
                contact_phone: '',
                // 头像
                avatar: '',
                // 后台标记
                remark: ''
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
            rules: {}
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
        this.fetchData();
    },
    methods: {
        fetchData() {
            const _id = this.$route.query.userId;
            fetchMember(_id)
                .then(response => {
                    this.postForm = response.data.data.user;
                    console.log(this.postForm);
                    this.fetchSuccess = true;
                })
                .catch(err => {
                    this.fetchSuccess = false;
                    console.log(err);
                });
        },
        updateForm() {
            this.$refs['postForm'].validate(valid => {
                if (valid) {
                    this.loading = true;
                    updateMember(this.postForm).then(resp => {
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
.createPost-container {
  position: relative;
  margin: 15px;
  .createPost-main-container {
    .postInfo-container {
      position: relative;
      @include clearfix;
      .postInfo-container-item {
        float: left;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }
  .word-counter {
    width: 40px;
    font-size: 8px;
    position: absolute;
    right: -2px;
    top: 0px;
  }
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

