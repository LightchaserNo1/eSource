import request from '@/utils/request'

const api = {
  add: '/boss/project/pts/job/add',
  update: '/boss/project/pts/job/update',
  taskList: '/boss/project/pts/job/list',
  resource: '/boss/repository/job/list',
  del: '/boss/project/pts/job/delete',
  // 数据源接口
  dataSource: '/boss/repository/database/list',
  listPa: '/boss/project/manage/listPa',
  projectList: '/boss/project/info/list',
  up: '/boss/project/upload/center/add',
  // 上报审核列表
  checkList: '/boss/project/upload/center/list',
  loopDetail: '/boss/project/upload/center/listPtsInfo',
  hand: '/boss/project/pts/job/handStart',
  log: '/boss/project/managePts/listJobLog',
  upNum: '/boss/project/upload/center/listUpLoadTimes'
}

export default api

export function addTask (data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}
export function updateTask (data) {
  return request({
    url: api.update,
    method: 'post',
    data
  })
}
export function getTaskList (params) {
  return request({
    url: api.taskList,
    method: 'get',
    params
  })
}
// 获取作业下拉列表
export function getResource (params) {
  return request({
    url: api.resource,
    method: 'get',
    params
  })
}
// 删除任务
export function deleteTask (params) {
  return request({
    url: api.del,
    method: 'get',
    params
  })
}
// 获取数据源
export function getDataSource (params) {
  return request({
    url: api.dataSource,
    method: 'get',
    params
  })
}
// 患者队列接口(数据上报)
export function getListPa (data) {
  return request({
    url: api.listPa,
    method: 'post',
    data
  })
}
// 获取项目列表
export function getProjectList (data) {
  return request({
    url: api.projectList,
    method: 'post',
    data
  })
}
// 上报
export function upReport (data) {
  return request({
    url: api.up,
    method: 'post',
    data
  })
}
// 上报审核列表
export function getUpCheckList (params) {
  return request({
    url: api.checkList,
    method: 'get',
    params
  })
}
// 查看队列
export function watchLoop (params) {
  return request({
    url: api.loopDetail,
    method: 'get',
    params
  })
}
// 手动运行
export function handOperation (params) {
  return request({
    url: api.hand,
    method: 'get',
    params
  })
}
// 运行日志列表
export function getLogList (data) {
  return request({
    url: api.log,
    method: 'post',
    data
  })
}
// 查看上报次数详情
export function watchNum (params) {
  return request({
    url: api.upNum,
    method: 'get',
    params
  })
}
