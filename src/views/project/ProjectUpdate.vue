<template>
  <div>
    <div class="box_wrap bgfff" >
      <div class="top-nav">
        <h2>研究基本信息</h2>
        <div class="right-btn">
          <a-button
            style="margin-right: 1rem;"
            @click="() => {addProVisible = true}"
            type="primary">编辑</a-button>
          <a-button
            style="margin-right: 1rem;"
            v-if="$isCenter"
            @click="syncHosptial(1)"
            type="primary">同步到医院</a-button>
          <a-button
            style="margin-right: 1rem;"
            v-if="$isCenter"
            @click="syncHosptial(2)"
            type="primary"
            ghost>导出</a-button>
          <!-- <a-button
            style="margin-right: 1rem;"
            v-if="$isCenter"
            @click="clickExport"
            type="primary"
            ghost>导出</a-button> -->
          <a-popconfirm
            v-if="$auth('PROJECT.PROJECT_DELETE')"
            title="是否删除项目？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleConfirmDelete()"
            @cancel="handleCancelDelete()">
            <a-button
              style="border:1px solid red;color:red"
              ghost>
              <a-icon type="delete"/>
              删除项目
            </a-button>
          </a-popconfirm>
        </div>
      </div>
      <template>
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
            {{ form.ProtocolNo }}
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
      </template>
    </div>
    <div
      class="box_wrap"
      style="margin-top:20px">
      <a-tabs
        default-active-key="1"
        type="card">
        <a-tab-pane
          key="1"
          tab="研究中心列表">
          <StudyCenter :proId="$props.proId"/>
        </a-tab-pane>
        <a-tab-pane
          key="2"
          tab="研究团队成员"
          force-render>
          <StudyMember :proId="$props.proId"/>
        </a-tab-pane>
        <a-tab-pane
          key="3"
          tab="访视计划"
          v-if="$auth('SYSTEM.PROJECT_VISIT_STAGE_FLOW')">
          <VisitPlan :proId="$props.proId"/>
        </a-tab-pane>
        <a-tab-pane
          key="4"
          tab="核证副本类型"
          v-if="$auth('SYSTEM.PROJECT_CERTIFIED_TYPE_LIST')">
          <CertifiedCopy :proId="$props.proId"/>
        </a-tab-pane>
      </a-tabs>
    </div>
    <AddProModal
      :data="form"
      :addProVisible="addProVisible"
      :updatas="true"
      @cancelAdd="cancelAdd"
    />
    <SyncToHosptial
      :visible="syncVisible"
      :openState="openState"
      @cancelSync="() => {this.syncVisible = false}"
      @syncOk="syncOk"
      @downLoad="clickExport"
      :proId="$props.proId"
    />
  </div>
</template>
<script>
import { getDictionary } from '@/api/organization/organization'
import { getDictionaryList } from '@api/optionConfig/optionConfig'
import StudyCenter from './components/StudyCenter.vue'
import StudyMember from './components/StudyMember.vue'
import CertifiedCopy from './components/CertifiedCopy.vue'
import VisitPlan from './components/VisitPlan.vue'
import AddProModal from './AddProModal'
import SyncToHosptial from './components/syncToHosptial.vue'
import { getProjectDetail, deleteProject, updateProject, getSponsorList, getStageList, syncToHosptial } from '@/api/project/project'

export default {
  components: {
    StudyCenter,
    StudyMember,
    AddProModal,
    VisitPlan,
    CertifiedCopy,
    SyncToHosptial
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
  props: {
    proId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      openState: 1,
      cardLoading: false,
      syncVisible: false,
      maxInterview: 0,
      addProVisible: false,
      unit: {
        1: '月',
        2: '天',
        3: '小时'
      },
      business: [],
      stageArr: [],
      firstCycle: null,
      fenqiVisible: false,
      diffStageId: null,
      jdVisible: false,
      projectStatus: {
        1: '未启动',
        2: '进行中',
        3: '关闭'
      },
      modalType: null,
      modalTitle: '',
      defaultOrgList: [],
      defaultStageList: [],
      createrId: this.$store.state.user.roles[0].id,
      ResearchList: [],
      form: {
        no: '',
        name: '',
        stage: '',
        ProtocolNo: '',
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
        proStageJson: [{ required: true, message: '请选择访视阶段' }],
        firstAccessFre: [{ required: true, message: '请补全访视频率' }],
        firstAccessFreUnit: [{ required: true, message: '请补全访视频率' }],
        afterAccessFre: [{ required: true, message: '请补全访视频率' }],
        afterAccessFreUnit: [{ required: true, message: '请补全访视频率' }]
      }
    }
  },
  created () {
    console.log(this.$store.state.user.roles[0].id)
  },
  mounted () {
    this.getBodyType()
    // 获取访视阶段列表
    this.fetchStageList()
    // 获取研究分期列表
    this.getResearchList()
    // 获取申办方列表
    this.fetchSponsorList()
    // 获取项目详情，做回显
    getProjectDetail({ id: this.$props.proId }).then(res => {
      console.log(res)
      if (res.firstAccessFreUnit) {
        this.firstCycle = parseInt(res.firstAccessFreUnit)
      }
      if (res.stage) {
        this.diffStageId = parseInt(res.stage)
      }
      if (res.sponsorIds && res.sponsorIds !== '0' && res.sponsorIds !== 0) {
        this.defaultOrgList = res.sponsorIds.split(',').map(item => parseInt(item))
      }
      const { no, name, stage, sponsorIds, protocolNo, status } = res
      let buildTime = ''
      if (res.buildTime) {
        buildTime = this.$options.filters.moment(res.buildTime, 'YYYY-MM-DD')
      }
      this.form = {
        createrId: this.createrId,
        no,
        name,
        stage,
        ProtocolNo: protocolNo,
        sponsorIds: sponsorIds ? sponsorIds.split(',').map(Number) : null,
        buildTime,
        status,
        id: this.$props.proId
      }
      console.log(this.form)
    })
  },
  methods: {
    // 同步到医院
    syncOk (orgId) {
      this.syncVisible = false
      console.log(orgId)
      this.cardLoading = true
      syncToHosptial({ proId: this.$props.proId, orgId })
      .then((res) => {
        console.log(res)
        this.$message.success('同步成功')
        this.cardLoading = false
      })
      .catch((row) => {
        console.log(row)
        this.$message.error('同步失败')
        this.cardLoading = false
      })
    },
    cancelAdd () {
      this.addProVisible = false
      getProjectDetail({ id: this.$props.proId }).then(res => {
        this.firstCycle = parseInt(res.firstAccessFreUnit)
        this.diffStageId = parseInt(res.stage)
        this.defaultOrgList = res.sponsorIds.split(',').map(item => parseInt(item))
        const { no, name, stage, sponsorIds, protocolNo, status } = res
        const buildTime = this.$options.filters.moment(res.buildTime, 'YYYY-MM-DD')
        this.form = {
          createrId: this.createrId,
          no,
          name,
          stage,
          ProtocolNo: protocolNo,
          sponsorIds: sponsorIds.split(',').map(Number),
          buildTime,
          status,
          id: this.$props.proId
        }
      })
    },
    getStageName (id) {
      return (this.ResearchList.find(v => v.id === id) || {}).metaName
    },
    getSponsorName (sponsorIds) {
      console.log(sponsorIds)
      console.log(sponsorIds.map(sponsorId => this.sponsorList.find(v => v.id === +sponsorId).orgName).toString())
      return sponsorIds.map(sponsorId => this.sponsorList.find(v => v.id === +sponsorId).orgName).toString()
    },
    getStageName2 (ids) {
      const arr = ids.split(',')
      return arr.map(sponsorId => this.stageArr.find(v => v.id === +sponsorId).orgName).toString()
    },
    clickBack () {
      this.$router.push({
        name: 'overview'
      })
    },
    // 获取申办方列表
    fetchSponsorList () {
      getSponsorList({ type: 1, pageSize: 1000, pageNumber: 1 }).then(res => {
        this.sponsorList = res.content
      })
    },
    getBodyType () {
      getDictionary({
        typeCode: 10001011
      }).then(res => {
        this.business = res
      })
    },
    // 获取当前项目的访视阶段列表
    fetchStageList () {
      getStageList({ proId: this.$props.proId }).then(res => {
        this.stageArr = res
        this.stageArr.forEach(item => {
          this.defaultStageList.push(item.id)
        })
      })
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
    // 保存，提交
    handleSave () {
      console.log(this.defaultStageList)
      if (!this.defaultStageList.length) {
        this.$message.error('请配置访视阶段')
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
    // 同步到医院弹窗
    syncHosptial (value) {
      this.openState = value
      this.syncVisible = true
    },
    clickExport () {
      this.syncVisible = false
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
    display: flex;
    justify-content:space-between;
    align-items: center;
    h2 {
      font-size: 16px;
      font-weight: bold;
      color: #232323;
    }
  }
  .box_wrap{
    border-radius: 5px;
  }
  .bgfff{
    background: #fff;
    padding:20px;
  }
  ::v-deep .ant-tabs.ant-tabs-card > .ant-tabs-bar .ant-tabs-tab{
    margin-right: 1px !important;
  }
  .right-btn{
    display: flex;
    justify-content: space-between;
  }
  .btn-wrap{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items:center ;
  }
</style>
