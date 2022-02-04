import request from '@/utils/request'

const deptApi = {
  deptList: '/boss/pms/dept/list',
  deptAdd: '/boss/pms/dept/add',
  deptUpdate: '/boss/pms/dept/update',
  deptDelete: '/boss/pms/dept/delete'
}

export function fetchDepartmentList (parameter) {
  return request({
    url: deptApi.deptList,
    method: 'post',
    data: parameter
  })
}

export function requestAddDepartment (parameter) {
  return request({
    url: deptApi.deptAdd,
    method: 'post',
    data: parameter
  })
}

export function requestDeleteDepartment (parameter) {
  return request({
    url: deptApi.deptDelete,
    method: 'post',
    data: parameter
  })
}

export function requestUpdateDepartment (parameter) {
  return request({
    url: deptApi.deptUpdate,
    method: 'post',
    data: parameter
  })
}
