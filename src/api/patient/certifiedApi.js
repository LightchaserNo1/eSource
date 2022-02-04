import request from '@/utils/request'

const Api = {
  // 获取核证副本tab
  getList: '/boss/project/info/list/proCopyType',
  // 资料列表
  materialList: '/boss/update/manager/listEsCerByPage'
}

export function getTabList (data) {
  return request({
    url: Api.getList,
    method: 'post',
    data
  })
}

export function getMaterialList (data) {
  return request({
    url: Api.materialList,
    method: 'post',
    data
  })
}
