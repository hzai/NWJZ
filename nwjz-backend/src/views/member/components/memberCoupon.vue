<template>
  <div class="app-container">
    <!-- <div class="filter-container">
      <el-select v-model="listQuery.status" class="filter-item" style="width: 130px" placeholder="订单状态" @change="handleFilter">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-input v-model="listQuery.order_code" style="width: 150px;" class="filter-item" placeholder="订单编号" @keyup.enter.native="handleFilter" />
      <el-date-picker v-model="listQuery.start_end" style="vertical-align: top;" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:01', '23:59:59']" @change="handleFilter" />
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div> -->
    <el-table :key="tableKey" v-loading="listLoading" :data="list" element-loading-text="给我一点时间" stripe fit highlight-current-row style="width: 100%">
      <el-table-column align="center" type="index" width="50" />
      <el-table-column align="center" label="优惠券名称" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.coupon.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型" width="100">
        <template slot-scope="scope">
          <el-tag v-for="tag in scope.row.coupon.coupon_type" :key="tag">
            {{ tag }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="面值" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.coupon.face_value }}元</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="满足金额" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.coupon.enough_money }}元</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="服务信息">
        <template slot-scope="scope">
          <span style="font-size:6px">{{ scope.row.service.title }}</span>
          <span style="font-size:6px;color:red">￥{{ scope.row.service.sale_price }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="过期时间" width="150">
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.expire_date) | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
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
import { fetchUserCouponList } from '@/api/coupon';
export default {
    name: 'MemberCoupon',
    filters: {
        statusTypeFilter(status) {
            const statusMap = {
                0: 'success',
                1: 'warning',
                2: 'danger'
            };
            return statusMap[status];
        },
        // 状态 0 - 已领取； 1 - 已使用； 2 - 已过期；
        statusFilter(status) {
            const statusMap = {
                0: '已领取',
                1: '已使用',
                2: '已过期'
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
                limit: 5,
                status: 'ALL'
                // order_code: '',
                // start_end: undefined
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
            fetchUserCouponList(_id, this.listQuery)
                .then(response => {
                    this.list = response.data.data.userCoupones;
                    this.total = response.data.data.total;
                    this.fetchSuccess = true;
                    this.listLoading = false;
                    console.log('this.list = ', this.list);
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
