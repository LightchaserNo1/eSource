import operate from '@/constants/monitor'

export default {
  addVisible () {
    return {
      type: operate.LOG_TYPE.change,
      operateType: operate.OPERATE_TYPE.add,
      content: '新增成员'
    }
  },
  activeEdit () {
    return {
      type: operate.LOG_TYPE.change,
      operateType: operate.OPERATE_TYPE.upData,
      content: '编辑成员'
    }
  },
  enable () {
    return {
      type: operate.LOG_TYPE.change,
      operateType: operate.OPERATE_TYPE.add,
      content: '启用'
    }
  },
  forbidden () {
    return {
      type: operate.LOG_TYPE.change,
      operateType: operate.OPERATE_TYPE.upData,
      content: '禁用'
    }
  }
}
