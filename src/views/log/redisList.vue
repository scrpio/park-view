<template>
  <el-row class="wrap">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>日志管理</el-breadcrumb-item>
        <el-breadcrumb-item>Redis日志</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" v-loading="loading" element-loading-text="拼命加载中" class="warp-main">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 22px;">
        <el-button v-has="'admin:user:clearLogs'" type="danger" icon="el-icon-delete" @click="batchDelete">清空日志</el-button>
      </el-col>

      <!--列表-->
      <el-table :data="logs" highlight-current-row border stripe size="mini" style="width: 100%;">
        <el-table-column prop="id" label="ID" width="80" align="center" sortable/>
        <el-table-column prop="executeTime" label="日期" sortable/>
        <el-table-column prop="usedTime" label="用时" sortable/>
        <el-table-column prop="args" label="参数"/>
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
import API from '@/api/api_sys'
import { timeFormat } from '@/utils'

export default {
  data() {
    return {
      loading: false,
      logs: [],
      total: 0,
      page: 1,
      limit: 15
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
    // 获取日志列表
    search() {
      var that = this
      var params = {
        page: that.page,
        limit: 15
      }
      that.loading = true
      API.getLogs(params).then(
        function(result) {
          that.loading = false
          if (result.code === 200) {
            console.log(result.data)
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
    // 清除日志
    batchDelete() {
      var that = this
      this.$confirm('确认清空缓存日志吗？', '提示', { type: 'warning' }).then(() => {
        that.loading = true
        API.clearLogs().then(
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
