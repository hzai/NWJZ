<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.nickname" style="width: 150px;" class="filter-item" placeholder="搜索昵称" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.contact_phone" style="width: 150px;" class="filter-item" placeholder="搜索电话" @keyup.enter.native="handleFilter" />
      <el-date-picker v-model="listQuery.start_end" style="vertical-align: top;" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:01', '23:59:59']" @change="handleFilter" />
      <el-select v-model="listQuery.status" class="filter-item" style="width: 130px" placeholder="状态" @change="handleFilter">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" min-width="100px" label="注册时间">
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.created_time) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="昵称" min-width="120">
        <template slot-scope="scope">
          <span class="link-type" @click="goInfo(scope.row)">{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="头像" width="65">
        <template slot-scope="scope">
          <router-link :to="'info?userId='+scope.row._id"><img :src="scope.row.avatar" class="user-avatar"></router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="220px" label="联系电话">
        <template slot-scope="scope">
          <span>{{ scope.row.contact_phone }}</span>
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
import {
    fetchMemberList
} from '@/api/user';
export default {
    name: 'MemberManage',
    filters: {
        statusTypeFilter(status) {
            const statusMap = {
                0: 'success',
                1: 'danger'
            };
            return statusMap[status];
        },
        statusFilter(status) {
            const statusMap = {
                0: '正常',
                1: '禁用'
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
                status: 0,
                start_end: this.$route.query.start_end ? this.$route.query.start_end : null
            },
            statusOptions: [{
                value: 'ALL',
                label: '所有状态'
            }, {
                value: 0,
                label: '正常'
            }, {
                value: 1,
                label: '禁用'
            }]
        };
    },
    created() {
        console.log(this.$route.query.start_end);
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
            this.listLoading = true;
            fetchMemberList(this.listQuery).then(response => {
                console.log(response.data.data.users);
                this.list = response.data.data.users;
                this.total = response.data.data.total;
                this.listLoading = false;
            });
        },
        goInfo(row) {
            this.$router.push({
                path: 'info',
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
