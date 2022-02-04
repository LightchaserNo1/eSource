import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import qs from 'qs'

// 配置 允许通过 非常规返回值类型
const allowSystemResponseURL = [
  '/boss/system/range/export',
  '/boss/project/managePts/jobLog/downLoad',
  '/boss/system/user/export',
  '/boss/project/info/export',
  '/boss/crf/config/expCrf',
  '/boss/crf/config/expTemplate'
]

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 60000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: '暂无权限'
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: '请重新登录'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    config.headers['proId'] = store.getters.project != null ? store.getters.project.id : ''
    config.data = qs.stringify(config.data)
  }
  const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['token'] = token
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  return new Promise((resolve, reject) => {
    const data = response.data
    if (data.status == null && allowSystemResponseURL.findIndex(item => item === response.config.url) !== -1) {
      return resolve(data)
    }

    if (data.status === '1') {
      return resolve(data.data)
    } else {
       switch (data.status) {
          case 'xxxx': // 自定义code
             // eslint-disable-next-line prefer-promise-reject-errors
             reject({
                response: {
                   status: 'xxxx',
                   msg: data.detail
                }
             })
             break
          default: {
            notification.error({
              message: '错误',
              description: data.detail
            })
            reject(data)
          }
       }
    }
 })
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
