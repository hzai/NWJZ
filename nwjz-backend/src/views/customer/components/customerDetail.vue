<template>
  <div class="createPost-container">
    <!-- <back-corner class="github-corner" /> -->
    <el-form ref="postForm" :model="postForm" :rules="rules">
      <div class="createPost-main-container">
        <!-- <el-row>
          <el-col :span="21"> -->
        <div class="postInfo-container">
          <div class="tip">
            <span>
              基础信息
            </span>
          </div>
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="85px" label="姓名" prop="name" class="postInfo-container-item">
                <el-input v-model="postForm.name" placeholder="姓名" style="min-width:150px;" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="85px" label="联系电话" prop="contact_phone" class="postInfo-container-item">
                <el-input v-model="postForm.contact_phone" placeholder="联系电话" style="min-width:150px;" :maxlength="14" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="85px" label="性别" class="postInfo-container-item">
                <el-radio v-model="postForm.sex" label="男">男</el-radio>
                <el-radio v-model="postForm.sex" label="女">女</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="85px" label="身份证号" prop="id_card" class="postInfo-container-item">
                <el-input v-model="postForm.id_card" placeholder="身份证号码" style="min-width:150px;" :maxlength="18" @change="id_card_change" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="85px" label="年龄" prop="age" class="postInfo-container-item">
                <el-input v-model.number="postForm.age" placeholder="年龄" style="min-width:150px;" :maxlength="2" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="85px" label="所在省份" prop="native_place" class="postInfo-container-item">
                <el-input v-model="postForm.native_place" placeholder="所在省份" style="min-width:150px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="85px" label="状态" class="postInfo-container-item">
                <el-select v-model="postForm.status" style="width:160px;" placeholder="请选择">
                  <el-option v-for="(item, key) in statusOptions" :key="key" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="85px" label="地址" prop="address" class="postInfo-container-item">
                <el-input v-model="postForm.address" placeholder="地址" style="min-width:550px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="tip">
            <span>
              家庭情况
            </span>
          </div>
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="85px" label="吃饭口味" prop="taste" class="postInfo-container-item">
                <el-input v-model="postForm.taste" placeholder="吃饭口味" style="min-width:150px;" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="85px" label="家庭人口" prop="family" class="postInfo-container-item">
                <el-input v-model.number="postForm.family" placeholder="家庭人口" style="min-width:150px;" :maxlength="2" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="85px" label="面积" prop="area" class="postInfo-container-item">
                <el-input v-model.number="postForm.area" placeholder="面积" style="min-width:150px;" :maxlength="5" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="85px" label="老人状态" class="postInfo-container-item">
                <el-select v-model="postForm.old_man_type" style="width:180px;" placeholder="请选择">
                  <el-option v-for="(item, key) in oldManOptions" :key="key" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="85px" label="幼童数量" class="postInfo-container-item" prop="childrens">
                <el-input v-model.number="postForm.childrens" placeholder="幼童数量" style="min-width:150px;" :maxlength="10" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="85px" label="宠物数量" class="postInfo-container-item" prop="pets">
                <el-input v-model.number="postForm.pets" placeholder="宠物数量" style="min-width:150px;" :maxlength="10" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="21">
              <el-form-item label-width="85px" label="服务类型" class="postInfo-container-item">
                <el-checkbox-group v-model="postForm.service_type">
                  <el-checkbox label="买菜" />
                  <el-checkbox label="做饭" />
                  <el-checkbox label="遛狗" />
                  <el-checkbox label="接送孩子" />
                  <el-checkbox label="照顾老人" />
                  <el-checkbox label="手洗衣物" />
                  <el-checkbox label="宝宝陪睡服务" />
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="tip">
            <span>
              核心需求
            </span>
          </div>
          <el-row>
            <el-col :span="13">
              <el-form-item label-width="85px" label="需求" prop="requirements">
                <el-checkbox-group v-model="postForm.requirements" size="small">
                  <el-checkbox label="ZJBM" border>保姆</el-checkbox>
                  <el-checkbox label="ZYYS" border>月嫂</el-checkbox>
                  <el-checkbox label="YYS" border>育婴师</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label-width="85px" label="工资范围">
                <el-radio-group v-model="postForm.salary_range">
                  <el-radio label="4000以下" />
                  <el-radio label="4000-6000" />
                  <el-radio label="6000-8000" />
                  <el-radio label="8000-10000" />
                  <el-radio label="10000以下" />
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="tip">
            <span>
              其他信息
            </span>
          </div>
          <el-row>
            <el-col :span="13">
              <el-form-item label-width="85px" label="备注">
                <el-input v-model="postForm.remark" type="textarea" :rows="3" placeholder="请输入备注内容" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2.5">
              <el-form-item label-width="85px" label="附件图片" class="postInfo-container-item" />
            </el-col>
            <el-col :span="25">
              <el-upload ref="attachment_images_uploader" :on-success="handelDetailPicSuccess" :file-list="postForm.attachment" :action="img_upload_api" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                <i class="el-icon-plus" />
              </el-upload>
              <el-dialog :visible.sync="dialogVisible" size="tiny">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="margin-top:20px;margin-left:85px">
            <el-col>
              <el-button v-if="!isEdit" v-loading="loading" size="medium" type="success" @click="submitForm()">保存</el-button>
              <el-button v-if="isEdit" v-loading="loading" size="medium" type="success" @click="updateForm()">更新</el-button>
              <router-link style="padding-left:10px;" :to="{ path:'client'}">
                <el-button size="medium" type="info">取消</el-button>
              </router-link>
            </el-col>
          </el-row>

        </div>
        <!-- </el-col>
        </el-row> -->
      </div>
    </el-form>
  </div>
</template>

<script>
// import Upload from '@/components/Upload/singleImage3';
// import BackCorner from '@/components/BackCorner';
import { createEmployer, fetchEmployer, updateEmployer } from '@/api/employer';
import requirementsData from '@/data/requirements';
import { mapGetters } from 'vuex';
import city from '@/data/city';
const img_upload_api = process.env.BASE_API + '/upload/addimg';
const img_url = process.env.IMG_URL;
export default {
    name: 'CustomerDetail',
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
                requirements: [],
                salary_range: '',
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
                    label: '新建'
                },
                {
                    value: 1,
                    label: '跟进中'
                },
                {
                    value: 2,
                    label: '匹配中'
                },
                {
                    value: 3,
                    label: '待面试'
                },
                {
                    value: 4,
                    label: '待签单'
                },
                {
                    value: 5,
                    label: '已服务'
                },
                {
                    value: 6,
                    label: '已放弃'
                },
                {
                    value: 7,
                    label: '已私签'
                },
                {
                    value: 8,
                    label: '黑名单'
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
                ],
                requirements: [
                    {
                        required: true,
                        message: '请选择需求',
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
        submitForm() {
            console.log(this.postForm);
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
                                path: 'client'
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

