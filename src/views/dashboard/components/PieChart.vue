<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')
import API from '@/api/api_chart'
import {
  debounce,
  getFirstDayOfWeek,
  getLastDayOfWeek
} from '@/utils'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.getChartData()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getChartData() {
      var that = this
      API.getRepairPie().then(function(result) {
        if (result.success) {
          var legendData = result.data.legendData
          var seriesData = result.data.seriesData
          that.initChart(legendData, seriesData)
        }
      }, function(err) {
        that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
      }).catch(function(error) {
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    },
    initChart(legendData, seriesData) {
      var selected = {}
      for (var i = 0; i < legendData.length; i++) {
        var name = legendData[i]
        for (var j = 0; j < seriesData.length; j++) {
          if (seriesData[j].name === name) {
            selected[name] = true
            break
          } else {
            selected[name] = false
          }
        }
      }
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        title: {
          text: '故障率'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: '2%',
          top: '15%',
          bottom: '5%',
          data: legendData,
          selected: selected
        },
        series: [{
          name: '百分比',
          type: 'pie',
          radius: ['35%', '70%'],
          center: ['30%', '60%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '12',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: seriesData
        }]
      })
    }
  }
}
</script>
