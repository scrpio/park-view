<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>车库管理</el-breadcrumb-item>
        <el-breadcrumb-item>车库列表</el-breadcrumb-item>
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
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-has="'admin:garage:add'" type="primary" @click="showAddDialog">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-has="'admin:garage:batchDelete'" type="danger" icon="el-icon-delete" @click="remove(ids)">批量删除</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="garage" highlight-current-row border stripe size="mini" style="width: 100%;" @selection-change="selsChange">
        <el-table-column type="selection" width="45" align="center"/>
        <el-table-column prop="id" label="ID" width="80" align="center" sortable/>
        <el-table-column prop="name" label="车库名称" min-width="150" sortable/>
        <el-table-column prop="telephone" label="联系电话" min-width="90" align="center"/>
        <el-table-column prop="manager" label="负责人" align="center"/>
        <el-table-column prop="latitude" label="纬度" min-width="90" align="center"/>
        <el-table-column prop="longitude" label="经度" min-width="90" align="center"/>
        <el-table-column prop="address" label="地址" min-width="200"/>
        <el-table-column prop="sum" label="车位数" min-width="80" align="center"/>
        <el-table-column prop="rows" label="行" min-width="80" align="center"/>
        <el-table-column prop="cols" label="列" min-width="80" align="center"/>
        <el-table-column prop="price" label="单价(元/小时)" min-width="80" align="center"/>
        <el-table-column prop="createTime" label="创建时间" min-width="120" align="center" sortable/>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="remove(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination :page-size="10" :total="total" layout="total, prev, pager, next, jumper" style="float:right;" @current-change="handleCurrentChange">
        </el-pagination>
      </el-col>

      <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
          <el-form-item label="车库名称" prop="name">
            <el-input v-model="editForm.name" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="联系电话" prop="telephone">
            <el-input v-model="editForm.telephone" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="负责人" prop="manager">
            <el-input v-model="editForm.manager" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="纬度" prop="latitude">
            <el-input v-model="editForm.latitude" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="经度" prop="longitude">
            <el-input v-model="editForm.longitude" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="editForm.address" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="车位数" prop="sum">
            <el-input v-model="editForm.sum" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="行" prop="rows">
            <el-input v-model="editForm.rows" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="列" prop="cols">
            <el-input v-model="editForm.cols" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="车位单价" prop="price">
            <el-input v-model="editForm.price" auto-complete="off"/>
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
          <el-form-item label="车库名称" prop="name">
            <el-input v-model="addForm.name" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="联系电话" prop="telephone">
            <el-input v-model="addForm.telephone" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="负责人" prop="manager">
            <el-input v-model="addForm.manager" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="纬度" prop="latitude">
            <el-input v-model="addForm.latitude" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="经度" prop="longitude">
            <el-input v-model="addForm.longitude" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="addForm.address" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="车位数" prop="sum">
            <el-input v-model="addForm.sum" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="行" prop="rows">
            <el-input v-model="addForm.rows" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="列" prop="cols">
            <el-input v-model="addForm.cols" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="车位单价" prop="price">
            <el-input v-model="addForm.price" auto-complete="off"/>
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
import API from '@/api/api_garage'

export default {
  data() {
    return {
      filters: {
        condition: ''
      },
      garage: [],
      ids: [],
      total: 0,
      page: 1,
      limit: 15,
      loading: false,
      // 编辑相关数据
      editFormVisible: false,
      editFormRules: {
        name: [
          { required: true, message: '请输入车库名称', trigger: 'blur' }
        ]
      },
      editForm: {
        name: '',
        telephone: '',
        manager: '',
        latitude: '',
        longitude: '',
        address: '',
        sum: '',
        price: ''
      },
      // 新增相关数据
      addFormVisible: false,
      addLoading: false,
      addForm: {
        name: '',
        telephone: '',
        manager: '',
        latitude: '',
        longitude: '',
        address: '',
        sum: '',
        price: ''
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
    // 获取车库列表
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
            that.garage = result.data.list
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
    showEditDialog(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    // 编辑提交
    editSubmit() {
      var that = this
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.loading = true
          var params = Object.assign({}, this.editForm)
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
    // 显示新增页面
    showAddDialog() {
      this.addFormVisible = true
    },
    // 新增提交
    addSubmit() {
      var that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          that.loading = true
          var params = Object.assign({}, this.addForm)
          API.add(params).then(
            function(result) {
              that.loading = false
              if (result.code === 200) {
                that.$message.success({ showClose: true, message: '添加成功', duration: 2000 })
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
    }
  },
  mounted() {
    this.handleSearch()
  }
}
</script>
