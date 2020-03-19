import * as API from '@/utils/request'

export default {
  // 取得菜单列表
  menus: params => {
    return API.GET('/menu/list', params)
  },

  // 新增
  add: params => {
    return API.POST('/menu/add', params)
  },

  // 编辑
  edit: params => {
    return API.PUT('/menu/edit', params)
  },

  // 删除
  remove: params => {
    return API.DELETE('/menu/remove', params)
  }
}
