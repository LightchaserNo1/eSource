<!-- 数据上传 -->
<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <!-- <a-col :md="8" :sm="24">
              <a-form-item label="项目">
                <a-select v-model="queryParam.id">
                  <a-select-option v-for="(item,index) in projectList" :key="index" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col> -->
            <a-col :md="8" :sm="24">
              <a-form-item label="受试者状态">
                <a-select v-model="queryParam.ptsTaskStatus" placeholder="请选择" default-value="">
                  <a-select-option v-for="item in statusList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => { queryParam = {}, $refs.table.refresh(true) }">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" @click="clickUp">上报中心</a-button>
      </div>

      <s-table
        ref="table"
        size="default"
        :rowKey="(record) => record.id"
        :columns="columns"
        :data="loadData"
        :row-selection="{ onChange: handleSelectChange }"
      >
        <span slot="sex" slot-scope="text,record">
          <span v-if="record.sex==1">男</span>
          <span v-if="record.sex==-1">女</span>
          <span v-else>未知</span>
        </span>
        <span slot="dateBirth" slot-scope="text,record">
          {{ record.dateBirth | moment("YYYY-MM-DD") }}
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { getListPa, getProjectList, upReport } from '@/api/task/task'

export default {
  components: {

  },
  data () {
    return {
      reportList: [],
      mdl: {},
      projectList: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '受试者ID',
          dataIndex: 'ptsId'
        },
        {
          title: '患者ID',
          dataIndex: 'empiId'
        },
        {
          title: '患者姓名',
          dataIndex: 'ptsName'
        },
        {
          title: '性别',
          dataIndex: 'sex',
          scopedSlots: { customRender: 'sex' }
        },
        {
          title: '年龄',
          dataIndex: 'age'
        },
        {
          title: '出生日期',
          dataIndex: 'dateBirth',
          scopedSlots: { customRender: 'dateBirth' }
        },
        {
          title: '家庭地址',
          dataIndex: 'address'
        },
        {
          title: '身份证号',
          dataIndex: 'ptsIdentity'
        },
        {
          title: '医疗机构',
          dataIndex: 'orgName'
        },
        {
          title: '科室',
          dataIndex: 'orgDeptName'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return getListPa({ ...parameter, ...this.queryParam, proId: this.$store.getters.project.id })
          .then(res => {
            return res
          }).catch((e) => {})
      },
      statusList: [
        {
          id: 1,
          name: '未脱落'
        },
        {
          id: -1,
          name: '脱落'
        }
      ]
    }
  },
  mounted () {
    getProjectList({ pageSize: 1000, pageNumber: 1, status: 2 }).then(res => {
      console.log(res.page.content, '项目列表')
      this.projectList = res.page.content
    })
  },
  methods: {
    handleSelectChange (selectedRowKeys, selectedRows) {
      console.log(selectedRowKeys, '===', selectedRows)
      this.reportList = selectedRows
    },
    clickUp () {
      if (this.reportList.length < 1) {
        this.$message.error('请至少选择一条数据')
        return false
      }
      this.reportList.forEach(item => {
        // 映射字段
        // item.orgId = item.siteOrgId
        item.deptId = item.orgDeptId
      })
      console.log(this.reportList)
      upReport({ json: JSON.stringify(this.reportList) }).then(res => {
        this.$message.success('上报成功')
      })
    }
  }
}
</script>
