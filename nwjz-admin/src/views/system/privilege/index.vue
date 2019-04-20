<template>
  <div class="app-container">
    <el-button type="primary" icon="el-icon-plus" @click="handleAddRole">
      {{ $t('permission.addRole') }}
    </el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" stripe>
      <el-table-column align="center" type="index" width="50" />
      <el-table-column align="center" :label="$t('permission.key')" width="220">
        <template slot-scope="scope">
          {{ scope.row.key }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('permission.name')" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" :label="$t('permission.description')">
        <template slot-scope="scope">
          {{ scope.row.description | ellipsis }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('common.operations')">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope)">
            {{ $t('common.edit') }}
          </el-button>
          <el-button type="danger" icon="el-icon-delete" @click="handleDelete(scope)">
            {{ $t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?$t('permission.editRole'):$t('permission.addRole')">
      <el-form ref="postForm" :model="role" label-width="80px" label-position="right" :rules="rules">
        <el-form-item :label="$t('permission.key')" prop="key">
          <el-input v-model="role.key" :placeholder="$t('permission.key')" />
        </el-form-item>
        <el-form-item :label="$t('permission.name')" prop="name">
          <el-input v-model="role.name" :placeholder="$t('permission.name')" />
        </el-form-item>
        <el-form-item :label="$t('permission.description')">
          <el-input v-model="role.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" :placeholder="$t('permission.description')" />
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree ref="tree" :check-strictly="checkStrictly" :data="routesData" :props="defaultProps" show-checkbox node-key="path" class="permission-tree" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmRole">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path';
import { deepClone } from '@/utils';
import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/role';
import i18n from '@/lang';

const defaultRole = {
    key: '',
    name: '',
    description: '',
    routes: []
};

export default {
    name: 'SystemPrivilege',
    data() {
        return {
            role: Object.assign({}, defaultRole),
            routes: [],
            rolesList: [],
            dialogVisible: false,
            dialogType: 'new',
            checkStrictly: false,
            defaultProps: {
                children: 'children',
                label: 'title'
            },
            rules: {
                key: [
                    {
                        required: true,
                        message: '请输入角色Key',
                        trigger: 'blur'
                    }
                ],
                name: [
                    {
                        required: true,
                        message: '请输入角色名称',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    computed: {
        routesData() {
            return this.routes;
        }
    },
    created() {
    // Mock: get all routes and roles list from server
        this.getRoutes();
        this.getRoles();
    },
    methods: {
        async getRoutes() {
            const res = await getRoutes();
            this.serviceRoutes = res.data.data.menus;
            //   console.log('this.serviceRoutes = ', this.serviceRoutes);
            const routes = this.generateRoutes(res.data.data.menus);
            //   console.log('routes = ', routes);
            this.routes = this.i18n(routes);
        },
        async getRoles() {
            const res = await getRoles();
            this.rolesList = res.data.data.roles;
        },
        i18n(routes) {
            const app = routes.map(route => {
                route.title = i18n.t(`route.${route.title}`);
                if (route.children) {
                    route.children = this.i18n(route.children);
                }
                return route;
            });
            return app;
        },
        // Reshape the routes structure so that it looks the same as the sidebar
        generateRoutes(routes, basePath = '/') {
            const res = [];

            for (let route of routes) {
                // skip some route
                if (route.hidden) {
                    continue;
                }

                const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route);

                if (route.children && onlyOneShowingChild && !route.alwaysShow) {
                    route = onlyOneShowingChild;
                }

                const data = {
                    path: path.resolve(basePath, route.path),
                    title: route.meta && route.meta.title
                };

                // recursive child routes
                if (route.children) {
                    data.children = this.generateRoutes(route.children, data.path);
                }
                res.push(data);
            }
            return res;
        },
        generateArr(routes) {
            let data = [];
            routes.forEach(route => {
                data.push(route);
                if (route.children) {
                    const temp = this.generateArr(route.children);
                    if (temp.length > 0) {
                        data = [...data, ...temp];
                    }
                }
            });
            return data;
        },
        handleAddRole() {
            this.role = Object.assign({}, defaultRole);
            if (this.$refs.tree) {
                this.$refs.tree.setCheckedNodes([]);
            }
            this.dialogType = 'new';
            this.dialogVisible = true;
        },
        handleEdit(scope) {
            this.dialogType = 'edit';
            this.dialogVisible = true;
            this.checkStrictly = true;
            this.role = deepClone(scope.row);
            this.$nextTick(() => {
                const routes = this.generateRoutes(this.role.routes);
                this.$refs.tree.setCheckedNodes(this.generateArr(routes));
                // set checked state of a node not affects its father and child nodes
                this.checkStrictly = false;
            });
        },
        handleDelete({ $index, row }) {
            this.$confirm('确定要删除这个角色', this.$t('common.warning'), {
                confirmButtonText: this.$t('common.confirm'),
                cancelButtonText: this.$t('common.cancel'),
                type: 'warning'
            })
                .then(async() => {
                    await deleteRole(row._id);
                    this.rolesList.splice($index, 1);
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                })
                .catch(err => {
                    console.error(err);
                });
        },
        generateTree(role, routes, basePath = '/', checkedKeys) {
            const res = [];
            console.log('generateTree = routes = ', routes);
            for (const route of routes) {
                const routePath = path.resolve(basePath, route.path);

                // recursive child routes
                if (route.children) {
                    route.children = this.generateTree(role, route.children, routePath, checkedKeys);
                }

                if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
                    route.meta.roles = [role.key];
                    res.push(route);
                }
            }
            return res;
        },
        async confirmRole() {
            this.$refs['postForm'].validate(valid => {
                if (valid) {
                    //
                }
            });
            const isEdit = this.dialogType === 'edit';

            const checkedKeys = this.$refs.tree.getCheckedKeys();
            this.role.routes = this.generateTree(
                this.role,
                deepClone(this.serviceRoutes),
                '/',
                checkedKeys
            );

            if (isEdit) {
                await updateRole(this.role._id, this.role);
                for (let index = 0; index < this.rolesList.length; index++) {
                    if (this.rolesList[index]._id === this.role._id) {
                        this.rolesList.splice(index, 1, Object.assign({}, this.role));
                        break;
                    }
                }
            } else {
                const { data } = await addRole(this.role);
                this.role = data.data.role;
                this.rolesList.push(this.role);
            }

            const { description, key, name } = this.role;
            this.dialogVisible = false;
            this.$notify({
                title: 'Success',
                dangerouslyUseHTMLString: true,
                message: `
            <div align='left'>${this.$t('permission.key')}: ${key}</div>
            <div align='left'>${this.$t('permission.name')}: ${name}</div>
            <div align='left'>${this.$t('permission.description')}: ${description}</div>
          `,
                type: 'success'
            });
        },
        // reference: src/view/layout/components/Sidebar/SidebarItem.vue
        onlyOneShowingChild(children = [], parent) {
            let onlyOneChild = null;
            const showingChildren = children.filter(item => !item.hidden);

            // When there is only one child route, the child route is displayed by default
            if (showingChildren.length === 1) {
                onlyOneChild = showingChildren[0];
                onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path);
                return onlyOneChild;
            }

            // Show parent if there are no child route to display
            if (showingChildren.length === 0) {
                onlyOneChild = { ...parent, path: '', noShowingChildren: true };
                return onlyOneChild;
            }

            return false;
        }
    }
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
