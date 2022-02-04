import request from '@/utils/request'

const api = {
  // -----------------------------------CRF相关配置----------------------------------------
  listForm: '/boss/crf/config/listForm',
  exportCrf: '/boss/crf/config/export', // 弃用
  expCrf: '/boss/crf/config/expCrf',
  impCrf: '/boss/crf/config/impCrf',
  expTemplate: '/boss/crf/config/expTemplate',
  impTemplate: '/boss/crf/config/impTemplate',
  addFrom: '/boss/crf/config/addFrom',
  delTemplate: '/boss/crf/config/delTemplate',
  listTrilStage: '/boss/update/manager/listTrilStage',
  delTest: '/boss/crf/config/delTest',
  delComm: '/boss/crf/config/delComm',
  listChapter: '/boss/crf/config/listChapter',
  listChapterByFrom: '/boss/crf/config/listChapterByFrom',
  addChapter: '/boss/crf/config/addChapter',
  subjectList: '/boss/crf/config/subjectList',
  childValues: '/boss/crf/config/childValues',
  addOrUpdateTestCrfPro: '/boss/crf/config/addOrUpdateTestCrfPro',
  listChapterBytemplate: '/boss/crf/config/listChapterBytemplate',
  listTable: '/boss/crf/config/listTable',
  listField: '/boss/crf/config/listField',
  listCommValues: '/boss/crf/config/listCommValues',
  addOrUpdateCommPro: '/boss/crf/config/addOrUpdateCommPro',
  listProceedPro: '/boss/crf/config/listProceedPro',
  listFrom: '/boss/assist/Config/listFrom',
  listOrg: '/boss/crf/config/listOrg',
  update: '/boss/crf/config/update'

}
// -----------------------------------CRF相关配置----------------------------------------
// CRF表单列表
export function getListFrom (data) {
  return request({
    url: api.listForm,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  })
}
// 新增CRF表单
export function addFrom (data) {
  return request({
    url: api.addFrom,
    method: 'post',
    data
  })
}
// 章节表单列表 listChapter
export function listChapter (data) {
  return request({
    url: api.listChapter,
    method: 'post',
    data
  })
}
// 章节下拉框列表 listChapterByFrom
export function listChapterByFrom (data) {
  return request({
    url: api.listChapterByFrom,
    method: 'post',
    data
  })
}
// 访视阶段列表 proId
export function getListTrilStage (data) {
  return request({
    url: api.listTrilStage,
    method: 'post',
    data
  })
}
// 新增章节模板
export function addChapter (data) {
  return request({
    url: api.addChapter,
    method: 'post',
    data
  })
}
// CRF表单导出
export function exportCrf () {
  return request({
    url: api.exportCrf,
    method: 'get',
    responseType: 'blob'
  })
}
// CRF配置导出expCrf
export function expCrf () {
  return request({
    url: api.expCrf,
    method: 'get',
    responseType: 'blob'
  })
}
// CRF配置导入impCrf
export function impCrf (parameter) {
  return request({
    url: api.impCrf,
    method: 'post',
    data: parameter,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
// 导出章节与配置
export function expTemplate (parameter) {
  return request({
    url: api.expTemplate,
    method: 'post',
    data: parameter,
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob'
  })
}
// 导入章节与配置
export function impTemplate (parameter) {
  return request({
    url: api.impTemplate,
    method: 'post',
    data: parameter,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
// 启用或关闭表单
export function updateTable (data) {
  return request({
    url: api.update,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  })
}
// 机构列表
export function listOrg (data) {
  return request({
    url: api.listOrg,
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
export function delComm (data) {
  return request({
    url: api.delComm,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  })
}
// 删除章节模板
export function delTemplate (data) {
  return request({
    url: api.delTemplate,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  })
}
// ----------------------------------检验配置----------------------------------------
// 检验主题值域
export function subjectList (data) {
  return request({
    url: api.subjectList,
    method: 'post',
    data
  })
}
// 子项值域列表
export function childValues (data) {
  return request({
    url: api.childValues,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  })
}
// 新增或修改检验配置
export function addOrUpdateTestCrfPro (data) {
  return request({
    url: api.addOrUpdateTestCrfPro,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  })
}
// 配置项目列表
export function listChapterBytemplate (data) {
  return request({
    url: api.listChapterBytemplate,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  })
}
// 项目列表
export function listProceedPro (data) {
  return request({
    url: api.listProceedPro,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}
// ----------------------------------通用配置----------------------------------------
// 通用项目表列表
export function listTable (data) {
  return request({
    url: api.listTable,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  })
}
// 通用dwd字段列表
export function listField (data) {
  return request({
    url: api.listField,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  })
}
// 通用项目值域下拉框列表
export function listCommValues (data) {
  return request({
    url: api.listCommValues,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  })
}
// 新增或修改通用配置
export function addOrUpdateCommPro (data) {
  return request({
    url: api.addOrUpdateCommPro,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  })
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
