/* eslint-disable eol-last */
import request from '@/utils/request'

const api = {
    list: '/boss/project/info/list',
    add: '/boss/project/info/add',
    update: '/boss/project/info/update',
    remove: '/boss/project/info/delete',
    detail: '/boss/project/info/detail',
    researcherList: '/boss/project/team/listTeam',
    studyCenterList: '/boss/project/manage/listResearch',
    addStudyCenter: '/boss/project/team/research/addEsResearch',
    centerMemberList: '/boss/project/team/research/listMember', // 研究中心里的成员列表
    phoneInfo: '/common/getAdmin',
    // 研究团队邀请项目负责人，
    invite: '/boss/project/team/invite',
    // 邀请团队成员
    inviteTeam: '/boss/project/team/inviteTeam',
    orgList: '/boss/org/info/list',
    officeList: '/common/listOrgAreaInfo',
    deleteStudyCenter: '/boss/project/team/research/delete',
    // 研究中心邀请研究成员
    detailAdd: '/boss/project/team/research/addResearchDetail',
    studyCenterDetail: '/boss/project/team/research/detail',
    studyCenterUpdate: '/boss/project/team/research/updateResearch',
    sponsorList: '/boss/org/info/listByPage',
    // 项目试验阶段列表
    stageList: '/boss/project/stage/list',
    // 新增试验阶段
    addStage: '/boss/project/stage/add',
    // 编辑试验阶段
    updateStage: '/boss/project/stage/update',
    // 删除试验阶段
    delStage: '/boss/project/stage/delete',
    // 受邀者列表
    inviterList: '/boss/system/role/listRole',
    // 加入项目
    joinProject: '/boss/project/info/join',
    // 删除团队成员(研究团队专用)
    deleteMember: '/boss/project/team/deleteTeam',
    // 研究中心删除成员
    centerDelMember: '/boss/project/team/research/deleteMember',
    // 发送pin码
    resetPin: '/boss/project/team/reinvite',
    // 导出项目
    projectExport: '/boss/project/info/export',
    // 导入项目
    projectImport: '/boss/project/info/import',
    updateStudyMember: '/boss/project/team/updateTeam',
    // 同步医院列表
    syncHosptial: '/boss/org/interface/address/list',
    // 同步医院请求
    syncTheHosptial: '/boss/project/info/importByInterface'
}

export default api

// 发送pin码
export function resetPin (parameter) {
    return request({
        url: api.resetPin,
        method: 'post',
        data: parameter
    })
}

// 加入项目
export function joinProject (parameter) {
    return request({
        url: api.joinProject,
        method: 'post',
        data: parameter
    })
}
// 获取申办列表
export function getSponsorList (data) {
    return request({
        url: api.sponsorList,
        method: 'post',
        data
    })
}
// 研究团队邀请项目负责人
export function actionInvite (data) {
    return request({
        url: api.invite,
        method: 'post',
        data
    })
}
// 研究团队邀请团队成员
export function actionInviteTeam (data) {
    return request({
        url: api.inviteTeam,
        method: 'post',
        data
    })
}
// 获取机构列表
export function getOrgList (data) {
    return request({
        url: api.orgList,
        method: 'post',
        data
    })
}
// 通过组织机构获取下属科室
export function getOfficeByOrg (data) {
    return request({
        url: api.officeList,
        method: 'post',
        data
    })
}
// 获取项目列表
export function getProjectList (data) {
    return request({
        url: api.list,
        method: 'post',
        data
    })
}
// 获取项目详情
export function getProjectDetail (data) {
    return request({
        url: api.detail,
        method: 'post',
        data
    })
}
// 添加项目
export function addProject (data) {
    return request({
        url: api.add,
        method: 'POST',
        data
    })
}
// 更新项目
export function updateProject (data) {
    return request({
        url: api.update,
        method: 'post',
        data
    })
}
// 删除项目
export function deleteProject (parameter) {
    return request({
        url: api.remove,
        method: 'post',
        params: parameter
    })
}
// 研究中心列表
export function getStudyCenterList (data) {
    return request({
        url: api.studyCenterList,
        method: 'post',
        data
    })
}
// 添加研究中心
export function addStudyCenter (data) {
    return request({
        url: api.addStudyCenter,
        method: 'post',
        data
    })
}
// 研究中心成员列表
export function getCenterMemberList (data) {
    return request({
        url: api.centerMemberList,
        method: 'post',
        data
    })
}
// 研究成员列表
export function getResearcherList (data) {
    return request({
        url: api.researcherList,
        method: 'post',
        data
    })
}
// 根据手机号获取用户信息
export function getUserInfoByPhone (data) {
    return request({
        url: api.phoneInfo,
        method: 'post',
        data
    })
}
// 研究中心删除
export function deleteStudyCenter (data) {
    return request({
        url: api.deleteStudyCenter,
        method: 'post',
        data
    })
}
// 研究中心详情添加
export function detailAdd (data) {
    return request({
        url: api.detailAdd,
        method: 'post',
        data
    })
}
// 研究中心详情接口
export function studyCenterDetail (data) {
    return request({
        url: api.studyCenterDetail,
        method: 'post',
        data
    })
}
// 更新研究中心
export function updateStudyCenter (data) {
    return request({
        url: api.studyCenterUpdate,
        method: 'post',
        data
    })
}
// 获取项目试验阶段列表
export function getStageList (params) {
    return request({
        url: api.stageList,
        method: 'get',
        params
    })
}
// 新增试验阶段
export function addStage (params) {
    return request({
        url: api.addStage,
        method: 'get',
        params
    })
}
// 编辑试验阶段
export function updateStage (params) {
    return request({
        url: api.updateStage,
        method: 'get',
        params
    })
}
// 删除试验阶段
export function delStage (params) {
    return request({
        url: api.delStage,
        method: 'get',
        params
    })
}
// 受邀者列表
export function getInviter (data) {
    return request({
        url: api.inviterList,
        method: 'post',
        data
    })
}
// 删除团队成员(研究团队里专用)
export function deleteMember (data) {
    return request({
        url: api.deleteMember,
        method: 'post',
        data
    })
}
// 研究中心删除成员
export function deleteCenterMember (data) {
    return request({
        url: api.centerDelMember,
        method: 'post',
        data
    })
}
// 导出项目
export function exportProject (params) {
    return request({
        url: api.projectExport,
        method: 'get',
        params
    })
}
export function importProject (data) {
  return request({
      url: api.projectImport,
      method: 'post',
      data,
      headers: { 'Content-Type': 'multipart/form-data' }
  })
}
// 更新团队成员
export function updateStudyMember (data) {
    return request({
        url: api.updateStudyMember,
        method: 'post',
        data
    })
}

// 同步医院列表
export function syncHosptialList (data) {
    return request({
        url: api.syncHosptial,
        method: 'post',
        data
    })
}

// 同步医院请求
export function syncToHosptial (data) {
    return request({
        url: api.syncTheHosptial,
        method: 'post',
        data
    })
}
