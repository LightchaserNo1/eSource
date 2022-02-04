import request from '@/utils/request'

const roleApi = {
  roleList: '/boss/pms/role/list',
  roleAdd: '/boss/pms/role/add',
  roleUpdate: '/boss/pms/role/update',
  roleDelete: '/boss/pms/role/delete',
  roleDetail: '/boss/pms/role/get'
}

export function fetchRoleList (parameter) {
  return request({
    url: roleApi.roleList,
    method: 'post',
    data: parameter
  })
}

export function requestAddRole (parameter) {
  return request({
    url: roleApi.roleAdd,
    method: 'post',
    data: parameter
  })
}

export function requestDeleteRole (parameter) {
  return request({
    url: roleApi.roleDelete,
    method: 'post',
    data: parameter
  })
}

export function requestUpdateRole (parameter) {
  return request({
    url: roleApi.roleUpdate,
    method: 'post',
    data: parameter
  })
}

export function fetchRoleDetail (parameter) {
  return request({
    url: roleApi.roleDetail,
    method: 'post',
    data: parameter
  })
}
