import * as API from '@/utils/request'

export default {
  // 初始化验证码
  initCaptcha: params => {
    return API.GET('/captcha/init', params)
  },

  // 获取手机短信验证码
  getSMSCode: params => {
    return API.GET('/captcha/sms', params)
  },

  getCitys: params => {
    return API.GET('/city', params)
  },

  getWeatherByCity: params => {
    return API.GET('/city/weather', params)
  },

  // 获取天气信息
  getWeather: params => {
    return API.GET('/weather', params)
  },

  // 注册
  register: params => {
    return API.POST('/register', params)
  },

  // 修改个人信息
  changeProfile: params => {
    return API.PATCH('/user/profile', params)
  },

  changePwd: params => {
    return API.PATCH('/user/changePwd', params)
  },

  // 查询获取user列表(通过page分页)
  findList: params => {
    return API.GET('/user/list', params)
  },

  getUsers: params => {
    return API.GET('/user/all', params)
  },

  // 用户拥有的角色集
  getRoleIds: params => {
    return API.GET('/user/roleIds', params)
  },

  // 增加用户
  add: params => {
    return API.POST('/user/add', params)
  },

  // 修改用户
  edit: params => {
    return API.PUT('/user/edit', params)
  },

  // 删除用户
  remove: params => {
    return API.DELETE('/user/remove', params)
  }
}
