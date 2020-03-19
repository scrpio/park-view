<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <el-card :body-style="{ padding: '0px' }" shadow="always">
        <div class="card-panel-content">
          <i class="fa fa-user fa-3x card-panel-icon" style="background-color:#2d8cf0;" />
          <div class="card-panel-description">
            <div class="card-panel-text">{{ countMember }}</div>
            <div>会员总数</div>
          </div>
        </div>
      </el-card>
    </el-col>

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <el-card :body-style="{ padding: '0px' }" shadow="always">
        <div class="card-panel-content">
          <i class="fa fa-car fa-3x card-panel-icon" style="background-color:#64d572;" />
          <div class="card-panel-description">
            <div class="card-panel-text">{{ countOrder }}</div>
            <div>车流量</div>
          </div>
        </div>
      </el-card>
    </el-col>

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <el-card :body-style="{ padding: '0px' }" shadow="always">
        <div class="card-panel-content">
          <i class="fa fa-wrench fa-3x card-panel-icon" style="background-color:#f25e43;" />
          <div class="card-panel-description">
            <div class="card-panel-text">{{ countRepair }}</div>
            <div>维修次数</div>
          </div>
        </div>
      </el-card>
    </el-col>

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <el-card :body-style="{ padding: '0px' }" shadow="always">
        <div class="card-panel-content">
          <i class="fa fa-bar-chart fa-3x card-panel-icon" style="background-color: #aa96d5;" />
          <div class="card-panel-description">
            <div class="card-panel-text">{{ countMoney }}</div>
            <div>销售总额</div>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import API from '@/api/api_chart'

export default {
  data() {
    return {
      countMember: '',
      countOrder: '',
      countMoney: '',
      countRepair: ''
    }
  },
  mounted() {
    this.getCount()
  },
  methods: {
    getCount() {
      var that = this
      API.countMember().then(function(result) {
        if (result.code === 200) {
          that.countMember = result.data
        }
      }, function(err) {
        that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
      }).catch(function(error) {
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })

      API.countOrder().then(function(result) {
        if (result.code === 200) {
          that.countOrder = result.data
        }
      }, function(err) {
        that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
      }).catch(function(error) {
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })

      API.countMoney().then(function(result) {
        if (result.code === 200) {
          that.countMoney = result.data
        }
      }, function(err) {
        that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
      }).catch(function(error) {
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
      
      API.countRepair().then(function(result) {
        if (result.code === 200) {
          that.countRepair = result.data
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
.panel-group {
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel-content {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    height: 100px;
  }
  .card-panel-icon {
  display:inline-block;
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
  }
  .card-panel-description {
    -ms-flex: 1;
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
  }
  .card-panel-text {
    font-size: 30px;
    font-weight: 700;
  }
}
</style>
