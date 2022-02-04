import request from '@/utils/request'

const api = {
  // -----------------------------------CRF相关配置----------------------------------------
  listFrom: '/boss/assist/Config/listFrom',
  listTest: '/boss/assist/Config/listTest',
  listCheck: '/boss/assist/Config/listCheck',
  delTest: '/boss/assist/Config/delTest',
  delCheck: '/boss/assist/Config/delCheck',
  addOrUpdateTest: '/boss/assist/Config/addOrUpdateTest',
  addOrUpdateCheck: '/boss/assist/Config/addOrUpdateCheck',
  listTestSubValues: '/boss/assist/Config/listTestSubValues',
  listTestfieldValues: '/boss/assist/Config/listTestfieldValues',
  listCheckValues: '/boss/assist/Config/listCheckValues',
  listCheckField: '/boss/assist/Config/listCheckField'
}

// -----------------------------------CRF辅助配置----------------------------------------
// CRF表单列表
export function listFrom (data) {
  return request({
    url: api.listFrom,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  })
}
// 辅助检验列表
export function listTest (data) {
  return request({
    url: api.listTest,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  })
}
// 辅助检查项列表
export function listCheck (data) {
  return request({
    url: api.listCheck,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  })
}
// 新增或修改检验配置
export function addOrUpdateTest (data) {
  return request({
    url: api.addOrUpdateTest,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  })
}
//  新增或修改检查配置
export function addOrUpdateCheck (data) {
  return request({
    url: api.addOrUpdateCheck,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  })
}
//  检验主题值域列表
export function listTestSubValues (data) {
  return request({
    url: api.listTestSubValues,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  })
}
//  检验子项值域列表
export function listTestfieldValues (data) {
  return request({
    url: api.listTestfieldValues,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  })
}
//  检查项目值域列表
export function listCheckValues (data) {
  return request({
    url: api.listCheckValues,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  })
}
//  检查项目字段列表
export function listCheckField (data) {
  return request({
    url: api.listCheckField,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  })
}
//  删除检验配置
export function delTest (data) {
  return request({
    url: api.delTest,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  })
}
// 删除通用配置
export function delCheck (data) {
  return request({
    url: api.delCheck,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  })
}
