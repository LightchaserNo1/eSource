import request from '@/utils/request'
const userApi = {
  userList: '/boss/org/info/list',
  institutionsDetail: '/boss/org/info/detail', // 查
  institutionsAdd: '/boss/org/info/add', // 增
  institutionsUpdate: '/boss/org/info/update', // 改
  institutionsDelete: '/boss/org/info/delete', // 删
  treeNode: '/boss/org/hospital/listTree', // 字点树形
  treeList: '/boss/org/hospital/list', // 字点列表
  upload: '/boss/org/hospital/upload', // 上传
  dictionary: '/common/dictionary', // 数据类型
  addDept: '/boss/org/hospital/addDept', // 科室添加
  updateDept: '/boss/org/hospital/updateDept', // 科室编辑
  deleteDept: '/boss/org/hospital/deleteDept', // 科室禁用
  invoke: '/boss/org/hospital/invoke', // 科室启用
  uploadFile: '/common/upload'
}
export function getInvoke (parameter) {
  return request({
    url: userApi.invoke,
    method: 'post',
    data: parameter
  })
}
export function getAddDept (parameter) {
  return request({
    url: userApi.addDept,
    method: 'post',
    data: parameter
  })
}
export function getUpdateDept (parameter) {
  return request({
    url: userApi.updateDept,
    method: 'post',
    data: parameter
  })
}
export function getDeleteDept (parameter) {
  return request({
    url: userApi.deleteDept,
    method: 'post',
    data: parameter
  })
}

export function getDictionary (parameter) {
  return request({
    url: userApi.dictionary,
    method: 'post',
    data: parameter
  })
}
export function getUpload (parameter) {
  return request({
    url: userApi.upload,
    method: 'post',
    data: parameter,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
export function getTreeNode (parameter) {
  return request({
    url: userApi.treeNode,
    method: 'post',
    data: parameter
  })
}
export function getTreeList (parameter) {
  return request({
    url: userApi.treeList,
    method: 'post',
    data: parameter
  })
}

export function getInstitutionsList (parameter) {
  return request({
    url: userApi.userList,
    method: 'post',
    data: parameter
  })
}
export function getInstitutionsDetail (parameter) {
  return request({
    url: userApi.institutionsDetail,
    method: 'post',
    data: parameter
  })
}
export function getInstitutionsAdd (parameter) {
  return request({
    url: userApi.institutionsAdd,
    method: 'post',
    data: parameter
  })
}
export function getInstitutionsUpdate (parameter) {
  return request({
    url: userApi.institutionsUpdate,
    method: 'post',
    data: parameter
  })
}
export function getInstitutionsDelete (parameter) {
  return request({
    url: userApi.institutionsDelete,
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
