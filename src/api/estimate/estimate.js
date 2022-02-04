import request from '@/utils/request'

const estimateApi = {
  detail: '/boss/project/assess/getTumourAssessDetail', // 评估详情
  add: '/boss/project/assess/addTumourAssess',
  update: '/boss/project/assess/updateTumourAssess',
  delete: '/boss/project/assess/deleteTumourAssessById',
  unInputStageList: '/boss/project/assess/listPtsNotStage', // 未录入试验阶段列表
  inputStageList: '/boss/project/assess/listPtsHaveStage' // 已录入试验阶段列表
}

export function getTumourEstimateDetail (parameter) {
  return request({
    url: estimateApi.detail,
    method: 'post',
    data: parameter
  })
}

export function addTumourEstimate (parameter) {
  return request({
    url: estimateApi.add,
    method: 'post',
    data: parameter
  })
}

export function updateTumourEstimate (parameter) {
  return request({
    url: estimateApi.update,
    method: 'post',
    data: parameter
  })
}

export function deleteTumourEstimate (parameter) {
  return request({
    url: estimateApi.delete,
    method: 'post',
    data: parameter
  })
}

export function getUnInputStageList (parameter) {
  return request({
    url: estimateApi.unInputStageList,
    method: 'post',
    data: parameter
  })
}

export function getInputStageList (parameter) {
  return request({
    url: estimateApi.inputStageList,
    method: 'post',
    data: parameter
  })
}
