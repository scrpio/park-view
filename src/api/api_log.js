import * as API from '@/utils/request'

export default {
  // 取得 log 列表(通过page分页)
  findList: params => {
    return API.GET('/log/list', params)
  },

  // 删除日志
  remove: params => {
  	return API.DELETE('/log/remove', params)
  }
}
