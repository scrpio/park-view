<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>会员管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员列表</el-breadcrumb-item>
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
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="order" highlight-current-row border stripe size="mini" style="width: 100%;">
        <el-table-column prop="id" label="ID" width="80" align="center" sortable/>
        <el-table-column prop="orderId" label="订单编号" width="120" align="center" sortable/>
        <el-table-column prop="openId" label="会员Id" min-width="120" sortable/>
        <el-table-column prop="nickname" label="昵称" min-width="100" sortable/>
        <el-table-column prop="license" label="车牌号" min-width="100" sortable/>
        <el-table-column prop="garageName" label="车库名称" min-width="120" sortable/>
        <el-table-column prop="carId" label="车位编号" min-width="100" sortable/>
        <el-table-column prop="price" label="单价" min-width="150"/>
        <el-table-column prop="amount" label="合计" min-width="120"/>
        <el-table-column prop="payType" label="付款方式" :formatter="formatType" min-width="90"/>
        <el-table-column prop="startTime" label="停车时间" min-width="150" align="center" sortable/>
        <el-table-column prop="endTime" label="取车时间" min-width="150" align="center" sortable/>
        <el-table-column prop="remark" label="备注" sortable/>
        <el-table-column prop="status" label="交易状态" :formatter="formatStatus" min-width="80" align="center" sortable/>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button :type="scope.row.status?'success':'danger'" :icon="scope.row.status?'el-icon-check':'el-icon-close'" size="mini" circle title="修改状态" @click="updateState(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination :page-size="10" :total="total" layout="total, prev, pager, next, jumper" style="float:right;" @current-change="handleCurrentChange"/>
      </el-col>

    </el-col>
  </el-row>
</template>

<script>
import API from '@/api/api_order'

export default {
  data() {
    return {
      filters: {
        condition: ''
      },
      loading: false,
      order: [],
      total: 0,
      page: 1,
      limit: 15,
      loading: false
    }
  },
  methods: {
    formatType(row, column) {
      return row.sex == 0 ? '微信' : '钱包'
    },
    // 状态显示转换
    formatStatus(row, column) {
      return row.status == 0 ? '未付款' : row.status == 1 ? '已付款' : '交易关闭'
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
    // 获取会员列表
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
            that.order = result.data.list
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
    updateState: function(row) {
      var that = this
      var params = {
        id: row.id,
        status: row.status?0:1
      }
      this.$confirm('确认修改订单号为' + row.id + '的交易状态吗？', '提示', { type: 'warning' }).then(() => {
        that.loading = true
        API.changeState(params).then(function(result) {
          that.loading = false
          if (result.success) {
            that.$message.success({ showClose: true, message: '状态修改成功', duration: 1500 })
            that.search()
          } else {
            that.$message.error({ showClose: true, message: '状态修改失败', duration: 2000 })
          }
        }, function(err) {
          that.loading = false
          that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
        }).catch(function(error) {
          that.loading = false
          console.log(error)
          that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
        })
      }).catch(() => {})
    }
  },
  mounted() {
    this.handleSearch()
  }
}
</script>
