import request from '@/utils/request'

const userApi = {
  Login: '/boss/passport/login',
  Logout: '/boss/passport/logout',
  UserInfo: '/boss/system/user/pmsInfo',
  emailCode: '/common/send/emailCode',
  bindEmail: '/boss/system/user/email/update',
  phoneCode: '/boss/passport/sendCode',
  bindPhone: '/boss/system/user/phone/update',
  reset: '/boss/passport/reset'
}

export function login (parameter) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: parameter
  })
}

export function getInfo (parameter) {
  return request({
    url: userApi.UserInfo,
    method: 'get',
    params: parameter,
    headers: {
			'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout () {
  return request({
    url: userApi.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 获取邮箱验证码
export function getEmailCode (parameter) {
  return request({
    url: userApi.emailCode,
    method: 'post',
    data: parameter
  })
}

// 绑定邮箱
export function bindEmail (parameter) {
  return request({
    url: userApi.bindEmail,
    method: 'post',
    data: parameter
  })
}

// 获取手机号验证码
export function getPhoneCode (parameter) {
  return request({
    url: userApi.phoneCode,
    method: 'post',
    data: parameter
  })
}

// 绑定手机号
export function bindPhone (parameter) {
  return request({
    url: userApi.bindPhone,
    method: 'post',
    data: parameter
  })
}

// 忘记密码
export function getReset (parameter) {
  return request({
    url: userApi.reset,
    method: 'post',
    data: parameter
  })
}
