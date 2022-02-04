// 项目状态
// TODO等接口改
export const MESSAGE_STATUS = {
  Await: {
    value: 1,
    desc: '未审核',
    status: 1,
    color: '#676767'
  },
  OnGoing: {
    value: 2,
    desc: '审核未通过',
    status: 2,
    color: '#FC0119'
  },
  Closed: {
    value: 3,
    desc: '审核通过',
    status: 3,
    color: '#62D883'
  }
}
export default { MESSAGE_STATUS }
