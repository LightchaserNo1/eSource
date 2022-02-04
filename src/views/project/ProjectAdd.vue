<template>
  <page-header-wrapper @back="$router.go(-1)">
    <a-card
      :body-style="{ padding: '18px' }"
      :bordered="false">
      <div class="top-nav">
        <div><a-descriptions title="研究基本信息"/></div>
      </div>
      <div class="form-wrapper">
        <a-form-model
          ref="ruleForm"
          layout="inline"
          :model="form"
          label-align="left"
          :rules="rules"
          :labelCol="{ style: 'width: 110px' }">
          <a-row :gutter="48">
            <a-col
              :md="8"
              :sm="24">
              <a-form-model-item
                label="项目编号"
                prop="no"
                labelAlign="left">
                <a-input v-model.trim="form.no" />
              </a-form-model-item>
            </a-col>
            <a-col
              :md="8"
              :sm="24">
              <a-form-model-item
                label="ProtocolNo"
                prop="ProtocolNo"
                labelAlign="left">
                <a-input v-model.trim="form.ProtocolNo"/>
              </a-form-model-item>
            </a-col>
            <a-col
              :md="8"
              :sm="24">
              <a-form-model-item
                label="立项时间"
                prop="buildTime"
                labelAlign="left">
                <a-date-picker
                  v-model="form.buildTime"
                  v-decorator="['date-time-picker']"
                  format="YYYY-MM-DD"
                  valueFormat="YYYY-MM-DD"
                  style="width:100%;"
                />
              </a-form-model-item>
            </a-col>
            <a-col
              :md="8"
              :sm="24">
              <a-form-model-item
                label="项目状态"
                prop="status"
                labelAlign="left">
                <a-select v-model.trim="form.status">
                  <a-select-option
                    v-for="(item,index) in projectStatus"
                    :key="index"
                    :value="item.value">
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col
              :md="16"
              :sm="24">
              <a-form-model-item
                label="项目全名"
                prop="name"
                labelAlign="left">
                <a-input
                  v-model.trim="form.name"
                  style="width:100%"/>
              </a-form-model-item>
            </a-col>
            <div style="clear:both;"></div>
            <a-col
              :md="20"
              :sm="24">
              <a-form-model-item
                label="申办方"
                labelAlign="left"
                prop="sponsorIds">
                <a-select
                  v-model="form.sponsorIds"
                  mode="multiple"
                  @change="sponsorChange"
                  placeholder="请选择申办方">
                  <a-select-option
                    v-for="(item,index) in sponsorList"
                    :key="index"
                    :value="item.id">
                    {{ item.orgName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col
              :md="4"
              :sm="24">
              <a-form-model-item>
                <a-button
                  type="primary"
                  @click="addSponsor()">新增申办方</a-button>
              </a-form-model-item>
            </a-col>
            <div style="clear:both;"></div>
            <a-col
              :md="20"
              :sm="24">
              <a-form-model-item
                label="访视阶段"
                labelAlign="left"
                prop="stageNames">
                <a-select
                  mode="multiple"
                  disabled
                  v-model="form.stageNames" >
                  <a-select-option
                    v-for="(item,index) in stageArr"
                    :key="index"
                    :value="item.stageName">
                    {{ item.stageName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col
              :md="4"
              :sm="24">
              <a-form-model-item>
                <a-button
                  type="primary"
                  @click="clickOpenModal(1)">编辑</a-button>
              </a-form-model-item>
            </a-col>
            <div style="clear:both;"></div>
            <a-col
              :md="8"
              :sm="24">
              <a-form-model-item
                label="研究分期"
                prop="stage"
                labelAlign="left">
                <a-select
                  v-model="form.stage"
                  @change="handleStageChange">
                  <a-select-option
                    v-for="(item,index) in ResearchList"
                    :key="index"
                    :value="item.id">
                    {{ item.metaName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- <a-col :md="8" :sm="24">
              <a-form-model-item>
                <a-button type="primary" @click="clickOpenModal(2)">编辑</a-button>
              </a-form-model-item>
            </a-col> -->
            <div style="clear:both;"></div>
            <a-col
              :md="4"
              :sm="24">
              <a-form-model-item
                label="访视频率"
                prop="firstAccessFre">
                <a-input-number
                  v-model.trim="form.firstAccessFre"
                  :min="1"/>
              </a-form-model-item>
            </a-col>
            <a-col
              :md="2"
              :sm="24">
              <a-form-model-item prop="firstAccessFreUnit">
                <a-select
                  v-model="form.firstAccessFreUnit"
                  @change="firstCycleChange">
                  <a-select-option
                    v-for="(item,index) in firstAccessFreUnitList"
                    :key="index"
                    :value="item.value">
                    {{ item.desc }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col
              :md="1"
              :sm="24">
              <a-form-model-item>
                <div style="font-size:30px;height:100%;line-height:100%;text-align:center;">±</div>
              </a-form-model-item>
            </a-col>
            <a-col
              :md="3"
              :sm="24">
              <a-form-model-item prop="afterAccessFre">
                <a-input-number
                  v-model.trim="form.afterAccessFre"
                  :min="1"
                  :max="maxInterview"
                  :disabled="!form.afterAccessFreUnit"
                />
              </a-form-model-item>
            </a-col>
            <a-col
              :md="2"
              :sm="24">
              <a-form-model-item prop="afterAccessFreUnit">
                <a-select
                  v-model="form.afterAccessFreUnit"
                  :disabled="!form.firstAccessFreUnit&&!form.firstAccessFre"
                  @change="secondCycleChange"
                >
                  <a-select-option
                    v-for="(item,index) in afterAccessFreUnitList"
                    :key="index"
                    :value="item.value"
                  >
                    {{ item.desc }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <!-- <div v-if="showList">
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="研究中心列表">
            <StudyCenter/>
          </a-tab-pane>
          <a-tab-pane key="2" tab="研究团队成员" force-render>
            <StudyMember/>
          </a-tab-pane>
        </a-tabs>
      </div> -->
      <div class="btn-wrap">
        <a-button
          @click="cilckSubmit()"
          size="large"
          type="primary"
          :loading="btnLoading">保存</a-button>
      </div>
      <!-- 研究分期弹窗 -->
      <OptionsModal
        :title="modalTitle"
        :visible="fenqiVisible"
        @modalCancel="modalCancel"
        @modalOk="modalOk"/>
      <!-- 访视阶段弹窗 -->
      <JdModal
        :jdVisible="jdVisible"
        @jdCancel="jdCancel"
        :title="jdModalTitle"
        @jdOk="jdOk"
        :stageArr="stageArr"/>
      <!-- 新增申办方弹窗 -->
      <AddModal
        :visible="addVisible"
        :openType="0"
        :business="business"
        :status="1"
        @modalOk="addSubmit"
        @modalCancel="addCancel"
      />
    </a-card>
  </page-header-wrapper>
</template>
<script>
// 获取研究分期列表
import { getDictionaryList } from '@api/optionConfig/optionConfig'
import moment from 'moment'
import OptionsModal from './components/OptionsModal.vue'
import JdModal from './components/JdModal.vue'
// import StudyCenter from './components/StudyCenter.vue'
// import StudyMember from './components/StudyMember.vue'
import { addProject, getSponsorList } from '@/api/project/project'
import AddModal from '../organization/components/AddModal.vue'
import { getDictionary, getInstitutionsAdd } from '@/api/organization/organization'
export default {
  props: {

  },
  components: {
    // StudyCenter,
    // StudyMember,
    OptionsModal,
    JdModal,
    AddModal
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
      // 访视频率加减最大值
      maxInterview: 0,
      // 下拉框数据
      business: [],
      ids: [],
      diffStageId: null,
      firstCycle: null,
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
      // afterAccessFreUnitList: [
      //   {
      //     value: '1',
      //     desc: '月'
      //   },
      //   {
      //     value: '2',
      //     desc: '天'
      //   },
      //   {
      //     value: '3',
      //     desc: '小时'
      //   }
      // ],
      modalType: null, // 1是访视阶段，2是研究分期
      modalTitle: '',
      stageList: '',
      // 访视阶段弹框开关
      jdVisible: false,
      // 研究分期弹窗开关
      fenqiVisible: false,
      // 新增申办方弹窗开关
      addVisible: false,
      showList: false,
      projectStatus: [
        {
          value: 1,
          text: '未启动'
        },
        {
          value: 2,
          text: '进行中'
        },
        {
          value: 3,
          text: '关闭'
        }
      ],
      stageArr: [],
      jdModalTitle: '编辑访视阶段',
      ResearchList: [],
      currentList: [],
      // 假数据:申办方列表,之后要请求接口的。
      sponsorList: [],
      btnLoading: false,
      form: {
        // stageNames: ['fff', 'f2123']
      },
      rules: {
        no: [
          { required: true, message: '请输入项目编号' },
          { min: 0, max: 20, message: '项目编号长度限制在20个字以内' },
          { pattern: /^[a-zA-Z0-9]+$/, message: '项目编号名格式错误' }
        ],
        ProtocolNo: [
          { min: 0, max: 20, message: '长度限制在20个字以内' },
          { pattern: /^[a-zA-Z0-9]+$/, message: '格式错误' }
        ],
        stage: [{ required: true, message: '请选择项目分期' }],
        sponsorIds: [{ required: true, message: '请选择申办方' }],
        name: [
          { required: true, message: '请输入项目全名' },
          { min: 0, max: 100, message: '长度限制在100个字以内' }
        ],
        buildTime: [{ required: true, message: '请选择立项时间' }],
        status: [{ required: true, message: '请选择项目状态' }],
        stageNames: [{ required: true, message: '请选择访视阶段', trigger: 'change' }],
        firstAccessFre: [{ required: true, message: '请补全访视频率' }],
        firstAccessFreUnit: [{ required: true, message: '请补全访视频率' }],
        afterAccessFre: [{ required: true, message: '请补全访视频率' }],
        afterAccessFreUnit: [{ required: true, message: '请补全访视频率' }]
      }
    }
  },
  watch: {
    visible (newv) {
      if (!newv) {
        this.getResearchList()
      }
    },
    form: {
      deep: true,
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
        console.log(this.maxInterview)
      }
    }
  },
  created () {

  },
  mounted () {
    this.getResearchList()
    this.getProjectStatus()
    this.getBodyType()
    this.getThisSponsorList()
  },
  methods: {
    // 限制选择频率
    firstCycleChange (e) {
      this.form = { ...this.form, afterAccessFre: '', afterAccessFreUnit: '' }
      this.firstCycle = e
    },
    secondCycleChange (e) {
      this.form = { ...this.form, afterAccessFre: 1 }
    },
    // 获取新增弹窗下拉列表
    getBodyType () {
      getDictionary({
        typeCode: 10001011
      }).then(res => {
        this.business = res
      })
    },
    // 选择研究分期
    handleStageChange (e) {
      this.diffStageId = e
    },
    // 获取申办方列表
    getThisSponsorList () {
      getSponsorList({ type: 1, pageSize: 1000, pageNumber: 1 }).then(res => {
        this.sponsorList = res.content
        console.log(this.sponsorList)
      })
    },
    // 打开新增申办方弹窗
    addSponsor () {
      this.addVisible = true
    },
    // 获取研究分期列表
    getResearchList () {
      // typeCode传10001009，就是获取研究分期列表
      getDictionaryList({ typeCode: 10001009, pageSize: 1000, pageNumber: 1 }).then(res => {
        this.ResearchList = res
      })
    },
    // 获取项目状态
    getProjectStatus () {
      // 006是项目状态
      getDictionaryList({ typeCode: 10001006, pageSize: 1000, pageNumber: 1 }).then(res => {
        // this.projectStatus = res
        console.log(res)
      })
    },
    // 关闭研究分期弹窗
    modalCancel (e) {
      if (this.modalType === 2) {
        if (e && parseInt(e) === parseInt(this.diffStageId)) {
          this.form.stage = null
        }
        this.getResearchList()
        this.fenqiVisible = false
      }
      this.modalTitle = ''
    },
    modalOk () {
      this.visible = false
      if (this.modalType === 2) {
        this.fenqiVisible = false
      }
      this.modalTitle = ''
    },
    // 打开编辑弹框
    clickOpenModal (e) {
      console.log(e)
      this.modalTitle = e === 1 ? '编辑访视阶段' : '编辑研究分期'
      this.modalType = e
      if (e === 2) {
        this.fenqiVisible = true
      } else {
        this.jdVisible = true
      }
    },
    sponsorChange (e) {
      console.log(e)
      // this.form.sponsorIds = e.join(',')
      // console.log(this.form)
    },
    clickCancelAdd () {
      this.$router.go(-1)
    },
    // 设置禁止选择的日期
    disabledDate (current) {
      return current && current < moment().endOf('day')
    },
    // 保存信息提交
    cilckSubmit () {
      // this.btnLoading = true
      console.log(this.form)
      this.$refs.ruleForm.validate(valid => {
        const bufferForm = { ...this.form }
        bufferForm.sponsorIds = bufferForm.sponsorIds.join(',')
        console.log(valid)
        if (valid) {
          addProject(bufferForm).then(res => {
            console.log(res)
            this.btnLoading = false
            this.$message.success('添加成功')
            // this.$router.go(-1)
            // this.$store.dispatch('EnterProject', { id: res }).then(res => {

            // })
            this.$router.push({
              name: 'ProjectUpdate',
              query: {
                id: res
              }
            })
          }, err => {
            console.log(err, '请求错误！！！')
            setTimeout(() => {
              this.btnLoading = false
            }, 1500)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    jdCancel () {
      this.jdVisible = false
    },
    jdOk (e) {
      this.stageArr = e.map(item => {
        return {
          status: item.status,
          stageName: item.stageName
        }
      })
      // this.form.stageNames = this.stageArr.map(item => item.stageName)
      const stageNames = this.stageArr.map(item => item.stageName)
      this.$set(this.form, 'stageNames', stageNames)
      console.log(this.stageArr, '处理后的阶段列表')
      this.form.proStageJson = JSON.stringify(this.stageArr)
      this.jdVisible = false
      console.log(this.form)
    },
        // 点击确认新增
    addSubmit (e) {
      console.log('编辑转入信息', e)
      getInstitutionsAdd({ ...e, type: 1 }).then(res => {
        this.addVisible = false
        this.$message.success('添加成功')
        this.getThisSponsorList()
      })
    },
    addCancel () {
      this.addVisible = false
    }
  }
}
</script>
<style scoped lang="css">
  .top-nav{
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  .btn-wrap{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items:center ;
  }
</style>
