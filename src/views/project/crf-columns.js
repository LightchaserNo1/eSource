// 定义crf档案下列表columns
const columns1 = [
  {
    title: '序号',
    dataIndex: 'recordId',
    align: 'center'
  },
  {
    title: '项目',
    dataIndex: 'examItemTypeName',
    align: 'center'
  },
  {
    title: 'toEDC',
    dataIndex: 'edc',
    align: 'center'
  },
  {
    title: '结果',
    dataIndex: 'testResultValue',
    align: 'center',
    scopedSlots: { customRender: 'testResultValue' }
  },
  {
    title: '单位',
    dataIndex: 'testResultValueUnit',
    align: 'center'
  },
  {
    title: '参考值',
    dataIndex: 'referenceValue',
    align: 'center'
  },
  {
    title: '临床意义',
    dataIndex: 'bed',
    align: 'center'
  }
]
const columns2 = [
  {
    title: '序号',
    dataIndex: 'recordId',
    align: 'center'
  },
  {
    title: '项目',
    dataIndex: 'examItemTypeName',
    align: 'center'
  },
  {
    title: 'toEDC',
    dataIndex: 'edc',
    align: 'center'
  },
  {
    title: '结果',
    dataIndex: 'testResultValue',
    align: 'center',
    scopedSlots: { customRender: 'testResultValue' }
  },
  {
    title: '单位',
    dataIndex: 'testResultValueUnit',
    align: 'center'
  },
  {
    title: '参考值',
    dataIndex: 'referenceValue',
    align: 'center'
  },
  {
    title: '临床意义',
    dataIndex: 'bed',
    align: 'center'
  }
]
export {
  columns1,
  columns2
}
