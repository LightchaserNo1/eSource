import request from '@/utils/request'

const userApi = {
  validateData: '/boss/admin/info/validateData',
  validateVideo: '/boss/admin/info/video',
  verifiedStatus: '/boss/admin/info/verifiedStatus'
}

// 人脸验证顺序
export function getValidateData (parameter) {
  return request({
    url: userApi.validateData,
    method: 'get',
    data: parameter
  })
}

// 人脸识别
export function sendValidateVideo (parameter) {
  return request({
    url: userApi.validateVideo,
    method: 'post',
    data: parameter
  })
}

export function getSendValidateVideo (parameter) {
  return request({
    url: userApi.verifiedStatus,
    method: 'get',
    data: parameter
  })
}
