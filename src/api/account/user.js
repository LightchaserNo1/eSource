import request from '@/utils/request'

const userApi = {
  userList: '/boss/pms/admin/list',
  userAdd: '/boss/pms/admin/add',
  userUpdate: '/boss/pms/admin/update',
  userRoleList: '/boss/pms/admin/getRoleList',
  userDelete: '/boss/pms/admin/deleteById'
}

export function fetchUserList (parameter) {
  return request({
    url: userApi.userList,
    method: 'post',
    data: parameter
  })
}

export function requestAddUser (parameter) {
  return request({
    url: userApi.userAdd,
    method: 'post',
    data: parameter
  })
}

export function requestDeleteUser (parameter) {
  return request({
    url: userApi.userDelete,
    method: 'post',
    data: parameter
  })
}

export function requestUpdateUser (parameter) {
  return request({
    url: userApi.userUpdate,
    method: 'post',
    data: parameter
  })
}

export function fetchUserRoleList (parameter) {
  return request({
    url: userApi.userRoleList,
    method: 'post',
    data: parameter
  })
}
