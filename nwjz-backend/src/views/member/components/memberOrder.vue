<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.status" class="filter-item" style="width: 130px" placeholder="订单状态" @change="handleFilter">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-input v-model="listQuery.order_code" style="width: 150px;" class="filter-item" placeholder="订单编号" @keyup.enter.native="handleFilter" />
      <el-date-picker v-model="listQuery.start_end" style="vertical-align: top;" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:01', '23:59:59']" @change="handleFilter" />
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" element-loading-text="给我一点时间" stripe fit highlight-current-row style="width: 100%">
      <el-table-column align="center" type="index" width="50" />
      <!-- <el-table-column align="center" label="客户" width="180">
        <template slot-scope="scope">
          <img :src="scope.row.user.avatar" class="user-avatar">
          <el-popover trigger="hover" placement="top">
            <p>
              <span style="font-size:6px">昵称: {{ scope.row.user.nickname }}</span>
            </p>
            <p>
              <span style="font-size:6px">联系电话: {{ scope.row.user.contact_phone }}</span>
            </p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.user.nickname }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="下单时间" width="150">
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.created_time) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单编号" width="180">
        <template slot-scope="scope">
          <span class="link-type" @click="goOrderDetail(scope.row)">{{ scope.row.order_code }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="title" label="服务信息" min-width="100">
        <template slot-scope="scope">
          <!-- <img :src="scope.row.service.primary_pic" width="20%" height="20%" /> -->
          <span style="font-size:6px">{{ scope.row.service.title }}</span>
          <span style="font-size:6px;color:red">￥{{ scope.row.service.sale_price }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="80px" label="服务地址">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>
              <span style="font-size:6px">姓名: {{ scope.row.address.contact_person }}</span>
            </p>
            <p>
              <span style="font-size:6px">联系电话: {{ scope.row.address.contact_phone }}</span>
            </p>
            <p>
              <span style="font-size:6px">地址: {{ scope.row.address.detail_address }}</span>
            </p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.address.contact_person }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" label="实收款" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.amount_paid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="付款方式" min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.pay_type | payTypeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" align="center" label="状态" width="100" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusTypeFilter">
            {{ scope.row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background :current-page.sync="listQuery.page" :page-sizes="[5, 10, 15]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

  </div>
</template>

<script>
import { fetchUserOrderList } from '@/api/user';
export default {
    name: 'MemberOrder',
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
            listQuery: {
                page: 1,
                limit: 10,
                status: 'ALL',
                order_code: '',
                start_end: undefined
            },
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
            ]
        };
    },
    created() {
        this.getList();
    },
    methods: {
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
            fetchUserOrderList(_id, this.listQuery)
                .then(response => {
                    this.list = response.data.data.orders;
                    this.total = response.data.data.total;
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
