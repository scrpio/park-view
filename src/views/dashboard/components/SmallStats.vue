<template>
  <el-card :body-style="{ padding: '0px' }">
    <div class="flex-column">
      <div class="stats-small">
        <span class="stats-small-label">{{ label }}</span>
        <h6 class="stats-small-value">{{ value }}</h6>
      </div>
      <div class="stats-small">
        <span :class="increase?'fa fa-sort-asc icon-up':'fa fa-sort-desc icon-down'">{{ percentage }}</span>
      </div>
    </div>
    <canvas ref="canvas" :class="className" :height="computedCanvasHeight"/>
  </el-card>
</template>

<script>
import Chart from '@/utils/chart'

export default {
  name: 'small-stats',
  props: {
    label: {
      type: String,
      default: 'Label'
    },
    value: {
      type: [Number, String],
      default: 0
    },
    percentage: {
      type: [Number, String],
      default: 0
    },
    increase: {
      type: Boolean,
      default: true,
    },
    decrease: {
      type: Boolean,
      default: false,
    },
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
      default: '70px'
    },
    variation: {
      type: String,
      default: null
    },
    chartData: {
      type: Array,
      required: true,
      default() {
        return []
      }
    },
    chartConfig: {
      type: Object
    }
  },
  computed: {
    computedCanvasHeight() {
      if (this.variation === '1') {
        return 120
      }
      return 60
    }
  },
  mounted() {
    const chartOptions = {
      ...{
        maintainAspectRatio: true,
        responsive: true,
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
          custom: false
        },
        elements: {
          point: {
            radius: 0
          },
          line: {
            tension: 0.33
          },
        },
        scales: {
          xAxes: [{
            gridLines: false,
            ticks: {
              display: false
            },
          }],
          yAxes: [{
            gridLines: false,
            scaleLabel: false,
            ticks: {
              display: false,
              isplay: false,
              suggestedMax: Math.max(...this.chartData[0].data) + 1
            }
          }],
        }
      },
      ...this.chartOptions
    }

    const chartConfig = {
      ...{
        type: 'line',
        data: {
          ...{ labels: ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'] },
          ...{ datasets: this.chartData, }
        },
        options: chartOptions
      },
      ...this.chartConfig
    }

    new Chart(this.$refs.canvas, chartConfig)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-card {
  height: 140px;
  position: relative;
  margin-bottom: 10px;
}
.flex-column {
  margin-top: 18px;
  margin-bottom: 18px;
  text-align: center;
}
.stats-small {
  max-width: 100%;
}
.el-card canvas {
  position: absolute;
  bottom: 0px;
}
.stats-small-label {
  font-size: 12px;
  color: #818ea3;
}
.stats-small-value {
  font-size: 33px;
  color: #3d5170;
  margin: auto;
}
.icon-up {
  font-size: 12px;
  color: #17c671;
  letter-spacing:2px;
}
.icon-down {
  font-size: 12px;
  color: #c4183c;
  letter-spacing:2px;
}
</style>
