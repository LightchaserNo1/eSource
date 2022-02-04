import request from '@/utils/request'

const pmsApi = {
  list: '/boss/system/pms/listAll',
  add: '/boss/system/pms/add',
  remove: '/boss/system/pms/delete',
	update: '/boss/system/pms/update',
	listPro: '/boss/pro/pms/listAll',
	addPro: '/boss/pro/pms/add',
	removePro: '/boss/pro/pms/delete',
	updatePro: '/boss/pro/pms/update'
}
export function permissionListPro (parameter) {
	return request({
		url: pmsApi.listPro,
		method: 'get',
		params: parameter
	})
}

export function permissionList (parameter) {
    return request({
      url: pmsApi.list,
      method: 'get',
      params: parameter
    })
}
export function addPermissionPro (parameter) {
	return request({
		url: pmsApi.addPro,
		method: 'post',
		data: parameter
	})
}
  export function addPermission (parameter) {
    return request({
      url: pmsApi.add,
      method: 'post',
      data: parameter
    })
	}
	export function updatePermissionPro (parameter) {
    return request({
      url: pmsApi.updatePro,
      method: 'post',
      data: parameter
    })
	}

  export function updatePermission (parameter) {
    return request({
      url: pmsApi.update,
      method: 'post',
      data: parameter
    })
	}
	export function removePermissionPro (parameter) {
    return request({
      url: pmsApi.removePro,
      method: 'post',
      data: parameter
    })
  }
  export function removePermission (parameter) {
    return request({
      url: pmsApi.remove,
      method: 'post',
      data: parameter
    })
  }
