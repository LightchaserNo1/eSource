import request from '@/utils/request'

const api = {
  list: '/boss/system/range/listRangeAdmin',
  add: '/boss/system/range/add',
  update: '/boss/system/range/update',
  del: '/boss/system/range/delete',
  tree: '/boss/system/range/listOrg',
  rangeList: '/boss/system/range/listRange',
  adminList: '/boss/system/range/listAdmin',
  exportVisible: '/boss/system/range/export',
  importVisible: '/boss/system/range/import'
}

export default api

export function getRangeList (params) {
  return request({
    url: api.list,
    method: 'post',
    params
  })
}
export function addRange (data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}
export function updateRange (data) {
  return request({
    url: api.update,
    method: 'post',
    data
  })
}
export function deleteRange (data) {
  return request({
    url: api.del,
    method: 'post',
    data
  })
}
export function getTreeList (params) {
  return request({
    url: api.tree,
    method: 'get',
    params
  })
}

export function getRange (params) {
  return request({
    url: api.rangeList,
    method: 'get',
    params
  })
}

export function getAdminList (params) {
  return request({
    url: api.adminList,
    method: 'get',
    params
  })
}

export function exportVisibleData (parameter) {
  return request({
    url: api.exportVisible,
    method: 'get',
    params: parameter,
    responseType: 'blob'
  })
}

export function importVisibleData (parameter) {
  return request({
    url: api.importVisible,
    method: 'post',
    data: parameter,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
