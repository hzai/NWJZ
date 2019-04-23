<template>
  <div class="tab-table-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" style="width: 150px;" class="filter-item" placeholder="搜索姓名" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.contact_phone" style="width: 150px;" class="filter-item" placeholder="搜索电话" @keyup.enter.native="handleFilter" />
      <!-- <el-input v-model="listQuery.id_card" style="width: 200px;" class="filter-item" placeholder="搜索身份证号码" @keyup.enter.native="handleFilter" /> -->
      <!-- <el-select class="filter-item" style="width: 130px" v-model="listQuery.is_employed" placeholder="正式员工" @change="handleFilter">
        <el-option v-for="item in employedOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select> -->
      <!-- <el-select v-model="listQuery.native_place" class="filter-item" style="width: 130px" filterable multiple placeholder="籍贯" @change="handleFilter">
        <el-option v-for="item in nativePlaceOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select> -->
      <!-- <el-select v-model="listQuery.nation" class="filter-item" style="width: 130px" placeholder="民族" @change="handleFilter">
        <el-option v-for="item in nationOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select> -->
      <el-select v-model="listQuery.zodiac" class="filter-item" style="width: 130px" placeholder="属相" @change="handleFilter">
        <el-option v-for="item in zodiacOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <br>
      <el-input v-model="listQuery.working_experience" style="width: 455px;" class="filter-item" placeholder="输入工作经验关键字" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.introduce" style="width: 455px;" class="filter-item" placeholder="输入自我介绍关键字" @keyup.enter.native="handleFilter" />
      <br>
      <el-select v-model="listQuery.languages" class="filter-item" style="width: 130px" multiple placeholder="语言" @change="handleFilter">
        <el-option v-for="item in languageOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.credentials" class="filter-item" style="width: 130px" multiple placeholder="资格证书" @change="handleFilter">
        <el-option v-for="item in credentialOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.work_type" class="filter-item" style="width: 130px" multiple placeholder="工作意向" @change="handleFilter">
        <el-option v-for="item in workTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-refresh" @click="handleReset">重置</el-button>
      <router-link style="margin-right:15px;" :to="{ path:'create'}">
        <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-plus">新增服务人员</el-button>
      </router-link>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" element-loading-text="给我一点时间" stripe fit highlight-current-row style="width: 100%">
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
      <el-table-column align="center" prop="name" label="姓名" min-width="80">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="100" label="联系电话">
        <template slot-scope="scope">
          <span>{{ scope.row.contact_phone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="年龄" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.age }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="籍贯" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.native_place | codeToTextFilter}}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="民族" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.nation }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="属相" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.zodiac }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="身份证号码" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.id_card }}</span>
        </template>
      </el-table-column> -->
      <el-table-column class-name="status-col" align="center" label="求职意向" width="150" prop="status">
        <template slot-scope="scope">
          {{scope.row.work_type | arrayToText | ellipsis}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center" label="在职状态" width="80" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusTypeFilter">
            {{ scope.row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="100" class-name="small-padding" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background :current-page.sync="listQuery.page" :page-sizes="[5, 10, 15]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { fetchWorkerList, updateWorker } from '@/api/worker';
import staticOptions from '@/data/options';
import place from '@/data/place';
import nation from '@/data/nation';
import zodiac from '@/data/zodiac';
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
    status: {
      type: String,
      default: 'ALL'
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
        working_experience: undefined,
        introduce: undefined
      },
      statusOptions: [
        {
          value: 'ALL',
          label: '所有状态'
        },
        {
          value: 0,
          label: '待岗'
        },
        {
          value: 1,
          label: '在岗'
        },
        {
          value: 2,
          label: '离职'
        },
        {
          value: 3,
          label: '黑名单'
        }
      ],
      employedOptions: [
        {
          value: 'ALL',
          label: '所有'
        },
        {
          value: true,
          label: '是'
        },
        {
          value: false,
          label: '否'
        }
      ],
      languageOptions: [
        {
          value: '普通话',
          lable: '普通话'
        },
        {
          value: '广东话',
          lable: '广东话'
        },
        {
          value: '客家话',
          lable: '客家话'
        },
        {
          value: '潮州话',
          lable: '潮州话'
        }
      ],
      credentialOptions: [
        {
          value: '月嫂证',
          lable: '月嫂证'
        },
        {
          value: '育婴师证',
          lable: '育婴师证'
        },
        {
          value: '护理证',
          lable: '护理证'
        },
        {
          value: '等级上岗证',
          lable: '等级上岗证'
        },
        {
          value: '其他证',
          lable: '其他证'
        }
      ],
      workTypeOptions: [
        {
          value: '钟点工',
          lable: '钟点工'
        },
        {
          value: '日常保洁',
          lable: '日常保洁'
        },
        {
          value: '做饭阿姨',
          lable: '做饭阿姨'
        },
        {
          value: '住家保姆',
          lable: '住家保姆'
        },
        {
          value: '不住家保姆',
          lable: '不住家保姆'
        },
        {
          value: '专业月嫂',
          lable: '专业月嫂'
        },
        {
          value: '育婴师',
          lable: '育婴师'
        },
        {
          value: '养老服务',
          lable: '养老服务'
        },
        {
          value: '专项保洁',
          lable: '专项保洁'
        }
      ],
      nativePlaceOptions: place,
      nationOptions: nation,
      zodiacOptions: zodiac
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
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
  border-radius: 10px;
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
