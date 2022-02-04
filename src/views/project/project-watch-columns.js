// 配置查看项目之后的列表columns
// 业务管理员
const YWColumns = [
  {
    title: '项目编号',
    dataIndex: 'proNo',
    align: 'center'
  },
  {
    title: 'PROTOCOL',
    dataIndex: 'protocolNo',
    scopedSlots: { customRender: 'protocolNo' },
    align: 'center'
  },
  {
    title: '医疗机构',
    dataIndex: 'orgName',
    scopedSlots: { customRender: 'orgName' },
    align: 'center'
  },
  {
    title: '科室',
    dataIndex: 'orgDeptName',
    scopedSlots: { customRender: 'orgDeptName' },
    align: 'center'
  },
  {
    title: '已入组患者',
    dataIndex: 'already',
    scopedSlots: { customRender: 'already' },
    align: 'center'
  },
  {
    title: '上报中心受试者',
    dataIndex: 'uploadPtsCount',
    scopedSlots: { customRender: 'uploadPtsCount' },
    align: 'center'
  },
  {
    title: '患者队列',
    dataIndex: 'sickLoop',
    scopedSlots: { customRender: 'sickLoop' },
    align: 'center'
  }
  // {
  //   title: '抓取情况',
  //   dataIndex: 'projectLog',
  //   scopedSlots: { customRender: 'projectLog' }
  // }
]
// CRA
const CRAClolumns = [
  {
    title: '项目编号',
    dataIndex: 'proNo',
    align: 'center'
  },
  {
    title: 'PROTOCOL',
    dataIndex: 'protocolNo',
    scopedSlots: { customRender: 'protocolNo' },
    align: 'center'
  },
  {
    title: '医疗机构',
    dataIndex: 'orgName',
    scopedSlots: { customRender: 'orgName' },
    align: 'center'
  },
  {
    title: '科室',
    dataIndex: 'orgDeptName',
    scopedSlots: { customRender: 'orgDeptName' },
    align: 'center'
  },
  {
    title: '已入组患者',
    dataIndex: 'already',
    scopedSlots: { customRender: 'already' },
    align: 'center'
  },
  {
    title: '患者队列',
    dataIndex: 'sickLoop',
    scopedSlots: { customRender: 'sickLoop' },
    align: 'center'
  }
  // {
  //   title: '抓取情况',
  //   dataIndex: 'projectLog',
  //   scopedSlots: { customRender: 'projectLog' }
  // }
]
// CRC
const CRCColumns = [
  {
    title: '项目编号',
    dataIndex: 'proNo',
    align: 'center'
  },
  {
    title: 'PROTOCOL',
    dataIndex: 'protocolNo',
    scopedSlots: { customRender: 'protocolNo' },
    align: 'center'
  },
  {
    title: '医疗机构',
    dataIndex: 'orgName',
    scopedSlots: { customRender: 'orgName' },
    align: 'center'
  },
  {
    title: '科室',
    dataIndex: 'orgDeptName',
    scopedSlots: { customRender: 'orgDeptName' },
    align: 'center'
  },
  {
    title: '配置患者列表',
    dataIndex: 'configList',
    scopedSlots: { customRender: 'configList' },
    align: 'center'
  },
  {
    title: '已入组患者',
    dataIndex: 'already',
    scopedSlots: { customRender: 'already' },
    align: 'center'
  },
  {
    title: '患者队列',
    dataIndex: 'sickLoop',
    scopedSlots: { customRender: 'sickLoop' },
    align: 'center'
  }
  // {
  //   title: '抓取情况',
  //   dataIndex: 'projectLog',
  //   scopedSlots: { customRender: 'projectLog' }
  // }
]
// PI
const PIColumns = [
  {
    title: '项目编号',
    dataIndex: 'proNo',
    align: 'center'
  },
  {
    title: 'PROTOCOL',
    dataIndex: 'protocolNo',
    scopedSlots: { customRender: 'protocolNo' },
    align: 'center'
  },
  {
    title: '医疗机构',
    dataIndex: 'orgName',
    scopedSlots: { customRender: 'orgName' },
    align: 'center'
  },
  {
    title: '科室',
    dataIndex: 'orgDeptName',
    scopedSlots: { customRender: 'orgDeptName' },
    align: 'center'
  },
  {
    title: '已入组患者',
    dataIndex: 'already',
    scopedSlots: { customRender: 'already' },
    align: 'center'
  },
  {
    title: '患者队列',
    dataIndex: 'sickLoop',
    scopedSlots: { customRender: 'sickLoop' },
    align: 'center'
  }
  // {
  //   title: '抓取情况',
  //   dataIndex: 'projectLog',
  //   scopedSlots: { customRender: 'projectLog' }
  // }
]
// PM
const PMColumns = [
  {
    title: '项目编号',
    dataIndex: 'proNo',
    align: 'center'
  },
  {
    title: 'PROTOCOL',
    dataIndex: 'protocolNo',
    scopedSlots: { customRender: 'protocolNo' },
    align: 'center'
  },
  {
    title: '医疗机构',
    dataIndex: 'orgName',
    scopedSlots: { customRender: 'orgName' },
    align: 'center'
  },
  {
    title: '科室',
    dataIndex: 'orgDeptName',
    scopedSlots: { customRender: 'orgDeptName' },
    align: 'center'
  },
  {
    title: '已入组患者',
    dataIndex: 'already',
    scopedSlots: { customRender: 'already' },
    align: 'center'
  },
  {
    title: '上报中心受试者',
    dataIndex: 'uploadPtsCount',
    scopedSlots: { customRender: 'uploadPtsCount' },
    align: 'center'
  },
  // {
  //   title: '患者队列',
  //
  //   dataIndex: 'sickLoop',
  //   scopedSlots: { customRender: 'sickLoop' }
  // },
  {
    title: '团队成员',
    dataIndex: 'ptsList',
    scopedSlots: { customRender: 'ptsList' },
    align: 'center'
  }
]
// ADMIN
const ADMINColumns = [
  {
    title: '项目编号',
    dataIndex: 'proNo',
    align: 'center'
  },
  {
    title: 'PROTOCOL',
    dataIndex: 'protocolNo',
    scopedSlots: { customRender: 'protocolNo' },
    align: 'center'
  },
  {
    title: '医疗机构',
    dataIndex: 'orgName',
    scopedSlots: { customRender: 'orgName' },
    align: 'center'
  },
  {
    title: '科室',
    dataIndex: 'orgDeptName',
    scopedSlots: { customRender: 'orgDeptName' },
    align: 'center'
  },
  // {
  //   title: '配置患者列表',
  //   dataIndex: 'configList',
  //   scopedSlots: { customRender: 'configList' },
  //   align: 'center'
  // },
  {
    title: '已入组患者',
    dataIndex: 'already',
    scopedSlots: { customRender: 'already' },
    align: 'center'
  },
  {
    title: '上报中心受试者',
    dataIndex: 'uploadPtsCount',
    scopedSlots: { customRender: 'uploadPtsCount' },
    align: 'center'
  },
  {
    title: '患者队列',
    dataIndex: 'sickLoop',
    scopedSlots: { customRender: 'sickLoop' },
    align: 'center'
  },
  {
    title: '抓取情况',
    dataIndex: 'projectLog',
    scopedSlots: { customRender: 'projectLog' },
    align: 'center'
  },
  {
    title: '团队成员',
    detaIndex: 'managerTeamList',
    scopedSlots: { customRender: 'managerTeamList' },
    width: '22%',
    align: 'center'
  }
]

export {
  YWColumns,
  CRAClolumns,
  CRCColumns,
  PIColumns,
  PMColumns,
  ADMINColumns
}
