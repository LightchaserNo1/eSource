// 配置项目列表columns,差别：业务管理员项目名称可点击
// 配置业务管理员身份的表格配置
export const specialColumns = [
  {
    title: '序号',
    width: '80px',
    dataIndex: 'id',
    scopedSlots: { customRender: 'id' }
  },
  {
    title: '项目编号',
    // width: '150px',
    width: '8%',
    dataIndex: 'no'
  },
  {
    title: 'PROTOCOL',
    // width: '150px',
    width: '9%',
    dataIndex: 'protocolNo',
    scopedSlots: { customRender: 'protocolNo' }
  },
  {
    title: '项目名称',
    width: '18%',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
  },
  // {
  //   title: '项目详情',
  //   align: 'center',
  //   width: '20%',
  //   dataIndex: 'watch',
  //   scopedSlots: { customRender: 'watch' }
  // },
  {
    title: '申办方',
    // width: '230px',
    // width: '25%',
    dataIndex: 'sponsorName',
    scopedSlots: { customRender: 'sponsorName' }
  },
  {
    title: '申办方负责人',
    dataIndex: 'pmName',
    // width: '100px',
    width: '8%',
    scopedSlots: { customRender: 'pmName' }
  },
  {
    title: '研究人员',
    // width: '100px',
    // align: 'center',
    width: '8%',
    dataIndex: 'mainResName',
    scopedSlots: { customRender: 'mainResName' }
  },
  {
    title: '状态',
    dataIndex: 'status',
    // width: '100px',
    width: '8%',
    // align: 'center',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '立项时间',
    // width: '150px',
    width: '10%',
    dataIndex: 'buildTime',
    scopedSlots: { customRender: 'buildTime' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '120px',
    fixed: 'right',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]
// 配置其他五个身份的columns
export const normalColumns = [
  {
    title: '序号',
    align: 'center',
    dataIndex: 'id',
    scopedSlots: { customRender: 'id' }
  },
  {
    title: '项目编号',
    align: 'center',
    dataIndex: 'no'
  },
  {
    title: 'PROTOCOL',
    align: 'center',
    dataIndex: 'protocolNo',
    scopedSlots: { customRender: 'protocolNo' }
  },
  {
    title: '项目名称',
    align: 'center',
    width: '20%',
    dataIndex: 'name'
  },
  // {
  //   title: '项目详情',
  //   align: 'center',
  //   width: '20%',
  //   dataIndex: 'watch',
  //   scopedSlots: { customRender: 'watch' }
  // },
  {
    title: '申办方',
    align: 'center',
    width: '20%',
    dataIndex: 'sponsorName',
    scopedSlots: { customRender: 'sponsorName' }
  },
  {
    title: '申办方负责人',
    align: 'center',
    dataIndex: 'pmName',
    scopedSlots: { customRender: 'pmName' }
  },
  {
    title: '研究人员',
    align: 'center',
    dataIndex: 'mainResName',
    scopedSlots: { customRender: 'mainResName' }
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '立项时间',
    align: 'center',
    dataIndex: 'buildTime',
    scopedSlots: { customRender: 'buildTime' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    // width: '30%',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]
