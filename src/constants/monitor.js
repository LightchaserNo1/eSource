export const OPERATE_TYPE = {
    add: 1, // 增加
    del: 2, // 删除
    upData: 3, // 更新
    query: 4, // 查询
    loginAuthentication: 5, // 登陆验证
    import: 6, // 导入
    export: 7 // 导出
}

export const LOG_TYPE = {
   operate: 1, // 操作日志
   change: 2, // 权限变更日志
   system: 3 // 系统日志
}

export default {
    OPERATE_TYPE,
    LOG_TYPE
}
