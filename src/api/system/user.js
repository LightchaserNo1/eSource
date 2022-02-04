import request from '@/utils/request'

const userApi = {
  userList: '/boss/system/user/list',
  userListPro: '/boss/system/user/listByProId',
  userAdd: '/boss/system/user/add',
  userUpdate: '/boss/system/user/update',
  joinProject: '/boss/project/info/join',
  userImport: '/boss/system/user/import',
  userExport: '/boss/system/user/export',
  personDetail: '/boss/admin/info/detail',
  userDetail: 'boss/system/user/userDetail',
  RangePro: 'boss/system/range/listRangeAdminByProId',
  updatePerson: '/boss/admin/info/update',
  userForbidden: '/boss/system/user/status/update',
  updatePassword: '/boss/system/user/pwd/update'
  // changeStatus: '/boss/system/user/status/update'
}

const orgApi = {
    list: '/common/listOrgInfo',
    areaList: '/common/listOrgAreaInfo'
}
// 加入项目
export function joinProject (parameter) {
  return request({
      url: userApi.joinProject,
      method: 'post',
      data: parameter
  })
}
// 账户列表(进项目)
export function getRangeListPro (parameter) {
  return request({
    url: userApi.RangePro,
    method: 'post',
    data: parameter
  })
}
export function getUserList (parameter) {
  return request({
    url: userApi.userList,
    method: 'post',
    data: parameter
  })
}
// 进项目获取用户列表
export function getUserListPro (parameter) {
  return request({
    url: userApi.userListPro,
    method: 'post',
    data: parameter
  })
}
export function addUser (parameter) {
  return request({
    url: userApi.userAdd,
    method: 'post',
    data: parameter
  })
}

export function updateUser (parameter) {
    return request({
      url: userApi.userUpdate,
      method: 'post',
      data: parameter
    })
  }

export function getOrgList (parameter) {
    return request({
      url: orgApi.list,
      method: 'post',
      data: parameter
    })
  }

  export function getAreaList (parameter) {
    return request({
      url: orgApi.areaList,
      method: 'post',
      data: parameter
    })
  }

    // 账号导入
export function userImport (parameter) {
  return request({
    url: userApi.userImport,
    method: 'post',
    data: parameter,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function userExport (parameter) {
  return request({
    url: userApi.userExport,
    method: 'get',
    params: parameter,
    responseType: 'blob'
  })
}

// 获取个人信息
export function getUserDetail (parameter) {
  return request({
    url: userApi.userDetail,
    method: 'post',
    data: parameter
  })
}

// 获取个人信息
export function getPersonDetail (parameter) {
  return request({
    url: userApi.personDetail,
    method: 'post',
    data: parameter
  })
}
// 更新个人信息
export function updatePersonDetail (parameter) {
  return request({
    url: userApi.updatePerson,
    method: 'post',
    data: parameter
  })
}
// 修改禁用/启用状态
export function updataForbidden (parameter) {
  return request({
    url: userApi.userForbidden,
    method: 'post',
    data: parameter
  })
}

// 个人中心修改密码
export function updatePassword (parameter) {
  return request({
    url: userApi.updatePassword,
    method: 'post',
    data: parameter
  })
}
