import request from '@/utils/request'

const logApi = {
  logStored: '/boss/log/add',
  logList: '/boss/log/opt/list',
  logExport: '/boss/log/export'
}
// 日志储存
export function getLogStored (parameter) {
  return request({
      url: logApi.logStored,
      method: 'post',
      data: parameter
  })
}

export function getLogList (parameter) {
  return request({
      url: logApi.logList,
      method: 'post',
      data: parameter
  })
}

export function getLogExport (parameter) {
  return request({
    url: logApi.logExport,
    method: 'get',
    params: parameter,
    responseType: 'blob'
  })
}
