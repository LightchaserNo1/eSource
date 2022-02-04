import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap } from '@/config/router.config'

// hack router push callback
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // the relevant part
}

// 创建方法
const createRouter = () => new Router({
  mode: 'history',
  routes: constantRouterMap
})

const router = createRouter()

export default router
