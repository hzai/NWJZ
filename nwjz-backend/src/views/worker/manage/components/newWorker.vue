<template>
  <div class="createPost-container">
    <el-alert v-if="postForm.remark" title="温馨提示" type="warning" :description="'备注: ' + postForm.remark" show-icon />

    <el-form ref="postForm" :model="postForm" :rules="rules" label-width="78px" label-position="left" style="padding-top:10px;" size="medium">
      <div class="createPost-main-container">
        <div class="tip">
          <span>
            身份信息（输入身份证号可获取信息）
          </span>
        </div>
        <el-row style="padding-left:30px;">
          <el-col :span="16">
            <div class="postInfo-container">
              <!--<el-row :gutter="10">
                     <el-col :span="10">
                      <el-form-item label="编号" class="postInfo-container-item">
                        <span>{{ postForm.worker_code }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-form-item label="状态" class="postInfo-container-item">
                        <el-select v-model="postForm.status" style="width:160px;" placeholder="请选择">
                          <el-option v-for="(item, key) in statusOptions" :key="key" :label="item.label" :value="item.value" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-form-item label="正式员工" class="postInfo-container-item">
                        <el-switch v-model="postForm.is_employed" active-text="是" inactive-text="否" />
                      </el-form-item>
                    </el-col>
                  </el-row>-->
              <el-row>
                <el-col :span="24">
                  <el-form-item label="身份证号" prop="id_card" class="postInfo-container-item">
                    <el-input v-model="postForm.id_card" placeholder="身份证号码" style="max-width:180px;margin-right:30px;" :maxlength="18" @change="id_card_change" />
                    <el-button v-loading="loading" size="medium" type="success">上传身份证照片</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="姓名" prop="name" class="postInfo-container-item">
                    <el-input v-model="postForm.name" placeholder="姓名" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系电话" prop="contact_phone" class="postInfo-container-item">
                    <el-input v-model="postForm.contact_phone" placeholder="联系电话" style="min-width:180px;" :maxlength="14" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="性别" class="postInfo-container-item">
                    <el-radio v-model="postForm.sex" label="女">女</el-radio>
                    <el-radio v-model="postForm.sex" label="男">男</el-radio>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="出生日期" prop="birth" class="postInfo-container-item">
                    <el-date-picker v-model="postForm.birth" style="width:180px;" type="date" format="yyyy-MM-dd" placeholder="选择日期" />
                  </el-form-item>
                </el-col>

              </el-row>

              <el-row>
                <!-- <el-col :span="12">
                      <el-form-item label="年龄" prop="age" class="postInfo-container-item">
                        <el-input v-model.number="postForm.age" placeholder="年龄" style="min-width:180px;" :maxlength="2" />
                      </el-form-item>
                    </el-col> -->
                <el-col :span="12">
                  <el-form-item label="籍贯" prop="native_place" class="postInfo-container-item">
                    <el-input v-model="postForm.native_place" placeholder="籍贯" style="min-width:180px;" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="民族" prop="nation" class="postInfo-container-item">
                    <el-select v-model="postForm.nation" style="width:180px;" placeholder="请选择">
                      <el-option v-for="(item, key) in nationOptions" :key="key" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>

          <el-col :span="4">
            <el-form-item label="头像" label-width="50px" class="postInfo-container-item">
              <el-upload class="avatar-uploader" :action="img_upload_api" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <img v-if="postForm.avatar" :src="postForm.avatar" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="tip">
          <span>
            个人资料
          </span>
        </div>
        <el-row style="padding-left:30px;">
          <el-col :span="8">
            <el-form-item label="紧急电话" class="postInfo-container-item">
              <el-input v-model="postForm.urgent_phone" placeholder="紧急电话" style="max-width:180px;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="身高" prop="height" class="postInfo-container-item">
              <el-input v-model.number="postForm.height" placeholder="身高" style="max-width:180px;" :maxlength="3" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="padding-left:30px;">
          <el-col :span="8">
            <el-form-item label="学历" class="postInfo-container-item">
              <el-select v-model="postForm.academic" style="width:180px;" placeholder="请选择">
                <el-option v-for="(item, key) in academicOptions" :key="key" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="婚姻状况" class="postInfo-container-item">
              <el-select v-model="postForm.marriaged" style="width:180px;" placeholder="请选择">
                <el-option v-for="(item, key) in marriagedOptions" :key="key" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="padding-left:30px;">
          <el-col :span="16">
            <el-form-item label="地址" prop="address" class="postInfo-container-item">
              <el-input v-model="postForm.address" placeholder="地址" style="min-width:550px;" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="padding-left:30px;">
          <el-col>
            <el-form-item label="语言能力" class="postInfo-container-item">
              <el-checkbox-group v-model="postForm.languages">
                <el-checkbox label="普通话" />
                <el-checkbox label="广东话" />
                <el-checkbox label="客家话" />
                <el-checkbox label="潮州话" />
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="padding-left:30px;">
          <el-col :span="16">
            <el-form-item label="自我介绍">
              <el-input v-model="postForm.introduce" type="textarea" class="article-textarea" :rows="2" placeholder="一句话简单的自我介绍" style="min-width:550px;" />
              <!-- <span class="word-counter" v-show="contentIntroduceShortLength">{{contentIntroduceShortLength}}字</span> -->
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="padding-left:30px;">
          <el-col :span="17">
            <el-form-item label="家庭成员" class="postInfo-container-item">
              <el-table ref="multipleTable" :data="postForm.family" tooltip-effect="dark" style="width: 100%">
                <el-table-column align="center" label="姓名" width="80">
                  <el-input v-model="scope.row.name" slot-scope="scope" style="min-width:20px;" placeholder="姓名" />
                </el-table-column>
                <el-table-column align="center" label="性别" width="45">
                  <el-input v-model="scope.row.sex" slot-scope="scope" style="min-width:10px;" placeholder="性别" />
                </el-table-column>
                <el-table-column align="center" label="关系" width="80">
                  <el-input v-model="scope.row.relationship" slot-scope="scope" placeholder="关系" />
                </el-table-column>
                <el-table-column align="center" label="年龄" width="45">
                  <el-input v-model="scope.row.age" slot-scope="scope" style="min-width:10px;" placeholder="年龄" />
                </el-table-column>
                <el-table-column align="center" label="工作单位" width="150">
                  <el-input v-model="scope.row.company" slot-scope="scope" style="min-width:10px;" placeholder="工作单位" />
                </el-table-column>
                <el-table-column align="center" label="电话" width="130">
                  <el-input v-model="scope.row.tel" slot-scope="scope" style="min-width:10px;" placeholder="电话" />
                </el-table-column>
                <el-table-column align="center" label="操作" width="80">
                  <template slot-scope="scope">
                    <el-button type="info" size="mini" icon="el-icon-delete" @click="handleDeleteFamily(scope.row)" />
                  </template>
                </el-table-column>
              </el-table>
              <div style="margin-top: 10px;float:right">
                <el-button type="primary" icon="el-icon-plus" round @click="addBlankFamily()">家庭成员</el-button>
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
            <el-form-item label="工作经验" class="postInfo-container-item">
              <el-select v-model="postForm.workesp" style="width:180px;" placeholder="请选择">
                <el-option v-for="(item, key) in workEspOptions" :key="key" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="padding-left:30px;">
          <el-col :span="17">
            <el-form-item label="工作类型" class="postInfo-container-item">
              <el-checkbox-group v-model="postForm.work_type">
                <el-checkbox label="月嫂" />
                <el-checkbox label="保姆" />
                <el-checkbox label="育婴师" />
                <el-checkbox label="钟点工" />
                <el-checkbox label="老年护理" />
                <el-checkbox label="病人护理" />
                <el-checkbox label="管家" />
                <el-checkbox label="家电保洁" />
                <el-checkbox label="维修" />
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="padding-left:30px;">
          <el-col :span="17">
            <el-form-item label="工作时间" class="postInfo-container-item">
              <el-checkbox-group v-model="postForm.work_type">
                <el-checkbox label="住家" />
                <el-checkbox label="走家" />
                <el-checkbox label="全天白班" />
                <el-checkbox label="上午白班" />
                <el-checkbox label="下午白班" />
                <el-checkbox label="均可" />
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="padding-left:30px;">
          <el-col :span="17">
            <el-form-item label="工作技能" class="postInfo-container-item">
              <el-checkbox-group v-model="postForm.work_type">
                <el-checkbox label="中餐" />
                <el-checkbox label="西餐" />
                <el-checkbox label="面食" />
                <el-checkbox label="海鲜" />
                <el-checkbox label="煲汤" />
                <el-checkbox label="辅食" />
                <el-checkbox label="熨烫" />
                <el-checkbox label="早教" />
                <el-checkbox label="催乳" />
                <el-checkbox label="通乳" />
                <el-checkbox label="小儿推拿" />
                <el-checkbox label="产后恢复" />
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="tip">
          <span>
            阿姨资质
          </span>
        </div>

        <el-row style="padding-left:30px;">
          <el-col :span="8">
            <el-form-item label="等级" class="postInfo-container-item">
              <el-select v-model="postForm.levels" style="width:180px;" placeholder="请选择">
                <el-option v-for="(item, key) in levelsOptions" :key="key" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" class="postInfo-container-item">
              <el-select v-model="postForm.status" style="width:180px;" placeholder="请选择">
                <el-option v-for="(item, key) in statusOptions" :key="key" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="padding-left:30px;">
          <el-col :span="16">
            <el-form-item label="薪资要求" class="postInfo-container-item">
              <el-input placeholder="最低薪资" style="max-width:180px;margin-right:10px;" :maxlength="5" />
              <span> - </span>
              <el-input placeholder="最高薪资" style="max-width:180px;margin-left:10px;" :maxlength="5" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="padding-left:30px;">
          <el-col :span="17">
            <el-form-item label="资格证书" class="postInfo-container-item">
              <el-checkbox-group v-model="postForm.credentials">
                <el-checkbox label="母婴护理证" />
                <el-checkbox label="育婴师证" />
                <el-checkbox label="健康证" />
                <el-checkbox label="等级上岗证" />
                <el-checkbox label="催乳师证" />
                <el-checkbox label="小儿推拿证" />
                <el-checkbox label="产后恢复师证" />
                <el-checkbox label="营养师证" />
                <el-checkbox label="驾照" />
                <el-checkbox label="厨师证" />
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="padding-left:30px;">
          <el-col :span="16">
            <el-form-item label="工作经历" class="postInfo-container-item">
              <el-table ref="multipleTable" :data="postForm.family" tooltip-effect="dark" style="width: 100%">
                <el-table-column align="center" label="在职时间" width="100">
                  <el-input style="min-width:100px;" placeholder="在职时间" />
                </el-table-column>
                <el-table-column align="center" label="工作内容" width="400">
                  <el-input style="min-width:400px;" placeholder="工作内容" />
                </el-table-column>
                <el-table-column align="center" label="操作" width="80">
                  <template slot-scope="scope">
                    <el-button type="info" size="mini" icon="el-icon-delete" @click="handleDeleteFamily(scope.row)" />
                  </template>
                </el-table-column>
              </el-table>
              <div style="margin-top: 10px;float:right">
                <el-button type="primary" icon="el-icon-plus" round @click="addBlankFamily()" />
              </div>
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
            <el-upload ref="attachment_uploader" :on-success="handelDetailPicSuccess" :file-list="postForm.attachment" :action="img_upload_api" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" size="tiny">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-col>
        </el-row>

        <el-row style="padding:30px;">
          <el-col style="text-align:center;">
            <el-button v-if="!isEdit" v-loading="loading" size="medium" type="success" @click="submitForm()">保存</el-button>
            <el-button v-if="isEdit" v-loading="loading" size="medium" type="success" @click="updateForm()">更新</el-button>
            <router-link style="padding-left:10px;" :to="{ path:'manage'}">
              <el-button size="medium" type="info">取消</el-button>
            </router-link>
          </el-col>
        </el-row>

      </div>

    </el-form>
    <!-- </el-tab-pane> -->
    <!-- <el-tab-pane v-if="isEdit" label="保险购买记录" name="insurance">
        <insurance-pane :worker-id="this.$route.query.id" />
      </el-tab-pane>
      <el-tab-pane v-if="isEdit" label="沟通记录" name="communication">
        <communication-pane type="worker" :worker-id="this.$route.query.id" />
      </el-tab-pane> -->
    <!-- </el-tabs> -->
  </div>
</template>

<script>
import { createWorker, fetchWorker, updateWorker } from '@/api/worker';
import { mapGetters } from 'vuex';
import city from '@/data/city';
import nationData from '@/data/nation';
import { getShengXiao } from '@/utils';

const img_upload_api = process.env.BASE_API + '/upload/addimg';
const img_url = process.env.IMG_URL;
const nationOptions = Object.assign([], nationData);
export default {
    name: 'NewWorker',
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
            activeTab: 'worker',
            dialogImageUrl: '',
            dialogVisible: false,
            img_upload_api,
            img_url,
            city: city,
            postForm: {
                status: 0,
                // 是否受雇为员工，默认false
                is_employed: false,
                // 昵称
                nickname: '',
                // 头像
                avatar: '',
                // 姓名
                name: '',
                // 性别
                sex: '女',
                // 籍贯
                native_place: '',
                // 民族
                nation: '',
                // 属相
                zodiac: '',
                // 户籍地址
                address: '',
                // 年龄
                age: undefined,
                // 婚姻状况
                marriaged: '',
                // 生日
                birth: undefined,
                // 身份证号
                id_card: '',
                // 身份证图片
                id_card_images: [],
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
                // 语言能力
                languages: [],
                // 证件
                credentials: [],
                // 工作类型
                workesp: [],
                // 工作经验 多少年
                levels: [],
                // 等级，家政公司自行定等级
                work_type: [],
                // 其他工作类型
                other_work_type: '',
                // 介绍人或担保人
                recommend_person: '',
                // 介绍人联系电话
                recommend_phone: '',
                // 家庭成员
                family: [],
                // 工作经验
                working_experience: '',
                // 自我介绍
                introduce: '',
                // 附件
                attachment: [],
                // 后台标记
                remark: '',
                // 角色
                roles: ['worker']
            },
            fetchSuccess: true,
            loading: false,
            statusOptions: [
                {
                    value: 0,
                    label: '待岗'
                },
                {
                    value: 1,
                    label: '上户中'
                },
                {
                    value: 2,
                    label: '培训中'
                },
                {
                    value: 3,
                    label: '休假'
                },
                {
                    value: 4,
                    label: '转行'
                },
                {
                    value: 5,
                    label: '黑名单'
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
            levelsOptions: [
                {
                    value: '1级',
                    label: '1级'
                },
                {
                    value: '2级',
                    label: '2级'
                },
                {
                    value: '3级',
                    label: '3级'
                },
                {
                    value: '4级',
                    label: '4级'
                },
                {
                    value: '5级',
                    label: '5级'
                }
            ],
            marriagedOptions: [
                {
                    value: '未婚',
                    label: '未婚'
                },
                {
                    value: '已婚',
                    label: '已婚'
                },
                {
                    value: '离异',
                    label: '离异'
                },
                {
                    value: '丧偶',
                    label: '丧偶'
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
            if (res.status === 0) {
                this.postForm.avatar = img_url + res.image_path;
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
            fetchWorker(_id)
                .then(response => {
                    this.postForm = response.data.data.worker;
                    this.postForm.birth = new Date(this.postForm.birth);
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
  width: 130px;
  height: 130px;
  line-height: 130px;
  text-align: center;
}
.avatar {
  width: 130px;
  height: 130px;
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

