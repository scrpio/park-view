<template>
  <div id="particles">
    <vue-particles color="#CCC"/>

    <el-form ref="RegisterFrom" :model="register" :rules="rules" label-position="left" label-width="0px" class="demo-ruleForm register-container">
      <el-form-item prop="username">
        <h3 class="title"><span @click="jumpTo('/login')">登录</span>|<span @click="jumpTo('/register')">注册</span></h3>
        <span class="icon"><i class="fa fa-user"></i></span>
        <el-input type="text" v-model="register.username" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <span class="icon"><i class="fa fa-lock"></i></span>
        <el-input type="password" v-model="register.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item prop="repwd">
        <span class="icon"><i class="fa fa-retweet"></i></span>
        <el-input type="password" v-model="register.repwd" auto-complete="off" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <span class="icon"><i class="fa fa-mobile-phone"></i></span>
        <el-input type="text" v-model="register.phone" auto-complete="off" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item prop="captcha">
        <span class="icon"><i class="fa fa-pencil"></i></span>
        <el-row type="flex" justify="space-between">
          <el-input v-model="register.captcha" clearable placeholder="请输入验证码"></el-input>
          <el-button class="send-captcha" v-if="!send" @click="sendCaptcha">获取验证码</el-button>
          <el-button class="count-captcha" v-if="send" disabled>{{ countButton }}</el-button>
        </el-row>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleRegister" :loading="loading">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import API from '@/api/api_user'

export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不得小于6位'))
      } else {
        callback()
      }
    }
    const validateConfirmPass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不得小于6位'))
      } else if (value !== this.register.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    const validateMobile = (rule, value, callback) => {
      var reg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!reg.test(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      send: false,
      count: 60,
      countButton: '60 s',
      register: {
        username: '',
        password: '',
        repwd: '',
        phone: '',
        captcha: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        repwd: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validateConfirmPass, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      checked: true
    }
  },
  methods: {
    jumpTo(url) {
      this.$router.push(url) // 用go刷新
    },
    sendCaptcha(){
      if (this.register.phone === '') {
        this.$message.error({ showClose: true, message: '手机号不能为空', duration: 2000 })
        return
      }
      this.send = true
      this.countDown()
      var param = {
        phone: this.register.phone,
        send: this.send
      }
      API.register(param).then(res => {
        if (res.success === true) {
          this.$message.success({ showClose: true, message: '发送成功', duration: 2000 });
        }else {
          this.$message.error({ showClose: true, message: '发送失败', duration: 2000 });
        }
      },
      function(error) {
        this.loading = false
        this.$message.error({ showClose: true, message: error.toString(), duration: 2000 })
      }).catch(function(error) {
        this.loading = false;
        console.log(error);
        this.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
      })
    },
    countDown() {
      var that = this
      if (this.count === 0) {
        this.send = false
        this.count = 60
        return
      } else {
        this.countButton = this.count + ' s'
        this.count--
      }
      setTimeout(function() { that.countDown() }, 1000)
    },
    handleRegister() {
      var that = this
      this.$refs.RegisterFrom.validate(valid => {
        if (valid) {
          this.loading = true
          that.send = false
          var params = {
            username: that.register.username,
            password: that.register.password,
            phone: that.register.phone,
            captcha: that.register.captcha,
            send: that.send
          }
          API.register(params).then(
            function(result) {
              that.loading = false
              if (result.code === 200) {
                that.$router.push({ path: '/login' })
              } else {
                that.$message.error({ showClose: true, message: '注册失败', duration: 2000 })
              }
            },
            function(error) {
              that.loading = false
              that.$message.error({ showClose: true, message: error.toString(), duration: 2000 })
            }
          ).catch(function(error) {
            that.loading = false
            console.log(error)
            that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
          })
        }
      })
    }
  }
}
</script>

<style>
.register-container input{
  padding-left: 30px;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.content-container {
  background-color: inherit;
}
#particles {
  position: fixed;
  height: 100%;
  width: 100%;
  .register-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 400px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    color: #454545;

    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #fff;
    }
    .title span {
      display: inline-block;
      margin-left:10px;
      margin-right: 10px;
      cursor: pointer;
    }
    .title span:hover {
      color: #409EFF;    
    }
    .title span {
      display: inline-block;
      margin-left:10px;
      margin-right: 10px;
      cursor: pointer;
    }
    .count-captcha,.send-captcha{
      width: 200px;
      text-align: center;
      margin-left: 5px;
    }
    .icon{
      position: absolute;
      left: 10px;
      font-size: 16px;
      z-index: 1;
    }
  }
}
</style>
