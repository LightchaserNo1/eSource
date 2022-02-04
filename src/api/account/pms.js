import request from '@/utils/request'

const pmsApi = {
  pmsList: '/boss/pms/permission/listAll',
  pmsAdd: '/boss/pms/permission/add',
  pmsDelete: '/boss/pms/permission/delete',
  pmsUpdate: '/boss/pms/permission/update'
}

export function fetchPermissionList (parameter) {
  return request({
    url: pmsApi.pmsList,
    method: 'post',
    data: parameter
  })
}

export function requestAddPermission (parameter) {
  return request({
    url: pmsApi.pmsAdd,
    method: 'post',
    data: parameter
  })
}

export function requestDeletePermission (parameter) {
  return request({
    url: pmsApi.pmsDelete,
    method: 'post',
    data: parameter
  })
}

export function requestUpdatePermission (parameter) {
  return request({
    url: pmsApi.pmsUpdate,
    method: 'post',
    data: parameter
  })
}
