import * as API from '@/utils/request'

export default {
  // 查询获取 dict 列表(通过page分页)
  findList: params => {
    return API.GET('/dict/list', params)
  },

  add: params => {
    return API.POST('/dict/add', params)
  },

  edit: params => {
    return API.PUT('/dict/edit', params)
  },

  remove: params => {
    return API.DELETE('/dict/remove', params)
  },

  // Redis 相关操作
  redisCacheInfo: params => {
    return API.GET('/redis/info', params)
  },

  redisCacheKeys: params => {
    return API.GET('/redis/keys', params)
  },

  redisCacheKeysCount: params => {
    return API.GET('/redis/keysCount', params)
  },

  getValueByKey: params => {
    return API.GET('/redis/value', params)
  },

  delKey: params => {
    return API.DELETE('/redis/delKey', params)
  },

  delKeys: params => {
    return API.DELETE('/redis/delKeys', params)
  },

  getLogs: params => {
    return API.GET('/redis/getLogs', params)
  },

  clearLogs: params => {
    return API.DELETE('/redis/clearLogs', params)
  }
}
