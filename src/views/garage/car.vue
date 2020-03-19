<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>车库管理</el-breadcrumb-item>
        <el-breadcrumb-item>车位管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" v-loading="loading" element-loading-text="拼命加载中" class="warp-main">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 22px;">
        <el-select v-model="condition" filterable placeholder="请选择车库">
          <el-option
            v-for="item in garageList"
            :key="item.id"
            :label="item.value"
            :value="item.value">
          </el-option>
        </el-select>
        <!-- <el-autocomplete v-model="condition" :fetch-suggestions="querySearchAsync" placeholder="请输入车库名称/ID" @keyup.enter.native="handleSearch"/> -->
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-switch v-model="show" style="float:right;" active-text="平面展示" inactive-text="列表显示" @change="handleSearch"/>
      </el-col>

      <div v-show="show">
        <table style="width: 100%">
          <thead>
            <tr>
              <th :colspan="cols" class="table-top">车位总数：{{sum}}，空闲车位数：{{leisure}}</th>
            </tr>
          </thead>
          <tbody>
            <span v-if="carView===null">暂无数据</span>
            <tr v-else v-for="(item,index) in carView" :key="index">
              <td v-for="car in item" :key="car.id">
                <i v-if="car.status" class="fa fa-car" style="font-size: 45px;vertical-align: bottom" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!--列表-->
      <div v-show="!show">
        <el-table :data="carList" highlight-current-row border stripe size="mini" style="width: 100%">
          <el-table-column align="center" label="ID" width="80">
            <template slot-scope="{row}">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="车库ID" width="150">
            <template slot-scope="{row}">
              <span>{{ row.garageId }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="车库名称">
            <template slot-scope="{row}">
              <span>{{ row.garageName }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="车位编号" width="150">
            <template slot-scope="{row}">
              <span v-if="row.edit">{{ row.carId }}</span>
              <template v-if="!row.edit">
                <el-input v-model="row.carId" class="edit-input" size="small" />
              </template>
            </template>
          </el-table-column>
          <el-table-column align="center" class-name="status-col" label="状态" width="150">
            <template slot-scope="{row}">
              <el-tag v-if="row.edit" :type="row.status | statusFilter">
                {{ row.status? "使用" : "空闲" }}
              </el-tag>
              <template v-if="!row.edit">
                <el-switch v-model="row.status" active-text="使用" inactive-text="空闲"/>
              </template>
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="150">
            <template slot-scope="{row}">
              <el-button
                v-if="row.edit"
                type="primary"
                size="mini"
                @click="row.edit=!row.edit"
              >
                编辑
              </el-button>
              <div v-if="!row.edit">
                <el-button
                  type="success"
                  size="mini"
                  @click="confirmEdit(row)"
                >
                  确认
                </el-button>
                <el-button
                  class="cancel-btn"
                  type="warning"
                  size="mini"
                  @click="cancelEdit(row)"
                >
                  取消
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-pagination :page-size="10" :total="total" layout="total, prev, pager, next, jumper" style="float:right;" @current-change="handleCurrentChange">
          </el-pagination>
        </el-col>
      </div>

    </el-col>
  </el-row>
</template>
<script>
import API from '@/api/api_garage'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        false: 'success',
        true: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      condition: '智汇Park立体停车库',
      garageList: [],
      carList: [],
      carView: [],
      leisure: 0,
      cols: 0,
      sum: 0,
      total: 0,
      page: 1,
      limit: 15,
      show: false,
      loading: false
    }
  },
  methods: {
    querySearchAsync(queryString, cb) {
      var restaurants = this.garageList;
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return (condition) => {
        return (condition.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    cancelEdit(row) {
      row.carId = row.originalCarId
      row.status = row.originalStatus
      row.edit = !row.edit
    },
    confirmEdit(row) {
      var that = this
      row.edit = false
      row.originalCarId = row.carId
      row.originalStatus = row.status
      var params = Object.assign({}, row)
      that.loading = true
      API.editCar(params).then(
        function(result) {
          that.loading = false
          if (result.code === 200) {
            that.$message.success({ showClose: true, message: '修改成功', duration: 2000 })
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
    // 获取车库列表
    search() {
      var that = this
      if (that.show) {
        that.loading = true
        API.findCarView({condition: that.condition}).then(
          function(result) {
            if (result.code === 200) {
              that.loading = false
              that.carView = result.data.list
              that.cols = result.data.cols
              that.sum = result.data.sum
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
      }else {
        var params = {
          page: that.page,
          limit: 15,
          condition: that.condition
        }
        that.loading = true
        API.findCarList(params).then(
          function(result) {
            if (result.code === 200) {
              that.loading = false
              that.total = result.data.total
              that.leisure = result.data.leisure

              const items = result.data.list
              that.carList = items.map(v => {
                that.$set(v, 'edit', true)
                v.originalCarId = v.carId
                v.originalStatus = v.status
                return v
              })
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
      }
    },
    getGarage() {
      var that = this
      API.getGarageList().then(
        function(result) {
          if (result.code === 200) {
            that.garageList = result.data
          }
        },
        function(err) {
          that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
        }
      ).catch(function(error) {
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    }
  },
  mounted() {
    this.handleSearch()
    this.getGarage()
  }
}
</script>

<style scoped>
table {
  border: 2px solid #ccc;
}
.table-top{
  font-size: 18px;
  padding: auto;
  text-align: center;
  line-height: 60px;
  border: 2px solid #ccc;
}
tbody tr td{
  width: 80px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 2px solid #ccc;
}
</style>
