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
      <el-table :data="member" highlight-current-row border stripe size="mini" style="width: 100%;">
        <el-table-column prop="id" label="ID" width="80" align="center" sortable/>
        <el-table-column prop="openId" label="openId" width="230" align="center" sortable/>
        <el-table-column prop="nickName" label="昵称" min-width="90" align="center"/>
        <el-table-column prop="license" label="车牌号" min-width="90" align="center"/>
        <el-table-column prop="gender" label="性别" :formatter="formatSex" min-width="70" align="center"/>
        <el-table-column prop="phone" label="电话" min-width="120" align="center"/>
        <el-table-column prop="birthday" label="出生日期" min-width="100" align="center"/>
        <el-table-column prop="province" label="省份" min-width="90"/>
        <el-table-column prop="city" label="城市" min-width="90"/>
        <el-table-column prop="level" label="会员等级" v-if="false"/>
        <el-table-column prop="points" label="积分" align="center"/>
        <el-table-column prop="balance" label="余额" align="center"/>
        <el-table-column prop="status" label="状态" min-width="80" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status==1?'success':'danger'">
              {{ scope.row.status==1?"正常":"冻结" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" min-width="150" align="center" sortable/>
        <el-table-column prop="lastLoginTime" label="最后登录时间" min-width="150" align="center" sortable/>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="updateState(scope.row)" >修改状态</el-button>
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
import API from '@/api/api_member'

export default {
  data() {
    return {
      filters: {
        condition: ''
      },
      loading: false,
      member: [],
      total: 0,
      page: 1,
      limit: 15,
      loading: false
    }
  },
  methods: {
    // 性别显示转换
    formatSex(row, column) {
      return row.gender == 1 ? '男' : row.gender == 2 ? '女' : '未知'
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
            that.member = result.data.list
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
      var params = Object.assign({}, row)
      params.status = row.status?0:1
      this.$confirm('确认修改ID为' + row.id + '的会员状态吗？', '提示', { type: 'warning' }).then(() => {
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
