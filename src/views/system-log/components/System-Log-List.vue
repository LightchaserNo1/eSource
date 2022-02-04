<template>
  <div>
    <a-card>
      <!-- form 表单 start -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-model-item label="模块:" labelAlign="left">
                <a-select allowClear v-model="queryParam.systemId" placeholder="请选择">
                  <a-select-option v-for="list in listInformation" :key="list.status" :value="list.status">
                    {{ list.text }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-model-item label="操作:" labelAlign="left">
                <a-select allowClear v-model="queryParam.action" placeholder="请选择">
                  <a-select-option v-for="list in actionInformation" :key="list.status" :value="list.status">
                    {{ list.text }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-model-item label="创建时间:" labelAlign="left">
                <a-range-picker
                  v-model="timeValue"
                  valueFormat="YYYY-MM-DD"
                  @change="handleChangeDate"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="6" :sm="24">

            </a-col>

          </a-row>
        </a-form>
      </div>
      <!-- form 表单 end -->
      <div class="table-operator" style="display: flex; justify-content: flex-end;">
        <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
        <a-button @click="clearCondition">重置</a-button>
        <a-button v-print="`#table${$props.no}`" icon="printer" v-if="$auth('LOG.LOG_PRINT')">打印</a-button>
        <a-button type="button" icon="download" @click="clickExport" v-if="$auth('LOG.LOG_EXPORT')">导出</a-button>
      </div>
      <div class="table" :id="'table' + $props.no">
        <s-table
          ref="table"
          size="default"
          :rowKey="(record) => record.id"
          :columns="columns"
          :data="loadData">
          <span slot="systemId" slot-scope="text, record">
            <template>
              {{ record.systemId | filtersState }}
            </template>
          </span>
          <span slot="action" slot-scope="text, record">
            <template>
              {{ record.action | enumValueByKey($const.ACTION_TYPE) }}
            </template>
          </span>
          <span slot="proName" slot-scope="text, record">
            <template>
              {{ record.proName }}
            </template>
          </span>
          <div slot="oriJson" slot-scope="text, record" v-html="getLine(record.oriJson)">
            <template>
              <!-- <div ></div> -->
            </template>
          </div>
          <div slot="afterJson" slot-scope="text, record" v-html="getLine(record.afterJson)">
            <template>
              <!-- <div ></div> -->
            </template>
          </div>
          <span slot="createTime" slot-scope="text, record">
            <template>
              {{ record.createTime | moment() }}
            </template>
          </span>
          <span slot="row-action" slot-scope="text, record">
            <a @click="clickDetail(record)">详情</a>
          </span>
        </s-table>
      </div>

      <a-modal
        :visible="detailModalVisible"
        title="日志详情"
        :footer="null"
        @cancel="handleDetailCancel">
        <a-descriptions v-if="detailRecord != null" style="word-break: break-all;word-wrap: break-word;" bordered>
          <a-descriptions-item :span="3" label="参数">
            {{ detailRecord.params }}
          </a-descriptions-item>
          <a-descriptions-item :span="3" label="原始信息">
            {{ detailRecord.oriJson }}
          </a-descriptions-item>
        </a-descriptions>
      </a-modal>

    </a-card>
  </div>
</template>
<script>
import { getLogList, getLogExport } from '@/api/system/systemlog'
import { exportExcel } from '@/utils/util'
export default {
  props: {
    activeIndex: {
      type: Number,
      default: 1
    },
    no: {
      type: [Number, String],
      required: true
    }
  },
  components: {},
  data () {
    return {
      // 时间
      createTime: [],
			actionInformation: [
				{ status: 'ADD', text: 'ADD' },
        { status: 'DELETE', text: 'DELETE' },
        { status: 'UPDATE', text: 'UPDATE' },
        { status: 'QUERY', text: 'QUERY' },
        { status: 'EXPORT', text: 'EXPORT' },
        { status: 'IMPORT', text: 'IMPORT' }
			],
      listInformation: [
        { status: 1, text: 'payment' },
        { status: 2, text: 'consent' },
        { status: 3, text: 'source' },
        { status: 4, text: 'payment小程序' },
        { status: 5, text: 'consent小程序' },
        { status: 6, text: 'source小程序' }
      ],
      loading: false,
      advanced: false,
      queryParam: {
        type: this.activeIndex
      },
      loadData: parameter => {
        console.log('loadData.parameter', this.queryParam)
        return getLogList(Object.assign(parameter, { ...this.queryParam })).then(res => {
          return res
        })
      },
      // 表头
      columns: [
        {
          title: '记录id',
          dataIndex: 'id',
          width: '120px'
        },
				{
          title: '项目名称',
					dataIndex: 'proName',
					width: '150px'
				},
        {
          title: '操作事件',
          dataIndex: 'operation',
          width: '200px'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '100px'
        },
        {
          title: '操作前',
          dataIndex: 'oriJson',
					width: '130px',
          scopedSlots: { customRender: 'oriJson' }
        },
        {
          title: '操作后',
          dataIndex: 'afterJson',
					width: '130px',
          scopedSlots: { customRender: 'afterJson' }
        },

        // {
        //   title: '业务模块',
        //   dataIndex: 'operation'
        // },
        {
          title: '操作人',
          dataIndex: 'uname',
          width: '130px'
        },
        {
          title: '操作时间',
          dataIndex: 'createTime',
          width: '180px',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '系统',
          dataIndex: 'systemId',
          width: '100px',
          scopedSlots: { customRender: 'systemId' }
        }
        // {
        //   title: '操作',
        //   dataIndex: 'row-action',
        //   width: '150px',
        //   scopedSlots: { customRender: 'row-action' }
        // }
      ],
      // 日期控件 双向绑定
      timeValue: null,
      detailModalVisible: false,
      // 当前查看的详情信息
      detailRecord: null
    }
  },
  mounted () {

  },
  methods: {
    getLine (val) {
      if (val) {
        return val.replace(/,/g, '</br>')
      }
      return val
    },
    // 清除条件
    clearCondition () {
      this.queryParam = {
        type: this.activeIndex
      }
      this.timeValue = null
      this.$refs.table.refresh(true)
    },
    // 选择创建时间
    handleChangeDate (value, dateString) {
      this.queryParam.startTime = dateString[0] + ' 00:00:00'
      this.queryParam.endTime = dateString[1] + ' 23:59:59'
    },
    clickExport () {
      console.log('打印日志')
      const exportParams = this.queryParam
      // delete exportParams.type// 删掉用不到的type参数
      getLogExport(exportParams).then(res => {
        console.log(res, 'export')
        exportExcel('日志', res)
      })
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    // 重置事件
    resetForm () {
      this.queryParam = {}
      this.createTime = []
      this.$refs.table.refresh(true)
    },
    // 点击详情
    clickDetail (row) {
      this.detailRecord = row
      this.detailModalVisible = true
    },
    handleDetailCancel () {
      this.detailModalVisible = false
    }
  },
  filters: {
    filtersState (val) {
      if (val === 1) {
        return 'payment'
      } else if (val === 2) {
        return 'consent'
      } else if (val === 3) {
        return 'source'
      } else if (val === 4) {
        return 'payment小程序'
      } else if (val === 5) {
        return 'consent小程序'
      } else if (val === 6) {
        return 'source小程序'
      }
    }
  }
}
</script>

<style>

</style>
