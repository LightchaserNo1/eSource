import request from '@/utils/request'

const userApi = {
  adminMessage: '/common/getAdmin',
  invitation: '/common/invite',
  listOrgDepts: '/common/listOrgAreaInfo',
  originationList: '/common/listOrgInfo',
  departmentList: '/common/listOrgAreaInfo',
  verificationCode: '/boss/passport/sendCode',
  sendPhoneCode: '/boss/system/user/phone/update',
  sendEmailCode: '/boss/system/user/email/update',
  adminList: '/common/listAdmin',
  getListOrg: '/common/listOrg',
  uploadFile: '/common/upload'
}

// 通过手机号获取用户信息
export function getAdminMessage (parameter) {
  return request({
    url: userApi.adminMessage,
    method: 'post',
    data: parameter
  })
}
// 获取用户信息后发送邀请
export function sendInvitation (parameter) {
  return request({
    url: userApi.invitation,
    method: 'post',
    data: parameter
  })
}
// 获取组织机构列表
export function getOriginationList (parameter) {
  return request({
    url: userApi.originationList,
    method: 'post',
    data: parameter
  })
}
// 获取组织机构下的科室列表
export function getDepartmentList (parameter) {
  return request({
    url: userApi.departmentList,
    method: 'post',
    data: parameter
  })
}
// 获取验证码
export function getVerificationCode (parameter) {
  return request({
    url: userApi.verificationCode,
    method: 'post',
    data: parameter
  })
}
// 发送验证码(更换手机)
export function sendPhoneCode (parameter) {
  return request({
    url: userApi.sendPhoneCode,
    method: 'post',
    data: parameter
  })
}
// 发送验证码(绑定/更换邮箱)
export function sendEmailCode (parameter) {
  return request({
    url: userApi.sendEmailCode,
    method: 'post',
    data: parameter
  })
}
// 获取角色下的用户列表
export function getAdminList (parameter) {
  return request({
    url: userApi.adminList,
    method: 'post',
    data: parameter
  })
}
// 获取申办方列表
export function getListOrg (parameter) {
  return request({
    url: userApi.getListOrg,
    method: 'post',
    data: parameter
  })
}

export function uploadFile (parameter) {
  return request({
    url: userApi.uploadFile,
    method: 'post',
    data: parameter,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
// 根据医院ID获取科室列表
export function listOrgDepts (parameter) {
  return request({
    url: userApi.listOrgDepts,
    method: 'post',
    data: parameter
  })
}
