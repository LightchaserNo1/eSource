// eslint-disable-next-line
import { BasicLayout, RouteView } from '@/layouts'
// import store from '@/store/index'
import {
  iconHzjs,
  iconMessage,
  iconPggl,
  iconSetting,
  iconSjrw,
  iconUpload,
  iconXmzl,
  iconHzdl,
  iconYhgl,
  iconCrf,
  iconZzjg,
  iconXxpz,
  iconRzgl,
  iconYnzd,
  iconZxlb
} from '@/core/icons'

// const RouteView = {
//   name: 'RouteView',
//   render: (h) => h('router-view')
// }

const isCenter = true.toString() === process.env.VUE_APP_PLATFORM_CENTER
// const isEnterProject = store.getters.project && store.getters.project.id
/**
 * 异步路由
 */
export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    redirect: '/overview',
    meta: { title: '首页' },
    children: [
      // (项目总览)首页
      {
        path: '/overview',
        name: 'overview',
        component: () => import('@/views/project/Index'),
        redirect: '/overview/all',
        hidden: true,
        meta: { title: '首页', keepAlive: true },
        children: [
          {
            path: '/overview/all',
            name: 'All',
            hidden: true,
            component: () => import('@/views/project/AllProject'),
            meta: { title: '全部项目' }
          },
          {
            path: '/overview/ongoing',
            name: 'Ongoing',
            hidden: true,
            component: () => import('@/views/project/GoingProject'),
            meta: { title: '进行中项目' }
          },
          {
            path: '/overview/close',
            name: 'Close',
            hidden: true,
            component: () => import('@/views/project/ClosedProject'),
            meta: { title: '已关闭项目' }
          },
          {
            path: '/overview/unstart',
            name: 'RouterUnStartProject',
            hidden: true,
            component: () => import('@/views/project/UnStart'),
            meta: { title: '未开启项目' }
          }
        ]
      },
      {
        path: '/project/ProjectAdd',
        name: 'ProjectAdd',
        hidden: true,
        component: () => import('@/views/project/ProjectAdd'),
        meta: { title: '新增项目' }
      },
      // {
      //   path: '/project/ProjectUpdate',
      //   name: 'ProjectUpdate',
      //   hidden: true,
      //   component: () => import('@/views/project/ProjectUpdate'),
      //   meta: { title: '编辑项目' }
      // },
      // {
      //   path: '/project/ProjectDetail',
      //   name: 'ProjectDetail',
      //   hidden: true,
      //   component: () => import('@/views/project/ProjectDetail'),
      //   meta: { title: '项目详情' }
      // },
      {
        path: '/project/ProjectManage',
        name: 'ProjectManage',
        hidden: false,
        hideChildrenInMenu: true,
        component: () => import('@/views/project/ProjectManage'),
        meta: { title: '项目管理', icon: iconXmzl, keepAlive: true }
      },
      {
        path: '/project/AddStudyCenter',
        name: 'AddStudyCenter',
        hidden: true,
        component: () => import('@/views/project/AddStudyCenter'),
        meta: { title: '添加研究中心' }
      },
      {
        path: '/project/UpdateStudyCenter',
        name: 'UpdateStudyCenter',
        hidden: true,
        component: () => import('@/views/project/UpdateStudyCenter'),
        meta: { title: '编辑研究中心' }
      },
      {
        path: '/project/ProjectWatch',
        name: 'ProjectWatch',
        component: () => import('@/views/project/ProjectWatch'),
        hidden: !isCenter,
        hideChildrenInMenu: true,
        meta: { title: '中心列表', icon: iconZxlb, keepAlive: true, permission: ['PROJECT'] }
      },
      // 患者队列
      {
        path: '/project/sickLoop',
        name: 'sickLoop',
        hidden: isCenter,
        component: () => import('@/views/project/SickLoop'),
        hideChildrenInMenu: true,
        meta: { title: '患者队列', icon: iconHzdl, keepAlive: true, permission: ['PROJECT'] }
      },
      // 上传详情
      {
        path: '/project/uploadIndex',
        name: 'UploadIndex',
        hidden: true,
        component: () => import('@/views/upload/UploadIndex'),
        meta: { title: '上传详情', permission: ['PROJECT'] }
      },
      // 项目日志
      {
        path: '/project/projectLog',
        name: 'projectLog',
        hidden: true,
        component: () => import('@/views/project/ProjectLog'),
        meta: { title: '项目日志', permission: ['PROJECT'] }
      },
      // 患者档案
      {
        path: '/project/SickFile',
        name: 'SickFile',
        hidden: true,
        component: () => import('@/views/project/SickFile'),
        meta: { title: '患者档案', permission: ['PROJECT'] }
      },
      // 患者抓取情况
      {
        path: '/project/CaptureCase',
        name: 'CaptureCase',
        hidden: true,
        component: () => import('@/views/project/CaptureCase'),
        meta: { title: '患者抓取情况', permission: ['PROJECT'] }
      },
      // 查看日志
      {
        path: '/project/WatchLog',
        name: 'WatchLog',
        hidden: true,
        component: () => import('@/views/project/WatchLog'),
        meta: { title: '查看日志', permission: ['PROJECT'] }
      },
      // 录入评估表
      {
        path: '/project/EstimateInput',
        name: 'EstimateInput',
        hidden: true,
        component: () => import('@/views/project/EstimateInput'),
        meta: { title: '录入评估表', permission: ['PROJECT'] }
      },
      // 患者检索
      {
        path: '/patient',
        name: 'PatientIndex',
        hidden: false,
        hideChildrenInMenu: true,
        component: () => import('@/views/patient/Index'),
        meta: { title: '患者检索', icon: iconHzjs, keepAlive: true, permission: ['PatientManage'] }
      },
      // 上传管理
      {
        path: '/upload',
        component: RouteView,
        redirect: '/upload/index',
        name: 'upload',
        hidden: false,
        hideChildrenInMenu: true,
        meta: { title: '上传管理', icon: iconUpload, keepAlive: true, permission: ['UploadManage'] },
        children: [
          {
            path: '/upload/index',
            name: 'UploadIndex',
            component: () => import('@/views/upload/Index'),
            meta: { title: '上传详情', keepAlive: true, permission: ['UploadManage'] }
          }
        ]
      },
      // 消息管理
      {
        path: '/message',
        component: RouteView,
        redirect: '/message/index',
        name: 'Message',
        hideChildrenInMenu: true,
        hidden: false,
        meta: { title: '消息管理', icon: iconMessage, keepAlive: true, permission: ['Message'] },
        children: [
          {
            path: '/message/index',
            name: 'MessageIndex',
            component: () => import('@/views/message/Index'),
            meta: { title: '消息管理', keepAlive: true, permission: ['Message'] }
          },
          {
            path: '/message/uploadVerify',
            name: 'uploadVerify',
            component: () => import('@/views/upload/uploadVerify'),
            meta: { title: '上传审核', permission: ['Message'] }
          },
          {
            path: '/message/upload',
            name: 'crcUpload',
            component: () => import('@/views/upload/Uploadcrc'),
            meta: { title: '上传审核', permission: ['Message'] }
          },
          {
            path: '/message/cbcReport',
            name: 'cbcReport',
            component: () => import('@/views/message/components/cbcReport'),
            meta: { title: '检验结果报告单', permission: ['Message'] }
          },
          {
            path: '/message/cbcfinishReport',
            name: 'cbcfinishReport',
            component: () => import('@/views/message/components/cbcfinishReport'),
            meta: { title: '检验结果报告单', permission: ['Message'] }
          },
          {
            path: '/message/xdtReport',
            name: 'xdtReport',
            component: () => import('@/views/message/components/xdtReport'),
            meta: { title: '检查结果报告单', permission: ['Message'] }
          },
          {
            path: '/message/xdtfinishReport',
            name: 'xdtfinishReport',
            component: () => import('@/views/message/components/xdtfinishReport'),
            meta: { title: '检查结果报告单', permission: ['Message'] }
          }
        ]
      },
      // 数据任务
      {
        path: '/task',
        name: 'TaskIndex',
        hidden: false,
        hideChildrenInMenu: true,
        component: () => import('@/views/task/Index'),
        meta: { title: '数据任务', icon: iconSjrw, keepAlive: true, permission: ['DataTask'] }
      },
      // 评估管理
      {
        path: '/estimate',
        name: 'EstimateIndex',
        hidden: false,
        hideChildrenInMenu: true,
        component: () => import('@/views/estimate/Index'),
        meta: { title: '评估管理', icon: iconPggl, keepAlive: true, permission: ['EstimateManage'] }
      },
      //
      {
        path: '/user-manage',
        name: 'ProjectUserManage',
        component: () => import('@/views/system/index'),
        hidden: false,
        hideChildrenInMenu: true,
        meta: { title: '用户管理', icon: iconYhgl, keepAlive: true, permission: ['SYSTEM'] }
      },
      // 后台设置
      {
        path: '/config',
        component: RouteView,
        redirect: '/crf-config/index',
        name: 'Config',
        meta: { title: '后台设置', icon: iconSetting, keepAlive: true, permission: ['CRF', 'ORGANIZATION', 'SYSTEM', 'DICTIONARY_CONFIG', 'LOG'] },
        children: [
          {
            path: '/org-manage/index',
            name: 'OrgManage',
            component: () => import('@/views/organization/Index'),
            meta: { title: '组织机构管理', icon: iconZzjg, keepAlive: true, permission: ['ORGANIZATION'] }
          },
          {
            path: '/crf-config/index',
            name: 'CRFConfig',
            component: () => import('@/views/crf-config/Index'),
            meta: { title: 'CRF相关配置', icon: iconCrf, keepAlive: true, permission: ['CRF'] }
          },
          {
            path: '/dictionary',
            name: 'drugsConfig',
            component: () => import('@/views/dictionary/drugsConfig'),
            meta: { title: '院内字典管理', icon: iconYnzd, keepAlive: true, permission: ['DICTIONARY'] }
          },
          // {
          //   path: '/account-visible/index',
          //   name: 'AccountVisible',
          //   component: () => import('@/views/account-visible/index'),
          //   meta: { title: '用户可见范围', keepAlive: false }
          // },
          {
            path: '/user-manage/index',
            name: 'UserManage',
            component: () => import('@/views/system/index'),
            hidden: false,
            hideChildrenInMenu: true,
            meta: { title: '用户管理', icon: iconYhgl, keepAlive: true, permission: ['SYSTEM'] }
          },
          // {
          //   path: '/term-manage/index',
          //   name: 'TermManage',
          //   component: () => import('@/views/term/Index'),
          //   meta: { title: '术语管理', keepAlive: true }
          // },
          {
            path: '/option-config/index',
            name: 'OptionConfig',
            component: () => import('@/views/option/OptionConfig'),
            meta: { title: '选项配置', icon: iconXxpz, keepAlive: true, permission: ['DICTIONARY_CONFIG'] }

          },
          {
            path: '/log-manage/index',
            name: 'LogManage',
            component: () => import('@/views/system-log/index'),
            meta: { title: '日志管理', icon: iconRzgl, keepAlive: true, permission: ['LOG'] }

          }
        ]
      },
      // 用户信息
      {
        path: '/user-info',
        component: RouteView,
        redirect: '/user-info/index',
        name: 'UserInfo',
        hidden: true,
        meta: { title: '用户信息', icon: 'team', keepAlive: true },
        children: [
          {
            path: '/user-info/index',
            name: 'UserInfo',
            component: () => import('@/views/user/UserInfo'),
            meta: { title: '编辑信息', keepAlive: true }
          }
        ]
      },
      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        hidden: true,
        redirect: '/exception/403',
        meta: { title: 'menu.exception', icon: 'warning', permission: ['exception'] },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: 'menu.exception.not-permission', permission: ['exception'] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: 'menu.exception.not-find', permission: ['exception'] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: 'menu.exception.server-error', permission: ['exception'] }
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user/login',
    hidden: true,
    name: 'login',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
  },
  // 隐私政策
  {
    path: '/user/privacyPolicy',
    hidden: true,
    name: 'privacyPolicy',
    component: () => import('@/views/user/privacyPolicy')
  },
  // 用户协议
  {
    path: '/user/agreement',
    hidden: true,
    name: 'agreement',
    component: () => import('@/views/user/agreement')
  },
  // 人脸识别
  {
    path: '/attestation',
    name: 'attestation',
    hidden: true,
    component: () => import('@/views/attestation/Index')
  },
  // 完善个人信息
  {
    path: '/person',
    name: 'Person',
    component: () => import('@/views/person/Index'),
    meta: { title: '完善个人信息', keepAlive: true, icon: 'apartment' }
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
