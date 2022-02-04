// crf患者档案
import request from '@/utils/request'

const api = {
  // stageList: '/boss/update/manager/listTrilStage',
  stageList: '/boss/update/manager/stageList',
  formList: '/boss/crf/form/list',
  tabList: '/boss/crf/stage/list',
  board: '/boss/crf/template/crfReport',
  // dateList: '/boss/crf/template/listReportTime',
  columns: '/boss/crf/dictionary/listByTableCode',
  // 已审核报告单
  reportList: '/boss/crf/template/listReportNo'
}
// 试验阶段列表
export function getStageList (data) {
  return request({
    url: api.stageList,
    method: 'post',
    data
  })
}
// 获取表单列表,最宽的那个
export function getFormList (params) {
  return request({
    url: api.formList,
    method: 'get',
    params
  })
}
// 选项列表，tabList
export function getTabList (params) {
  return request({
    url: api.tabList,
    method: 'get',
    params
  })
}
// 获取底部内容
export function getBoard (params) {
  return request({
    url: api.board,
    method: 'get',
    params
  })
}
// 获取报告时间
// export function getDateList (params) {
//   return request({
//     url: api.dateList,
//     method: 'get',
//     params
//   })
// }
// 获取columns模板
export function getColumns (data) {
  return request({
    url: api.columns,
    method: 'post',
    data
  })
}

// 已审核报告单
export function getReport (params) {
  return request({
    url: api.reportList,
    method: 'get',
    params
  })
}
