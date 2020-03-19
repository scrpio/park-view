<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" v-loading="loading" element-loading-text="拼命加载中" class="warp-main">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.condition"  placeholder="关键词" style="min-width: 240px;" @keyup.enter.native="handleSearch"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-has="'admin:user:add'" type="primary" icon="el-icon-plus" @click="showAddDialog">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-has="'admin:user:batchDelete'" type="danger" icon="el-icon-delete" @click="remove(ids)">批量删除</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="users" highlight-current-row border stripe size="mini" style="width: 100%;" @selection-change="selsChange">
        <el-table-column type="selection" width="45" align="center"/>
        <el-table-column prop="id" label="ID" width="80" align="center" sortable/>
        <el-table-column prop="username" label="用户名" min-width="100" sortable/>
        <el-table-column prop="nickname" v-if="false" label="昵称" min-width="100" sortable/>
        <el-table-column prop="sex" label="性别" :formatter="formatSex" min-width="70" align="center" sortable/>
        <el-table-column prop="phone" label="电话" min-width="120" sortable/>
        <el-table-column prop="email" label="邮箱" min-width="120" sortable/>
        <el-table-column prop="birthday" label="出生日期" min-width="100" sortable/>
        <el-table-column prop="deptId" v-if="false" label="部门" sortable/>
        <el-table-column prop="address" label="住址" min-width="150" sortable/>
        <el-table-column prop="status" label="状态" min-width="80" align="center" sortable>
          <template slot-scope="scope">
            <el-tag :type="scope.row.status==1?'success':scope.row.status==2?'warning':'danger'">
              {{ scope.row.status==1?"正常":scope.row.status==2?"冻结":"删除" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="150" align="center" sortable/>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="remove(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination :page-size="10" :total="total" layout="total, prev, pager, next, jumper" style="float:right;" @current-change="handleCurrentChange"/>
      </el-col>
      <!-- 添加界面 -->
      <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" :rules="editFormRules" ref="addForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="addForm.password"/>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="addForm.nickname"/>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio v-model="addForm.sex" :label="1">男</el-radio>
            <el-radio v-model="addForm.sex" :label="0">女</el-radio>
          </el-form-item>
          <el-form-item label="出生日期" prop="birthday">
            <el-date-picker type="date" placeholder="出生日期" v-model="addForm.birthday"/>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="addForm.phone"/>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input type="email" v-model="addForm.email"/>
          </el-form-item>
          <el-form-item label="部门" prop="deptId">
            <el-select v-model="addForm.deptId">
              <el-option v-for="dept in depts" :label="dept.name" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色" prop="roleIds">
            <el-checkbox-group v-model="roleIds">
              <el-checkbox v-for="role in roles" :label="role.id" :key="role.id" :value="role.id">
                {{ role.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio v-model="addForm.status" :label="1">启用</el-radio>
            <el-radio v-model="addForm.status" :label="2">冻结</el-radio>
            <el-radio v-model="addForm.status" :label="3">删除</el-radio>
          </el-form-item>
          <el-form-item label="住址" prop="address">
            <el-input v-model="addForm.address" :autosize="{ minRows: 2, maxRows: 5}" type="textarea"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>
      <!-- 编辑界面 -->
      <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="editForm.nickname"/>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio v-model="editForm.sex" :label="1">男</el-radio>
            <el-radio v-model="editForm.sex" :label="0">女</el-radio>
          </el-form-item>
          <el-form-item label="出生日期" prop="birthday">
            <el-date-picker type="date" placeholder="出生日期" v-model="editForm.birthday"/>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="editForm.phone"/>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input type="email" v-model="editForm.email"/>
          </el-form-item>
          <el-form-item label="部门" prop="deptId">
            <el-select v-model="editForm.deptId">
              <el-option v-for="dept in depts" :label="dept.name" :key="dept.id" :value="dept.id">{{ dept.name }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色" prop="roleIds">
            <el-checkbox-group v-model="roleIds">
              <el-checkbox v-for="role in roles" :label="role.id" :key="role.id" :value="role.id">{{ role.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio v-model="editForm.status" :label="1">启用</el-radio>
            <el-radio v-model="editForm.status" :label="2">冻结</el-radio>
            <el-radio v-model="editForm.status" :label="3">删除</el-radio>
          </el-form-item>
          <el-form-item label="住址" prop="address">
            <el-input v-model="editForm.address" :autosize="{ minRows: 2, maxRows: 5}" type="textarea"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>

    </el-col>
  </el-row>
</template>

<script>
import API from '@/api/api_user'
import ROLE_API from '@/api/api_role'
import DEPT_API from '@/api/api_dept'

export default {
  data() {
    return {
      filters: {
        condition: ''
      },
      loading: false,
      users: [],
      depts: [],
      roles: [],
      roleIds: [],
      ids: [],
      total: 0,
      page: 1,
      limit: 15,
      // 编辑相关数据
      editFormVisible: false,
      loading: false,
      editFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      editForm: {},
      // 新增相关数据
      addFormVisible: false,
      addLoading: false,
      addForm: {
        username: '',
        password: '',
        nickname: '',
        birthday: '',
        sex: 1,
        status: 1,
        phone: '',
        email: '',
        deptId: '',
        roleIds: []
      }
    }
  },
  methods: {
    // 性别显示转换
    formatSex(row, column) {
      return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知'
    },
    // 状态显示转换
    formatStatus(row, column) {
      return row.status == 1 ? '启用' : row.status == 2 ? '冻结' : '删除'
    },
    handleCurrentChange(val) {
      this.page = val
      this.search()
    },
    handleSearch() {
      this.total = 0
      this.page = 1
      this.search()
    },
    selsChange(sels) {
      this.ids = sels.map(row => row.id).toString()
    },
    // 获取用户列表
    search() {
      var that = this
      var params = {
        page: that.page,
        limit: 15,
        condition: that.filters.condition
      }
      that.loading = true
      API.findList(params).then(
        function(result) {
          that.loading = false
          if (result.code === 200) {
            that.total = result.data.total
            that.users = result.data.list
          }
        },
        function(err) {
          that.loading = false
          that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
        }
      ).catch(function(error) {
        that.loading = false
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    },
    // 新增界面
    showAddDialog() {
      this.addFormVisible = true
    },
    // 编辑界面
    showEditDialog(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
      var that = this
      API.getRoleIds({userId: row.id}).then(function(result) {
        that.roleIds = result
      })
    },
    // 新增提交
    addSubmit() {
      var that = this
      this.$refs.addForm.validate(valid => {
        if (valid) {
          that.loading = true
          var params = Object.assign({}, this.addForm)
          params.roleIds = that.roleIds
          API.add(params).then(
            function(result) {
              if (result.code === 200) {
                that.loading = false
                that.$message.success({ showClose: true, message: '新增成功', duration: 2000 })
                that.$refs['addForm'].resetFields()
                that.addFormVisible = false
                that.search()
              }
          })
        }
      })
    },
    // 编辑提交
    editSubmit() {
      var that = this
      this.$refs.editForm.validate(valid => {
        if (valid) {
          var params = Object.assign({}, that.editForm);
          params.roleIds = that.roleIds
          that.loading = true
          API.edit(params).then(
            function(result) {
              that.loading = false
              if (result.code === 200) {
                that.$message.success({ showClose: true, message: '修改成功', duration: 2000 })
                that.$refs['editForm'].resetFields()
                that.editFormVisible = false
                that.search()
              }
            },
            function(err) {
              that.loading = false
              that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
            }
          ).catch(function(error) {
            that.loading = false
            console.log(error)
            that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
          })
        }
      })
    },
    // 删除
    remove(ids) {
      var that = this
      this.$confirm('确认删除记录吗?', '提示', { type: 'warning' }).then(() => {
        that.loading = true
        API.remove({ ids: ids }).then(
          function(result) {
            that.loading = false
            if (result.code === 200) {
              that.$message.success({ showClose: true, message: '删除成功', duration: 1500 })
              that.search()
            }
          },
          function(err) {
            that.loading = false
            that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
          }
        ).catch(function(error) {
          that.loading = false
          console.log(error)
          that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
        })
      })
    },
    init() {
      var that = this
      DEPT_API.deptList().then(function(result) {
        that.depts = result
      })
      ROLE_API.roleList().then(function(result) {
        that.roles = result
      })
    }
  },
  mounted() {
    this.handleSearch()
    this.init()
  }
}
</script>
