import * as API from '@/utils/request'

export default {
  // 查询获取 dept 列表(通过page分页)
  findList: params => {
    return API.GET('/dept/list', params)
  },

  deptList: params => {
    return API.GET('/dept/allDept', params)
  },

  // 新增
  add: params => {
    return API.POST('/dept/add', params)
  },

  // 编辑
  edit: params => {
    return API.PUT('/dept/edit', params)
  },

  // 删除
  remove: params => {
    return API.DELETE('/dept/remove', params)
  }
}
