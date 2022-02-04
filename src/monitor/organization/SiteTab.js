import operate from '@/constants/monitor'

export default {
  handleAdd () {
    return {
      type: operate.LOG_TYPE.change,
      operateType: operate.OPERATE_TYPE.add,
      content: '新增公司'
    }
  },
  watchDictionary () {
    return {
      type: operate.LOG_TYPE.change,
      operateType: operate.OPERATE_TYPE.upData,
      content: '查看公司详情'
    }
  },
  openUpload () {
    return {
      type: operate.LOG_TYPE.change,
      operateType: operate.OPERATE_TYPE.upData,
      content: '编辑公司'
    }
  },
  confirm () {
    return {
      type: operate.LOG_TYPE.change,
      operateType: operate.OPERATE_TYPE.del,
      content: '删除公司'
    }
  },
  addDepartment () {
    return {
      type: operate.LOG_TYPE.change,
      operateType: operate.OPERATE_TYPE.add,
      content: '添加科室'
    }
  },
  openEditor () {
    return {
      type: operate.LOG_TYPE.change,
      operateType: operate.OPERATE_TYPE.upData,
      content: '科室编辑'
    }
  }
}
