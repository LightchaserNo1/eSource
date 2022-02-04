import operate from '@/constants/monitor'

export default {
  handleAddVisible () {
    return {
      type: operate.LOG_TYPE.change,
      operateType: operate.OPERATE_TYPE.add,
      content: '添加角色'
    }
  },
  editRow () {
    return {
      type: operate.LOG_TYPE.change,
      operateType: operate.OPERATE_TYPE.upData,
      content: '编辑角色'
    }
  },
  deleteRow () {
    return {
      type: operate.LOG_TYPE.change,
      operateType: operate.OPERATE_TYPE.del,
      content: '删除角色'
    }
  }
}
