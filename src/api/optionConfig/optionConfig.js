import request from '@/utils/request'

const api = {
  treeList: '/common/dictionaryType',
  list: '/common/dictionary',
  add: '/common/addDictionary',
  del: '/common/deleteDictionary',
  update: '/boss/system/dictionary/update',
  code: '/boss/system/dictionary/getMetaCode'
}
// 获取树列表
export function getTreeList (data) {
  return request({
    url: api.treeList,
    method: 'post',
    data
  })
}
// 获取字典列表
export function getDictionaryList (data) {
  return request({
    url: api.list,
    method: 'post',
    data
  })
}
// 添加字典列表
export function addDictionary (data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}
// 删除字典列表
export function deleteDictionary (data) {
  return request({
    url: api.del,
    method: 'post',
    data
  })
}
// 更新字典列表
export function updateDictionary (data) {
  return request({
    url: api.update,
    method: 'post',
    data
  })
}
// 获取随机编码
export function getRandomCode (data) {
  return request({
    url: api.code,
    method: 'post',
    data
  })
}
