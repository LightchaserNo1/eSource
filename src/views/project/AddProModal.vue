<template>
  <div>
    <a-modal
      :width="675"
      @cancel="addModalCancel"
      @ok="cilckSubmit()"
      :visible="addProVisible"
      title="研究基本信息">
      <a-card
        :body-style="{ padding: '18px' }"
        :bordered="false">
        <div class="form-wrapper">
          <a-form-model
            ref="ruleForm"
            layout="inline"
            :model="form"
            label-align="left"
            :rules="rules"
            :labelCol="{ style: 'width: 110px' }">
            <a-form-model-item
              label="项目编号"
              prop="no"
              labelAlign="left">
              <a-input
                v-model.trim="form.no"
                placeholder="请输入项目编号" />
            </a-form-model-item>
            <a-form-model-item
              label="ProtocolNo"
              prop="ProtocolNo"
              labelAlign="left">
              <a-input
                v-model.trim="form.ProtocolNo"
                placeholder="请输入ProtocolNo"/>
            </a-form-model-item>
            <a-form-model-item
              label="项目状态"
              prop="status"
              labelAlign="left">
              <a-radio-group
                name="status"
                v-model="form.status">
                <a-radio
                  v-for="(item,index) in projectStatus"
                  :key="index"
                  :value="item.value">{{ item.text }}</a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item
              label="项目全名"
              prop="name"
              labelAlign="left">
              <a-input
                v-model.trim="form.name"
                placeholder="请输入项目全名"
                style="width:100%"/>
            </a-form-model-item>
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
            <a-form-model-item
              label="研究分期"
              prop="stage"
              labelAlign="left">
              <a-select
                v-model="form.stage"
                placeholder="请选择研究分期"
                @change="handleStageChange">
                <a-select-option
                  v-for="(item,index) in ResearchList"
                  :key="index"
                  :value="item.id">
                  {{ item.metaName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              label="申办方"
              labelAlign="left"
              prop="sponsorIds">
              <div class="flex">
                <a-select
                  style="width: 400px;"
                  v-model="form.sponsorIds"
                  mode="multiple"
                  @change="sponsorChange"
                  placeholder="请选择申办方"
                >
                  <a-select-option
                    v-for="(item,index) in sponsorList"
                    :key="index"
                    :value="item.id">
                    {{ item.orgName }}
                  </a-select-option>
                </a-select>
                <a-button
                  type="primary"
                  @click="addSponsor()">新增</a-button>
              </div>
            </a-form-model-item>
          </a-form-model>
        </div>
        <!-- 研究分期弹窗 -->
        <OptionsModal
          :title="modalTitle"
          :visible="fenqiVisible"
          @modalCancel="modalCancel"
          @modalOk="modalOk"/>
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
    </a-modal>
  </div>
</template>
<script>

// 获取研究分期列表
import { getDictionaryList } from '@api/optionConfig/optionConfig'
import moment from 'moment'
import OptionsModal from './components/OptionsModal.vue'
// import JdModal from './components/JdModal.vue'
import { addProject, getSponsorList, updateProject } from '@/api/project/project'
import AddModal from '../organization/components/AddModal.vue'
import { getDictionary, getInstitutionsAdd } from '@/api/organization/organization'
export default {
  props: {
    addProVisible: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object,
      default: null
    },
    updatas: {
      type: Boolean,
      required: false
    }
  },
  components: {
    OptionsModal,
    AddModal
  },
  data () {
    return {
      isYW: this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.YW_ADMIN.value),
      // 访视频率加减最大值
      maxInterview: 0,
      // 下拉框数据
      business: [],
      ids: [],
      diffStageId: null,
      firstCycle: null,
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
      rules: {}
    }
  },
  beforeUpdate () {
    this.rules = {
        no: [
          { required: true, message: '请输入项目编号' },
          { min: 0, max: 20, message: '项目编号长度限制在20个字以内' },
          { pattern: /^[^\u4e00-\u9fa5]+$/, message: '项目编号名格式错误' }
        ],
        ProtocolNo: [
          { min: 0, max: 20, message: '长度限制在20个字以内' },
          { pattern: /^[a-zA-Z0-9]+$/, message: '格式错误' }
        ],
        stage: [{ required: this.isYW ? (this.isYW && this.updatas) : true, message: '请选择项目分期' }],
        sponsorIds: [{ required: this.isYW ? (this.isYW && this.updatas) : true, message: '请选择申办方' }],
        name: [
          { required: this.isYW ? (this.isYW && this.updatas) : true, message: '请输入项目全名' },
          { min: 0, max: 100, message: '长度限制在100个字以内' }
        ],
        buildTime: [{ required: this.isYW ? (this.isYW && this.updatas) : true, message: '请选择立项时间' }],
        status: [{ required: this.isYW ? (this.isYW && this.updatas) : true, message: '请选择项目状态' }]
      }
  },
  watch: {
    visible (newv) {
      if (!newv) {
        this.getResearchList()
      }
    },
    data (val) {
      if (val) {
        console.log(val)
        this.form = { ...val }
        if (!this.form.sponsorIds && this.form.sponsorIds !== '0' && this.form.sponsorIds !== 0) {
          delete this.form.sponsorIds
        }
        console.log(this.form)
      }
    },
    addProVisible () {
      console.log('%%%%%%%%%%%%%%%', this.form)
    }
  },
  mounted () {
    this.getResearchList()
    this.getProjectStatus()
    this.getBodyType()
    this.getThisSponsorList()
  },
  methods: {
    addModalCancel () {
      this.$refs.ruleForm.resetFields()
      this.$emit('cancelAdd')
    },
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
      this.$refs.ruleForm.validate(valid => {
        console.log(11111, this.form, this.form.sponsorIds)
        const bufferForm = { ...this.form }
        if (this.form.sponsorIds) {
          if (bufferForm.sponsorIds || bufferForm.sponsorIds.length) {
            bufferForm.sponsorIds = bufferForm.sponsorIds.join(',')
          }
        }
        console.log(this.$props.data)
        console.log(bufferForm)
        console.log(this.$store.state.user.roles[0].id)
        if (valid) {
          if (this.$props.data === null) {
            addProject(bufferForm)
            .then(res => {
              console.log(res)
              this.btnLoading = false
              this.$message.success('添加成功')
              // this.$router.go(-1)
              // this.$store.dispatch('EnterProject', { id: res }).then(res => {

              // })
              this.$router.push({
                name: 'ProjectManage',
                query: {
                  id: res
                }
              })
            })
            .catch(() => {
              this.$message.error('添加失败')
            })
          } else {
            console.log(bufferForm)
            delete bufferForm.createrId
            updateProject(bufferForm)
            .then((res) => {
              this.$message.success('编辑成功')
              this.$emit('cancelAdd')
              console.log(res)
            })
            .catch((row) => {
              this.$message.error('编辑失败')
              console.log(row)
            })
          }
        } else {
          console.log('缺少信息')
          return false
        }
      })
    },
    jdCancel () {
      this.jdVisible = false
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
<style scoped lang="less">
  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &.access {
      width: 410px;
    }
    ::v-deep .ant-form-item {
      margin-bottom: 0;
      height: auto;
    }
    .jiajian {
      font-size: 30px;
      margin: 0 15px;
    }
  }
</style>
