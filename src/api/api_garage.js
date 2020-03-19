import * as API from '@/utils/request'

export default {
  // 查询获取 garage 列表(通过page分页)
  findList: params => {
    return API.GET('/garage/list', params)
  },

  getGarageList: params => {
    return API.GET('/garage/allList', params)
  },

  // 新增
  add: params => {
    return API.POST('/garage/add', params)
  },

  // 编辑
  edit: params => {
    return API.POST('/garage/edit', params)
  },

  // 删除
  remove: params => {
    return API.DELETE('/garage/remove', params)
  },

  // 查询获取 car 列表(通过page分页)
  findCarList: params => {
    return API.GET('/garage/car/list', params)
  },

  findCarView: params => {
    return API.GET('/garage/car/view', params)
  },

  // 新增
  addCar: params => {
    return API.POST('/garage/car/add', params)
  },

  // 编辑
  editCar: params => {
    return API.POST('/garage/car/edit', params)
  },

  carState: params => {
    return API.POST('/garage/car/status', params)
  },

  // 删除
  removeCar: params => {
    return API.DELETE('/garage/car/remove', params)
  },

  // 查询获取 repair 列表(通过page分页)
  repairList: params => {
    return API.GET('/repair/list', params)
  },

  // 新增
  addRepair: params => {
    return API.POST('/repair/add', params)
  },

  // 编辑
  editRepair: params => {
    return API.POST('/repair/edit', params)
  },

  // 删除
  removeRepair: params => {
    return API.DELETE('/repair/remove', params)
  },

  errorState: params => {
    return API.POST('/repair/errorStatus', params)
  },

  repairState: params => {
    return API.POST('/repair/repairStatus', params)
  }
}
