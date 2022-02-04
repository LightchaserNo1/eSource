<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="24">
      <!-- 左侧菜单 开始 -->
      <a-col :md="24" :lg="6" v-if="!$props.ptsId">
        <!-- 项目列表 开始 -->
        <!-- <a-card class="left-card" :headStyle="headStyle" title="项目列表" :loading="projectLoading" bordered>
          <div class="project-row" v-for="(p, index) in projectList" :key="index">
            <div class="number">{{ index + 1 }}</div>
            <div class="name">{{ p.name }}</div>
          </div>
        </a-card> -->
        <!-- <s-table
          ref="projectTable"
          size="middle"
          bordered
          :rowKey="(record) => record.id"
          :row-selection="{ type: 'radio', onChange: handleProjectSelectChange }"
          :pageSize="5"
          :columns="projectColumns"
          :data="loadProjectData"
          :pagination="{
            simple: true
          }"
        >
          <template slot="title">
            <div style="font-size: 16px; font-weight: 500;">项目列表</div>
          </template>
        </s-table> -->
        <!-- 项目列表 结束 -->

        <!-- 患者列表 开始 -->
        <!-- <a-card
          class="left-card"
          style="margin-top: 18px"
          :headStyle="headStyle"
          title="患者列表"
          :loading="patientLoading"
          bordered>
          <div class="patient-row" v-for="(patient, index) in patientList" :key="index">
            <div class="name">{{ patient.name }}</div>
            <a-rate disabled :value="patient.number">
              <a-icon slot="character" type="line" />
            </a-rate>
            <a-tag class="tag" color="orange">
              {{ patient.number }}
            </a-tag>
          </div>
        </a-card> -->
        <s-table
          ref="patientTable"
          size="default"
          bordered
          :rowKey="(record) => record.id"
          :row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys, onChange: handlePatientSelectChange }"
          :pageSize="5"
          :columns="patientColumns"
          :data="loadPatientData"
          :pagination="{
            simple: true
          }"
        >
          <template slot="title">
            <div style="font-size: 16px; font-weight: 500;">患者列表</div>
          </template>
          <span slot="ptsNo" slot-scope="text, record">
            <div style="display: flex; align-items: center;">
              <div>{{ record.ptsNo }}</div>
              <div style="flex: 1"></div>
              <a-progress style="width: 150px" :percent="getFinishPercent(record)" size="small" />
              <!-- <a-rate style="margin-right: 10px; margin-bottom: 2px" :default-value="3" :count="5" /> -->
              <!-- <a-badge
                :count="5"
                :number-style="{
                  backgroundColor: '#1890ff',
                  color: '#fff'
                }"
              /> -->
            </div>
          </span>

        </s-table>
        <!-- 患者列表 结束 -->
      </a-col>
      <!-- 左侧菜单 结束 -->
      <!-- 右侧表单 开始 -->
      <a-col :md="24" :lg="$props.ptsId ? 24 : 18">
        <a-card bordered>
          <a-form layout="horizontal" :form="form" class="form">
            <a-form-item label="id" style="display: none" >
              <a-input
                v-decorator="[
                  'id'
                ]"
              />
            </a-form-item>
            <a-col type="flex">
              <!-- 评估表 条件 开始 -->
              <a-row type="flex" align="middle" :gutter="16">
                <a-col :lg="6" :md="12" :sm="24">
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
                      <a-select-option v-for="(estimate, index) in estimateList" :key="index" :value="estimate.value">{{ estimate.name }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
                  <a-form-item
                    label="试验阶段"
                    v-bind="topFormItemLayout"
                  >
                    <a-select
                      @change="handleStepChange"
                      placeholder="请选择试验阶段"
                      v-decorator="[
                        'step',
                        {
                          rules: [{ required: true, message: '请选择试验阶段'}]
                        }
                      ]" >
                      <a-select-option v-for="(step, index) in stepList" :key="index" :value="step.id">{{ step.name }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
                  <a-button type="primary" v-if="formDisabled" @click="clickEdit" :disabled="selectStage ? false : true">编辑</a-button>
                  <a-button type="primary" v-if="!formDisabled" @click="clickSave">保存</a-button>
                  <a-button style="margin-left: 10px;" v-if="!formDisabled" @click="clickCancel">取消</a-button>
                </a-col>
              </a-row>
              <!-- 评估表 条件 结束 -->
              <a-divider dashed></a-divider>
              <!-- 肿瘤评估表 开始 -->
              <TumourForm
                :disabled="formDisabled"
                :form="form"
                :patientId="getPatientId"
                :patientName="getPatientName"
                :step="getSelectStepName"></TumourForm>
              <!-- 肿瘤评估表 结束 -->

            </a-col>
          </a-form>
        </a-card>
      </a-col>
      <!-- 右侧表单 结束 -->
    </a-row>
  </div>
</template>

<script>
import TumourForm from './TumourForm.vue'
import { getProjectList } from '@/api/project/project'
import { getPatientList } from '@/api/patient/patient'
import { getInputStageList, getTumourEstimateDetail, updateTumourEstimate } from '@/api/estimate/estimate'
import { buildPaginationObj } from '@/components/Table'

import moment from 'moment'

export default {
  components: {
    TumourForm
  },
  props: {
    ptsId: {
      default: null,
      type: [String, Number]
    },
    orgId: {
      default: null,
      type: [String, Number]
    },
    ptsName: {
      default: null,
      type: [String, Number]
    }
  },
  data () {
    return {
      selectedRowKeys: [],
      formDisabled: true,
      // 卡片头部样式
      headStyle: {
        'background-color': '#FAFAFA',
        'position': 'sticky',
        // 'position': '-webkit-sticky',
        'top': 0,
        'z-index': 10
      },
      // 表单样式
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
      // 项目列表加载
      projectLoading: false,
      selectProjectId: this.$store.getters.project.id,
      // 项目表头
      projectColumns: [
        {
          title: '项目名称',
          dataIndex: 'name'
        }
      ],
      id: null,
      stageId: null,
      // 项目列表 加载数据方法 必须为 Promise 对象
      loadProjectData: parameter => {
        console.log('loadData.parameter', parameter)
        return getProjectList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.page
          })
      },
      // 患者列表加载
      patientLoading: false,
      selectPatient: null,
      patientQueryParam: {
        proId: this.$store.getters.project.id
      },
      // 患者表头
      patientColumns: [
        {
          title: '受试者编号',
          dataIndex: 'ptsNo',
          scopedSlots: { customRender: 'ptsNo' }
        }
      ],
      // 患者列表 加载数据方法 必须为 Promise 对象
      loadPatientData: parameter => {
        console.log('loadData.parameter', parameter)
        if (this.patientQueryParam.proId == null) {
          return Promise.resolve(buildPaginationObj([]))
        }
        return getPatientList(Object.assign(parameter, this.patientQueryParam))
          .then(res => {
            if (res.content.length) {
              console.log(res.content[0])
              this.selectPatient = res.content[0]
              this.selectedRowKeys = [this.selectPatient.id]
              this.queryStageList()
            }
            return res
          })
      },
      form: null,
      // 评估表 列表
      estimateList: [{
        value: 1,
        name: '肿瘤评估表'
      }],
      // 试验阶段 列表
      stepList: [],
      // 选中的试验阶段
      selectStage: null,
      // 试验阶段
      stageNames: null
    }
  },
  watch: {
    stageId (newValue) {
      if (newValue) {
        this.queryEstimateDetail()
      }
    }
  },
  computed: {
    getSelectStepName () {
      if (this.selectStage == null) {
        return ''
      }
      return this.selectStage.name
    },
    getPatientId () {
      if (this.ptsId) {
        return this.ptsId
      } else if (this.selectPatient == null) {
        return ''
      }
      return this.selectPatient.ptsNo || ''
    },
    getPatientName () {
      if (this.ptsName) {
        return this.ptsName
      } else if (this.selectPatient == null) {
        return ''
      }
      return this.selectPatient.ptsName || ''
    }
  },
  beforeCreate () {
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
    if (this.$props.ptsId != null) {
      // 此时获取试验阶段，是从患者队列页面跳过来的。
      // 如果 受试者id 是从页面参数获取，需根据受试者id 获取受试者详情，并赋值 selectPatient
      this.selectPatient = {
        id: this.$props.ptsId,
        orgId: this.$props.orgId,
        ptsName: this.$props.ptsName
      }
      this.queryStageList()
      // getTesterInfo({
      //   enrolleeId: this.$props.ptsId
      // }).then(res => {
      //   this.selectPatient = res
      //   this.queryStageList()
      // })
    }
  },
  methods: {
        // 重置form
    resetForm () {
      this.selectStage = null
      this.form = this.$form.createForm(this)
      // 靶病灶位置  最长直径/淋巴结短径（mm）
      this.form.getFieldDecorator('babingzao', { initialValue: [''], preserve: true })
      // 非靶病灶位置  非靶病灶其他描述
      this.form.getFieldDecorator('feibabingzao', { initialValue: [''], preserve: true })
      // 新病灶
      this.form.getFieldDecorator('newDiseaseInput', { initialValue: [''], preserve: true })
      console.log('####', this.form)
    },
    // ********** 私有方法 **************
    getFinishPercent (record) {
      if (record.proStageCount > 0) {
        return Number(((record.alreadyStageCount / record.proStageCount) * 100).toFixed(1))
      }
      return 0
    },
    reloadPageData () {
      this.queryStageList()
    },
    // ********** 详情请求事件 **************
    queryEstimateDetail () {
      getTumourEstimateDetail({
        orgId: this.selectPatient.orgId || this.selectPatient.researchId,
        proId: this.selectProjectId,
        ptsId: this.selectPatient.id,
        stageId: this.stageId || this.selectStage.id
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
        let unTargetSite = []
        let feibabingzao = []
        let feibabingzaoLocation = []
        let feibabingzaoOther = []
        if (res.unTargetSite && res.unTargetSite !== 'null' && res.unTargetSite !== 'undefined') {
          unTargetSite = JSON.parse(res.unTargetSite)
          unTargetSite.forEach(item => {
            feibabingzao.push('')
            feibabingzaoLocation.push(item.location)
            feibabingzaoOther.push(item.desc)
          })
        } else {
          feibabingzao = ['']
          feibabingzaoLocation = ['']
          feibabingzaoOther = ['']
        }
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
    queryStageList () {
      getInputStageList({
        ptsId: this.$props.ptsId || this.selectPatient.id,
        proId: this.selectProjectId || this.$store.getters.project.project.id
      }).then(res => {
        this.stepList = res
      })
    },
    // ********** 事件回调 **************
    handleStepChange (e) {
      this.selectStage = this.stepList.filter(item => {
        return item.id === e
      })[0]
      console.log('########', e, this.selectStage)
      this.queryEstimateDetail()
    },
    /*
    handleProjectSelectChange (e) {
      console.log('############', e)
      this.selectProjectId = 1
      this.patientQueryParam = {
        proId: 1
      }
      this.$refs.patientTable.refresh(true)
    },
    */
    handlePatientSelectChange (e, rows) {
      console.log('######1231213######', rows)
      this.id = rows[0].id
      this.selectPatient = rows[0]
      this.selectedRowKeys = e
      this.queryStageList()
      // this.queryEstimateDetail()
      this.resetForm()
    },
    // ********** 点击事件 **************
    clickSave () {
      console.log('##### 靶病灶 #####', this.form.getFieldValue('babingzao'))
      console.log('##### 靶病灶 #####', this.form.getFieldValue('babingzaoLocation'), this.form.getFieldValue('babingzaoSize'))
      console.log('##### 非靶病灶 #####', this.form.getFieldValue('feibabingzao'))
      console.log('##### 非靶病灶 #####', this.form.getFieldValue('feibabingzaoLocation'), this.form.getFieldValue('feibabingzaoOther'))

      console.log('##### 新病灶 #####', this.form.getFieldValue('newDiseaseInput'))
      console.log('##### 新病灶 #####', this.form.getFieldValue('disease'))

      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          /*
          stageId	试验版本
          assessType 评估方法
          assessTime 评估日期
          ptsId 受试者id
          proId 项目id
          orgId 机构id
          targetSite 靶病灶位置以及描述
          unTargetSite 非靶病灶位置以及描述
          isNewTarget	是否有新病灶
          newTargetSite 新病灶
          evTarget 评价-靶病灶
          evUntarget 评价-非靶病灶
          evReaction 评价-整体反应
          */

          const assessTime = values.assessTime.format('YYYY-MM-DD')

          const targetSite = []
          for (let i = 0; i < values.babingzaoLocation.length; i++) {
            targetSite.push({
              'location': values.babingzaoLocation[i],
              'size': values.babingzaoSize[i]
            })
          }

          const unTargetSite = []
          for (let i = 0; i < values.feibabingzaoLocation.length; i++) {
            unTargetSite.push({
              'location': values.feibabingzaoLocation[i],
              'desc': values.feibabingzaoOther[i]
            })
          }

          console.log('@@@@@@@', assessTime, JSON.stringify(targetSite), JSON.stringify(unTargetSite))
          updateTumourEstimate({
            id: values.id,
            // id: this.id,
            stageId: this.stageId,
            assessType: values.assessType,
            assessTime: assessTime,
            ptsId: this.selectPatient.id,
            proId: this.selectProjectId,
            orgId: this.selectPatient.orgId || this.selectPatient.researchId,
            targetSite: JSON.stringify(targetSite),
            unTargetSite: unTargetSite[0].location ? JSON.stringify(unTargetSite) : '',
            isNewTarget: values.isNewTarget,
            newTargetSite: JSON.stringify(values.disease),
            evTarget: values.evTarget || '',
            evUntarget: values.evUntarget || '',
            evReaction: values.evReaction || ''
          }).then(res => {
            this.$message.success('保存成功！')
            this.queryEstimateDetail()
          })
        }
      })
    },
    clickEdit () {
      this.formDisabled = false
    },
    clickCancel () {
      this.queryEstimateDetail()
    }
  }
}
</script>

<style scoped lang="less">

  .left-card {
    height: 300px;
    overflow-y: auto;
    // background-color: #FF0000;
  }

  .project-row {
    padding: 0 auto;
    display: flex;
    align-items: center;
    margin-bottom: 18px;

    .number {
      margin-right: 20px;
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
    }

    .name {
      font-size: 16px;
      line-height: 28px;
      font-weight: 500;

      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }

  .patient-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: solid 1px #EEEEEE;
    border-radius: 6px;
    margin-bottom: 18px;
    height: 40px;
    padding: 0 10px;

    .name {
      font-size: 16px;
    }

    .tag {
      border-radius: 50%;
    }
  }

  .ant-form-item {
    margin-bottom: 0;
  }

</style>
