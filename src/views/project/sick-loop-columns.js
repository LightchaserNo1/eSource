// 配置患者队列colimns,原型上的蓝色表格列表配置
const YWColumns = [
  {
    title: '序号',
    dataIndex: 'nos',
    scopedSlots: { customRender: 'nos' },
    align: 'center'
  },
  {
    title: '受试者编号',
    align: 'center',
    dataIndex: 'ptsNo'
  },
  {
    title: '访视阶段',
    align: 'center',
    dataIndex: 'visitStageName'
  },
  {
    title: '入组时间',
    align: 'center',
    dataIndex: 'basicLineDate',
    scopedSlots: { customRender: 'basicLineDate' }
  },
  {
    title: '档案',
    align: 'center',
    dataIndex: 'file',
    scopedSlots: { customRender: 'file' }
  },
  {
    title: '上传',
    align: 'center',
    dataIndex: 'upload',
    scopedSlots: { customRender: 'upload' }
  }
]
const CRAColumns = [
  {
    title: '序号',
    dataIndex: 'nos',
    scopedSlots: { customRender: 'nos' },
    align: 'center'
  },
  {
    title: '受试者编号',
    align: 'center',
    dataIndex: 'ptsNo'
  },
  {
    title: '访视阶段',
    align: 'center',
    dataIndex: 'visitStageName'
  },
  {
    title: '入组时间',
    align: 'center',
    dataIndex: 'basicLineDate',
    scopedSlots: { customRender: 'basicLineDate' }
  },
  {
    title: '档案',
    align: 'center',
    dataIndex: 'file',
    scopedSlots: { customRender: 'file' }
  }
]
const CRCColumns = [
  {
    title: '序号',
    dataIndex: 'nos',
    scopedSlots: { customRender: 'nos' },
    align: 'center'
  },
  {
    title: '受试者编号',
    align: 'center',
    dataIndex: 'ptsNo'
  },
  {
    title: '访视阶段',
    align: 'center',
    dataIndex: 'visitStageName'
  },
  {
    title: '入组时间',
    align: 'center',
    dataIndex: 'basicLineDate',
    scopedSlots: { customRender: 'basicLineDate' }
  },
  {
    title: '档案',
    align: 'center',
    dataIndex: 'file',
    scopedSlots: { customRender: 'file' }
  },
  {
    title: '上传',
    align: 'center',
    dataIndex: 'upload',
    scopedSlots: { customRender: 'upload' }
  },
  {
    title: '停止同步',
    align: 'center',
    dataIndex: 'fallDown',
    scopedSlots: { customRender: 'fallDown' }
  }
]
const PIColumns = [
  {
    title: '序号',
    dataIndex: 'nos',
    scopedSlots: { customRender: 'nos' },
    align: 'center'
  },
  {
    title: '受试者编号',
    align: 'center',
    dataIndex: 'ptsNo'
  },
  {
    title: '访视阶段',
    align: 'center',
    dataIndex: 'visitStageName'
  },
  {
    title: '入组时间',
    align: 'center',
    dataIndex: 'basicLineDate',
    scopedSlots: { customRender: 'basicLineDate' }
  },
  {
    title: '档案',
    align: 'center',
    dataIndex: 'file',
    scopedSlots: { customRender: 'file' }
  },
  {
    title: '评估表',
    align: 'center',
    dataIndex: 'assessSheet',
    scopedSlots: { customRender: 'assessSheet' }
  }
]
const ADMINColumns = [
  {
    title: '序号',
    dataIndex: 'nos',
    scopedSlots: { customRender: 'nos' },
    align: 'center'
  },
  {
    title: '受试者编号',
    align: 'center',
    dataIndex: 'ptsNo'
  },
  {
    title: '访视阶段',
    align: 'center',
    dataIndex: 'visitStageName'
  },
  {
    title: '入组时间',
    align: 'center',
    dataIndex: 'basicLineDate',
    scopedSlots: { customRender: 'basicLineDate' }
  },
  {
    title: '档案',
    align: 'center',
    dataIndex: 'file',
    scopedSlots: { customRender: 'file' }
  },
  {
    title: '评估表',
    align: 'center',
    dataIndex: 'assessSheet',
    scopedSlots: { customRender: 'assessSheet' }
  },
  {
    title: '抓取情况',
    align: 'center',
    dataIndex: 'catch',
    scopedSlots: { customRender: 'catch' }
  }
]

export {
  YWColumns,
  CRAColumns,
  CRCColumns,
  PIColumns,
  ADMINColumns
}
  // 被移除的columns
  // {
  //   title: '受试者Id',
  //   dataIndex: 'ptsId',
  //   align: 'center'
  // },
  // {
  //   title: '患者ID',
  //   align: 'center',
  //   dataIndex: 'empiId',
  //   scopedSlots: { customRender: 'empiId' }
  // },
  // {
  //   title: '患者姓名',
  //   align: 'center',
  //   dataIndex: 'ptsName',
  //   scopedSlots: { customRender: 'ptsName' }
  // },
  // {
  //   title: '性别',
  //   align: 'center',
  //   dataIndex: 'sex',
  //   scopedSlots: { customRender: 'sex' }
  // },
  // {
  //   title: '年龄',
  //   align: 'center',
  //   dataIndex: 'age',
  //   scopedSlots: { customRender: 'age' }
  // },
  // {
  //   title: '出生日期',
  //   align: 'center',
  //   dataIndex: 'dateBirth',
  //   scopedSlots: { customRender: 'dateBirth' }
  // },
  // {
  //   title: '家庭住址',
  //   align: 'center',
  //   dataIndex: 'home',
  //   scopedSlots: { customRender: 'home' }
  // },
  // {
  //   title: '身份证号',
  //   align: 'center',
  //   dataIndex: 'ptsIdentity',
  //   scopedSlots: { customRender: 'ptsIdentity' }
  // },
  // {
  //   title: '医疗机构',
  //   align: 'center',
  //   width: '18%',
  //   dataIndex: 'orgName',
  //   scopedSlots: { customRender: 'orgName' }
  // },
  // {
  //   title: '科室',
  //   align: 'center',
  //   dataIndex: 'orgDeptName',
  //   scopedSlots: { customRender: 'orgDeptName' }
  // },
  // {
  //   title: '抓取情况',
  //   align: 'center',
  //   // fixed: 'right',
  //   dataIndex: 'catch',
  //   scopedSlots: { customRender: 'catch' }
  // }
