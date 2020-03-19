import * as API from '@/utils/request'

export default {
  // 查询获取 role 列表(通过page分页)
  findList: params => {
    return API.GET('/role/list', params)
  },

  roleList: params => {
    return API.GET('/role/allRole', params)
  },

  // 角色拥有的权限集
  getMenuIds: params => {
    return API.GET('/role/menuIds', params)
  },

  // 新增
  add: params => {
    return API.POST('/role/add', params)
  },

  // 编辑
  edit: params => {
    return API.PUT('/role/edit', params)
  },

  // 删除
  remove: params => {
    return API.DELETE('/role/remove', params)
  }
}
