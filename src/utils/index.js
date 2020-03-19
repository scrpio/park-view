// 日期格式化，返回值形式为yy-mm-dd
export function timeFormat(time) {
  // if (!date || typeof (date) === 'string') {
  //   this.error('参数异常，请检查...')
  // }
  var date = new Date(time)
  var Y = date.getFullYear() + '-' // 年
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' // 月
  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ' // 日,
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return Y + M + D + h + m + s
}
// 获取本周的周一
export function getFirstDayOfWeek() {
  var date = new Date()
  // 获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
  var weekday = date.getDay() || 7
  date.setDate(date.getDate() - weekday + 1)
  return timeFormat(date)
}
// 获取本周的周日
export function getLastDayOfWeek() {
  var date = new Date()
  // 获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
  var weekday = date.getDay() || 7
  date.setDate(date.getDate() + (8 - weekday))
  return timeFormat(date)
}
// 获取当月第一天
export function getFirstDayOfMonth() {
  var date = new Date()
  date.setDate(1)
  return timeFormat(date)
}
// 获取当月最后一天
export function getLastDayOfMonth() {
  var date = new Date()
  var y = date.getFullYear() // 年
  var m = date.getMonth() + 1 // 月
  return timeFormat(new Date(y, m, 0))
}
// 获取当年第一天
export function getFirstDayOfYear() {
  var date = new Date()
  date.setDate(1)
  date.setMonth(0)
  return timeFormat(date)
}
// 获取当年最后一天
export function getLastDayOfYear() {
  var date = new Date()
  var y = date.getFullYear() // 年
  return timeFormat(new Date(y, 11, 31))
}
// 日期格式化，返回值形式为yyyy年mm月dd日
export function dateFormat(time) {
  var date = new Date(time)
  var Y = date.getFullYear() + '年' // 年
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月' // 月
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + '日' // 日
  return Y + M + D
}
// 日期格式化
export function formatDate(time) {
  var days = parseInt(time / (60 * 60 * 24))
  var hours = parseInt((time % (60 * 60 * 24)) / (60 * 60))
  var minutes = parseInt((time % (60 * 60)) / 60)
  var seconds = time % 60
  return days + ' 天 ' + hours + ' 小时 ' + minutes + ' 分 ' + seconds + ' 秒 '
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}
