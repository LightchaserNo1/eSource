import request from '@/utils/request'

const patientApi = {
  sickList: '/boss/project/manage/listPa',
  // 弃用换成上面的 listPa
  allSickList: '/boss/project/manage/listPts',
  tabList: '/common/dictionary',
  centerList: '/boss/project/manage/listResearch',
  addCatch: '/boss/project/managePts/addPtsTask',
  typeList: '/boss/project/managePts/queryTypeList',
  workList: '/boss/project/managePts/listByPage',
  projectLog: '/boss/project/managePts/listJobLog',
  historyList: '/boss/project/managePts/listGroupByPage',
  // 检查信息
  examineInfo: '/boss/project/managePts/listObExamReportByPage',
  // 就诊历次列表
  cureNumber: '/boss/project/managePts/listVisit',
  // 受试者信息，那个描述表格用的
  testerInfo: '/boss/project/managePts/patientInfo',
  // 诊断信息列表
  cureInfo: '/boss/project/managePts/listPaDiagInfoByPage',
  // 手术信息
  operationInfo: '/boss/project/managePts/listExecByPage',
  // 给药信息
  medicine: '/boss/project/managePts/listPtsDoseByPage',
  // 检验信息
  checkOutInfo: '/boss/project/managePts/listExamineByPage',
  // 病理查询
  pathology: '/boss/project/managePts/listOrPathologyExamByPage',
  // 体征
  sign: '/boss/project/managePts/listPaVitalSignByPage',
  // 图文材料
  imgText: '/boss/update/manager/listEsCerByPage',
  // 修改基线时间
  baseTime: '/boss/project/managePts/updateBasicDate',
  catch: '/boss/project/managePts/update/ptsTask',
  // 药敏记录接口
  medinceRecord: '/boss/project/managePts/listReportMedicine',
  // 导出日志
  exportLog: '/boss/project/managePts/jobLog/downLoad',
  // 历史记录中查看内容
  watchContent: '/boss/project/managePts/listByPage',
  // 修改患者档案(全部匹配中用的)
  updateSickFile: '/boss/project/managePts/update',
  // 删除 (全部匹配中用的)
  deleteSickFile: '/boss/project/managePts/delete',
  // 添加项目核证副本类型
  addCopyType: '/boss/project/info/add/proCopyType',
  // 项目核证副本类型列表
  copyTypeList: '/boss/project/info/list/proCopyType',
  // 编辑项目核证副本类型
  updateCopyType: '/boss/project/info/edit/proCopyType',
  // 删除项目核证副本类型
  deleteCopyType: '/boss/project/info/delete/proCopyType'
}
// 研究中心列表
export function getResearchList (data) {
  return request({
    url: patientApi.centerList,
    method: 'post',
    data
  })
}
// 患者队列
export function getPatientList (data) {
  return request({
    url: patientApi.sickList,
    method: 'post',
    data
  })
}
// 所有患者队列
export function getAllPatientList (data) {
  return request({
    url: patientApi.allSickList,
    method: 'post',
    data
  })
}
// 添加患者抓取数据
export function addCatchData (data) {
  return request({
    url: patientApi.addCatch,
    method: 'post',
    data
  })
}
// 获取患者类型
export function getSickType (data) {
  return request({
    url: patientApi.typeList,
    method: 'post',
    data
  })
}
// 任务列表
export function getWorkList (data) {
  return request({
    url: patientApi.workList,
    method: 'post',
    data
  })
}
// 历史记录
export function getHistory (data) {
  return request({
    url: patientApi.historyList,
    method: 'post',
    data
  })
}
// 就诊历次列表
export function getCureNumber (data) {
  return request({
    url: patientApi.cureNumber,
    method: 'post',
    data
  })
}
// 受试者信息
export function getTesterInfo (data) {
  return request({
    url: patientApi.testerInfo,
    method: 'post',
    data
  })
}
// 获取患者诊断信息
export function getCureInfo (data) {
  return request({
    url: patientApi.cureInfo,
    method: 'post',
    data
  })
}
// 获取手术信息
export function getOperationInfo (data) {
  return request({
    url: patientApi.operationInfo,
    method: 'post',
    data
  })
}
// 获取给药信息
export function getMedicineInfo (data) {
  return request({
    url: patientApi.medicine,
    method: 'post',
    data
  })
}
// 获取检验信息
export function getMCheckOutInfo (data) {
  return request({
    url: patientApi.checkOutInfo,
    method: 'post',
    data
  })
}
// 获取病理查询信息
export function getPathology (data) {
  return request({
    url: patientApi.pathology,
    method: 'post',
    data
  })
}
// 获取体征信息
export function getSignInfo (data) {
  return request({
    url: patientApi.sign,
    method: 'post',
    data
  })
}
// 获取检查信息
export function getExamineInfo (data) {
  return request({
    url: patientApi.examineInfo,
    method: 'post',
    data
  })
}
// 获取项目日志
export function getProjectLog (data) {
  return request({
    url: patientApi.projectLog,
    method: 'post',
    data
  })
}
// 全部档案，获取顶部tabs
export function getTabList (data) {
  return request({
    url: patientApi.tabList,
    method: 'post',
    data
  })
}
// 获取图文材料
export function getImg (data) {
  return request({
    url: patientApi.imgText,
    method: 'post',
    data
  })
}
// 修改基线时间
export function changeBaseTime (data) {
  return request({
    url: patientApi.baseTime,
    method: 'post',
    data
  })
}
// 开始抓取，停止抓取
export function dealCatch (data) {
  return request({
    url: patientApi.catch,
    method: 'post',
    data
  })
}
// 获取药敏记录
export function getMedicineRecord (params) {
  return request({
    url: patientApi.medinceRecord,
    method: 'get',
    params
  })
}
// 患者日志导出
export function exportLog (params) {
  return request({
    url: patientApi.exportLog,
    method: 'get',
    params
  })
}
// 查看内容
export function watchContent (data) {
  return request({
    url: patientApi.watchContent,
    method: 'post',
    data
  })
}
// 修改患者抓取任务
export function updateCatchTask (data) {
  return request({
    url: patientApi.updateSickFile,
    method: 'post',
    data
  })
}
// 删除患者抓取任务
export function deleteCatchTask (data) {
  return request({
    url: patientApi.deleteSickFile,
    method: 'post',
    data
  })
}

// 添加项目核证副本类型
export function addCertifiedCopy (data) {
  return request({
    url: patientApi.addCopyType,
    method: 'post',
    data
  })
}

// 项目核证副本类型列表
export function certifiedCopyList (data) {
  return request({
    url: patientApi.copyTypeList,
    method: 'post',
    data
  })
}

// 编辑项目核证副本类型
export function updateCertifiedCopy (data) {
  return request({
    url: patientApi.updateCopyType,
    method: 'post',
    data
  })
}

// 删除项目核证副本类型
export function deleteCertifiedCopy (data) {
  return request({
    url: patientApi.deleteCopyType,
    method: 'post',
    data
  })
}
