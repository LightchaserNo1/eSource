/* eslint-disable eol-last */
import Vue from 'vue'
import moment from 'moment'
import store from '@/store'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

Vue.filter('NumberFormat', function (value) {
  if (!value) {
    return '0'
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  return intPartFormat
})

Vue.filter('dayjs', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

// 格式化图片地址
Vue.filter('dealImageUrl', function (url) {
  if (!url) return ''
  return url.substr(0, 4) === 'http' || url.substr(0, 2) === '//' ? url : process.env.VUE_APP_BASE_IMAGE + url
})

// 常量转换
Vue.filter('enumValueByKey', function (value, enumObj, key = 'desc') {
  if (value == null) {
    return ''
  }
  var target = ''
  Object.keys(enumObj).forEach((item) => {
    const obj = enumObj[item]
    if (obj.value === value) {
      target = obj[key]
    }
  })
  return target
})
// 正则检验手机号
Vue.filter('phoneNumberReg', function (phoneNumber) {
  const regTest = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
  return regTest.test(phoneNumber)
})

// 判断是否有权限
Vue.filter('isHasAuth', function (val) {
  const curRoles = store.getters.roles
  let flag = false
  if (
    curRoles &&
        curRoles.length &&
        curRoles
          .map(item => item.code)
          .indexOf(val) !== -1
  ) {
    flag = true
  }
  return flag
})