<template>
  <!-- 全部档案组件 -->
  <div>
    <a-card :loading="cardLoading">
      <div>
        <!-- <h1>{{ isOut }}</h1>
        <h1>{{ selectType }}</h1> -->
        <span><strong>就诊例次:</strong></span>
        <a-select v-model="form.desc" style="width:250px;margin-left:30px;" @change="descChange">
          <a-select-option v-for="(item,index) in topList" :key="index" :value="item.desc">
            <a-popover placement="right" trigger="hover">
              <template slot="content">
                {{ item.desc }}
              </template>
              {{ item.desc }}
            </a-popover>
          </a-select-option>
        </a-select>
      </div>
      <div class="slice"></div>
      <!-- 业务管理员，PI，展示全;CRC，CRA，只展示受试者Id -->
      <a-descriptions bordered size="small" >
        <template>
          <a-descriptions-item label="受试者编号">
            {{ $route.query.ptsNo||$props.ptsNo }}
          </a-descriptions-item>
        </template>
        <template>
          <a-descriptions-item label="性别">
            {{ infoObj.sexName }}
          </a-descriptions-item>
          <a-descriptions-item label="费用">
          </a-descriptions-item>
          <!-- <a-descriptions-item label="病案号">
            {{infoObj.}}
          </a-descriptions-item> -->
          <a-descriptions-item label="ABO血型">
            {{ infoObj.aboName }}
          </a-descriptions-item>
          <a-descriptions-item label="医保类别">
            {{ infoObj.medicareCategName }}
          </a-descriptions-item>
          <!-- <a-descriptions-item label="姓名">
            {{ infoObj.ptsName }}
          </a-descriptions-item> -->
          <a-descriptions-item label="Rh血型">
            {{ infoObj.rhName }}
          </a-descriptions-item>
          <a-descriptions-item label="入院日期">
            <span v-if="infoObj.admitDate">
              {{ infoObj.admitDate | moment("YYYY-MM-DD") }}
            </span>
            <span v-else></span>
          </a-descriptions-item>
          <a-descriptions-item label="年龄">
            {{ infoObj.age }}
          </a-descriptions-item>
          <a-descriptions-item label="出生日期">
            <span v-if="infoObj.dateBirth">
              {{ infoObj.dateBirth | moment("YYYY-MM-DD") }}
            </span>
            <span v-else></span>
          </a-descriptions-item>
          <a-descriptions-item label="出院日期">
            <span v-if="infoObj.dischargeDate">
              {{ infoObj.dischargeDate | moment("YYYY-MM-DD") }}
            </span>
            <span v-else></span>
          </a-descriptions-item>
        </template>
      </a-descriptions>
    </a-card>
    <div class="slice"></div>
    <div v-if="tabList.length>0">
      <a-tabs @change="handleTabChange" :default-active-key="tabList[0].metaCode">
        <!--  下边这些metaCode,不会再变了。 -->
        <a-tab-pane
          v-for="(item) in tabList"
          :key="item.metaCode"
          :tab="item.metaName">
          <CureInfo
            v-if="item.metaCode==100010012"
            :metaCode="100010012"
            ref="cureInfo"
            :raceParams="raceParams"
            :enrolleeId="$props.enrolleeId"/>
          <!-- 病程记录 -->
          <SickRecord
            :metaCode="100010005"
            :enrolleeId="$props.enrolleeId"
            :inhospIndexNo="infoParams.outpatientNo"
            v-else-if="item.metaCode==100010005&&showSickRecord"
          />
          <Operation
            v-else-if="item.metaCode==100010010"
            ref="operation"
            :metaCode="100010010"
            :raceParams="raceParams"
            :enrolleeId="$props.enrolleeId"/>
          <Hayao
            v-else-if="item.metaCode==100010008"
            ref="medicine"
            :metaCode="100010008"
            :raceParams="raceParams"
            :enrolleeId="$props.enrolleeId"/>
          <!-- 检验 -->
          <CheckOut
            v-else-if="item.metaCode==100010006"
            ref="checkOut"
            :metaCode="100010006"
            :raceParams="raceParams"
            :enrolleeId="$props.enrolleeId"/>
          <Examine
            v-else-if="item.metaCode==100010007"
            ref="examine"
            :changeTimes="changeTimes"
            :metaCode="100010007"
            :raceParams="raceParams"
            :enrolleeId="$props.enrolleeId"/>
          <Sign
            v-else-if="item.metaCode==100010011"
            ref="sign"
            :metaCode="100010011"
            :raceParams="raceParams"
            :enrolleeId="$props.enrolleeId"/>
          <Pathology
            v-else-if="item.metaCode==100010009"
            ref="pathology"
            :metaCode="100010009"
            :raceParams="raceParams"
            :enrolleeId="$props.enrolleeId"/>
          <!-- 这个BeforeHospital就是用来展示图文材料用的 -->
          <BeforeHospital
            v-else
            :changeTimes="changeTimes"
            :type="selectType"
            ref="beforeHospital"
            :metaCode="item.metaCode"
            :enrolleeId="$props.enrolleeId"
          />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
import { BeforeHospital, CureInfo, Operation, Hayao, CheckOut, Pathology, Sign, Examine, SickRecord } from '../file-components'
import { getCureNumber, getTesterInfo, getTabList } from '@/api/patient/patient'
export default {
  props: {
    enrolleeId: {
      required: true,
      default: '',
      type: [String, Number]
    },
    /*
      这个ptsNo，理论上是通过患者信息接口里拿的，但是接口里没给
      如果是从患者检索里查看患者档案，则可通过组件传值带过来
    */
    ptsNo: {
      type: [String, Number],
      default: ''
    }
  },
  components: {
    BeforeHospital,
    CureInfo,
    Operation,
    Hayao,
    CheckOut,
    Pathology,
    Sign,
    SickRecord,
    Examine
  },
  data () {
    return {
      isOut: false,
      tabList: [],
      contentTabList: [],
      changeTimes: 1,
      selectType: null,
      indexNo: null,
      showSickRecord: false,
      roleId: 3,
      infoParams: {},
      blank: false,
      tabKeys: null,
      selectTarget: {},
      cardLoading: false,
      form: {},
      topList: [],
      infoObj: {},
      raceParams: {}
    }
  },
  watch: {
    selectType (type) {
      if (type === 1 || type === 3) {
        this.tabList.filter(item => item.metaName !== '病程记录')
        this.handleTabChange(100010005)
      } else {
        this.tabList = [...this.contentTabList]
        this.handleTabChange(100010006)
      }
    },
    raceParams: {
      immediate: true,
      deep: true,
      handler (newValue, oldValue) {
        this.$forceUpdate()
        console.log(newValue)
        this.updateTable()
      }
    }
  },
  created () {
    console.log(this.$props)
  },
  mounted () {
    // 获取动态tabs
    getTabList({ pageSize: 1000, pageNumber: 1, typeCode: 10001003 }).then(res => {
      // res.splice(0, 1)
      this.tabList = res
      this.contentTabList = res
      localStorage.setItem('metaCode', res[0].metaCode)
    })
    // 获取顶部就诊例次列表
    /*
       type:
       1---门诊 outhospIndexNo
       2---住院 inhospIndexNo
       3---院外 visitsCode
    */
    getCureNumber({ enrolleeId: this.$props.enrolleeId })
    .then(res => {
      console.log('#####', res)
      this.topList = res
      this.selectType = res[0].type
      this.selectTarget = res[0]
      // 临时又多了个参数，找不到在哪设置参数，才这样写的。这个参数是请求图文材料必传的参数
      this.form.desc = res[0].desc
      if (res[0].type === 3) {
        this.isOut = true
        this.showSickRecord = false
        this.infoParams.outpatientType = 3
        this.raceParams.visitsCode = res[0].visitsCode
        localStorage.setItem('visitsCode', this.selectTarget.visitsCode)
      } else if (res[0].type === 2) {
        this.infoParams.outpatientType = 2
        this.infoParams.outpatientNo = res[0].inhospIndexNo
        this.raceParams.inhospIndexNo = res[0].inhospIndexNo
        this.raceParams.type = res[0].type
        localStorage.setItem('visitsCode', this.selectTarget.inhospIndexNo)
        this.isOut = false
        this.showSickRecord = true
      } else if (res[0].type === 1) {
        this.infoParams.outpatientType = 1
        this.infoParams.outpatientNo = res[0].outhospIndexNo
        this.raceParams.outhospIndexNo = res[0].outhospIndexNo
        localStorage.setItem('visitsCode', this.selectTarget.outhospIndexNo)
        this.raceParams.type = res[0].type
        this.isOut = false
        this.showSickRecord = false
      }
      this.fetchInfo(this.infoParams)
    })
  },
  methods: {
    // 刷新table
    updateTable () {
      this.$nextTick(() => {
        if (this.tabKeys === 100010012) {
            this.$refs.cureInfo[0].refreshTable()
        } else if (this.tabKeys === 100010010) {
          this.$refs.operation[0].refreshTable()
        } else if (this.tabKeys === 100010008) {
          this.$refs.medicine[0].refreshTable()
        } else if (this.tabKeys === 100010006) {
          this.$refs.checkOut[0].refreshTable()
        } else if (this.tabKeys === 100010009) {
          this.$refs.pathology[0].refreshTable()
        } else if (this.tabKeys === 100010011) {
          this.$refs.sign[0].refreshTable()
        } else if (this.tabKeys === 100010007) {
          this.$refs.examine[0].refreshTable()
        }
      })
    },
    // 刷新图片
    updateImg () {
      this.$nextTick(() => {
        if (this.tabKeys === 100010012) {
            this.$refs.cureInfo[0].getImg()
        } else if (this.tabKeys === 100010010) {
          this.$refs.operation[0].getImg()
        } else if (this.tabKeys === 100010008) {
          this.$refs.medicine[0].getImg()
        } else if (this.tabKeys === 100010006) {
          this.$refs.checkOut[0].getImg()
        } else if (this.tabKeys === 100010009) {
          this.$refs.pathology[0].getImg()
        } else if (this.tabKeys === 100010011) {
          this.$refs.sign[0].getImg()
        } else if (this.tabKeys === 100010007) {
          this.$refs.examine[0].getImg()
        }
      })
    },
    // 获取受试者信息
    fetchInfo (params) {
      getTesterInfo({ enrolleeId: this.$props.enrolleeId, pageSize: 1000, pageNumber: 1, ...params }).then(res => {
        this.infoObj = res
        console.log(this.infoObj, '患者信息')
        this.cardLoading = false

        this.updateTable()
      })
    },
    handleTabChange (key) {
      console.log(key)
      this.changeTimes++
      key = parseInt(key)
      this.tabKeys = key
      console.log(this.tabKeys)
      localStorage.setItem('metaCode', this.tabKeys)
      const { inhospIndexNo, outhospIndexNo, type, visitsCode } = this.selectTarget
      if (type === 3) {
        // type为3===>为院外资料，下边不展示列表，直接展示图文材料
        this.isOut = true
      } else {
        this.isOut = false
      }
      this.raceParams = { inhospIndexNo, outhospIndexNo, type, visitsCode }
      for (const key in this.raceParams) {
        if (!this.raceParams[key]) {
          delete this.raceParams[key]
        }
      }
      // 更新tab时，获取参数并更新组件的table
      // 下边这些metaCode,不会再变了。
      if (!this.isOut) { // 不是院外资料的时候，下边才会展示列表。并可进行图文与列表的切换。
        this.updateTable()
        this.updateImg()
      } else { // 自动调用图文材料接口
        // this.$bus.$emit('getImgAuto')
        console.log('AUTO')
      }
    },
    // 选择就诊例次
    descChange (e) {
      /*
        type:
        1---门诊 outhospIndexNo
        2---住院 inhospIndexNo
        3---院外 visitsCode
      */
      this.changeTimes++
      this.selectType = 0
      const target = this.topList.find(item => item.desc === e)
      this.selectType = target.type
      this.selectTarget = target
      console.log(this.selectTarget)
      if (target.type === 3) {
        localStorage.setItem('visitsCode', this.selectTarget.visitsCode)
        this.showSickRecord = false
        this.infoParams = { outpatientType: 3 }
      } else if (target.type === 1) {
        this.showSickRecord = false
        localStorage.setItem('visitsCode', this.selectTarget.outhospIndexNo)
        this.infoParams = { outpatientType: 1, outpatientNo: target.outhospIndexNo }
      } else if (target.type === 2) {
        this.showSickRecord = true
        localStorage.setItem('visitsCode', this.selectTarget.inhospIndexNo)
        this.infoParams = { outpatientType: 2, outpatientNo: target.inhospIndexNo }
      }
      this.fetchInfo(this.infoParams)
      const { inhospIndexNo, outhospIndexNo, type, visitsCode } = target
      if (type === 3) {
        this.isOut = true
      } else {
        this.isOut = false
      }
      this.raceParams = { inhospIndexNo, outhospIndexNo, type, visitsCode }
      for (const key in this.raceParams) {
        if (!this.raceParams[key]) {
          delete this.raceParams[key]
        }
      }
      if (type !== 3) { // 不为院外资料，才会展示列表刷新列表
        this.updateTable()
      } else {
        this.isOut = false
        this.updateImg()
      }
    }
  }
}
</script>
<style scoped lang="less">
  .slice{
    height:30px;
    width: 100%;
  }
  .blue-divider{
    width: 100%;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .divider-div{
      width: 4px;
      height: 23px;
      margin-right: 5px;
      background-color: rgba(60,194,253);
    }
    span{
      display: flex;
      width: 70px;
      font-size: 15px;
      font-weight: 900;
    }
  }
</style>
