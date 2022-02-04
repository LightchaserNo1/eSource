import request from '@/utils/request'

const roleApi = {
  list: '/boss/system/role/list',
  roleList: '/common/getSystemRole',
  add: '/boss/system/role/add',
  del: '/boss/system/role/delete',
  upData: '/boss/system/role/update',
	userRole: '/boss/system/role/getPms',
	listPro: '/boss/pro/role/list',
	addPro: '/boss/pro/role/add',
	delPro: '/boss/pro/role/delete',
	upDataPro: '/boss/pro/role/update',
	userRolePro: '/boss/pro/role/getPms'
}
export function getRoleListPro (parameter) {
  return request({
    url: roleApi.listPro,
    method: 'post',
    data: parameter
  })
}
export function getRoleList (parameter) {
  return request({
    url: roleApi.list,
    method: 'post',
    data: parameter
  })
}
export function getRole (parameter) {
  return request({
    url: roleApi.roleList,
    method: 'post',
    data: parameter
  })
}
// 和payment保持一致，故多加此行
export function roleList (parameter) {
  return request({
    url: roleApi.roleList,
    method: 'post',
    data: parameter
  })
}
export function addRolePro (parameter) {
	return request({
		url: roleApi.addPro,
		method: 'post',
		data: parameter
	})
}
export function addRole (parameter) {
    return request({
      url: roleApi.add,
      method: 'post',
      data: parameter
    })
}
export function getRoleDetail (parameter) {
	return request({
		url: roleApi.add,
		method: 'post',
		data: parameter
	})
}
export function upDataRolePro (parameter) {
	return request({
		url: roleApi.upDataPro,
		method: 'post',
		data: parameter
	})
}
  export function upDataRole (parameter) {
    return request({
      url: roleApi.upData,
      method: 'post',
      data: parameter
    })
	}
	export function delRolePro (parameter) {
    return request({
      url: roleApi.delPro,
      method: 'post',
      data: parameter
    })
  }
  export function delRole (parameter) {
    return request({
      url: roleApi.del,
      method: 'post',
      data: parameter
    })
  }

	export function userRolePro (parameter) {
    return request({
      url: roleApi.userRolePro,
      method: 'post',
      data: parameter
    })
  }
  export function userRole (parameter) {
    return request({
      url: roleApi.userRole,
      method: 'post',
      data: parameter
    })
  }
