<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="24">
      <!-- 提交审核 开始 -->
      <a-col
        :md="24"
        :lg="24">
        <a-card bordered>
          <a-col type="flex">
            <!-- 评估表 条件 开始 -->
            <a-row
              type="flex"
              justify="space-between"
              align="middle"
              :gutter="16">
              <a-col
                :lg="6"
                :md="12"
                :sm="24">
                受试者编号： <span class="ant-form-text"> {{ ptsNo }} </span>
              </a-col>
              <a-col
                :xl="{ span: 6, offset: 4 }"
                :lg="{ span: 15 }"
                :md="{ span: 24 }"
                :sm="24"
                class="btnCol">
                <!--      <a-button type="primary" @click="showProcess" v-if="$auth('UploadManage.addVisitsPro')"
                  >新建过程</a-button
                >
                <a-button type="primary" @click="showBusiness" v-if="$auth('UploadManage.addByBusiness')"
                  >新建业务</a-button
                > -->
                <a-button
                  type="primary"
                  @click="showModal">提交审核</a-button>
              </a-col>
            </a-row>
          </a-col>
          <!-- 评估表 条件 结束 -->
          <a-divider dashed></a-divider>
          <uploadForm
            :listTypeList="listTypeList"
            :listTrilStage="listTrilStage"
            :formData.sync="formData"
          ></uploadForm>
        </a-card>
      </a-col>
      <!-- 提交审核 结束 -->
    </a-row>
    <PersonForm
      ref="collectionForm"
      :visible="visible"
      @cancel="handleCancel"
      @ok="handleOk"></PersonForm>
    <esignPane
      ref="esignPane"
      :visible.sync="esignVisible"
      :width="width"
      :height="height"
      :lineWidth="lineWidth"
      :lineColor="lineColor"
      :bgColor="bgColor"
      :isCrop="isCrop"
      @cancel="cancelEsign"
      @ok="okEsign"
    ></esignPane>
  </div>
</template>

<script>
import PersonForm from './PersonForm.vue'
import esignPane from './esignPane.vue'
import uploadForm from './uploadForm.vue'
import { listTrilStage, listType, addOrUpdate, Login } from '@/api/update/update'
// submitReview
export default {
  components: {
    PersonForm,
    esignPane,
    uploadForm
  },
  data () {
    return {
      // 项目列表加载
      patientLoading: false,
      patientList: [],
      ptsNo: this.$route.query.ptsNo || '', // 受试者id
      ptsId: this.$route.query.ptsId || '', // 接口这里用的主键id
      form: null,
      visible: false,
      esignVisible: false, // 签字板是否开启
      listTrilStage: [], // 访视阶段列表
      listTypeList: [], // 核证副本类型列表
      width: '1200', // 签字板宽度
      height: '600', // 签字板高度
      lineWidth: 6, // 画笔的线条粗细
      lineColor: '#000000', // 画笔的颜色
      bgColor: '', // 画布的背景颜色
      isCrop: false, // 是否裁剪，在画布设定尺寸基础上裁掉四周空白部分
      formData: [
        {
          imageOriginal: '', // 核证原始图片
          imageAt: '', // 脱敏后图片
          typeNo: undefined, // 核证副本号
          typeName: '', // 核证副本名称
          trialStageNo: undefined, // 访视阶段号
          trialStageName: '', // 访视阶段名称
          signImg: '', // 上传人签名图片
          ptsId: '', // 受试者ID
          proId: this.$store.getters.project.id || null // 项目ID
        }
      ]
    }
  },
  computed: {
  },
  beforeCreate () {
    this.form1 = this.$form.createForm(this, { name: 'normal_login' })
  },
  beforeMount () {

  },
  mounted () {
    // 初始化数据
    this.getlistType()
    this.getlistTrilStage()
  },
  methods: {
    showModal () {
      let isAll = true
      this.formData.map(item => {
        const obj = {
          ...item
        }
        if (obj.imageOriginal === '' || obj.imageAt === '' || obj.typeNo === undefined || obj.trialStageNo === undefined) {
          isAll = false
        }
        return obj
      })
      if (!isAll) { return this.$message.warning('请确认所有项完成后提交') } else {
        this.visible = true
      }
    },
    handleCancel () {
      this.visible = false
    },
    handleOk () {
      const form = this.$refs.collectionForm.form
      form.validateFields((err, values) => {
        if (!err) {
          if (!values.checked) return this.$message.warning('请确认所有项完成后提交')
          const loginParams = {}
          loginParams.account = values.account
          loginParams.pwd = values.pwd
          // 调用登录接口
          Login(loginParams)
            .then(res => this.loginSuccess())
            .catch(err => this.loginFailed(err))
            .finally(() => {

            })
        } else {
          return
        }
        // console.log('Received values of form: ', values)
        form.resetFields()
        this.visible = false
      })
    },
    /*
     *@Description: 登录成功处理
     *@Author: Ling
     *@Date: 2021-11-17 16:19:30
    */
    loginSuccess () {
      this.esignVisible = true
      // 延迟600ms显示验证成功信息
      setTimeout(() => {
        this.$notification.success({
          message: '账户信息',
          description: `验证成功`
        })
      }, 600)
    },
    loginFailed (err) {
      console.log('====登录失败====', err)
    },
    cancelEsign () {
      this.esignVisible = false
    },
    okEsign (src) {
      this.esignVisible = false
      const arr = this.formData.map(item => {
        const obj = {
          ...item
        }
        obj.signImg = src
        obj.ptsId = this.ptsId
        obj.ptsNo = this.ptsNo
        return obj
      })
      console.log(JSON.stringify(arr))
      const form = new FormData()
      form.append('cerInfnos', JSON.stringify(arr))
      console.log(form.get('cerInfnos'))
      addOrUpdate(form).then((res) => {
        this.$message.success('保存成功')
        this.formData = [
          {
            imageOriginal: '', // 核证原始图片
            imageAt: '', // 脱敏后图片
            typeNo: undefined, // 核证副本号
            typeName: '', // 核证副本名称
            trialStageNo: undefined, // 访视阶段号
            trialStageName: '', // 访视阶段名称
            signImg: '', // 上传人签名图片
            ptsId: '', // 受试者ID
            proId: this.$store.getters.project.id || null // 项目ID
          }]
      })
        .catch((e) => {
          console.log(e)
        })
    },
    // 获取核证副本务列表
    getlistType () {
      const params = {
        proId: this.$store.getters.project.id
      }
      listType(params).then(res => {
        this.listTypeList = res
        // console.log(this.businessList)
      }, err => {
        console.log(err)
      })
    },
    // 获取访视阶段列表
    getlistTrilStage () {
      const params = {
        proId: this.$store.getters.project.id
      }
      listTrilStage(params).then(res => {
        this.listTrilStage = res.filter(item => item.id !== 0)
      }, err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="less">
.left-card {
  height: 590px;
  overflow-y: auto;
  // background-color: #FF0000;
}

.patient-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: solid 1px #eeeeee;
  border-radius: 6px;
  margin-bottom: 18px;
  height: 40px;
  padding: 0 10px;
  .name {
    width: 100%;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
  }
}
.btnCol {
  .ant-btn {
    margin-right: 10px;
  }
}
.ant-form-item {
  margin-bottom: 0;
}
</style>
