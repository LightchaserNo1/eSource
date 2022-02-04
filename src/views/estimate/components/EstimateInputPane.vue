<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="24">
      <!-- 左侧菜单 开始 -->
      <a-col :md="24" :lg="6" v-if="!$props.ptsId">
        <!-- 项目列表 开始 -->
        <!-- <a-card class="left-card" :headStyle="headStyle" title="项目列表" :loading="projectLoading" bordered> -->
        <!-- <div class="project-row" v-for="(p, index) in projectList" :key="index">
            <div class="number">{{ index + 1 }}</div>
            <div class="name">{{ p.name }}</div>
          </div> -->
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

        <!-- </a-card> -->
        <!-- 项目列表 结束 -->

        <!-- 患者列表 开始 -->
        <!-- <a-card
          class="left-card"
          style="margin-top: 18px"
          :headStyle="headStyle"
          title="患者列表"
          :loading="patientLoading"
          bordered> -->
        <!-- <div class="patient-row" v-for="(patient, index) in patientList" :key="index">
            <div class="name">{{ patient.name }}</div>
          </div> -->
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
        </s-table>
        <!-- </a-card> -->
        <!-- 患者列表 结束 -->
      </a-col>
      <!-- 左侧菜单 结束 -->
      <!-- 右侧表单 开始 -->
      <a-col :md="24" :lg="$props.ptsId ? 24 : 18">
        <a-card bordered>
          <a-form layout="horizontal" :form="form" class="form">
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
                      placeholder="请选择试验阶段"
                      @select="handleStepChange"
                      v-decorator="[
                        'id',
                        {
                          initialValue: selectStage == null ? '' : selectStage.id,
                          rules: [{ required: true, message: '请选择试验阶段'}]
                        }
                      ]" >
                      <a-select-option v-for="(step, index) in stepList" :key="index" :value="step.id">{{ step.name }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
                  <a-button type="primary" @click.stop="clickSave">保存</a-button>
                </a-col>
              </a-row>
              <!-- 评估表 条件 结束 -->
              <a-divider dashed></a-divider>
              <!-- 肿瘤评估表 开始 -->
              <TumourForm
                :form="form"
                :patientId="getPatientId"
                :patientName="getPatientName"
                :step="getSelectStepName"
              ></TumourForm>
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
import { addTumourEstimate, getUnInputStageList } from '@/api/estimate/estimate'
import { getProjectList } from '@/api/project/project'
import { getPatientList } from '@/api/patient/patient'
import { buildPaginationObj } from '@/components/Table'

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
      // 卡片头部样式
      headStyle: {
        'background-color': '#FAFAFA',
        'position': 'sticky',
        // 'position': '-webkit-sticky',
        'top': 0
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
          dataIndex: 'ptsNo'
        }
      ],
      // 患者列表 加载数据方法 必须为 Promise 对象
      loadPatientData: parameter => {
        console.log('loadPatientData loadData.parameter', parameter, this.patientQueryParam)
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
      selectStage: null
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
      return this.$props.ptsId || this.selectPatient.ptsNo
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

    // ********** 网络请求 **************
    queryStageList () {
      getUnInputStageList({
        ptsId: this.selectPatient.ptsId || this.selectPatient.id,
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
    },
    // handleProjectSelectChange (e) {
    //   console.log('############', e)
    //   this.selectProjectId = 1
    //   this.patientQueryParam = {
    //     // proId: e[0]
    //     proId: 1
    //   }
    //   this.$refs.patientTable.refresh(true)
    // },
    handlePatientSelectChange (e, rows) {
      console.log('######1231213######', e, rows)
      this.selectPatient = rows[0]
      this.selectedRowKeys = e
      this.resetForm()
      this.queryStageList()
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
          console.log(assessTime)
          console.log(JSON.stringify(targetSite))
          console.log(JSON.stringify(unTargetSite))
          console.log(this.selectPatient)
          addTumourEstimate({
            stageId: this.selectStage.id,
            assessType: values.assessType,
            assessTime: assessTime,
            ptsId: this.selectPatient.id,
            proId: this.selectProjectId || this.$store.getters.project.id,
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
            this.queryStageList()
            this.$emit('saveSuccess')
            this.resetForm()
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">

  // .left-card {
    // height: 300px;
    // overflow-y: auto;
    // background-color: #FF0000;
  // }

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
    border: solid 1px #EEEEEE;
    border-radius: 6px;
    margin-bottom: 18px;
    height: 40px;

    .name {
      flex: 1;
      text-align: center;
      font-size: 16px;
    }
  }

  .ant-form-item {
    margin-bottom: 0;
  }

</style>
