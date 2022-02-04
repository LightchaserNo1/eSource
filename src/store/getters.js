const getters = {
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  pms: state => state.user.pms,
  menus: state => state.user.menus,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  project: state => state.user.project,
  currentProId: state => state.app.currentProId
}

export default getters
