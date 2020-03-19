<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" v-loading="loading" element-loading-text="拼命加载中" class="warp-main">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.condition" placeholder="关键词" @keyup.enter.native="handleSearch"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="showAddDialog">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-has="'admin:role:batchDelete'" type="danger" icon="el-icon-delete" @click="remove(ids)">批量删除</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="roles" highlight-current-row border stripe size="mini" style="width: 100%;" @selection-change="selsChange">
        <el-table-column type="selection" width="45" align="center"/>
        <el-table-column prop="id" label="ID" width="80" align="center" sortable/>
        <el-table-column prop="name" label="角色名" sortable/>
        <el-table-column prop="sort" label="排序" align="center" sortable/>
        <el-table-column prop="tips" label="备注"/>
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

      <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
          <el-form-item label="角色名" prop="name">
            <el-input v-model="editForm.name" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="备注" prop="tips">
            <el-input type="textarea" v-model="editForm.tips" :rows="2"/>
          </el-form-item>
          <el-form-item label="权限">
            <el-tree ref="menuAddTree" :data="menus" show-checkbox node-key="id" :default-checked-keys="menuIds" :props="treeProps"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit">提交</el-button>
        </div>
      </el-dialog>

      <!--新增界面-->
      <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" :rules="editFormRules" ref="addForm">
          <el-form-item label="角色名" prop="name">
            <el-input v-model="addForm.name" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="备注" prop="tips">
            <el-input type="textarea" v-model="addForm.tips" :rows="8"/>
          </el-form-item>
          <el-form-item label="权限">
            <el-tree :data="menus" show-checkbox node-key="id" :props="treeProps"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>

    </el-col>
  </el-row>
</template>
<script>
import API from '@/api/api_role'
import MENU_API from '@/api/api_menu'

export default {
  data() {
    return {
      filters: {
        condition: ''
      },
      roles: [],
      total: 0,
      page: 1,
      limit: 15,
      loading: false,
      ids: [], // 列表选中列
      menus: [],
      menuIds: [], // 角色拥有的权限
      treeProps: {
        children: 'children',
        label: 'text'
      },
      // 编辑相关数据
      editFormVisible: false, // 编辑界面是否显示
      editFormRules: {
        name: [
          { required: true, message: '请输入角色', trigger: 'blur' }
        ]
      },
      editForm: {
        name: '',
        sort: '',
        tips: ''
      },
      // 新增相关数据
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addForm: {
        name: '',
        sort: '',
        tips: ''
      }
    }
  },
  methods: {
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
    // 获取角色列表
    search() {
      var that = this;
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
            that.roles = result.data.list
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
    // 显示编辑界面
    showEditDialog: function(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
      var that = this
      API.getMenuIds({ roleId: row.id }).then(function(res) {
        that.setMenuIds(res)
        that.$nextTick(function() {
          MENU_API.menus().then(function(result) {
            that.menus = result.data
          })
        })
      })
    },
    // 编辑提交
    editSubmit() {
      var that = this
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          var params = Object.assign({}, this.editForm)
          params.menuIds = that.getMenuIds()
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
    // 显示新增界面
    showAddDialog: function () {
      this.addFormVisible = true
    },
    // 新增提交
    addSubmit() {
      var that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          that.loading = true
          var params = Object.assign({}, this.addForm)
          params.menuIds = that.getMenuIds()
          API.add(params).then(
            function(result) {
              that.loading = false
              if (result.code === 200) {
                that.$message.success({ showClose: true, message: '新增成功', duration: 2000 })
                that.$refs['addForm'].resetFields()
                that.addFormVisible = false
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
    // 单个删除
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
    // 获取选中、半选中节点
    getMenuIds() {
      return this.$refs.menuAddTree.getCheckedKeys().concat(this.$refs.menuAddTree.getHalfCheckedKeys())
    },
    // (keys, leafOnly) 接收两个参数，1. 勾选节点的 key 的数组 2. boolean 类型的参数，若为 true 则仅设置叶子节点的选中状态，默认值为 false
    setMenuIds(keys) {
      this.$refs.menuAddTree.setCheckedKeys(keys, true)
    }
  },
  mounted() {
    this.handleSearch()
  }
}
</script>
