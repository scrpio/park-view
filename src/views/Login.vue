<template>
  <div id="particles">
    <!-- <vue-particles color="#CCC"/> -->
    <div class="login-form">
      <el-tabs v-model="activeName" stretch class="login-container">
        <el-tab-pane label="账户密码登录" name="account">
          <el-form ref="AccountFrom" :model="accountFrom" :rules="accountRules" label-position="left">
            <el-form-item prop="username">
              <span class="icon"><i class="fa fa-user"/></span>
              <el-input type="text" v-model="accountFrom.username" auto-complete="off" placeholder="账号"/>
            </el-form-item>
            <el-form-item prop="password">
              <span class="icon"><i class="fa fa-lock"/></span>
              <el-input type="password" v-model="accountFrom.password" auto-complete="off" placeholder="密码"/>
            </el-form-item>
            <!-- <el-form-item prop="captcha">
              <span class="icon"><i class="fa fa-pencil"/></span>
              <el-row type="flex" justify="space-between">
                <el-input v-model="accountFrom.captcha" clearable  placeholder="请输入验证码"/>
                <img :src="captchaImg" class="images" @click="getCaptcha" />
              </el-row>
            </el-form-item> -->
            <el-form-item prop="rememberMe">
              <el-checkbox v-model="accountFrom.rememberMe" checked>记住密码</el-checkbox>
            </el-form-item>
            <el-form-item style="width:100%;">
              <el-button type="primary" :loading="loading" style="width:100%;" @click.enter="accountLogin">登录</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="手机号登录" name="tel">
          <el-form ref="PhoneFrom" :model="phoneFrom" :rules="phoneRules" label-position="left">
            <el-form-item prop="phone">
              <span class="icon"><i class="fa fa-mobile-phone"></i></span>
              <el-input type="text" v-model="phoneFrom.phone" auto-complete="off" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item prop="captcha">
              <span class="icon"><i class="fa fa-pencil"></i></span>
              <el-row type="flex" justify="space-between">
                <el-input v-model="phoneFrom.captcha" clearable placeholder="请输入验证码"></el-input>
                <el-button class="captcha-btn" v-if="!send" @click="sendSMS">获取验证码</el-button>
                <el-button class="captcha-btn" v-if="send" disabled>{{ countButton }}</el-button>
              </el-row>
            </el-form-item>
            <el-form-item style="width:100%;">
              <el-button type="primary" :loading="loading" style="width:100%;" @click.enter="phoneLogin">登录</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    
  </div>
</template>

<script>
import API from '@/api/api_user'

export default {
  data() {
    return {
      loading: false,
      activeName: 'account',
      checked: true,
      send: false,
      countButton: 60,
      captchaImg: '',
      accountFrom: {
        username: 'admin',
        password: '123456',
        captchaId: '',
        captcha: '',
        rememberMe: true
      },
      phoneFrom: {
        phone: '',
        captchaId: '',
        captcha: ''
      },
      accountRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
        // captcha: [
        //   { required: true, message: '请输入验证码', trigger: 'blur' }
        // ]
      },
      phoneRules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // getCaptcha() {
    //   API.initCaptcha().then(res => {
    //     if (res.success) {
    //       this.accountFrom.captchaId = res.data
    //       this.captchaImg = process.env.BASE_API +'/captcha/draw/' + res.data
    //     } else {
    //       this.$message.error({ showClose: true, message: '获取验证码失败', duration: 2000 })
    //     }
    //   }).catch(() => {
    //     this.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
    //   })
    // },
    accountLogin() {
      var that = this
      this.$refs.AccountFrom.validate(valid => {
        if (valid) {
          var params = Object.assign({}, this.accountFrom)
          this.loading = true
          this.$store.dispatch('Login', params).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {
            this.loading = false
            this.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
          })
        }
      })
    },
    countDown() {
      var that = this
      if (this.countButton === 0) {
        this.send = true
        this.countButton = 60
        return
      } else {
        this.countButton = this.countButton
        this.countButton--
      }
      setTimeout(function() { that.countDown() }, 1000)
    },
    sendSMS() {
      if (this.phoneFrom.phone === '') {
        this.$message.error({ showClose: true, message: '手机号不能为空', duration: 2000 })
        return
      }
      this.countDown()
      API.getSMSCode({phone: this.phoneFrom.phone}).then(res => {
        if (res.success) {
          this.phoneFrom.captchaId = res.data
          this.$message.success({ showClose: true, message: '发送成功', duration: 2000 })
        }else {
          this.$message.error({ showClose: true, message: '发送失败', duration: 2000 })
        }
      },
      function(error) {
        this.$message.error({ showClose: true, message: error.toString(), duration: 2000 })
      }).catch(function(error) {
        console.log(error)
        this.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    },
    phoneLogin() {
      var that = this
      this.$refs.PhoneFrom.validate(valid => {
        if (valid) {
          var params = Object.assign({}, this.phoneFrom)
          this.loading = true
          this.$store.dispatch('SMSLogin', params).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {
            this.loading = false
            this.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
          })
        }
      })
    }
  },
  mounted() {
    // this.getCaptcha()
  }
}
</script>

<style>
.login-container input {
  padding-left: 30px;
}
.el-tabs__header {
  margin: 0 0 30px;
}
.el-tabs__nav {
  width: 100%;
  text-align: center;
}
.el-tabs__active-bar {
  width: 50% !important;
}
.el-tabs__item {
  width: 50%;
  font-size: 18px;
  color: #cfcfcf;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
#particles {
  background-image: url(../assets/images/bg.png);
  background-repeat: no-repeat;
  background-size: cover;
  height:100%;
}
.login-form {
  width: 400px;
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.login-container {
  position: relative;
  padding: 35px 35px 15px 35px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: #fff;
  border-radius: 5px;
  color: #454545;

  .el-input {
    display: inline-block;
    height: 47px;
    width: 100%;
  }
  .icon {
    position: absolute;
    left: 10px;
    font-size: 16px;
    z-index: 1;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
  .captcha-btn {
    width: 200px;
    height: 40px;
    text-align: center;
    margin-left: 5px;
  }
  .images {
    margin-left: 5px;
    border-radius: 4px;
    width: 200px;
    height: 40px;
    cursor: pointer;
  }
}
</style>
