import request from '@/utils/request'

export function login(username, password, captchaId, captcha, rememberMe) {
  return request({
    url: '/login/account',
    method: 'post',
    data: {
      username,
      password,
      captchaId,
      captcha,
      rememberMe
    }
  })
}

export function smsLogin(phone, captchaId, captcha) {
  return request({
    url: '/login/phone',
    method: 'post',
    data: {
      phone,
      captchaId,
      captcha
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/currentUser',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}
