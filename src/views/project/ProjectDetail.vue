<template>
  <div>
    <a-card
      :body-style="{ padding: '18px' }"
      :bordered="false"
      :loading="cardLoading">
      <div class="top-nav">
        <div style="font-weight:bold;font-size:14px;color:black;">研究基本信息</div>
      </div>
      <div class="form-wrapper" >
        <a-descriptions
          class="project-info"
          :column="3"
          bordered>
          <a-descriptions-item
            label="项目名称"
            :span="3">
            {{ form.name }}
          </a-descriptions-item>
          <a-descriptions-item label="项目状态">
            {{ projectStatus[form.status] }}
          </a-descriptions-item>
          <a-descriptions-item label="立项时间">
            {{ form.buildTime }}
          </a-descriptions-item>
          <a-descriptions-item label="项目编号">
            {{ form.no }}
          </a-descriptions-item>
          <a-descriptions-item label="ProtocolNO">
            {{ form.protocolNo }}
          </a-descriptions-item>
          <a-descriptions-item
            label="研究分期">
            {{ (ResearchList.length && form.stage) ? getStageName(form.stage) : '' }}
          </a-descriptions-item>
          <a-descriptions-item
            label="申办方">
            {{ (sponsorList.length && form.sponsorIds) ? getSponsorName(form.sponsorIds) : '' }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-card>
    <div class="topTab">
      <a-tabs
        default-active-key="1"
        type="card">
        <a-tab-pane
          key="1"
          tab="研究中心列表">
          <StudyCenter
            :proId="$props.proId"
            :isDetail="true"/>
        </a-tab-pane>
        <a-tab-pane
          key="2"
          tab="研究团队成员"
          force-render>
          <StudyMember
            :proId="$props.proId"
            :isDetail="true"/>
        </a-tab-pane>
        <a-tab-pane
          key="3"
          tab="访视计划"
          v-if="$auth('SYSTEM.PROJECT_VISIT_STAGE_FLOW')">
          <VisitPlan
            :proId="$props.proId"
            :isDetail="true"/>
        </a-tab-pane>
        <a-tab-pane
          key="4"
          tab="核证副本类型"
          v-if="$auth('SYSTEM.PROJECT_CERTIFIED_TYPE_LIST')">
          <CertifiedCopy
            :proId="$props.proId"
            :isDetail="true"/>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
import { getInstitutionsAdd, getDictionary } from '@/api/organization/organization'
import OptionsModal from './components/OptionsModal.vue'
import UpdateStage from './components/UpdateStage.vue'
import { getDictionaryList } from '@api/optionConfig/optionConfig'
import moment from 'moment'
// import { exportWord } from '@/utils/util'
import AddModal from '../organization/components/AddModal.vue'
import StudyCenter from './components/StudyCenter.vue'
import StudyMember from './components/StudyMember.vue'
import CertifiedCopy from './components/CertifiedCopy.vue'
import VisitPlan from './components/VisitPlan.vue'
import { getProjectDetail, deleteProject, updateProject, getSponsorList, getStageList } from '@/api/project/project'
// import { getInfo } from '@/api/login'
export default {
  props: {
    proId: {
      type: [Number, String],
      required: true
    }
  },
  components: {
    AddModal,
    StudyCenter,
    StudyMember,
    CertifiedCopy,
    VisitPlan,
    OptionsModal,
    UpdateStage
  },
  computed: {
   afterAccessFreUnitList () {
      if (this.firstCycle === 1) {
         return [
          {
            value: 2,
            desc: '天'
          },
          {
            value: 3,
            desc: '小时'
          }
        ]
      } else {
        return [
          { value: 3, desc: '小时' }
        ]
      }
    }
  },
  data () {
    return {
      maxInterview: 0,
      addVisible: false,
      firstAccessFreUnitList: [
        {
          value: 1,
          desc: '月'
        },
        {
          value: 2,
          desc: '天'
        },
        {
          value: 3,
          desc: '小时'
        }
      ],
      business: [],
      showStages: null,
      stageArr: [],
      firstCycle: null,
      diffStageId: null,
      cardLoading: true,
      showList: false,
      projectStatus: {
        1: '未启动',
        2: '进行中',
        3: '关闭'
      },
      jdModalTitle: '编辑试验阶段',
      modalType: null,
      modalTitle: '',
      defaultOrgList: [],
      defaultStageList: [],
      createrId: null,
      ResearchList: [],
      form: {
        no: '',
        name: '',
        stage: '',
        protocolNo: '',
        buildTime: '',
        sponsorName: '',
        status: '',
        id: this.$props.proId

      },
      proStageJson: '',
      sponsorList: [],
      rules: {
        no: [{ required: true, message: '请选择客户' }],
        sponsorIds: [{ required: true, message: '请选择申办方' }],
        stage: [{ required: true, message: '请选择项目分期' }],
        sponsorName: [{ required: true, message: '请输入申办方名称' }],
        name: [{ required: true, message: '请输入项目全名' }],
        buildTime: [{ required: true, message: '请选择立项时间' }],
        status: [{ required: true, message: '请选择项目状态' }],
        proStageJson: [{ required: true, message: '请选择试验阶段' }],
        firstAccessFre: [{ required: true, message: '请补全访视频率' }],
        firstAccessFreUnit: [{ required: true, message: '请补全访视频率' }],
        afterAccessFre: [{ required: true, message: '请补全访视频率' }],
        afterAccessFreUnit: [{ required: true, message: '请补全访视频率' }]
      },
      defaultSponsor: []
    }
  },
  created () {
    console.log(this.$props.proId)
  },
  mounted () {
    this.getBodyType()
    // getInfo({ proId: this.$props.proId }).then(res => {
    //   console.log(res, 'pms')
    //   console.log(this.$store.getters)
    // })
    // 获取试验阶段列表
    this.fetchStageList()
    // 获取研究分期列表
    this.getResearchList()
    // 获取申办方列表
    this.fetchSponsorList()
    // 获取项目详情，做回显
    getProjectDetail({ id: this.$props.proId }).then(res => {
      console.log(res)
      this.firstCycle = parseInt(res.firstAccessFreUnit)
      this.diffStageId = parseInt(res.stage)
      this.defaultOrgList = res.sponsorIds.split(',').map(item => parseInt(item))
      const { no, name, stage, protocolNo, sponsorIds, afterAccessFre, afterAccessFreUnit, firstAccessFre, firstAccessFreUnit, status } = res
      const buildTime = this.$options.filters.moment(res.buildTime, 'YYYY-MM-DD')
      this.form = { createrId: this.createrId, no, name, stage, protocolNo, sponsorIds, buildTime, status, afterAccessFre, afterAccessFreUnit, firstAccessFre, firstAccessFreUnit }
      this.cardLoading = false
    })
  },
  watch: {
    form: {
      deep: true,
      immediately: true,
      handler (newVaule, oldVaule) {
        // firstUnit 第一个输入框的单位
        // firstInput 第一个输入框
        // secondUnit 第二个输入框的单位
        if (newVaule.firstAccessFreUnit && newVaule.firstAccessFre && newVaule.afterAccessFreUnit) {
          const firstUnit = Number(newVaule.firstAccessFreUnit)
          const firstInput = Number(newVaule.firstAccessFre)
          const secondUnit = Number(newVaule.afterAccessFreUnit)
          if (firstUnit === 1) {
            if (secondUnit === 2) {
              this.maxInterview = firstInput * 30
            } else if (secondUnit === 3) {
              this.maxInterview = firstInput * 24 * 30
            }
          } else if (firstUnit === 2) {
            if (secondUnit === 3) {
              this.maxInterview = firstInput * 24
            }
          } else if (firstUnit === 3) {
            if (secondUnit === 3) {
              this.maxInterview = firstInput
            }
          }
        }
        console.log(this.maxInterview, '++++++++')
      }
    }
  },
  methods: {
    handleFirstChange (e) {
      this.form = { ...this.form, afterAccessFre: '', afterAccessFreUnit: '' }
      this.firstCycle = e
    },
    secondCycleChange (e) {
      this.form = { ...this.form, afterAccessFre: 1 }
    },
    // 获取申办方列表
    fetchSponsorList () {
      getSponsorList({ type: 1, pageSize: 1000, pageNumber: 1 }).then(res => {
        this.sponsorList = res.content
      })
    },
    getStageName (id) {
      return (this.ResearchList.find(v => v.id === id) || {}).metaName
    },
    getSponsorName (sponsorIds) {
      if (typeof sponsorIds === 'string') {
        return this.sponsorList.find(v => v.id === +sponsorIds).orgName.toString()
      } else if (typeof sponsorIds === 'object') {
        return sponsorIds.map(sponsorId => this.sponsorList.find(v => v.id === +sponsorId).orgName).toString()
      }
    },
    getBodyType () {
      getDictionary({
        typeCode: 10001011
      }).then(res => {
        this.business = res
      })
    },
    addSubmit (e) {
      console.log('编辑转入信息', e)
      getInstitutionsAdd({ ...e, type: 1 }).then(res => {
        this.addVisible = false
        this.$message.success('添加成功')
        this.fetchSponsorList()
      })
    },
    // 获取当前项目的试验阶段列表
    fetchStageList () {
      getStageList({ proId: this.$props.proId }).then(res => {
        console.log(res, '试验阶段列表')
        this.stageArr = res
        this.stageArr.forEach(item => {
          this.defaultStageList.push(item.id)
        })
      })
    },
    // 设置禁止选择的日期
    disabledDate (current) {
      return current && current < moment().endOf('day')
    },
    // 选择研究分期
    handleStageChange (e) {
      console.log(e)
      this.diffStageId = e
    },
    getResearchList () {
      // typeCode传10001009，就是获取研究分期列表
      getDictionaryList({ typeCode: 10001009, pageSize: 1000, pageNumber: 1 }).then(res => {
        this.ResearchList = res
      })
    },
    // 确认删除项目
    handleConfirmDelete () {
      deleteProject({ id: this.$props.proId }).then(res => {
        this.$message.success('删除成功')
          setTimeout(() => {
            this.$router.push({
              name: 'All'
            })
        }, 300)
      })
    },
    // 取消删除项目
    handleCancelDelete () {
      console.log('取消删除项目')
    },
    sponsorChange (e) {
      this.form.sponsorIds = e.join(',')
    },
    // 保存，提交
    handleSave () {
      console.log(this.defaultStageList)
      if (!this.defaultStageList.length) {
        this.$message.error('请配置试验阶段')
        return false
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // this.form.sponsorIds = this.form.sponsorIds.join(',')
          updateProject({ ...this.form, id: this.$props.proId }).then(res => {
            this.$message.success('修改成功')
            this.$router.push({
              name: 'All'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    stageChange (e) {
      const stageArray = this.stageArr.filter(item => {
        return e.findIndex(value => value === item.id) !== -1
      }).map(item => {
        return {
           stageName: item.stageName || '',
           stageCode: item.stageCode || '',
           remarks: item.remarks || '',
           status: item.status
        }
      })
      this.form.proStageJson = JSON.stringify(stageArray)
    },
    clickExport () {
      const parseParams = (url, params) => {
        const paramsArray = []
        Object.keys(params).forEach(key => params[key] && paramsArray.push(`${key}=${params[key]}`))
        if (url.search(/\?/) === -1) {
          url += `?${paramsArray.join('&')}`
        } else {
          url += `&${paramsArray.join('&')}`
        }
        return url
      }
      const baseUrl = '/api'
      const api = '/boss/project/info/export'
      const fullUrl = baseUrl + api
      console.log(fullUrl)
      const dealUrl = parseParams(fullUrl, { proId: this.$props.proId })
      console.log({ proId: this.$props.proId })
      window.open(dealUrl, '_self')
    }
    // clickExport () {
    //   console.log('导出项目')
    //   exportProject({ proId: this.$props.proId }).then(res => {
    //     console.log(res)
    //     exportWord('项目日志', res)
    //   })
    // },
  }
}
</script>
<style scoped lang="less">
.project-info {
    width: 100%;
    margin-top: 20px;
    ::v-deep .ant-descriptions-item-label{
      color: #0F121B;
      background: rgba(241, 245, 248, 0.6);
      padding-right: 20px;
      text-align: right;
    }
    ::v-deep .ant-descriptions-item-content{
      color: #4D5C6F;
    }
  }
  .top-nav{
    /* margin-left:18px; */
    line-height: 40px;
    height: 40px;
    width: 100%;
    display: flex;
    justify-content:space-between;
    align-items: center;
  }
  .right-btn{
    /* margin-right:-18px; */
    width: 17%;
    display: flex;
    justify-content: space-between;
  }
  .btn-wrap{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items:center ;
  }
  ::v-deep .ant-tabs.ant-tabs-card > .ant-tabs-bar .ant-tabs-tab{
    margin-right: 1px !important;
  }
  .topTab{
    margin-top:20px
  }
</style>
