import * as API from '@/utils/request'

export default {
  // 查询获取 member 列表(通过page分页)
  findList: params => {
    return API.GET('/member/list', params)
  },

  changeState: params => {
    return API.POST('/member/status', params)
  },

  rechargeList: params => {
    return API.GET('/recharge/list', params)
  },

  remove: params => {
    return API.DELETE('/recharge/remove', params)
  },

  rechargeState: params => {
    return API.POST('/recharge/status', params)
  }
}
