<template>
  <div class="upload-panel">
    <a-row :gutter="24">
      <a-col class="left-card" :lg="4">
        <div
          class="project-row"
          :class="{active: ptsId === p.ptsId}"
          :title="p.ptsNo"
          v-for="(p, index) in patientList"
          :key="index"
          @click="getId(p.ptsId, p.ptsNo)">
          {{ p.ptsNo }}
        </div>
      </a-col>
      <!-- updata 开始 -->
      <a-col :lg="20">
        <template v-if="ptsId">
          <div class="upload-opt">
            <div class="no">
              受试者编号： <span class="no-num"> {{ ptsNo }} </span>
            </div>
          </div>
          <uploadFinishForm
            :key="uploadKey"
            :listTypeList="listTypeList"
            :listTrilStage="listTrilStage"
            :formData.sync="formData"
            :disable="true"
          ></uploadFinishForm>
        </template>
        <a-empty style="padding-top: 150px;" v-else />
      </a-col>
      <!-- updata 结束 -->
    </a-row>
    <PersonForm ref="collectionForm" :visible="visible" @cancel="handleCancel" @ok="handleOk"></PersonForm>
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
import uploadFinishForm from './uploadFinishForm.vue'
import { mapActions } from 'vuex'
import { listPts, listType, listTrilStage, submitReview, listCerByPage } from '@/api/update/update'
export default {
  components: {
    PersonForm,
    esignPane,
    uploadFinishForm
  },
  data () {
    return {
      uploadKey: 0,
      // 项目列表加载
      patientLoading: false,
      patientList: [],
      ptsNo: '', // 受试者id
      ptsId: '', // ptsId
      form: null,
      visible: false,
      esignVisible: false, // 签字板是否开启
      listTypeList: [], // 核证副本类型列表
      listTrilStage: [], // 访视阶段列表
      width: '1200', // 签字板宽度
      height: '600', // 签字板高度
      lineWidth: 6, // 画笔的线条粗细
      lineColor: '#000000', // 画笔的颜色
      bgColor: '', // 画布的背景颜色
      isCrop: false, // 是否裁剪，在画布设定尺寸基础上裁掉四周空白部分
      formData: [
        {
          imageAt: '',
          imageOriginal: '',
          proId: null,
          ptsId: null,
          signImg: '',
          typeNo: undefined, // 核证副本号
          typeName: '', // 核证副本名称
          trialStageName: '',
          trialStageNo: undefined
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
  },
  methods: {
    // 获取受试者list  并初始化第一个对象
    getList () {
      listPts({ proId: this.$store.getters.project.id }).then(res => {
        this.patientList = res
        this.ptsNo = res[0].ptsNo
        this.ptsId = res[0].ptsId
        this.getData()
      })
    },
    getId (ptsId, ptsNo) {
      if (ptsId === this.ptsId) return
      // 这里ptsNo代工取的主键id
      this.ptsId = ptsId
      this.ptsNo = ptsNo
      this.freshListData()
    },
    // 获取回显数据 同时刷新select列表
    getData () {
      const form = new FormData()
      form.append('proId', this.$store.getters.project.id)
      form.append('ptsId', this.ptsId)
      listCerByPage(form).then(res => {
        const arr = res.map(item => {
          const obj = {
            ...item
          }
          if (item.verifySignImg !== null) {
            item.loading = false
          }
          return obj
        })
        this.formData = arr
      }, err => {
        console.log(err)
      })
      this.getlistType()
      this.getlistTrilStage()
    },
    // 刷新数据
    freshListData () {
      this.getData()
      this.uploadKey++
    },
    ...mapActions(['Login']),
    handleCancel () {
      this.visible = false
    },
    handleOk () {
      const form = this.$refs.collectionForm.form
      const { Login } = this
      form.validateFields((err, values) => {
        if (!err) {
          const loginParams = {}
          loginParams.account = values.username
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
      console.log(src)
      const arr = this.formData.map(item => {
        const obj = {
          ...item
        }
        obj.signImg = src
        return obj
      })
      const form = new FormData()
      form.append('cerInfnos	', arr)
      submitReview(form).then((res) => {
        console.log(res)
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
    // 获取隶属业务列表
    getlistTrilStage () {
      const params = {
        proId: this.$store.getters.project.id
      }
      listTrilStage(params).then(res => {
        this.listTrilStage = res
        // console.log(this.listTrilStage)
      }, err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="less">
@import "./uploadTabItem";
</style>
