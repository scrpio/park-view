import * as API from '@/utils/request'

export default {
  countMember: params => {
    return API.GET('/chart/countMember', params)
  },

  countOrder: params => {
    return API.GET('/chart/countOrder', params)
  },

  countMoney: params => {
    return API.GET('/chart/countMoney', params)
  },

  countRepair: params => {
    return API.GET('/chart/countRepair', params)
  },
  
  chartOrder: params => {
    return API.GET('/chart/order', params)
  },

  getCarBar: params => {
    return API.GET('/chart/carBar', params)
  },
  
  getRepairPie: params => {
    return API.GET('/chart/repairPie', params)
  }
}
