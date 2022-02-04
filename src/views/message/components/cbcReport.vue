<!-- 检验 -->
<template>
  <page-header-wrapper @back="goBack">
    <div class="page-header-index-wide page-header-wrapper-grid-content-main">
      <a-row type="flex" justify="end">
        <a-col :span="22" class="title">
          <span>检验结果报告单</span>
        </a-col>
        <a-col :span="2">
          <a-button type="primary" style="width: 120px; margin-bottom: 15px" @click="updateMsg"> 提交 </a-button>
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
              <template slot="isBeyond" slot-scope="text, record">
                <div>
                  {{ record.isBeyond == 0 ? '否' : '是' }}
                </div>
              </template>
              <template slot="action" slot-scope="text, record">
                <!-- 这里通过type、isVisit判断跳转到哪里 -->
                <a @click="handlePatientSelectChange(record)">查看</a>
              </template>
              <template slot="isVisit" slot-scope="text, record">
                <div>
                  <a-select
                    style="width: 100%"
                    v-model="record.trueStageId"
                    placeholder="请选择访视阶段"
                    @change="(val) => handleTop(val, record.id, 'isVisit')"
                  >
                    <a-select-option
                      v-for="(trilItem, trilIndex) in listTrilStage"
                      :title="trilItem.name"
                      :key="trilIndex"
                      :value="trilItem.id"
                    >
                      {{ trilItem.name }}
                    </a-select-option>
                  </a-select>
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
      <a-row :gutter="24">
        <!-- 右侧表单 开始 -->
        <a-col :md="24" :lg="24" v-if="relationList.length > 0">
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
                <a-select
                  v-if="record.editable"
                  :value="record.isValid == 0 ? '未确认' : record.isValid"
                  style="width: 120px"
                  @change="(e) => handleChange(e, record.id, 'isValid')"
                >
                  <a-select-option :value="-1"> 异常无临床意义 </a-select-option>
                  <a-select-option :value="1"> 正常 </a-select-option>
                  <a-select-option :value="2"> 异常有临床意义 </a-select-option>
                </a-select>
                <template v-else>
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
              </template>
              <template slot="auditOpinion" slot-scope="text, record">
                <a-input
                  v-if="record.editable"
                  style="margin: -5px 0"
                  :value="record.auditOpinion"
                  :maxLength="400"
                  placeholder="备注最多400字"
                  @change="(e) => handleChange(e.target.value, record.id, 'auditOpinion')"
                />
                <template v-else>
                  {{ text }}
                </template>
              </template>
              <template slot="operation" slot-scope="text, record">
                <div class="editable-row-operations">
                  <span v-if="record.editable">
                    <a @click="() => save(record.id)">保存</a>
                    <a-popconfirm title="确认取消?" @confirm="() => cancel(record.id)">
                      <a>取消</a>
                    </a-popconfirm>
                  </span>
                  <span v-else>
                    <a :disabled="editingKey !== ''" @click="() => edit(record.id)">编辑</a>
                  </span>
                </div>
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
import { ckList, listRep, upRepInfo, resultJudge, updateMsg } from '@/api/message/message'
import { listTrilStage } from '@/api/update/update'
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
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      relationList: [],
      listTrilStage: [],
      parameter: {
        proId: this.$store.getters.project.id || null, // 项目ID this.$store.getters.project.id
        ptsId: this.$route.query.ptsId, // 受试者编码  this.$route.query.ptsId || null
        mId: this.$route.query.id // 消息ID  this.$route.query.id || null 175
      },
      editingKey: '',
      cacheData: [],
      cacheTop: [],
      finished: this.$route.query.finished !== '' ? JSON.parse(this.$route.query.finished) : false
    }
  },
  computed: {

  },
  mounted () {
    this.getlistTrilStage()
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
    // 获取访视阶段列表
    getlistTrilStage () {
      const params = {
        proId: this.$store.getters.project.id
      }
      listTrilStage(params).then(res => {
        this.listTrilStage = res
      }, err => {
        console.log(err)
      })
    },
    mainChange (e, id) {
      console.log(e.target.checked)
      this.visitJudge(id)
    },
    upRepInfo (id, val) {
      const trueStageName = this.getTrialNoName(val)
      const form = new FormData()
      form.append('id', id)
      form.append('trueStageId', val)
      form.append('trueStageName', trueStageName)
      upRepInfo(form).then(res => {
        this.$message.success('保存成功')
      }).catch((err) => {
        console.log('报错信息', err)
        this.loading = false
      })
    },
    getTrialNoName (id) {
      if (this.listTrilStage.length === 0) return ''
      const res = this.listTrilStage.find(v => v.id === id) || {}
      return res.name
    },
    // 获取访视表格数据 reportNo	检查报告号 reportType报告类型
    getListData () {
      // this.loading = true
      this.topTableloading = true
      ckList(this.parameter).then(res => {
        this.dataList = res
        this.cacheTop = this.dataList.map(item => ({ ...item }))
        this.pagination = {
          total: res.length, // 数据总数
          current: 1,
          defaultPageSize: 5,
          showSizeChanger: true, // 显示修改pageSize的下拉框
          pageSizeOptions: ['5', '10'], // 设置pageSize的可选值，页面啊可以通过下拉框进行选择
          showTotal: total => `共 ${total} 条数据` // 展示总共有几条数据
        }
        this.isBeyond = res[0].isBeyond
        this.editingKey = ''
        this.topTableloading = false
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
        this.editingKey = ''
        this.cacheData = this.relationList.map(item => ({ ...item }))
        this.loading = false
      }).catch((err) => {
        console.log('报错信息', err)
        this.loading = false
      })
    },
    // 保存上表数据
    handleTop (e, id, column) {
      console.log(e)
      this.upRepInfo(id, e)
      const newData = [...this.dataList]
      const newCacheData = [...this.cacheTop]
      const target = newData.filter(item => id === item.id)[0]
      const targetCache = newCacheData.filter(item => id === item.id)[0]
      if (target && targetCache) {
        target[column] = e
        this.dataList = newData
        Object.assign(targetCache, target)
        this.cacheTop = newCacheData
      }
    },
    handleChange (value, id, column) {
      console.log(value)
      const newData = [...this.relationList]
      const target = newData.filter(item => id === item.id)[0]
      if (target) {
        target[column] = value
        this.relationList = newData
      }
    },
    edit (id) {
      console.log(id)
      const newData = [...this.relationList]
      const target = newData.filter(item => id === item.id)[0]
      this.editingKey = id
      if (target) {
        target.editable = true
        this.relationList = newData
      }
    },
    save (id) {
      const newData = [...this.relationList]
      const newCacheData = [...this.cacheData]
      const target = newData.filter(item => id === item.id)[0]
      const targetCache = newCacheData.filter(item => id === item.id)[0]
      if (target && targetCache) {
        delete target.editable
        this.relationList = newData
        Object.assign(targetCache, target)
        this.cacheData = newCacheData
      }
      this.editingKey = ''
      this.judgeResult(target)
    },
    cancel (id) {
      const newData = [...this.relationList]
      const target = newData.filter(item => id === item.id)[0]
      this.editingKey = ''
      if (target) {
        Object.assign(target, this.cacheData.filter(item => id === item.id)[0])
        delete target.editable
        this.relationList = newData
      }
    },
    judgeResult (target) {
      const arr = [{
        'id': target.id,
        'isValid': target.isValid,
        'auditOpinion': target.auditOpinion
      }]
      const form = new FormData()
      form.append('reportJson', JSON.stringify(arr))
      resultJudge(form).then(res => {
        this.$message.success('保存成功')
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
    },
    updateMsg () {
      const form = new FormData()
      form.append('id', this.$route.query.id)
      form.append('auditStatus', 1)
      updateMsg(form).then(res => {
        this.$message.success('保存成功')
        this.$router.go(-1)
      }).catch((err) => {
        console.log('报错信息', err)
        this.loading = false
      })
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
