import storage from 'store'
import { login, logout, getInfo } from '@/api/login'
import { ACCESS_TOKEN, CURRENT_PROJECT } from '@/store/mutation-types'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    pms: [],
    menus: [],
    info: {},
    project: null,
    isCenter: null
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_PMS: (state, pms) => {
      state.pms = pms
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_PROJECT: (state, project) => {
      state.project = project
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response
          storage.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result.token)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }, proId) {
      return getInfo({
        proId: proId || ''
      }).then(response => {
        let menus = response.menus
        if (proId == null || proId.length === 0) {
          const proIndex = response.menus.findIndex(item => item === 'PROJECT')
          if (proIndex !== -1) {
            response.menus.splice(proIndex, 1)
          }
          menus = response.menus
        }

        return new Promise((resolve, reject) => {
          commit('SET_PMS', response.pms)
          commit('SET_MENUS', menus)
          commit('SET_ROLES', response.roles)
          commit('SET_INFO', response.user)
          commit('SET_NAME', response.user.name)
          commit('SET_AVATAR', response.user.headimg)
          resolve(menus, response.pms)
        })
      })
      /*
      return new Promise((resolve, reject) => {
        const result = userInfo // 动态权限
        // 获取用户基本信息
        const role = result.role
        // 获取不同模块下的权限
        role.permissions = result.role.permissions
        // 返回一个新的role实例
        role.permissions.map(per => {
            // per相当于role.permissions
            // 不模块的按钮权限
          if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
            const action = []
            per.actionEntitySet.forEach(act => {
              action.push(act.action)
              if (act.actionEntitySet != null && act.actionEntitySet.length > 0) {
                act.actionEntitySet.forEach(sub => {
                  action.push(sub.code)
                })
              }
            })
            per.actionList = action
          } else {
            per.actionList = []
          }
        })
        role.permissionList = role.permissions.map(permission => { return permission.permissionId })
        commit('SET_ROLES', result.role)
        commit('SET_INFO', result)
        commit('SET_NAME', { name: result.userName, welcome: welcome() })
        commit('SET_AVATAR', result.headimg)
        localStorage.setItem('curRole', result.roleName)
        resolve(result)
        */
    },
    ClearProject ({ commit }) {
      return new Promise((resolve) => {
        commit('SET_PROJECT', null)
        commit('SET_ROLES', [])
        commit('SET_PMS', [])
        commit('SET_MENUS', [])
        storage.remove(CURRENT_PROJECT)
        resolve()
      })
    },
    EnterProject ({ commit }, project) {
      if (project == null) {
        return
      }
      console.log('===== 切换项目 =====', project.id, project.name)
      return new Promise((resolve, reject) => {
        storage.set(CURRENT_PROJECT, JSON.stringify(project))
        commit('SET_PROJECT', project)
        // 重置权限 重新获取
        commit('SET_ROLES', [])
        commit('SET_PMS', [])
        commit('SET_MENUS', [])
        resolve()
      })
    },
    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PMS', [])
          commit('SET_MENUS', [])
          commit('SET_PROJECT', null)
          storage.remove(ACCESS_TOKEN)
          storage.remove(CURRENT_PROJECT)
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
        })
      })
    }

  }
}

export default user
