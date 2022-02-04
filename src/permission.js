import router, { resetRouter } from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN, CURRENT_PROJECT } from '@/store/mutation-types'
import { i18nRender } from '@/locales'
import Watermark from './components/watermark'
import { getPhoneTail } from '@/utils/util'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const allowList = ['login', 'attestation', 'reset', 'privacyPolicy', 'agreement'] // 免登录页面地址
const loginRoutePath = '/user/login'
const defaultRoutePath = '/'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`))
  /* has token */
  if (allowList.includes(to.name)) {
    // 在免登录名单，直接进入
    next()
  } else {
    if (storage.get(ACCESS_TOKEN)) {
      if (to.path === loginRoutePath) {
        next({ path: defaultRoutePath })
        NProgress.done()
      } else {
        // console.log('=== router ===', to, from)
        // console.log('##### router.before project ######', store.getters.project)
        // console.log('##### router.before roles ######', store.getters.roles)

        let proId = null
        if (store.getters.project != null) {
          proId = store.getters.project.id
        } else {
          // 修复 在项目列表页面 重新加载页面 bootstrap Initializer 方法 还未执行时 获取不到 proId
          const pro = storage.get(CURRENT_PROJECT)
          if (pro != null && pro.length > 0) {
            const project = JSON.parse(pro)
            proId = project.id
          }
        }
        // 未进入项目 拉取登录权限
        if (to.name === 'All' && from.name !== 'All' && proId != null) {
          store.dispatch('ClearProject')
          proId = null
        }
        if (store.getters.pms.length === 0) {
          // console.log('======store.getters.info========', store.getters.userInfo)
          // if (store.getters.userInfo != null && store.getters.userInfo.isAdmin === 1) {
            // 超级管理员 不传项目id 获取所有权限
            // proId = ''
          // }
            store
            .dispatch('GetInfo', proId)
              .then((menus, pms) => {
              // console.log('======== dispatch GetInfo ===========', menus, pms)
              // generate dynamic router
              store.dispatch('GenerateRoutes', menus).then(() => {
                // 根据roles权限生成可访问的路由表
                // 动态添加可访问路由表
                resetRouter()
                router.addRoutes(store.getters.addRouters)
                // 请求带有 redirect 重定向时，登录自动重定向到该地址
                const redirect = decodeURIComponent(from.query.redirect || to.path)
                // console.log('######## redirect ########', redirect)
                if (to.path === redirect) {
                  // set the replace: true so the navigation will not leave a history record
                  next({ ...to,
                    replace: true
                  })
                } else {
                  // 跳转到目的路由
                  next({
                    path: redirect
                  })
                }
              })
            })
            .catch((err) => {
              console.log('###############', err)
              notification.error({
                message: '错误',
                description: '请求用户信息失败，请重试'
              })
              // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
              store.dispatch('Logout').then(() => {
                next({ path: loginRoutePath, query: { redirect: to.fullPath } })
              })
            })
          } else {
            next()
          }
      }
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach((to, from) => {
  NProgress.done() // finish progress bar
  if (store.getters.userInfo != null && store.getters.userInfo.name != null) {
    Watermark.set(store.getters.userInfo.name + '(' + getPhoneTail(store.getters.userInfo.phone) + ')')
  }
})
