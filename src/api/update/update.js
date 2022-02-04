import request from '@/utils/request'

const updateApi = {
  listPro: '/boss/update/manager/listProByPage',
  proNumber: '/boss/update/manager/proNumber',
  ocr: '/boss/update/manager/ocrDis',
  image: '/boss/update/manager/updateImage',
  submit: '/boss/update/manager/submitReview',
  result: '/boss/update/manager/listCerByPage',
  listTrilStage: '/boss/update/manager/listStage',
  stageList: '/boss/update/manager/stageList',
  listType: '/boss/update/manager/listType',
  addOrUpdate: '/boss/update/manager/addOrUpdate',
  updateOcr: '/boss/update/manager/updateOcr',
  verifyCer: '/boss/update/manager/verifyCer',
  listDwdPa: '/boss/project/managePts/listDwdPa',
  listPts: '/boss/update/manager/listPts',
  Login: '/boss/update/manager/accountCheck'
}
//  项目列表
export function listProByPage (parameter) {
  return request({
    url: updateApi.listPro,
    method: 'post',
    data: parameter
  })
}
// 项目状态数量
export function proNumber (parameter) {
  return request({
    url: updateApi.proNumber,
    method: 'post',
    data: parameter
  })
}
// OCR识别
export function ocrDis (parameter) {
  return request({
    url: updateApi.ocr,
    method: 'post',
    data: parameter,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
// 上传核证图片
export function updateImage (parameter) {
  return request({
    url: updateApi.image,
    method: 'post',
    data: parameter,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
// 提交审核
export function submitReview (parameter) {
  return request({
    url: updateApi.submit,
    method: 'post',
    data: parameter
  })
}
// 上传结果
export function listCerByPage (parameter) {
  return request({
    url: updateApi.result,
    method: 'post',
    data: parameter,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
//  试验阶段列表
export function listTrilStage (parameter) {
  return request({
    url: updateApi.listTrilStage,
    method: 'post',
    data: parameter
  })
}
//  试验阶段列表
export function stageList (parameter) {
  return request({
    url: updateApi.stageList,
    method: 'post',
    data: parameter
  })
}
//  副本类型列表
export function listType (parameter) {
  return request({
    url: updateApi.listType,
    method: 'post',
    data: parameter
  })
}
//  提交审核 批量新增或修改
export function addOrUpdate (parameter) {
  return request({
    url: updateApi.addOrUpdate,
    method: 'post',
    data: parameter,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
//  提交审核 批量新增或修改
export function updateOcr (data) {
  return request({
    url: updateApi.updateOcr,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}
//  核证副本审核
export function verifyCer (data) {
  return request({
    url: updateApi.verifyCer,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}
// 患者队列-原先
export function listPts (data) {
  return request({
    url: updateApi.listPts,
    method: 'post',
    data
  })
}
// 登录验证
export function Login (parameter) {
  return request({
    url: updateApi.Login,
    method: 'post',
    data: parameter
  })
}
