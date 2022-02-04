// 患者检索
import request from '@/utils/request'
const api = {
  sickList: '/boss/project/managePts/listPtsSymptom',
  searchList: '/boss/project/managePts/listPaSearch',
  officeList: '/boss/dim/department/list'
}
// 病症列表
export function getSickList (data) {
  return request({
    url: api.sickList,
    method: 'post',
    data
  })
}
// 患者检索列表
export function getSearchList (data) {
  return request({
    url: api.searchList,
    method: 'post',
    data
  })
}
export function getOfficeList (params) {
  return request({
    url: api.officeList,
    method: 'get',
    params
  })
}
