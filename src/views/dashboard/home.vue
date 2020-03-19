<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="wrap-main">
      <panel-group/>

      <el-row :gutter="10">
        <el-col :sm="24" :md="14" :lg="14">
          <el-card style="margin-bottom: 20px">
            <bar-chart/>
          </el-card>
        </el-col>
        <el-col :sm="24" :md="10" :lg="10">
          <el-card style="margin-bottom: 20px">
            <pie-chart/>
          </el-card>
        </el-col>
      </el-row>
      
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :lg="24">
          <el-card>
            <div slot="header">
              <el-button type="text" @click="getChartData(0)">本周</el-button>
              <el-button type="text" @click="getChartData(1)">本月</el-button>
              <el-button type="text" @click="getChartData(2)">全年</el-button>
              <el-date-picker v-model="dateRange" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" @change="getChartData(-1)"/>
            </div>
            <line-chart :chart-data="chartData"/>
          </el-card>
        </el-col>
      </el-row>
      
    </el-col>
  </el-row>
</template>

<script>
import API from '@/api/api_chart'
import PanelGroup from './components/PanelGroup'
import BarChart from './components/BarChart'
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import Weather from './components/Weather'
import {
  timeFormat,
  getFirstDayOfWeek,
  getLastDayOfWeek,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  getFirstDayOfYear,
  getLastDayOfYear
} from '@/utils'

export default {
  components: {
    PanelGroup,
    LineChart,
    PieChart,
    Weather,
    BarChart,
  },
  data() {
    return {
      dateRange: [],
      chartData: {}
    }
  },
  mounted() {
    this.getChartData(0)
  },
  methods: {
    getChartData(index) {
      var that = this
      var type, startDate, endDate, params
      if (index === -1) {
        type = 0
        startDate = timeFormat(that.dateRange[0])
        endDate = timeFormat(that.dateRange[1])
      } else if (index === 0) {
        type = 0
        startDate = getFirstDayOfWeek()
        endDate = getLastDayOfWeek()
      } else if (index === 1) {
        type = 0
        startDate = getFirstDayOfMonth()
        endDate = getLastDayOfMonth()
      } else if (index === 2) {
        type = 1
        startDate = getFirstDayOfYear()
        endDate = getLastDayOfYear()
      }
      params = {
        type: type,
        year: new Date().getFullYear(),
        startTime: startDate,
        endTime: endDate
      }
      API.chartOrder(params).then(function(result) {
        if (result.success) {
          that.chartData = result.data
        } else {
          that.$message.error({ showClose: true, message: result.message, duration: 2000 })
        }
      }, function(err) {
        that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
      }).catch(function(error) {
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
