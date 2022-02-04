<template>
  <div>
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="7" :sm="24">
              <a-form-model-item label="公司名称" labelAlign="left">
                <a-input v-model="queryParam.kw" />
              </a-form-model-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-button @click="activeSearch" type="primary" class="search">搜索</a-button>
              <a-button @click="activeReset" type="default" class="search" style="margin-left:20px;">重置</a-button>
            </a-col>
            <a-col :md="2" :sm="24">
              <a-button type="primary" @click="handleAdd" >新增</a-button>
            </a-col>
            <!-- <a-col :md="2" :sm="24" v-if="isSupperAdmin&&!$isCenter">
              <a-button type="primary" @click="handleAdd" >导入</a-button>
            </a-col>
            <a-col :md="2" :sm="24" v-if="isSupperAdmin&&$isCenter">
              <a-button type="primary" @click="handleAdd" >导出</a-button>
            </a-col> -->
          </a-row>
        </a-form-model>
      </div>
      <a-table
        ref="table"
        size="default"
        @change="handleTableChange"
        :rowKey="record => record.id"
        :scroll="{ x: 1800 }"
        :pagination="pagination"
        :columns="columns"
        :data-source="dataTable"
      >
        <span slot="operation" slot-scope="text, record">
          <template>
            <a @click="openEditor(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="openDetails(record)">详情</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" ok-text="确定" cancel-text="取消" @confirm="confirm(record)">
              <a>删除</a>
            </a-popconfirm>
          </template>
        </span>
      </a-table>
      <AddModal
        :visible="showModal"
        @modalOk="addSubmit"
        @modalCancel="addCancel"
        :type="currentType"
        :openType="openType"
        :editContent="modify"
        :business="business"
      />
    </a-card>
  </div>
</template>
<script>
import { buildPaginationObj } from '@/components/Table'
import monitor from '@/utils/monitor'
import SponsorTab from '@/monitor/organization/SponsorTab'
import {
  getInstitutionsList,
  getInstitutionsDelete,
  getInstitutionsDetail,
  getInstitutionsAdd,
  getInstitutionsUpdate,
  getDictionary
} from '@/api/organization/organization'
import AddModal from './AddModal.vue'
const watch = monitor(SponsorTab)

export default {
  props: {
    stateAgencies: {
      type: Number,
      default: null
    }
  },
  components: {
    AddModal
  },
  data () {
    return {
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['5', '10', '20', '50'],
        showSizeChanger: true,
        showTotal: total => `共${total}条数据`
      },
      isSupperAdmin: this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.ADMIN.value),
      business: [],
      dataTable: [],
      openType: 0, // 通过这个判断 状态是 添加 编辑 详情
      currentType: 1,
      modify: {}, // 编辑某一行
      detailsInfo: {}, // 编辑某一行
      // tab切换时，更改queryParams中的状态字段。
      queryParam: {
        kw: '',
        type: 1
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getInstitutionsList(Object.assign(parameter, this.queryParam)).then(res => {
          console.log(res)
          return buildPaginationObj(res)
        })
      },
      currentId: null,
      showModal: false,
      detailsModal: false,
      columns: [
        {
          title: 'ID',
          dataIndex: 'id'
        },
        {
          title: '组织机构名称',
          dataIndex: 'orgName'
        },
        {
          title: '组织机构代码',
          dataIndex: 'orgCode'
        },
        {
          title: '英文名称',
          dataIndex: 'englishName'
        },
        {
          title: '简称',
          dataIndex: 'shortName'
        },
        {
          title: '类型',
          dataIndex: 'typeName'
        },
        {
          title: '地址',
          dataIndex: 'address'
        },
        {
          title: '联系人',
          dataIndex: 'contacts'
        },
        {
          title: '联系人电话',
          dataIndex: 'phone'
        },
        {
          title: '联系人邮箱',
          dataIndex: 'email'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' }
        }
      ]
    }
  },
  mounted () {
    this.getBodyType()
    console.log(this.isSupperAdmin)
    this.fetchList(this.queryParam)
  },
  methods: watch({
    fetchList (queryParam) {
      getInstitutionsList({ pageSize: 15000, pageNumber: 1, ...queryParam }).then(res => {
        this.dataTable = res
        console.log(this.dataTable, 222)
        this.pagination.total = this.dataTable.length
      })
    },
    handleTableChange (val) {
      const pager = { ...this.pagination }
      pager.current = val.current
      pager.pageSize = val.pageSize
      this.pagination = pager
    },
    getBodyType () {
      getDictionary({
        typeCode: 10001011
      }).then(res => {
        this.business = res
      })
    },
    // 搜索
    activeSearch () {
      // this.$refs.table.refresh(true)
      this.fetchList(this.queryParam)
    },
    // 搜索 重置
    activeReset () {
      this.queryParam = {}
      this.queryParam.type = 1
      this.fetchList(this.queryParam)
      // this.$refs.table.refresh(true)
    },
    // 点击弹出新增表单
    handleAdd () {
      this.modify = {}
      this.openType = 0
      this.showModal = true
    },
    // 点击编辑这一行
    openEditor (record) {
      this.currentId = record.id
      getInstitutionsDetail({ id: record.id }).then(res => {
        const { orgName, orgCode, englishName, shortName, address, contacts, phone, email, orgType } = res
        this.modify = { orgName, orgCode, englishName, shortName, address, contacts, phone, email, orgType }
        this.openType = 1
        setTimeout(() => {
          this.showModal = true
        }, 10)
      })
    },
    // 点击删除这一行
    confirm (record) {
      getInstitutionsDelete({ id: record.id, type: 1 }).then(res => {
        this.$message.success('删除成功')
        this.$refs.table.refresh(true)
      })
    },
    // 点击查看这一行详情
    openDetails (record) {
      getInstitutionsDetail({ id: record.id }).then(res => {
        const { orgName, orgCode, englishName, shortName, address, contacts, phone, email, orgType } = res
        this.modify = { orgName, orgCode, englishName, shortName, address, contacts, phone, email, orgType }
        this.openType = 2
        setTimeout(() => {
          this.showModal = true
        }, 10)
      })
    },
    // 点击确认新增
    addSubmit (e) {
      console.log('编辑转入信息', e)
      console.log('编辑转入id', this.currentId)
      if (this.openType === 0) {
        getInstitutionsAdd({ ...e, type: this.currentType }).then(res => {
          this.showModal = false
          this.$message.success('添加成功')
          this.$refs.table.refresh(true)
        })
      } else {
        getInstitutionsUpdate({ ...e, id: this.currentId, type: this.currentType }).then(res => {
          this.$message.success('修改成功')
          this.showModal = false
          this.$refs.table.refresh(true)
        })
      }
    },
    addCancel () {
      this.showModal = false
    }
  })
}
</script>
<style></style>
