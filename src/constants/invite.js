// 定义邀请状态
export const INVITE_STATUS = {
  Resolve: {
    value: 1,
    desc: '已邀请',
    status: 1,
    color: '#3C92FF'
  },
  Reject: {
    value: 2,
    desc: '已加入',
    status: 2,
    color: '#1CA261'
  },
  WaitDeal: {
    value: 3,
    desc: '待处理',
    status: 3,
      color: '#43a'
  },
  WaitJoin: {
    value: 4,
    desc: '待加入',
    status: 4,
    color: '#e23f00'
  }
}
export default { INVITE_STATUS }
