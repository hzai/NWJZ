<template>
  <div class="tab-table-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" style="width: 150px;" class="filter-item" placeholder="搜索姓名" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.contact_phone" style="width: 150px;" class="filter-item" placeholder="搜索电话" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.work_type" class="filter-item" style="width: 130px" multiple placeholder="工作意向" @change="handleFilter">
        <el-option v-for="item in staticOptions.job" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="handleReset">重置</el-button>
      <!-- <router-link style="margin-right:15px;" :to="{ path:'create'}">
        <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-search">智能筛选</el-button>
      </router-link> -->
      <el-collapse>
        <el-collapse-item title="详细筛选（点击展开）" name="1">
          <div>
            <el-select v-model="listQuery.native_place" class="filter-item" style="width: 180px" filterable multiple placeholder="籍贯" @change="handleFilter">
              <el-option v-for="item in provinceAndCityDataPlus" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="listQuery.credentials" class="filter-item" style="width: 130px;margin-left:15px;" multiple placeholder="资格证书" @change="handleFilter">
              <el-option v-for="item in staticOptions.credentials" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-input v-model="listQuery.ageMin" style="width: 100px;margin-left:15px;" class="filter-item" placeholder="最小年龄" @keyup.enter.native="handleFilter" />
            <span> - </span>
            <el-input v-model="listQuery.ageMax" style="width: 100px;" class="filter-item" placeholder="最大年龄" @keyup.enter.native="handleFilter" />
            <el-input v-model="listQuery.salaryMin" style="width: 100px;margin-left:15px;" class="filter-item" placeholder="最低薪资" @keyup.enter.native="handleFilter" />
            <span> - </span>
            <el-input v-model="listQuery.salaryMax" style="width: 100px;" class="filter-item" placeholder="最高薪资" @keyup.enter.native="handleFilter" />
            <el-select v-model="listQuery.zodiac" class="filter-item" style="width: 130px;margin-left:15px;" placeholder="属相" @change="handleFilter">
              <el-option v-for="item in staticOptions.zodiac" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :border="true" :data="list" element-loading-text="给我一点时间" stripe fit highlight-current-row style="width: 100%">
      <!-- <el-table-column align="center" prop="name" label="编号" min-width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.worker_code }}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="头像" width="65">
        <template slot-scope="scope">
          <router-link :to="'/worker/edit?id='+scope.row._id"><img :src="scope.row.avatar?scope.row.avatar:'http://images.llguanjia.com/avatar.png'" class="user-avatar"></router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="姓名" width="80">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="120" label="联系电话">
        <template slot-scope="scope">
          <span>{{ scope.row.contact_phone }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="性别" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="年龄" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.age }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="经验" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.working_age }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="籍贯" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.native_place | nativePlaceFilter }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="民族" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.nation }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="属相" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.zodiac }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column align="center" label="身份证号码" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.id_card }}</span>
        </template>
      </el-table-column> -->
      <el-table-column class-name="status-col" align="center" label="求职意向" width="150" prop="status">
        <template slot-scope="scope">
          {{ scope.row.work_type | arrayToText | ellipsis }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center" label="简介" min-width="150" prop="status">
        <template slot-scope="scope">
          {{ scope.row.introduce | ellipsis }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center" label="状态" width="80" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | workerStatusColorFilter">
            {{ scope.row.status | workerStatusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="80" class-name="small-padding" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)">分享</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background :current-page.sync="listQuery.page" :page-sizes="[5, 10, 15]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { provinceAndCityData, provinceAndCityDataPlus } from 'element-china-area-data';
import { fetchWorkerList, updateWorker } from '@/api/worker';
import staticOptions from '@/data/options';
export default {
  name: 'WorkerManageTable',
  filters: {
    statusTypeFilter(status) {
      const statusMap = {
        0: 'warning',
        1: 'success',
        2: 'info',
        3: 'danger'
      };
      return statusMap[status];
    },
    statusFilter(status) {
      const statusMap = {
        0: '待岗',
        1: '在岗',
        2: '离职',
        3: '黑名单'
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
    return {
      staticOptions,
      provinceAndCityData,
      provinceAndCityDataPlus,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        status: this.status,
        name: undefined,
        contact_phone: undefined,
        id_card: undefined,
        languages: [],
        credentials: [],
        work_type: [],
        native_place: [],
        nation: '',
        zodiac: '',
        ageMin: undefined,
        ageMax: undefined,
        salaryMin: undefined,
        salaryMax: undefined,
        working_experience: undefined,
        introduce: undefined
      },
      resetQuery: {
        page: 1,
        limit: 10,
        name: undefined,
        contact_phone: undefined,
        id_card: undefined,
        nation: '',
        languages: [],
        credentials: [],
        work_type: [],
        native_place: [],
        zodiac: '',
        ageMin: undefined,
        ageMax: undefined,
        salaryMin: undefined,
        salaryMax: undefined,
        working_experience: undefined,
        introduce: undefined
      }
    };
  },
  created() {
    // console.log(provinceAndCityData);
    // this.getList();
  },
  mounted() {},
  methods: {
    parentHandleclick(employerFromParent) {
      this.listQuery.work_type = [employerFromParent.requirements];
      this.listQuery.native_place = [employerFromParent.worker_native_place];
      this.listQuery.ageMin = employerFromParent.age_min ? employerFromParent.age_min : undefined;
      this.listQuery.ageMax = employerFromParent.age_max ? employerFromParent.age_max : undefined;
      //   this.listQuery.salaryMin = employerFromParent.salary_min
      //     ? employerFromParent.salary_min
      //     : undefined;
      //   this.listQuery.salaryMax = employerFromParent.salary_max
      //     ? employerFromParent.salary_max
      //     : undefined;
      this.getList();
    },
    handleFilter() {
      this.listQuery.page = 1;
      //   this.$store.dispatch('saveListQuery', { worker_list: this.listQuery });
      this.getList();
    },
    handleReset() {
      const tempStatus = this.listQuery.status;
      this.listQuery = {};
      this.listQuery = Object.assign({}, this.resetQuery);
      this.listQuery.status = tempStatus;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      //   this.$store.dispatch('saveListQuery', { worker_list: this.listQuery });
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      //   this.$store.dispatch('saveListQuery', { worker_list: this.listQuery });
      this.getList();
    },
    async handleModifyStatus(row, status) {
      this.listLoading = true;
      row.status = status;
      await updateWorker(row._id, row).then(resp => {
        if (resp.data.status === 0) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.listLoading = false;
        }
      });
    },
    getList() {
      //   if (
      //     this.$store.state.user.listQuery !== null &&
      //     this.$store.state.user.listQuery !== undefined &&
      //     this.$store.state.user.listQuery.worker_list !== undefined
      //   ) {
      //     this.listQuery = this.$store.state.user.listQuery.worker_list;
      //   }
      //   this.$store.dispatch('saveListQuery', { worker_list: this.listQuery });
      this.listLoading = true;
      fetchWorkerList(this.listQuery).then(response => {
        // console.log(response.data.data.workers)
        this.list = response.data.data.workers;
        this.total = response.data.data.total;
        this.listLoading = false;
      });
    },
    handleUpdate(row) {
      this.$router.push({
        path: 'edit',
        query: {
          id: row._id
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'src/styles/mixin.scss';
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  object-fit: cover;
}
.el-tag + .el-tag {
  margin: 5px;
}
.el-row {
  margin-bottom: 20px;
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
