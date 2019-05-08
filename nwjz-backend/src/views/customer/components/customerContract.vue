<template>
  <div class="createPost-container">
    <div style="margin-top:-15px;margin-bottom:10px;">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="dialogHTVisible = true">创建合同</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="dialogZDDDVisible = true">创建钟点订单</el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" border :data="list" element-loading-text="给我一点时间" stripe fit highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50" />
      <el-table-column align="center" prop="name" label="合同编号" min-width="100">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.contract_no }}</span>
          <!-- <span>{{scope.row.worker.name}}</span> -->
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="家政服务员" min-width="100">
        <template slot-scope="scope">
          <span class="link-type" @click="gotoWorker(scope.row.worker._id)">{{ scope.row.worker.name }}</span>
          <!-- <span>{{scope.row.worker.name}}</span> -->
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="120px" label="电话">
        <template slot-scope="scope">
          <span>{{ scope.row.worker.contact_phone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="阿姨工资" min-width="100px">
        <template>
          <span>5000元</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="每月休息" min-width="100px">
        <template>
          <span>4天</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="开始时间">
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.contract_start_date) | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" align="center" label="结束时间">
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.contract_end_date) | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center" label="状态" width="100" sortable prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusTypeFilter">
            {{ scope.row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="80" class-name="small-padding" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="border-bottom:2px solid #CCCCCC;margin:15px 0;" />
    <el-tabs tab-position="left">
      <el-tab-pane label="更换阿姨">
        <div style="margin-top:5px;margin-bottom:10px;">
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="dialogGHAYVisible = true">更换阿姨</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" border :data="list" element-loading-text="给我一点时间" stripe fit highlight-current-row style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column align="center" prop="name" label="家政服务员" min-width="100">
            <template slot-scope="scope">
              <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.contract_no }}</span>
              <!-- <span>{{scope.row.worker.name}}</span> -->
            </template>
          </el-table-column>
          <el-table-column min-width="120px" align="center" label="上户时间">
            <template slot-scope="scope">
              <span>{{ new Date(scope.row.contract_start_date) | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="120px" align="center" label="下户时间">
            <template slot-scope="scope">
              <span>{{ new Date(scope.row.contract_end_date) | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="100px" label="工资/月">
            <template slot-scope="scope">
              <span>{{ scope.row.worker.contact_phone }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="100px" label="每月休息">
            <template slot-scope="scope">
              <span>{{ scope.row.worker.contact_phone }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="200px" label="备注">
            <template slot-scope="scope">
              <span>{{ scope.row.worker.contact_phone }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="回访记录">
        <div style="margin-top:5px;margin-bottom:10px;">
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="dialogHFJLVisible = true">添加回访记录</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" border :data="list" element-loading-text="给我一点时间" stripe fit highlight-current-row style="width: 100%">
          <el-table-column type="index" width="50" />
          <el-table-column align="center" prop="name" label="回访方式" min-width="80px">
            <template slot-scope="scope">
              <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.contract_no }}</span>
              <!-- <span>{{scope.row.worker.name}}</span> -->
            </template>
          </el-table-column>
          <el-table-column min-width="80px" align="center" label="满意度">
            <template slot-scope="scope">
              <span>{{ new Date(scope.row.contract_start_date) | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="200px" align="center" label="回访记录">
            <template slot-scope="scope">
              <span>{{ new Date(scope.row.contract_end_date) | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="100px" label="回访时间">
            <template slot-scope="scope">
              <span>{{ scope.row.worker.contact_phone }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="80px" label="回访人">
            <template slot-scope="scope">
              <span>{{ scope.row.worker.contact_phone }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="100px" label="备注">
            <template slot-scope="scope">
              <span>{{ scope.row.worker.contact_phone }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 合同dialog -->
    <el-dialog title="添加合同" top="5vh" center :visible.sync="dialogHTVisible">
      <div style="margin:0 auto;">
        <el-form :model="form" label-width="130px" label-position="right">
          <el-form-item label="类型">
            <el-select v-model="form.contact_detail_type" style="width:300px;" placeholder="请选择类型">
              <el-option label="住家保姆" value="住家保姆" />
              <el-option label="走家保姆" value="走家保姆" />
              <el-option label="月嫂" value="月嫂" />
              <el-option label="育婴师" value="育婴师" />
              <el-option label="老人陪护" value="老人陪护" />
              <el-option label="病人陪护" value="病人陪护" />
            </el-select>
          </el-form-item>
          <el-form-item label="服务人员">
            <el-input v-model="form.worker" style="width:300px;" placeholder="请输入姓名或电话查询" />
            <!-- <el-autocomplete popper-class="my-autocomplete" v-model="state" :fetch-suggestions="querySearch" placeholder="请输入姓名或电话查询" @select="handleSelect">
              <i class="el-icon-edit el-input__icon" slot="suffix" @click="handleIconClick"></i>
              <template slot-scope="{ item }">
                <div class="name">{{ item.value }}</div>
                <span class="addr">{{ item.address }}</span>
              </template>
            </el-autocomplete> -->
          </el-form-item>
          <el-form-item label="阿姨工资(元/月)">
            <el-input v-model="form.service_payment" style="width:300px;" />
          </el-form-item>
          <el-form-item label="每月休息天数">
            <el-input v-model="form.rest_day" style="width:300px;" />
          </el-form-item>
          <el-form-item label="加班费用(元/天)">
            <el-input v-model="form.overtime_expenses" style="width:300px;" />
          </el-form-item>
          <el-form-item label="客户服务费">
            <el-input v-model="form.contract_intermediary_cost" style="width:300px;" />
          </el-form-item>
          <el-form-item label="阿姨服务费">
            <el-input v-model="form.worker_intermediaty_cost" style="width:300px;" />
          </el-form-item>
          <el-form-item label="合同期限">
            <el-date-picker v-model="form.contact_limit" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" style="width:300px;" placeholder="增加合同备注，如客户特殊情况，走家费用或其他约定等。" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogHTVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogHTVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 钟点订单dialog -->
    <el-dialog title="添加钟点订单" top="5vh" center :visible.sync="dialogZDDDVisible">
      <div style="margin:0 auto;">
        <el-form :model="form2" label-width="130px" label-position="right">
          <el-form-item label="类型">
            <el-select v-model="form2.contact_detail_type" style="width:300px;" placeholder="请选择类型">
              <el-option label="临时钟点" value="临时钟点" />
              <el-option label="长期中餐" value="长期中餐" />
              <el-option label="长期晚餐" value="长期晚餐" />
              <el-option label="长期保洁" value="长期保洁" />
              <el-option label="开荒保洁" value="开荒保洁" />
              <el-option label="玻璃清洗" value="玻璃清洗" />
            </el-select>
          </el-form-item>
          <el-form-item label="服务人员">
            <el-input v-model="form2.worker" style="width:300px;" placeholder="请输入姓名或电话查询" />
          </el-form-item>
          <el-form-item label="订单应收费用">
            <el-input v-model="form2.order_payment" style="width:300px;" />
          </el-form-item>
          <el-form-item label="结算阿姨工资">
            <el-input v-model="form2.service_payment" style="width:300px;" placeholder="(元/月或次)" />
          </el-form-item>
          <el-form-item label="客户服务费">
            <el-input v-model="form2.contract_intermediary_cost" style="width:300px;" />
          </el-form-item>
          <el-form-item label="阿姨服务费">
            <el-input v-model="form2.worker_intermediaty_cost" style="width:300px;" />
          </el-form-item>
          <el-form-item label="服务时间">
            <el-date-picker v-model="form2.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form2.remark" style="width:300px;" placeholder="增加合同备注，如客户特殊情况，走家费用或其他约定等。" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogZDDDVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogZDDDVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 更换阿姨dialog -->
    <el-dialog title="更换阿姨" top="5vh" center :visible.sync="dialogGHAYVisible">
      <div style="margin:0 auto;">
        <el-form :model="form3" label-width="130px" label-position="right">
          <el-form-item label="服务人员">
            <el-input v-model="form3.worker" style="width:300px;" placeholder="请输入姓名或电话查询" />
          </el-form-item>
          <el-form-item label="阿姨工资(元/月)">
            <el-input v-model="form3.service_payment" style="width:300px;" />
          </el-form-item>
          <el-form-item label="每月休息天数">
            <el-input v-model="form3.rest_day" style="width:300px;" />
          </el-form-item>
          <el-form-item label="加班费用(元/天)">
            <el-input v-model="form3.overtime_expenses" style="width:300px;" />
          </el-form-item>
          <el-form-item label="阿姨服务费">
            <el-input v-model="form3.worker_intermediaty_cost" style="width:300px;" />
          </el-form-item>
          <el-form-item label="合同期限">
            <el-date-picker v-model="form3.limit" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form3.remark" style="width:300px;" placeholder="增加合同备注，如客户特殊情况，走家费用或其他约定等。" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGHAYVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogGHAYVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 回访记录dialog -->
    <el-dialog title="回访记录" top="5vh" center :visible.sync="dialogHFJLVisible">
      <div style="margin:0 auto;">
        <el-form :model="form3" label-width="130px" label-position="right">
          <el-form-item label="回访方式">
            <el-select v-model="form4.review_type" style="width:300px;" placeholder="请选择回访方式">
              <el-option label="电话" value="电话" />
              <el-option label="微信" value="微信" />
              <el-option label="QQ" value="QQ" />
              <el-option label="上门" value="上门" />
              <el-option label="客户到店" value="客户到店" />
            </el-select>
          </el-form-item>
          <el-form-item label="满意度">
            <el-select v-model="form4.review_race" style="width:300px;" placeholder="请选择满意度">
              <el-option label="很满意" value="很满意" />
              <el-option label="满意" value="满意" />
              <el-option label="一般" value="一般" />
              <el-option label="不满意" value="不满意" />
              <el-option label="非常不满" value="非常不满" />
            </el-select>
          </el-form-item>
          <el-form-item label="回访记录">
            <el-input v-model="form4.review_content" style="width:300px;" placeholder="" />
          </el-form-item>
          <el-form-item label="回访时间">
            <el-date-picker v-model="form4.review_date" type="datetime" placeholder="选择日期时间" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form4.remark" style="width:300px;" placeholder="增加合同备注，如客户特殊情况，走家费用或其他约定等。" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogHFJLVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogHFJLVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// import Upload from '@/components/Upload/singleImage3';
import { createEmployer, fetchEmployer, updateEmployer } from '@/api/employer';
import { queryWorkers } from '@/api/worker';
import { getContractListByEmployer } from '@/api/contract';
import { mapGetters } from 'vuex';
import city from '@/data/city';
const img_upload_api = process.env.BASE_API + '/upload/addimg';
const img_url = process.env.IMG_URL;
export default {
    name: 'CustomerContract',
    components: {
    // Upload
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
            dialogHTVisible: false,
            dialogZDDDVisible: false,
            dialogGHAYVisible: false,
            dialogHFJLVisible: false,
            form: {},
            form2: {},
            form3: {},
            form4: {},
            queryList: {},
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
        this.fetchQueryWorker();
        if (this.isEdit) {
            // this.fetchData();
            // this.fetchContactList();
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
        fetchQueryWorker() {
            queryWorkers({}).then(response => {
                this.queryList = response.data.data.workers;
                // console.log('worker', queryList);
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
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>

