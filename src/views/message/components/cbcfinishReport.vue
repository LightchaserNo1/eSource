<template>
  <page-header-wrapper @back="goBack">
    <div class="page-header-index-wide page-header-wrapper-grid-content-main">
      <a-row type="flex" justify="end">
        <a-col :span="22" class="title">
          <span>检验结果报告单</span>
        </a-col>
        <a-col :span="2">
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="24" :lg="24">
          <a-card bordered>
            <!-- 表格开始 -->
            <a-table
              :rowKey="(record, index) => index"
              size="middle"
              :pagination="pagination"
              @change="tableChange"
              :data-source="dataList"
              :columns="isBeyond == 0 ? projectColumns : beyondColumns"
              :loading="topTableloading"
            >
              <template slot="applyDate" slot-scope="text, record">
                <div>
                  {{ record.applyDate | moment('YYYY-MM-DD HH:mm:ss') }}
                </div>
              </template>
              <template slot="sampleSamplingDate" slot-scope="text, record">
                <div>
                  {{ record.sampleSamplingDate | moment('YYYY-MM-DD HH:mm:ss') }}
                </div>
              </template>
              <template slot="testDate" slot-scope="text, record">
                <div>
                  {{ record.testDate | moment('YYYY-MM-DD HH:mm:ss') }}
                </div>
              </template>
              <template slot="reportDate" slot-scope="text, record">
                <div>
                  {{ record.reportDate | moment('YYYY-MM-DD HH:mm:ss') }}
                </div>
              </template>
              <template slot="isBeyond" slot-scope="text, record">
                <div>
                  {{ record.isBeyond == 0 ? '否' : '是' }}
                </div>
              </template>
              <template slot="stageDate" slot-scope="text, record">
                <div>
                  {{ record.stageDate | moment('YYYY-MM-DD HH:mm:ss') }}
                </div>
              </template>
              <template slot="afterStageDate" slot-scope="text, record">
                <div>
                  {{ record.afterStageDate | moment('YYYY-MM-DD HH:mm:ss') }}
                </div>
              </template>
              <template slot="action" slot-scope="text, record">
                <!-- 这里通过type、isVisit判断跳转到哪里 -->
                <a @click="handlePatientSelectChange(record)">查看</a>
              </template>
              <template slot="isVisit" slot-scope="text, record">
                <div>
                  {{ record.trueStageName }}
                </div>
              </template>
            </a-table>
            <!-- 表格结束 -->
          </a-card>
        </a-col>
      </a-row>
      <a-row class="rows" v-if="relationList.length > 0">
        <a-col :span="24">
          <span v-if="requisitionNo">申请单号:{{ requisitionNo }}</span>
          <span v-if="reportNo" style="margin-left:30px">报告单号:{{ reportNo }}</span>
        </a-col>
      </a-row>
      <a-row :gutter="24" v-if="relationList.length > 0">
        <!-- 右侧表单 开始 -->
        <a-col :md="24" :lg="24">
          <a-card bordered>
            <!-- Message表格开始 -->
            <a-table
              ref="table"
              size="middle"
              :rowKey="(record, index) => index"
              :data-source="relationList"
              :columns="columns"
              :loading="loading"
            >
              <template slot="item" slot-scope="text, record">
                <span style="color: #02a7f0" v-if="record.isRelationCrf == 1">
                  {{ text }}
                </span>
                <template v-else>
                  {{ text }}
                </template>
              </template>
              <template slot="createTime" slot-scope="text, record">
                <div>
                  {{ record.createTime | moment('YYYY-MM-DD HH:mm:ss') }}
                </div>
              </template>
              <template slot="abbreviation" slot-scope="text, record">
                <div>
                  <span v-if="record.abbreviation === '↑'" style="color: green">{{ record.abbreviation }}</span>
                  <span v-if="record.abbreviation === '↓'" style="color: red">{{ record.abbreviation }}</span>
                </div>
              </template>
              <template slot="isValid" slot-scope="text, record">
                {{
                  record.isValid == -1
                    ? '异常无临床意义'
                    : record.isValid == 1
                      ? '正常'
                      : record.isValid == 2
                        ? '异常有临床意义'
                        : '未确认'
                }}
              </template>
              <template slot="auditOpinion" slot-scope="text">
                {{ text }}
              </template>
            </a-table>
            <!-- 表格结束 -->
          </a-card>
        </a-col>
        <!-- 右侧表单 结束 -->
      </a-row>
    </div>
  </page-header-wrapper>
</template>

<script>
import { ckList, listRep } from '@/api/message/message'
export default {
  data () {
    return {
      topTableloading: false,
      isBeyond: 0,
       // 项目表头
      projectColumns: [
        {
          title: '序号',
          dataIndex: 'num',
          customRender: (text, record, index) => `${(this.pagination.current - 1) * this.pagination.defaultPageSize + (index + 1)}`
        },
        {
          title: '申请单号',
          dataIndex: 'requisitionNo'
        },
        {
          title: '项目名称',
          dataIndex: 'itemTypeName'
        },
        {
          title: '申请时间',
          dataIndex: 'applyDate',
          scopedSlots: { customRender: 'applyDate' }
        },
        {
          title: '采样时间',
          dataIndex: 'sampleSamplingDate',
          scopedSlots: { customRender: 'sampleSamplingDate' }
        },
        {
          title: '试验时间',
          dataIndex: 'testDate',
          scopedSlots: { customRender: 'testDate' }
        },
        {
          title: '报告时间',
          dataIndex: 'reportDate',
          scopedSlots: { customRender: 'reportDate' }
        },
        {
          title: '最近访视批次时间',
          dataIndex: 'stageDate',
          scopedSlots: { customRender: 'stageDate' }
        },
        {
          title: '最近访视批次',
          dataIndex: 'stageName'
        },
        {
          title: '报告明细',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        },
        {
          title: '访视批次',
          dataIndex: 'isVisit',
          scopedSlots: { customRender: 'isVisit' }
        }
      ],
      beyondColumns: [
        {
          title: '序号',
          dataIndex: 'num',
          customRender: (text, record, index) => `${(this.pagination.current - 1) * this.pagination.defaultPageSize + (index + 1)}`
        },
        {
          title: '申请单号',
          dataIndex: 'requisitionNo'
        },
        {
          title: '项目名称',
          dataIndex: 'itemTypeName'
        },
        {
          title: '申请时间',
          dataIndex: 'applyDate',
          scopedSlots: { customRender: 'applyDate' }
        },
        {
          title: '采样时间',
          dataIndex: 'sampleSamplingDate',
          scopedSlots: { customRender: 'sampleSamplingDate' }
        },
        {
          title: '试验时间',
          dataIndex: 'testDate',
          scopedSlots: { customRender: 'testDate' }
        },
        {
          title: '报告时间',
          dataIndex: 'reportDate',
          scopedSlots: { customRender: 'reportDate' }
        },
        {
          title: '疑似超窗',
          dataIndex: 'isBeyond',
          scopedSlots: { customRender: 'isBeyond' }
        },
        {
          title: '前访视批次时间',
          dataIndex: 'stageDate',
          scopedSlots: { customRender: 'stageDate' }
        },
        {
          title: '前访视批次',
          dataIndex: 'stageName'
        },
        {
          title: '后访视批次时间',
          dataIndex: 'afterStageDate',
          scopedSlots: { customRender: 'afterStageDate' }
        },
        {
          title: '后访视批次',
          dataIndex: 'afterStageName'
        },
        {
          title: '报告明细',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        },
        {
          title: '访视批次',
          dataIndex: 'isVisit',
          scopedSlots: { customRender: 'isVisit' }
        }
      ],
      selectRows: null,
      requisitionNo: null,
      reportNo: null,
      // 项目列表 加载数据方法 必须为 Promise 对象
      dataList: [],
      pagination: {
        total: 0,
        pageSize: 5, // 每页中显示5条数据
        showSizeChanger: true,
        pageSizeOptions: ['5', '10'], // 每页中显示的数据
        showTotal: total => `共有 ${total} 条数据` // 分页中显示总的数据
      },
      loading: false,
      columns: [
        {
          title: '检验项目',
          dataIndex: 'item',
          align: 'center',
          scopedSlots: { customRender: 'item' }
        },
        {
          title: '结果',
          dataIndex: 'result',
          align: 'center'
        },
        {
          title: '异常标记',
          dataIndex: 'abbreviation', // null
          align: 'center',
          scopedSlots: { customRender: 'abbreviation' }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          // ellipsis: true,
          align: 'center'
        },
        {
          title: '参考值',
          dataIndex: 'reference',
          align: 'center'
        },
        {
          title: '临床意义',
          dataIndex: 'isValid',
          align: 'center',
          width: 250,
          scopedSlots: { customRender: 'isValid' }
        },
        {
          title: '备注',
          dataIndex: 'auditOpinion',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'auditOpinion' }
        }
      ],
      relationList: [],
      parameter: {
        proId: this.$store.getters.project.id || null, // 项目ID this.$store.getters.project.id
        ptsId: this.$route.query.ptsId, // 受试者编码  this.$route.query.ptsId || null
        mId: this.$route.query.id // 消息ID  this.$route.query.id || null 175
      },
      finished: this.$route.query.finished !== '' ? JSON.parse(this.$route.query.finished) : false
    }
  },
  computed: {

  },
  mounted () {
    this.getListData()
  },
  methods: {
    goBack () {
      console.log(this.finished)
      this.$router.push({
        name: 'Message',
        query: { activeKey: this.finished ? '1' : '2' }
      })
    },
    // 获取访视表格数据 reportNo	检查报告号 reportType报告类型
    getListData () {
      // this.loading = true
      this.topTableloading = true
      ckList(this.parameter).then(res => {
        this.dataList = res
        this.pagination = {
          total: res.length, // 数据总数
          current: 1,
          defaultPageSize: 5,
          showSizeChanger: true, // 显示修改pageSize的下拉框
          pageSizeOptions: ['5', '10'], // 设置pageSize的可选值，页面啊可以通过下拉框进行选择
          showTotal: total => `共 ${total} 条数据` // 展示总共有几条数据
        }
        this.isBeyond = res[0].isBeyond
        this.topTableloading = false
        // this.loading = false
      }).catch((err) => {
        console.log('报错信息', err)
        this.topTableloading = false
        // this.loading = false
      })
    },
    // 获取表格数据 reportNo	检查报告号 reportType报告类型
    getData () {
      this.loading = true
      const form = new FormData()
      form.append('reportNo', this.selectRows.reportNo)
      form.append('reportType', this.selectRows.reportType)
      listRep(form).then(res => {
        this.relationList = res.relationList
        this.loading = false
      }).catch((err) => {
        console.log('报错信息', err)
        this.loading = false
      })
    },
    tableChange (pagination) {
      this.pagination = pagination
    },
    handlePatientSelectChange (rows) {
      this.loading = true
      this.selectRows = rows
      this.reportNo = rows.reportNo
      this.requisitionNo = rows.requisitionNo
      this.getData()
    }
  }
}
</script>

<style scoped lang="less">
.editable-row-operations a {
  margin-right: 8px;
}
.title{
  height:30px;
  line-height: 30px;
  font-weight: bolder;
}
.rows {
  background: #f1f5f8;
  padding: 15px 0;
  font-weight: bolder;
}
</style>
