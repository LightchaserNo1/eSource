import request from '@/utils/request'

const Api = {
  // 新增访视版本
  addVisit: '/boss/project/manage/visit/addVersion',
  // 获取访视版本列表
  visitList: '/boss/project/manage/visit/listVersion',
  // 修改访视版本状态
  visitStatus: '/boss/project/manage/visit/updateStatus',
  // 新增访视计划
  addplan: '/boss/project/manage/visit/add',
  // 删除访视计划
  deletePlan: '/boss/project/manage/visit/delete',
  // 访视计划列表
  planList: '/boss/project/manage/visit/list',
  // 编辑访视计划
  updatePlan: '/boss/project/manage/visit/update',
  // 导入访视计划信息
  toleadPlan: '/boss/project/manage/visit/import',
  // 删除访视计划
  deleteVisit: '/boss/project/manage/visit/deleteVersion'
}
// 新增访视版本
export function addVisitPlan (data) {
  return request({
    url: Api.addVisit,
    method: 'post',
    data
  })
}

// 获取访视版本列表
export function visitPlanList (data) {
  return request({
    url: Api.visitList,
    method: 'post',
    data
  })
}

// 获取访视版本列表
export function updateVisitStatus (data) {
  return request({
    url: Api.visitStatus,
    method: 'post',
    data
  })
}

// 新增访视计划
export function addThePlan (data) {
  return request({
    url: Api.addplan,
    method: 'post',
    data
  })
}

// 删除访视计划
export function deleteThePlan (data) {
  return request({
    url: Api.deletePlan,
    method: 'post',
    data
  })
}

// 访视计划列表
export function planTheList (data) {
  return request({
    url: Api.planList,
    method: 'post',
    data
  })
}

// 编辑访视计划
export function updateThePlan (data) {
  return request({
    url: Api.updatePlan,
    method: 'post',
    data
  })
}

// 导入访视计划信息
export function toleadVisitPlan (data) {
  return request({
    url: Api.toleadPlan,
    method: 'post',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// 编辑访视计划
export function deleteVisitPlan (data) {
  return request({
    url: Api.deleteVisit,
    method: 'post',
    data
  })
}
