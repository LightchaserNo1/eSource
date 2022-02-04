<template>
  <div>
    <!-- crf档案组件 -->
    <a-card style="margin-bottom: 20px;">
      <div class="form-wrapper">
        <a-form-model
          :model="queryParam"
          label-align="left"
          :labelCol="{ style: 'width: 160px' }"
          layout="inline">
          <a-row :gutter="48">
            <a-col :md="16" :sm="24">
              <a-form-model-item :label="$route.query.ptsNo+'患者档案'" >
                <a-select
                  @select="fileChange"
                  v-model="queryParam.formNo"
                  style="width:100%"
                  placeholder="请选择 ">
                  <a-select-option :value="item.uuidNo" v-for="(item, index) in formList" :key="index">
                    {{ item.tableName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="试验阶段" >
                <a-select
                  @select="stageSearch"
                  v-model="queryParam.proStageId"
                  style="width:100%"
                  placeholder="请选择">
                  <a-select-option :value="item.id" v-for="(item,index) in stageLits" :key="index">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <div :loading="cardLoading" style="min-height:500px;">
        <a-tabs
          v-if="tabList&&tabList.length>0"
          :default-active-key="0"
          v-model="tabsKey"
          @change="tabChange"
          :tabBarStyle="tabBarStyle"
          size="large"
          :tabBarGutter="110">
          <a-tab-pane v-for="(item,index) in tabList" :key="index" :tab="item.formStageName" :force-render="index==0">
            <template v-if="item.formStageName!='评估量表'">
              <a-row :gutter="48">
                <a-col :md="8" :sm="24" v-if="item.tableName === 'ob_exam_report' || item.tableName === 'ob_test_report'">
                  <div class="form-wrapper">
                    <a-form-model
                      :model="tableParam"
                      label-align="left"
                      layout="inline"
                      :labelCol="{ style: 'width: 110px' }">
                      <a-form-model-item label="报告号" >
                        <a-select @change="reportNoChange" v-model="tableParam.no">
                          <a-select-option v-for="(items,indexs) in reportNoList" :key="indexs" :value="items.reportNo">
                            {{ items.reportNo }}
                          </a-select-option>
                        </a-select>
                      </a-form-model-item>
                    </a-form-model>
                  </div>
                </a-col>
                <a-col :md="8" :sm="24" v-if="item.tableName === 'ob_exam_report' || item.tableName === 'ob_test_report'">
                  <div style="text-align:center;font-weight:bold;font-size:24px;color:black;">
                    {{ itemName }}
                    <span style="opacity:0">空</span>
                  </div>
                </a-col>
                <a-col :md="24" :sm="24" v-else>
                  <div style="text-align:center;font-weight:bold;font-size:24px;color:black;">
                    {{ itemName }}
                  </div>
                </a-col>
              </a-row>
              <div style="margin-top:15px;"></div>
              <a-row :gutter="48" v-if="item.tableName === 'ob_exam_report' || item.tableName === 'ob_test_report'">
                <!-- <a-col :md="4" :sm="24">姓名: ***</a-col> -->
                <!-- <a-col :md="4" :sm="24">住院号:***</a-col> -->
                <!-- <a-col :md="4" :sm="24" v-if="listType==1">申请单号:{{ orderInfo.testRequisitionNo }}</a-col> -->
                <!-- <a-col :md="4" :sm="24" v-else>申请单号:{{ orderInfo.examRequisitionNo }}</a-col> -->
                <!-- <a-col :md="4" :sm="24">标本:静脉血</a-col> -->
                <!-- <a-col :md="4" :sm="24">采样时间:{{ orderInfo.testDate | moment("YYYY-MM-DD") }}</a-col> -->
                <!-- <a-col :md="4" :sm="24">报告时间:{{ orderInfo.reportDate | moment("YYYY-MM-DD") }}</a-col> -->
                <a-col :md="4" :sm="24" v-if="orderInfo.testReportNo">报告号:{{ orderInfo.testReportNo }}</a-col>
              </a-row>
              <div style="margin-top:20px;"></div>
              <a-table
                :loading="tableLoading"
                @change="handleTableChange"
                :rowKey="record=>record.virtualId"
                :pagination="pagination"
                :data-source="dataTable"
                :columns="columns" >
                <template slot="testResultValue" slot-scope="text,record">
                  <div>
                    {{ record.testResultValue }}
                    <span v-if="record.range>0">
                      <a-icon type="arrow-up" style="color:#DD001B"/>
                    </span>
                    <span v-else-if="record.range<0">
                      <a-icon type="arrow-down" style="color:#3C71FA"/>
                    </span>
                  </div>
                </template>
                <span slot="recordDate" slot-scope="text,record">
                  {{ record.recordDate | moment() }}
                </span>
                <span slot="reportDate" slot-scope="text,record">
                  {{ record.reportDate | moment() }}
                </span>
                <span slot="testDate" slot-scope="text,record">
                  {{ record.testDate | moment() }}
                </span>
                <span slot="examDate" slot-scope="text,record">
                  {{ record.examDate | moment() }}
                </span>
                <span slot="dateBirth" slot-scope="text,record">
                  {{ record.dateBirth | moment('YYYY-MM-DD') }}
                </span>
                <template slot="isValid" slot-scope="text,record">
                  <div>
                    <span v-if="record.isValid==-1">否</span>
                    <span v-else-if="record.isValid==0">未确认</span>
                    <span v-else>是</span>
                  </div>
                </template>
              </a-table>
            </template>
            <template v-else>
              <a-card bordered>
                <a-form layout="horizontal" :form="form" class="form">
                  <!-- 评估表 条件 开始 -->
                  <a-row :gutter="48">
                    <a-col :md="8" :sm="24">
                      <a-form-item
                        label="评估表"
                        v-bind="topFormItemLayout"
                      >
                        <a-select
                          placeholder="请选择评估表"
                          v-decorator="[
                            'type',
                            {
                              initialValue: 1,
                              rules: [{ required: true, message: '请选择评估表'}]
                            }
                          ]" >
                          <a-select-option v-for="(estimate) in estimateList" :key="estimate.name" :value="estimate.value">
                            {{ estimate.name }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <!-- 评估表 条件 结束 -->
                  <a-divider dashed></a-divider>
                  <!-- 肿瘤评估表 开始 -->
                  <TumourForm
                    :disabled="true"
                    :form="form"
                    :patientId="ptsId"
                    :patientName="ptsName"
                    :step="stageName"
                    @gainValue="gainValue"
                  >
                  </TumourForm>
                  <!-- 肿瘤评估表 结束 -->
                </a-form>
              </a-card>
            </template>
          </a-tab-pane>
        </a-tabs>
        <div v-else>
          <a-empty v-if="showEmpty"/>
        </div>
      </div>
    </a-card>
  </div>
</template>
<script>
import TumourForm from '@/views/estimate/components/TumourForm.vue'
import { getFormList, getStageList, getTabList, getBoard, getColumns, getReport } from '@/api/patient/crfFile'
import moment from 'moment'
import { getTumourEstimateDetail } from '@/api/estimate/estimate'
// import { columns1, columns2 } from '../crf-columns'
export default {
  props: {
    enrolleeId: {
      required: true,
      type: [String, Number]
    },
    ptsId: {
      default: null,
      type: [String, Number]
    },
    ptsName: {
      default: null,
      type: [String, Number]
    },
    orgId: {
      default: null,
      type: [String, Number]
    }
  },
  components: {
    TumourForm
  },
  data () {
    return {
      tabsKey: 0,
      // 表单样式
      // bufferTable: [],
      beginRequest: 0,
      tableLoading: false,
      topFormItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      // 评估表 列表
      estimateList: [{
        value: 1,
        name: '肿瘤评估表'
      }],
      // 评估表value
      estimateValue: {
        id: 1
      },
      // 试验阶段
      stageName: '',
      // 表单数据
      form: null,
      reportNoList: [],
      orderInfo: {},
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['5', '10', '20', '50'],
        showSizeChanger: true,
        showTotal: total => `共${total}条数据`
      },
      dataTable: [],
      boardParams: {// 请求下方列表用到的参数
        enrolleeId: this.$props.enrolleeId,
        proId: this.$store.getters.project.id
      },
      listType: null,
      defaultShow: {},
      formList: [],
      columns: [],
      blank: false,
      tableCode: '',
      proId: this.$store.getters.project.id,
      sickId: this.$props.ptsId,
      // 试验阶段列表
      stageLits: [],
      loadData: [],
      itemName: null,
      // timeList: [],
      tabBarStyle: {
        width: '100%',
        display: 'flex',
        justfyContent: 'space-center'
      },
      dateParams: {
        enrolleeId: this.$props.enrolleeId
      },
      tabList: [],
      queryParam: {// 请求tabs用到的参数
        proId: this.$store.getters.project.id
      },
      tableParam: {},
      cardLoading: false,
      formStageNo: ''
    }
  },
  computed: {
    showEmpty () {
      return Object.keys(this.queryParam).length > 2
    }
  },
  created () {

  },
  beforeMount () {
    this.form = this.$form.createForm(this)
    // 靶病灶位置  最长直径/淋巴结短径（mm）
    this.form.getFieldDecorator('babingzao', { initialValue: [''], preserve: true })
    // 非靶病灶位置  非靶病灶其他描述
    this.form.getFieldDecorator('feibabingzao', { initialValue: [''], preserve: true })
    // 新病灶
    this.form.getFieldDecorator('newDiseaseInput', { initialValue: [''], preserve: true })

    console.log('####', this.form)
  },
  mounted () {
    // 获取试验阶段
    getStageList({ proId: this.proId }).then(res => {
      this.stageLits = res
      this.queryParam.proStageId = res[0].id
      this.boardParams.trialStageId = this.queryParam.proStageId
      console.log(this.stageLits, '试验阶段列表')
      this.beginRequest++
    }).catch(() => {
      console.log('试验阶段列表请求失败')
    })
    // 获取患者档案
    getFormList({ proId: this.$store.getters.project.id }).then(res => {
      this.formList = res
      this.queryParam.formNo = res[0].uuidNo
      console.log(this.formList, '患者档案列表')
      this.beginRequest++
    })
  },
  watch: {
    beginRequest (newv) {
      if (newv === 2) {
         this.getTabs(this.queryParam)
      }
    }
  },
  methods: {
    // 选择报告号
    reportNoChange (e) {
      if (this.reportNoList.length > 0) {
        console.log(e)
        this.orderInfo.testReportNo = e
        // console.log(this.bufferTable)
        this.getBoards(this.boardParams, e)
        // this.dataTable = [...this.bufferTable.filter(item => item.testReportNo === Number(e))]
        console.log(this.dataTable)
      }
    },
    gainValue () {
      this.$nextTick(() => this.queryEstimateDetail())
    },
    // 表单页详情数据请求
    queryEstimateDetail () {
      getTumourEstimateDetail({
        stageId: this.queryParam.proStageId,
        orgId: this.orgId,
        proId: this.$store.getters.project.id,
        ptsId: this.ptsId
      }).then(res => {
        console.log(res)
        this.$message.success('请求成功')
        /*
        assessTime: 1635782400000
        assessType: 1
        createTime: 1635756958000
        evReaction: "7"
        evTarget: "5"
        evUntarget: "6"
        id: 2
        isNewTarget: "1"
        modifyTime: 1635756958000
        newTargetSite: "[\"8\",\"9\"]"
        orgId: this.$props.orgId
        proId: 1
        ptsId: 14
        stageId: 1
        targetSite: "[{\"location\":\"1\",\"size\":\"2\"},{\"location\":\"11\",\"size\":\"22\"}]"
        unTargetSite: "[{\"location\":\"3\",\"desc\":\"4\"},{\"location\":\"33\",\"desc\":\"44\"}]"
        version: 1
        */
        const targetSite = JSON.parse(res.targetSite)
        const bingbazhao = []
        const babingzaoLocation = []
        const babingzaoSize = []
        targetSite.forEach(item => {
          bingbazhao.push('')
          babingzaoLocation.push(item.location)
          babingzaoSize.push(item.size)
        })

        const unTargetSite = JSON.parse(res.unTargetSite)
        const feibabingzao = []
        const feibabingzaoLocation = []
        const feibabingzaoOther = []
        unTargetSite.forEach(item => {
          feibabingzao.push('')
          feibabingzaoLocation.push(item.location)
          feibabingzaoOther.push(item.desc)
        })

        const newDiseaseInput = []
        const disease = []
        if (res.newTargetSite != null && res.newTargetSite.length > 0) {
          const newTargetSite = JSON.parse(res.newTargetSite)
          newTargetSite.forEach(item => {
            newDiseaseInput.push('')
            disease.push(item)
          })
        }
        const fieldsValue = {
          id: res.id,
          assessTime: moment(res.assessTime),
          assessType: res.assessType.toString(),
          babingzao: bingbazhao,
          feibabingzao: feibabingzao,
          evUntarget: res.evUntarget,
          evTarget: res.evTarget,
          evReaction: res.evReaction,
          isNewTarget: parseInt(res.isNewTarget + ''),
          newDiseaseInput: newDiseaseInput,
          step: res.stageId,
          type: 1
        }
        console.log('#########', fieldsValue)
        this.form.setFieldsValue(fieldsValue)
        // 动态表单 需渲染出组件 才能赋值
        const otherFieldsValue = {
          babingzaoLocation: babingzaoLocation,
          babingzaoSize: babingzaoSize,
          feibabingzaoLocation: feibabingzaoLocation,
          feibabingzaoOther: feibabingzaoOther,
          disease: disease
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(otherFieldsValue)
        })

        this.formDisabled = true
      })
    },
    // 处理分页
    handleTableChange (val) {
      const pager = { ...this.pagination }
      pager.current = val.current
      pager.pageSize = val.pageSize
      this.pagination = pager
    },
    // 选择试验阶段处理函数
    stageSearch (e) {
      console.log(e, this.queryParam, this.boardParams)
      this.stageLits.forEach(item => {
        if (item.id === e) {
          this.stageName = item.name
        }
      })
      this.boardParams.trialStageId = this.queryParam.proStageId
      this.getTabs(this.queryParam)
    },
    // tab切换处理函数
    tabChange (e) {
      // const obj = this.tabList.find(item => item.formStageId === e)
      console.log(e)
      this.dataTable = []
      this.reportNoList = []
      const obj = this.tabList[e]
      console.log(obj, 99999)
      this.formStageNo = obj.formStageNo
      // 评估量表的formStageId为-1
      if (obj.formStageId !== -1) {
        this.itemName = obj.formStageName
        this.boardParams.formTrialStageId = obj.formStageId
        this.getBoards(this.boardParams)
        // console.log(this.bufferTable, '新的数据')
        // this.dataTable = this.bufferTable
      }
    },
    // 获取tabs
    getTabs (params) {
      const { proStageId, formNo } = this.queryParam
      // 这俩参数必须全有了才能做请求
      if (!proStageId || !formNo) {
        return false
      }
      this.cardLoading = true
      getTabList(params).then(res => {
        this.cardLoading = false
        this.tabList = res.trialStageList instanceof Array ? res.trialStageList : []
        this.tabsKey = 0
        this.itemName = this.tabList[0].formStageName
        this.formStageNo = this.tabList[0].formStageNo
        // 如果empty组件闪现一下，就加个定时器把loading置为false
        // 选中录入评估表时，formStageId为空，不请求下方列表接口。
        if (this.tabList.length > 0) {
          this.defaultShow = this.tabList[0]
          console.log(this.defaultShow)
          if (this.defaultShow.formStageName !== '评估量表') {
            this.boardParams.formTrialStageId = this.defaultShow.formStageId
            console.log(this.tabList, this.boardParams)
            this.getBoards(this.boardParams)
          }
        }
      })
    },
    // 获取下方列表
    getBoards (params, e) {
      this.tableLoading = true
      // 获取已审核报告单
      getReport({ proId: this.$store.getters.project.id, enrolleeId: this.ptsId, stageId: this.queryParam.proStageId })
      .then((ress) => {
        console.log(ress)
        this.reportNoList = ress || []
        console.log(this.reportNoList)
        this.orderInfo.testReportNo = this.reportNoList.length > 0 ? this.reportNoList[0].reportNo : ''
        console.log(this.orderInfo)
        if (this.reportNoList.length && this.reportNoList) {
          this.tableParam.no = this.reportNoList[0].reportNo
          // this.reportNoChange(this.tableParam.no)
        } else {
          this.tableParam.no = ''
          this.tableCode = ''
          this.dataTable = []
        }
        let paramsValue = {}
        if (e || this.orderInfo.testReportNo) {
          paramsValue = { ...params, reportNo: e || this.orderInfo.testReportNo, formNo: this.queryParam.formNo, formStageNo: this.formStageNo }
        } else {
          paramsValue = { ...params, formNo: this.queryParam.formNo, formStageNo: this.formStageNo }
        }
        getBoard({ ...paramsValue })
        .then((res) => {
          console.log(res)
          this.tableCode = res.tableCode
          if (this.tableCode) {
            getColumns({ tableCode: this.tableCode })
            .then((tableRes) => {
              console.log(tableRes, 'columns')
              // 动态配置表格的columns
              const columns = tableRes.map(item => {
                return {
                  dataIndex: item.englishName,
                  align: 'center',
                  title: item.fieldName,
                  scopedSlots: { customRender: item.englishName }
                }
              })
              console.log(columns, '配置列')
              this.columns = columns
            })

            /*
              当checkProType为1时用obTestReportList渲染下方列表，否则就用obExamReportList;
              后端查不到东西时会返回null，处理转[]
              dealSting() 加入范围字段
            */
            this.listType = res.checkProType
            this.dateParams.checkProType = res.checkProType
            // getDateList(this.dateParams).then(res => {
            //   this.timeList = res
            // })
            console.log(res)
            console.log(this.dataTable)
            this.dataTable.forEach((item, index) => { item.virtualId = index })
            this.dataTable = res.testReportList instanceof Array ? this.delString(res.testReportList) : []
            // this.bufferTable = res.testReportList instanceof Array ? this.delString(res.testReportList) : [{}]
            this.pagination.total = this.dataTable.length
            this.orderInfo = this.dataTable.length > 0 ? this.dataTable[0] : {}
            console.log(this.dataTable)
          }
        this.tableLoading = false
        })
      })
      .catch((row) => {
        console.log(row)
      })
    },
    // 选择患者档案回调
    fileChange () {
      this.boardParams.trialStageId = this.queryParam.proStageId
      this.getTabs(this.queryParam)
    },
    // 处理结果值区间字符串
    delString (arr) {
      if (!(arr instanceof Array)) {
        return false
      }
      arr.forEach(item => {
        // 有的可能没有值,避免终断循环
        if (!item.referenceValue) {
          item.referenceValue = '10000-20000%'
        }
        const dealArr = item.referenceValue.split('-')
        const minValue = parseFloat(dealArr[0])
        const maxValue = parseFloat(dealArr[1])
        if (parseFloat(item.testResultValue) > maxValue) {
          item.range = 1
        } else if (parseFloat(item.testResultValue) < minValue) {
          item.range = -1
        } else {
          item.range = 0
        }
        // 1---偏高  -1---偏低  0---在正常值范围内
      })
      return arr
    }
  }
}
</script>
<style scoped lang="css">

</style>
