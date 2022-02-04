import operate from '@/constants/monitor'

export default {
  clickJoinProject () {
    return {
      operateType: operate.OPERATE_TYPE.add,
      content: '加入项目'
    }
  }
}
