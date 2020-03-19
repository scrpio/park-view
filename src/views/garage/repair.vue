<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>车库管理</el-breadcrumb-item>
        <el-breadcrumb-item>维修记录</el-breadcrumb-item>
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
            <el-button v-has="'admin:repair:add'" type="primary" @click="showAddDialog">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-has="'admin:repair:batchDelete'" type="danger" icon="el-icon-delete" @click="remove(ids)">批量删除</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="repair" highlight-current-row border stripe size="mini" style="width: 100%;" @selection-change="selsChange">
        <el-table-column type="selection" width="45" align="center"/>
        <el-table-column prop="id" label="ID" width="80" align="center" sortable/>
        <el-table-column prop="garageName" label="车库名称" align="center"/>
        <el-table-column prop="type" label="故障类型" align="center"/>
        <el-table-column prop="name" label="故障名称" align="center"/>
        <el-table-column prop="errorTime" label="故障时间" align="center" sortable/>
        <el-table-column prop="repairer" label="维修员" align="center"/>
        <el-table-column prop="phone" label="维修员手机号" align="center"/>
        <el-table-column prop="status" label="状态" align="center"/>
        <el-table-column prop="remark" label="备注"/>
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
          <el-form-item label="车库名称" prop="garageId">
            <el-select v-model="editForm.garageId" filterable>
              <el-option
                v-for="item in garageList"
                :key="item.id"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="故障类型" prop="type">
            <el-select v-model="editForm.type">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="故障名称" prop="name">
            <el-input v-model="editForm.name" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="故障状态" prop="status">
            <el-select v-model="editForm.status">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="故障时间" prop="errorTime">
            <el-date-picker v-model="editForm.errorTime" type="datetime"/>
          </el-form-item>
          <el-form-item label="维修员" prop="repairer">
            <el-input v-model="editForm.repairer" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="维修员手机号" prop="phone">
            <el-input v-model="editForm.phone" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="editForm.remark" :rows="2"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit">提交</el-button>
        </div>
      </el-dialog>

      <!--新增界面-->
      <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="100px" :rules="editFormRules" ref="addForm">
          <el-form-item label="车库名称" prop="garageId">
            <el-select v-model="addForm.garageId" filterable>
              <el-option
                v-for="item in garageList"
                :key="item.id"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="故障类型" prop="type">
            <el-select v-model="addForm.type">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="故障名称" prop="name">
            <el-input v-model="addForm.name" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="故障状态" prop="status">
            <el-select v-model="addForm.status">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="故障时间" prop="errorTime">
            <el-date-picker v-model="addForm.errorTime" type="datetime"/>
          </el-form-item>
          <el-form-item label="维修员" prop="repairer">
            <el-input v-model="addForm.repairer" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="维修员手机号" prop="phone">
            <el-input v-model="addForm.phone" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="addForm.remark" :rows="2"/>
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
import { timeFormat } from '@/utils'

export default {
  data() {
    return {
      filters: {
        condition: ''
      },
      typeList: [{
        value: '0',
        label: '机械故障'
      }, {
        value: '1',
        label: '电气故障'
      }],
      statusList: [{
        value: '0',
        label: '待处理'
      }, {
        value: '1',
        label: '已报修'
      }, {
        value: '2',
        label: '维修中'
      }, {
        value: '3',
        label: '恢复运行'
      }],
      repair: [],
      ids: [],
      garageList: [],
      total: 0,
      page: 1,
      limit: 15,
      loading: false,
      // 编辑相关数据
      editFormVisible: false,
      editFormRules: {
        name: [
          { required: true, message: '请输入故障名称', trigger: 'blur' }
        ]
      },
      editForm: {
        garageName: '',
        type: '',
        name: '',
        status: '',
        errorTime: '',
        repairer: '',
        phone: '',
        remark: ''
      },
      // 新增相关数据
      addFormVisible: false,
      addLoading: false,
      addForm: {
        garageName: '',
        type: '',
        name: '',
        status: '',
        errorTime: '',
        repairer: '',
        phone: '',
        remark: ''
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
    // 获取部门列表
    search() {
      var that = this
      var params = {
        page: that.page,
        limit: 15,
        condition: that.filters.condition
      }
      that.loading = true
      API.repairList(params).then(
        function(result) {
          that.loading = false
          if (result.code === 200) {
            that.total = result.data.total
            that.repair = result.data.list
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
          that.editForm.errorTime = timeFormat(this.editForm.errorTime)
          var params = Object.assign({}, this.editForm)
          API.editRepair(params).then(
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
          that.addForm.errorTime = timeFormat(this.addForm.errorTime)
          var params = Object.assign({}, this.addForm)
          API.addRepair(params).then(
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
        API.removeRepair({ ids: ids }).then(
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
    getGarage() {
      var that = this
      API.getGarageList().then(
        function(result) {
          if (result.code === 200) {
            that.garageList = result.data
          }
        },
        function(err) {
          that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
        }
      ).catch(function(error) {
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    }
  },
  mounted() {
    this.handleSearch()
    this.getGarage()
  }
}
</script>
