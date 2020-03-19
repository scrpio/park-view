import { login, smsLogin, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    username: '',
    avatar: '',
    token: getToken()
  },

  mutations: {
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password, userInfo.captchaId, userInfo.captcha, userInfo.rememberMe).then(response => {
          const data = response.data
          setToken(data)
          commit('SET_TOKEN', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 手机登录
    SMSLogin({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        smsLogin(userInfo.phone, userInfo.captchaId, userInfo.captcha).then(response => {
          const data = response.data
          setToken(data)
          commit('SET_TOKEN', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          commit('SET_USERNAME', data.user.username)
          commit('SET_AVATAR', data.user.avatar)
          localStorage.setItem("access-user", JSON.stringify(data.user))
          localStorage.setItem("access-menus", JSON.stringify(data.router))
          localStorage.setItem("access-perms", JSON.stringify(data.perms))
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '')
          localStorage.removeItem("access-menus")
          localStorage.removeItem("access-perms")
          localStorage.removeItem("access-user")
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
