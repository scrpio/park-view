<template>
  <el-card :body-style="{ padding: '0px' }">
    <div class="card-body">
      <div class="inner-bg">
        <div class="grid">
          <p class="temperature">{{ weather.temperature }}</p>
          <span class="city">{{ selectedCity[1] }}</span>
          <el-cascader expand-trigger="hover" :options="citys" v-model="selectedCity" size="mini" @change="handleChange" />
          <p>{{ weather.weather }}<span>{{ weather.wind }}</span></p>
          <p>{{ weather.airCondition }}</p>
        </div>
        <div class="clear"> </div>
      </div>
      <div class="bottom">
        <div class="nbs-flexisel-container">
          <div class="nbs-flexisel-inner">
            <ul id="flexiselWeather" class="nbs-flexisel-ul">
              <li v-for="item in future" class="nbs-flexisel-item">
                <div class="biseller-column">
                  <p>{{ item.week }}</p>
                  <img src="./images/thunderstorm.png"/>
                  <!-- <img src="./images/thunderstorm.png" v-if="thunderstorm(item.dayTime)"/>
                  <img src="./images/rain.png" v-if="rain(item.dayTime)"/>
                  <img src="./images/cloudy.png" v-if="cloudy(item.dayTime)"/>
                  <img src="./images/sunny.png" v-if="sunny(item.dayTime)"/>
                  <img src="./images/mostly_sunny.png" v-if="mostlySunny(item.dayTime)"/>
                  <img src="./images/sunny_rain.png" v-if="sunnyRain(item.dayTime)"/> -->
                  <p>{{ item.temperature }}</p>
                </div>
              </li>
            </ul>
            <div class="nbs-flexisel-nav-left"><i class="el-icon-arrow-right"></i></div>
            <div class="nbs-flexisel-nav-right"><i class="el-icon-arrow-left"></i></div>
          </div>
        </div>
        <div class="clear"> </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import API from '@/api/api_user'

export default {
  name: 'weather',
  props: {
    title: {
      type: String,
      default: '天气预报'
    }
  },
  data() {
    return {
      weather: {},
      future: [],
      citys: [],
      selectedCity: []
    }
  },
  methods: {
    rain(value) {
      return (value == '暴雨'||value == '中雨'||value == '小雨')
    },
    thunderstorm(value) {
      return (value == '雷阵雨'||value == '零散雷雨'||value == '雷雨')
    },
    cloudy(value) {
      return (value == '阴')
    },
    sunny(value) {
      return (value == '晴')
    },
    mostlySunny(value) {
      return (value == '多云')
    },
    sunnyRain(value) {
      return (value == '阵雨')
    },
    handleChange(value) {
      var that = this
      var param = {
        city: value[1],
        province: value[0]
      }
      API.getWeatherByCity(param).then(
        function(response) {
          if (response.success) {
            that.weather = response.data.result[0]
            that.weather.airCondition = '空气' + response.data.result[0].airCondition
            that.future = response.data.result[0].future
            that.selectedCity.push(response.data.result[0].province)
            that.selectedCity.push(response.data.result[0].city)
          }
        },
        function(err) {
          that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
        }
      ).catch(function(error) {
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    },
    getCitys() {
      var that = this
      API.getCitys().then(
        function(response) {
          if (response.success) {
            var options = response.data.result
            for (var i = 0; i < options.length; i++) {
              var temp = {
                vaule: '',
                label: '',
                children: []
              }
              temp.value = options[i].province
              temp.label = options[i].province
              var len = options[i].city.length
              for (var j = 0; j < len; j++) {
                var temp2 = {
                  value: '',
                  label: ''
                }
                temp2.value = options[i].city[j].city
                temp2.label = options[i].city[j].city
                temp.children.push(temp2)
              }
              that.citys.push(temp)
            }
          }
        },
        function(err) {
          that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
        }
      ).catch(function(error) {
        console.log(error)
        that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    },
    weatherInfo() {
      var that = this
      API.getWeather().then(
        function(response) {
          if (response.success) {
            that.weather = response.data.result[0]
            that.weather.airCondition = '空气' + response.data.result[0].airCondition
            that.future = response.data.result[0].future
            that.selectedCity.push(response.data.result[0].province)
            that.selectedCity.push(response.data.result[0].city)
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
    this.weatherInfo()
    this.getCitys()
  }
}
</script>
<style>
.el-cascader .el-input__inner {
  border: none;
  background-color: rgba(0, 0, 0, 0);
  width: 0px;
  padding-left: 0px;
}
.el-cascader__label {
  display: none;
}
.el-input__suffix-inner .el-icon-arrow-down::before {
  content: "\e60b";
}
</style>
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
  padding: 0;
  position: relative;
}
.inner-bg {
  width: 100%;
  height: 100%;
  background-image: url(./images/bg.png);
  background-repeat: no-repeat;
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  -ms-background-size: cover;
  -moz-background-size: cover;
  min-height: 500px;
}
.grid {
  text-align: left;
  padding-top: 5em;
  margin-left: 30px;
}
.city {
  font-size: 18px;
  color: #fff;  
}
.grid p {
  font-size: 14px;
  color: #fff;
  margin: 8px 0px;
}
.grid p span{
  margin-left: 10px;
}
.grid .temperature {
  font-size: 60px;
}
.clear{
  clear: both;
}
.bottom {
  background-color: rgba(25, 33, 41, 0.65);
  padding: 0 7%;
  position: absolute;
  left: 0%;
  bottom: 0;
  width: 86%;
}

#flexiselWeather {
  animation:flexisel 20s linear infinite normal;
  /* Firefox: */
  -moz-animation:flexisel 20s linear infinite normal;
  /* Safari and Chrome: */
  -webkit-animation:flexisel 20s linear infinite normal;
  /* Opera: */
  -o-animation:flexisel 20s linear infinite normal;
}
@keyframes flexisel {
  0%   { left: 0%; }
  100% { left: -100%; }
}
@-moz-keyframes flexisel {
  0%   { left: 0%; }
  100% { left: -100%; }
}
@-webkit-keyframes flexisel {
  0%   { left: 0%; }
  100% { left: -100%; }
}
@-o-keyframes flexisel {
  0%   { left: 0%; }
  100% { left: -100%; }
}
#flexiselWeather:hover {
  animation-play-state: paused;
}

.nbs-flexisel-container {
  position: relative;
  max-width: 100%;
}
.nbs-flexisel-inner {
  overflow: hidden;
  margin: 0% auto 2%;
  padding:1em 0;
}
.nbs-flexisel-ul {
  position: relative;
  width: 9999px;
  margin: 0px;
  padding: 0px;
  list-style-type: none;
  text-align: center;
}
.nbs-flexisel-item {
  float: left;
  margin: 0px;
  padding: 0px;
  cursor: pointer;
  position: relative;
  line-height: 0px;
}
li.nbs-flexisel-item {
  padding-left: 8px;
  padding-right: 8px;
  border-left: 1px solid #fff!important;
}
li.nbs-flexisel-item:nth-child(1){
  border: none!important;
}
.biseller-column img{
  margin: 1em 0;
  max-width: 50px;
  max-height: 50px;
}
.biseller-column p {
  font-size: 1em;
  color: #fff;
  margin: 0;
  text-align: center;
}
.nbs-flexisel-nav-left, .nbs-flexisel-nav-right {
  color: #fff;
  position: absolute;
  cursor: pointer;
  z-index: 100;
  margin-top: 35px;
}
.nbs-flexisel-nav-left {
  right: -7%;
}
.nbs-flexisel-nav-left.disabled {
  opacity: 0.4;
}
.nbs-flexisel-nav-right {
  left: -7%;
}
.nbs-flexisel-nav-right.disabled {
  opacity: 0.4;
}
</style>
