<template>
  <el-row class="wrap">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>日志管理</el-breadcrumb-item>
        <el-breadcrumb-item>日志列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" v-loading="loading" element-loading-text="拼命加载中" class="warp-main">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 22px;">
        <el-button v-has="'admin:user:batchDelete'" type="danger" icon="el-icon-delete" @click="remove(ids)">批量删除</el-button>
      </el-col>

      <!--列表-->
      <el-table :data="logs" highlight-current-row border stripe size="mini" style="width: 100%;" @selection-change="selsChange">
        <el-table-column type="selection" width="45" align="center"/>
        <el-table-column prop="id" label="ID" width="80" align="center" sortable/>
        <el-table-column prop="logType" label="日志类型" min-width="100" align="center"/>
        <el-table-column prop="operation" label="操作" min-width="100" align="center"/>
        <el-table-column prop="username" label="用户" min-width="100" sortable/>
        <el-table-column prop="method" label="方法" min-width="150"/>
        <!-- <el-table-column prop="params" label="参数" min-width="150"/> -->
        <el-table-column prop="time" label="用时/ms" min-width="90" align="center" sortable/>
        <el-table-column prop="ip" label="IP" min-width="90"/>
        <el-table-column prop="createTime" label="操作时间" min-width="150" align="center" sortable/>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="remove(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination :page-size="10" :total="total" layout="total, prev, pager, next, jumper" style="float:right;" @current-change="handleCurrentChange">
        </el-pagination>
      </el-col>
    </el-col>

  </el-row>
</template>

<script>
import API from '@/api/api_log'

export default {
  data() {
    return {
      loading: false,
      logs: [],
      ids: [], // 列表选中列
      total: 0,
      page: 1,
      limit: 15
    }
  },
  methods: {
    selsChange(sels) {
      this.ids = sels.map(row => row.id).toString()
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
    // 获取日志列表
    search() {
      var that = this
      var params = {
        page: that.page,
        limit: 15
      }
      that.loading = true
      API.findList(params).then(
        function(result) {
          that.loading = false
          if (result.code === 200) {
            that.total = result.data.total
            that.logs = result.data.list
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
    // 删除
    remove(ids) {
      var that = this
      this.$confirm('确认删除该记录吗?', '提示', { type: 'warning' }).then(() => {
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
