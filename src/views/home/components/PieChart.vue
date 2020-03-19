<template>
  <el-card :body-style="{ padding: '0px' }">
    <div class="card-header">
      <h6>{{ title }}</h6>
    </div>
    <div class="card-body">
      <div id="pie-chart" style="height:450px;width:100%;"/>
    </div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')

const defaultChartData = {
  datasets: [
    { value: 335, name: '直接访问' },
    { value: 310, name: '邮件营销' },
    { value: 234, name: '联盟广告' },
    { value: 135, name: '视频广告' },
    { value: 1548, name: '搜索引擎' }
  ],
  labels: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
}

export default {
  name: 'pie-chart',
  props: {
    title: {
      type: String,
      default: '访问来源',
    },
  },
  mounted() {
    this.initChart(defaultChartData)
  },
  methods: {
    initChart(chartData) {
      echarts.init(document.getElementById('pie-chart')).setOption({
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          x: 'center',
          data: chartData.labels
        },
        series: [{
          name:'访问来源',
          type: 'pie',
          center: ['50%', '55%'],
          selectedMode: 'single',
          label: {
            normal: {
              show: false
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: chartData.datasets
        }]
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-card {
  max-height: 605px;
  margin-bottom: 10px;
}
.card-header {
  font-size: 15px;
  font-weight: 500;
  padding: 16px;
  border-bottom: 1px solid #e1e5eb;
}
.card-body {
  margin: 16px 10px;
}
</style>
