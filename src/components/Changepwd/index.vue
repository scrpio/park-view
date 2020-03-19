<template>
  <div v-if="name.length>0">
    <el-tooltip content="修改密码" placement="bottom">
      <span class="lock-btn" @click="dialogVisible = true">
        <i class="fa fa-lock" />
      </span>
    </el-tooltip>

    <el-dialog :visible.sync="dialogVisible" title="修改密码" width="35%">
      <el-form :model="form" :rules="formRules">
        <el-form-item :label-width="formLabelWidth" label="原密码">
          <el-input v-model="form.oldPwd" type="password" auto-complete="off" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="新密码">
          <el-input v-model="form.password" type="password" auto-complete="off" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="确认密码">
          <el-input v-model="form.confirmPwd" type="password" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleChangepwd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api/api_user'

export default {
  name: 'Changepwd',
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
      } else if (value !== this.form.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      dialogVisible: false,
      formLabelWidth: '80px',
      form: {
        oldPwd: '',
        password: '',
        confirmPwd: ''
      },
      formRules: {
        oldPwd: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: validateConfirmPass, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    name() {
      return this.$store.getters.name
    }
  },
  methods: {
    handleChangepwd() {
      const that = this
      that.$refs.form.validate((valid) => {
        if (valid) {
          that.loading = true
          const params = {
            oldPwd: that.form.oldPwd,
            password: that.form.password
          }
          API.changePwd(params).then(function(result) {
            that.loading = false
            if (result.success) {
              that.$message.success({ showClose: true, message: '修改成功', duration: 2000 })
              that.dialogVisible = false
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
  }
}
</script>

<style scoped>
.lock-btn {
  font-size: 20px;
  cursor: pointer;
}
</style>
