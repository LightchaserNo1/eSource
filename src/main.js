import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import Print from 'vue-print-nb'
import { VueAxios } from './utils/request'
import PageHeaderWrapper from '@/layouts/PageHeaderWrapper'
import { STable, InPageSkip, PageSkip, Esign, InPageSwitch } from '@/components'
import Antd from 'ant-design-vue/es'
import 'ant-design-vue/dist/antd.less'
// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
// import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use' // use lazy load components
import './permission' // permission control
import './utils/filter' // global filter
import './global.less' // global style
import constants from './constants'

Vue.config.productionTip = false
Vue.prototype.$const = constants
Vue.prototype.$isCenter = true.toString() === process.env.VUE_APP_PLATFORM_CENTER

// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios)
// use pro-layout components
Vue.component('page-container', PageHeaderWrapper)
Vue.component('page-header-wrapper', PageHeaderWrapper)
Vue.component('s-table', STable)
Vue.component('in-page-skip', InPageSkip)
Vue.component('in-page-switch', InPageSwitch)
Vue.component('PageSkip', PageSkip)
// 手写板
Vue.component('esign', Esign)

Vue.use(Antd)
Vue.use(Print)

new Vue({
  router,
  store,
  i18n,
  // init localstorage, vuex, Logo message
  beforeCreate () {
    Vue.prototype.$bus = this
  },
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
