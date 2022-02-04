import operate from '@/constants/monitor'

export default {
  addPms () {
    return {
      type: operate.LOG_TYPE.change,
      operateType: operate.OPERATE_TYPE.add,
      content: '新增权限'
    }
  },
  addBtnPms () {
    return {
      type: operate.LOG_TYPE.change,
      operateType: operate.OPERATE_TYPE.add,
      content: '新增按钮权限'
    }
  },
  activeDel () {
    return {
      type: operate.LOG_TYPE.change,
      operateType: operate.OPERATE_TYPE.del,
      content: '删除权限'
    }
  }
}
