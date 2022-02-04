import operate from '@/constants/monitor'

export default {
  handleAdd () {
    return {
      type: operate.LOG_TYPE.operate,
      operateType: operate.OPERATE_TYPE.add,
      content: '新增申办方'
    }
  },
  openDetails () {
    return {
      type: operate.LOG_TYPE.operate,
      operateType: operate.OPERATE_TYPE.query,
      content: '申办方详情'
    }
  },
  openEditor () {
    return {
      type: operate.LOG_TYPE.operate,
      operateType: operate.OPERATE_TYPE.upData,
      content: '编辑申办方'
    }
  },
  confirm () {
    return {
      type: operate.LOG_TYPE.operate,
      operateType: operate.OPERATE_TYPE.del,
      content: '删除申办方'
    }
  }
}
