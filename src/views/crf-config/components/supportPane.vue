/* eslint-disable no-return-assign */
<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row>
      <!-- 表格开始 -->
      <a-table
        ref="table"
        :rowKey="(record) => record.id"
        size="middle"
        bordered
        :pagination="pagination"
        @change="tableChange"
        :data-source="dataList"
        :row-selection="{ type: 'radio', onChange: handlePatientSelectChange, selectedRowKeys }"
        :columns="projectColumns"
        :loading="loading"
      >
        <template slot="createTime" slot-scope="text, record">
          <div>
            {{ record.createTime | moment('YYYY-MM-DD HH:mm:ss') }}
          </div>
        </template>
        <template slot="status" slot-scope="text, record">
          <div>
            {{ record.status == 0 ? '禁用' : '启用' }}
          </div>
        </template>
      </a-table>
      <!-- 表格结束 -->
    </a-row>
    <a-row>
      <!-- updata 开始 -->
      <a-col :lg="24">
        <div class="titleWrap">
          <div class="title">院内项目配置</div>
        </div>
        <a-card style="padding: 0">
          <a-tabs type="card" default-active-key="1" @change="callback">
            <a-tab-pane key="1" tab="检验" :forceRender="true">
              <inspection ref="inspection" :assistConfigId="assistConfigId + ''"></inspection>
            </a-tab-pane>
            <a-tab-pane key="2" tab="检查" :forceRender="true">
              <sglobalModal ref="sglobalModal" :assistConfigId="assistConfigId + ''"></sglobalModal>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
      <!-- updata 结束 -->
    </a-row>
  </div>
</template>
<script>
import inspection from './inspection.vue' // 检查配置组件
import sglobalModal from './sglobalModal.vue' // 通用配置组件
// import { expCrf } from '@/api/crf/crf'
import { listFrom } from '@/api/crf/assist'
// import { exportWord } from '@/utils/util'
export default {
  components: {
    inspection,
    sglobalModal
  },
  data () {
    return {
      loading: false,
      // 项目表头
      projectColumns: [
        {
          title: '项目ID',
          dataIndex: 'proId'
        },
        {
          title: '表ID',
          dataIndex: 'tableId'
        },
        {
          title: '表名',
          dataIndex: 'tableName'
        },
        {
          title: '版本',
          dataIndex: 'edition'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '创建人',
          dataIndex: 'creatorName'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        }
      ],
      selectedRowKeys: [],
      // 项目列表 加载数据方法 必须为 Promise 对象
      dataList: [],
      assistConfigId: null, // 	表单信息ID
      pagination: {
        total: 0,
        pageSize: 10, // 每页中显示10条数据
        showSizeChanger: true,
        pageSizeOptions: ['10', '20'], // 每页中显示的数据
        showTotal: total => `共有 ${total} 条数据` // 分页中显示总的数据
      }
    }
  },
  mounted () {
    this.getListData()
  },
  methods: {
    // CRF表单列表
    getListData () {
      this.loading = true
      listFrom().then(res => {
        this.dataList = res
        console.log(res)
        this.assistConfigId = res[0].id
        this.selectedRowKeys = []
        this.selectedRowKeys.push(res[0].id)
        this.pagination = {
          total: res.length, // 数据总数
          current: 1,
          defaultPageSize: 10,
          showSizeChanger: true, // 显示修改pageSize的下拉框
          pageSizeOptions: ['10', '20'], // 设置pageSize的可选值，页面啊可以通过下拉框进行选择
          showTotal: total => `共 ${total} 条数据` // 展示总共有几条数据
        }
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inspection.getlistTest()
        })
      }).catch((err) => {
        console.log('报错信息', err)
        this.loading = false
      })
    },
    tableChange (pagination, filters, sorter) {
      this.pagination = pagination
    },
    handlePatientSelectChange (keys, rows) {
      this.selectedRowKeys = keys
      this.assistConfigId = rows[0].id
      this.$nextTick(() => {
        this.$refs.inspection.getlistTest()
      })
    },
    callback (key) {
      if (key === '1') {
        this.$nextTick(() => {
          this.$refs.inspection.getlistTest()
        })
      } else if (key === '2') {
        this.$nextTick(() => {
          this.$refs.sglobalModal.getlistTest()
        })
      }
    }
    // ,
    // clickExport () {
    //   expCrf().then(res => {
    //     exportWord('CRF', res)
    //   })
    // }
  }
}
</script>

<style scoped lang="less">
.titleWrap {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  margin-top: 10px;
  .crf {
    font-weight: bolder;
  }
  .title {
    height: 30px;
    line-height: 30px;
    font-weight: bolder;
    margin-left: 20px;
  }
  .btn {
    margin-left: auto;
    .btnItem {
      margin-right: 15px;
    }
  }
}
.ml15 {
  margin-left: 15px;
}
/deep/ .ant-card-body {
  padding: 16px;
}
/deep/ .ant-tabs-bar {
  margin: 0 0 5px 0 !important;
}
</style>
