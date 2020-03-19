<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum" :loading="loading">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>个人信息</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item prop="username" label="账号">
          <el-input v-model="form.username" style="width: 300px;" disabled/>
        </el-form-item>
        <el-form-item prop="nickname" label="昵称">
          <el-input v-model="form.nickname" style="width: 300px;"/>
        </el-form-item>
        <el-form-item prop="sex" label="性别">
          <el-radio v-model="form.sex" :label="1">男</el-radio>
          <el-radio v-model="form.sex" :label="0">女</el-radio>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker type="date" v-model="form.birthday"/>
        </el-form-item>
        <el-form-item prop="phone" label="电话">
          <el-input v-model="form.phone" style="width: 300px;"/>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="form.email" style="width: 300px;"/>
        </el-form-item>
        <el-form-item prop="address" label="住址">
          <el-input v-model="form.address" :autosize="{ minRows: 2, maxRows: 5}" type="textarea" style="width: 300px;"/>
        </el-form-item>
        <el-form-item prop="avatar" label="用户头像">
          <el-upload
              :with-credentials="true"
              :action="doUpload"
              :show-file-list="false"
              :before-upload="handleBeforeUpload"
              :on-success="handleSuccess"
              class="avatar-uploader">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSaveProfile">修改并保存</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import API from '@/api/api_user'

export default {
  data() {
    return {
      loading: false,
      imageUrl: '',
      doUpload: process.env.BASE_API + '/upload/file',
      form: {
        username: '',
        nickname: '',
        sex: '',
        birthday: '',
        phone: '',
        email: '',
        avatar: '',
        address: ''
      },
      rules: {
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
        ]
      },
    }
  },
  methods: {
    handleBeforeUpload(file) {
      var that = this
      const isLt2M = file.size / 1024 / 1024 < 2
      const isFlag = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isFlag) {
        that.$message.error({ showClose: true, message: '所选文件‘ ' + file.name + ' ’格式不正确, 请选择 .jpg 或 .png格式文件.', duration: 2000 })
      }
      if (!isLt2M) {
        that.$message.error({ showClose: true, message: '上传头像图片大小不能超过 5M.', duration: 2000 })
      }
      return isFlag && isLt2M
    },
    handleSuccess(res, file) {
      if (res.success) {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.form.avatar = res.data
      }
    },
    handleSaveProfile() {
      var that = this
      that.$refs.form.validate((valid) => {
        if (valid) {
          that.loading = true
          var params = Object.assign({}, this.form)
          API.changeProfile(params).then(function (result) {
            that.loading = false
            if (result.success) {
              that.$message.success({ showClose: true, message: '修改成功', duration: 2000 })
            } else {
              that.$message.error({ showClose: true, message: result.message, duration: 2000 })
            }
          }, function(err) {
            that.loading = false
            that.$message.error({ showClose: true, message: err.toString(), duration: 2000 })
          }).catch(function(error) {
            that.loading = false
            console.log(error)
            that.$message.error({ showClose: true, message: '请求出现异常', duration: 2000 })
          })
        }
      })
    }
  },
  mounted() {
    var user = JSON.parse(window.localStorage.getItem('access-user'))
    if (user != null || user.length > 0) {
      this.form = user
      this.imageUrl = user.avatar
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px !important;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
</style>