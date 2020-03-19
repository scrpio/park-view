import * as API from '@/utils/request'

export default {
  // 查询获取 order 列表(通过page分页)
  findList: params => {
    return API.GET('/order/list', params)
  },

  changeState: params => {
    return API.POST('/order/status', params)
  }
}
