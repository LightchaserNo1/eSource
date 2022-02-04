import request from '@/utils/request'
// import requestJson from '@/utils/requestJson'

const api = {
  // 报价单
  list: '/offer/research',
  add: '/offer/add',
  update: '/offer/update',
  del: '/offer/delete',
  info: '/offer/details'
}

export default api
// 报价单列表
export function getList (parameter) {
  return request({
    url: api.list,
    method: 'get',
    params: parameter
  })
}
// 新增报价单
export function QuotationAdd (data) {
  return request({
    url: api.add,
    method: 'POST',
    data
  })
}
// 修改报价单
export function QuotationUpdate (data) {
  return request({
    url: api.update,
    method: 'POST',
    data
  })
}
// 删除报价单
export function QuotationDel (parameter) {
  return request({
    url: api.del,
    method: 'get',
    params: parameter
  })
}
// 获取报价单信息
export function QuotationInfo (parameter) {
  return request({
    url: api.info,
    method: 'get',
    params: parameter
  })
}
