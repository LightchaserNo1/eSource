import request from '@/utils/request'

const api = {
  dailyRecord: '/boss/project/managePts/listCourseInfo',
  exitHos: '/boss/project/managePts/listSumInfo',
  checkRoom: '/boss/project/managePts/listDoctorRound',
  firstRecord: '/boss/project/managePts/listFirstCourse',
  stageBrief: '/boss/project/managePts/listPhaseSum'
}
// 日常病程记录查询
export function dailyRecord (data) {
  return request({
    url: api.dailyRecord,
    method: 'post',
    data
  })
}
// 出院小结
export function exitHos (data) {
  return request({
    url: api.exitHos,
    method: 'post',
    data
  })
}
// 查房记录
export function checkRoom (data) {
  return request({
    url: api.checkRoom,
    method: 'post',
    data
  })
}
// 第一次病程记录
export function firstRecord (data) {
  return request({
    url: api.firstRecord,
    method: 'post',
    data
  })
}
// 阶段小结
export function stageBrief (data) {
  return request({
    url: api.stageBrief,
    method: 'post',
    data
  })
}
