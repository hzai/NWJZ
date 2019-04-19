<template>
  <div class="app-container">
    <el-table :key="tableKey" v-loading="listLoading" :data="list" element-loading-text="给我一点时间" stripe fit highlight-current-row style="width: 100%">
      <el-table-column align="center" type="index" width="50" />
      <el-table-column align="center" label="联系人" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.contact_person }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系电话" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.contact_phone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="区域" width="180">
        <template slot-scope="scope">
          <span>{{ getAddressArea(scope.row.area) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="详细地址">
        <template slot-scope="scope">
          <span>{{ scope.row.detail_address }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background :current-page.sync="listQuery.page" :page-sizes="[5, 10, 15]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog title="创建地址" :visible.sync="dialogAddressFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 500px; margin-left:50px;">
        <el-form-item v-if="dialogStatus=='create'" label="联系人" prop="contact_person">
          <el-col :span="10">
            <el-input v-model="temp.contact_person" placeholder="联系人" />
          </el-col>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'" label="联系电话" prop="contact_phone">
          <el-col :span="10">
            <el-input v-model="temp.contact_phone" placeholder="联系电话" />
          </el-col>
        </el-form-item>
        <el-form-item label="服务地址" prop="address">
          <el-select v-model="temp.area1" class="filter-item" placeholder="请选择">
            <el-option v-for="(item, key) in addressOptions" :key="key" :label="item.name" :value="item.value" />
          </el-select>
          <el-input v-model="temp.detail_address" placeholder="详细地址" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddressFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createDataAddress">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchUserAddress } from '@/api/address';
import addressData from '@/data/address';
import { value2name } from '@/utils/value2name';
let addressOptions = Object.assign([], addressData);
addressOptions = addressOptions.splice(2, 30);
export default {
    name: 'MemberAddress',
    filters: {
        statusTypeFilter(status) {
            const statusMap = {
                0: 'Warning',
                1: 'success',
                2: 'blue',
                3: 'danger',
                4: 'info',
                5: 'primary'
            };
            return statusMap[status];
        },
        // 订单状态 0 - 待付款；1 - 已付款；2 - 待评价；3 - 已完成；4 - 交易关闭
        statusFilter(status) {
            const statusMap = {
                0: '待付款',
                1: '已付款',
                2: '待评价',
                3: '已完成',
                4: '交易关闭',
                5: '待回访'
            };
            return statusMap[status];
        },
        // 订单状态 01 - 余额；02 - 微信支付；
        payTypeFilter(type) {
            const typeMap = {
                '01': '微信支付',
                '02': '余额'
            };
            return typeMap[type];
        },
        apmStatusTypeFilter(status) {
            const statusMap = {
                0: 'warning',
                1: 'danger',
                2: 'warning',
                3: 'success',
                4: 'info'
            };
            return statusMap[status];
        },
        preApmStatusTypeFilter(status) {
            const statusMap = {
                0: 'success',
                1: 'warning',
                2: 'danger',
                3: 'success',
                4: 'info'
            };
            return statusMap[status];
        },
        // Appointment状态 0 - 已预约（未分配）；1 - 已分配；2 - 服务中；3 - 服务完成; 4 - 服务取消
        apmStatusFilter(status) {
            const statusMap = {
                0: '正常',
                1: '禁用',
                2: '服务中',
                3: '服务完成',
                4: '服务取消'
            };
            return statusMap[status];
        },
        // Preappointment状态 0 - 正常；1 - 使用完毕；2 - 过期；
        preApmStatusFilter(status) {
            const statusMap = {
                0: '正常',
                1: '使用完毕',
                2: '过期'
            };
            return statusMap[status];
        }
    },
    data() {
        return {
            tableKey: 0,
            list: null,
            total: null,
            listLoading: true,
            addressData,
            addressOptions,
            dialogAddressFormVisible: false,
            dialogStatus: '',
            listQuery: {
                page: 1,
                limit: 5,
                status: 'ALL',
                order_code: '',
                start_end: undefined
            },
            temp: {
                _id: '',
                area1: '',
                contact_person: '',
                contact_phone: ''
            },
            fetchSuccess: true,
            statusOptions: [
                {
                    value: 'ALL',
                    label: '所有状态'
                },
                {
                    value: '0',
                    label: '待付款'
                },
                {
                    value: '1',
                    label: '已付款'
                },
                {
                    value: '2',
                    label: '待评价'
                },
                {
                    value: '3',
                    label: '已完成'
                },
                {
                    value: '4',
                    label: '交易关闭'
                },
                {
                    value: '5',
                    label: '待回访'
                },
                {
                    value: '6',
                    label: '已回访'
                },
                {
                    value: '7',
                    label: '已退款'
                }
            ],
            rules: {
                nickname: [
                    {
                        required: true,
                        message: '昵称是必填项',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getAddressArea(area) {
            return value2name(area, this.addressData);
        },
        handleFilter() {
            this.listQuery.page = 1;
            this.getList();
        },
        handleSizeChange(val) {
            this.listQuery.limit = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.page = val;
            this.getList();
        },
        getList() {
            const _id = this.$route.query.userId;
            this.listLoading = true;
            fetchUserAddress(_id, this.listQuery)
                .then(response => {
                    this.total = response.data.data.total;
                    this.list = response.data.data.addresses;
                    this.fetchSuccess = true;
                    this.listLoading = false;
                })
                .catch(err => {
                    this.fetchSuccess = false;
                    console.log(err);
                });
        },
        goInfo(row) {
            this.$router.push({
                path: 'detail',
                query: {
                    userId: row._id
                }
            });
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
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
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
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
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
</style>
