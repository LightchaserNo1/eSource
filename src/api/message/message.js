import request from '@/utils/request'

const api = {
  list: '/boss/message/manager/list',
  isUn: '/boss/message/manager/isUn',
  add: '/boss/message/manager/add',
  update: '/boss/message/manager/update',
  hzlist: '/boss/update/manager/list',
  verifyCer: '/boss/update/manager/verifyCer',
  cbcList: '/boss/report/manager/list',
  listRep: '/boss/report/manager/listRep',
  resultJudge: '/boss/report/manager/resultJudge',
  upRepInfo: '/boss/report/manager/upRepInfo',
  visitJudge: '/boss/report/manager/visitJudge'
}
// 新增消息-----------------------过期
export function add (parameter) {
  return request({
    url: api.add,
    method: 'post',
    data: parameter,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
// 消息更新
export function updateMsg (parameter) {
  return request({
    url: api.update,
    method: 'post',
    data: parameter,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
// 是否有未处理消息
export function isUn (parameter) {
  return request({
    url: api.isUn,
    method: 'post',
    data: parameter,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
//  消息列表
export function getList (data) {
  return request({
    url: api.list,
    method: 'post',
    data
  })
}
// 核证副本列表
export function hzList (parameter) {
  return request({
    url: api.hzlist,
    method: 'post',
    data: parameter,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
//  核证副本审核
export function verifyCer (parameter) {
  return request({
    url: api.verifyCer,
    method: 'post',
    data: parameter,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
//  检查项目列表
export function ckList (parameter) {
  return request({
    url: api.cbcList,
    method: 'post',
    data: parameter
  })
}
//  检验检查结果列表
export function listRep (parameter) {
  return request({
    url: api.listRep,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: parameter
  })
}
//  结果判断
export function resultJudge (parameter) {
  return request({
    url: api.resultJudge,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: parameter
  })
}
//  更新报告信息
export function upRepInfo (parameter) {
  return request({
    url: api.upRepInfo,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: parameter
  })
}
//  结果判断
export function visitJudge (parameter) {
  return request({
    url: api.visitJudge,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: parameter
  })
}
