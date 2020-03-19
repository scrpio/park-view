<template>
  <el-card :body-style="{ padding: '0px' }">
    <div class="card-header">
      <h6>{{ title }}</h6>
    </div>
    <div class="card-body">
      <div id="line-chart" style="height:450px;width:100%;"/>
    </div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')

const defaultChartData = {
  labels: Array.from(new Array(12), (_, i) => (i + 1 + '月')),
  salesData: [650, 960, 1450, 1820, 2800, 2102, 1920, 3920, 3202, 3140, 2800, 3200],
  costData: [380, 430, 120, 230, 410, 740, 472, 219, 391, 301, 780, 1200]
}

export default {
  name: 'line-chart',
  props: {
    title: {
      type: String,
      default: '销售额'
    }
  },
  mounted() {
    this.initChart(defaultChartData)
  },
  methods: {
    initChart(chartData) {
      echarts.init(document.getElementById('line-chart')).setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data:['销售收入', '成本支出']
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: chartData.labels
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [{
          name:'销售收入',
          type:'line',
          smooth: true,
          showSymbol: false,
          itemStyle: {
            normal: {
              color: 'rgb(0, 123, 255)',
              areaStyle: {
                color: 'rgba(0, 123, 255, 0.1)'
              },
              lineStyle: {
                color: 'rgba(0, 123, 255, 1)'
              }
            }
          },
          data: chartData.salesData
        }, {
          name:'成本支出',
          type:'line',
          smooth: true,
          showSymbol: false,
          itemStyle: {
            normal: {
              color: 'rgba(255, 65, 105, 1)',
              areaStyle: {
                color: 'rgba(255, 65, 105, 0.1)'
              },
              lineStyle: {
                type: 'dashed',
                color: 'rgba(255, 65, 105, 1)'
              }
            }
          },
          data: chartData.costData
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

