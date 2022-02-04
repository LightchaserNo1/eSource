<template>
  <div>
    <!-- 手术信息模块 -->
    <a-card v-if="$props.raceParams.type!==3">
      <in-page-skip :firstView="firstView" @goBack="handleGoBack">
        <div slot="firstShow">
          <div class="top">
            <!-- <a-button type="primary" @click="toUpload" v-if="$auth('PROJECT.PROJECT_PATIENT_UPLOAD_FILES')">上传</a-button> -->
            <a-button
              type="primary"
              v-if="roleId==$const.ROLE_TYPE.YW_ADMIN.value"
              @click="clickWatchImg"
              style="margin-right:20px;">图文材料</a-button>
          </div>
          <s-table
            v-if="$props.raceParams.inhospIndexNo || $props.raceParams.outhospIndexNo"
            :rowKey="record=>record.id"
            :data="loadData"
            ref="table"
            :columns="columns">
            <template slot="surgeryBeginDate" slot-scope="text,record">
              <div>
                {{ record.surgeryBeginDate | moment() }}
              </div>
            </template>
            <template slot="surgeryEndDate" slot-scope="text,record">
              <div>
                {{ record.surgeryEndDate | moment() }}
              </div>
            </template>
            <template slot="aboutRecord" slot-scope="text,record">
              <div>
                <a href="javascript:;" @click="beforeOperation(record)">术前小结</a>
                <a-divider type="vertical"></a-divider>
                <a href="javascript:;">手术记录</a>
              </div>
            </template>
          </s-table>
        </div>
        <div slot="skipIn">
          <ImageText :params="imgParams" ref="imgText"/>
        </div>
      </in-page-skip>
    </a-card>
    <!--   CRA: 直接展示图文材料只有上传一个按钮
      CRC，直接展示图文材料，只有一个上传按钮 -->
    <a-card v-else>
      <ImageText :params="imgParams" ref="imgText"/>
    </a-card>
  </div>
</template>
<script>
import ImageText from './ImageText.vue'
import { getOperationInfo } from '@/api/patient/patient'
export default {
  props: {
    enrolleeId: {
      required: true,
      type: [String, Number]
    },
    raceParams: {
      required: true,
      type: Object
    },
    metaCode: {
      required: true,
      type: [String, Number]
    }
  },
  components: {
    ImageText
  },
  data () {
    return {
      imgParams: {
        ptsId: this.$props.enrolleeId,
        metaCode: this.$props.metaCode,
        proId: this.$store.getters.project.id,
        pageNumber: 1,
        pageSize: 100,
        visitsProcessNo: this.$props.raceParams.inhospIndexNo || this.$props.raceParams.outhospIndexNo || this.$props.raceParams.visitsCode
      },
      roleId: 2,
      listSource: [],
      columns: [
        {
          title: '手术名称',
          dataIndex: 'surgeryName',
          align: 'center'
        },
        {
          title: '手术开始时间',
          dataIndex: 'surgeryBeginDate',
          align: 'center',
          scopedSlots: { customRender: 'surgeryBeginDate' }
        },
        {
          title: '手术结束时间',
          dataIndex: 'surgeryEndDate',
          align: 'center',
          scopedSlots: { customRender: 'surgeryEndDate' }
        },
        {
          title: '麻醉方式',
          dataIndex: 'anesMethodName',
          align: 'center'
        },
        {
          title: '术前诊断',
          dataIndex: 'preSurgeryDiagName',
          align: 'center'
        },
        {
          title: 'ICD9',
          dataIndex: 'ICD',
          align: 'center'
        },
        {
          title: '手术时长',
          dataIndex: 'cureType',
          align: 'center'
        },
        {
          title: '相关记录',
          dataIndex: 'aboutRecord',
          align: 'center',
          scopedSlots: { customRender: 'aboutRecord' }
        }
      ],
      firstView: true,
      loadData: parameter => {
        console.log(this.$props.raceParams, 99999)
        return getOperationInfo({ inhospIndexNo: this.$props.raceParams.inhospIndexNo, outhospIndexNo: this.$props.raceParams.outhospIndexNo }).then(
          res => res
        )
      }
    }
  },
  created () {

  },
  mounted () {
    this.roleId = this.$store.getters.userInfo.roleId
    this.$bus.$on('getImgAuto', () => {
      this.$refs.imgText.getData()
    })
  },
  beforeDestroy () {
    this.$bus.$off('getImgAuto')
  },
  methods: {
    toUpload () {
      this.$router.push({
        name: 'UploadIndex',
        query: { ...this.$props, ...JSON.parse(sessionStorage.getItem('upLoadParams')) }
      })
    },
    // 查看术前小结
    beforeOperation (record) {
      console.log(record)
    },
    refreshTable () {
      if (this.$props.raceParams.inhospIndexNo || this.$props.raceParams.outhospIndexNo) {
        this.$refs.table.refresh(true)
      }
    },
    handleGoBack () {
      this.firstView = true
    },
    clickWatchImg () {
      console.log(this.$props, 'vvvv')
      this.$refs.imgText.getData().then(res => {
        this.firstView = false
      })
    },
    // type为3时自动获取图文材料
    getImg () {
      console.log(this.$props, 'vvvv')
      this.$refs.imgText.getData().then(res => {
        console.log('自动请求图片成功')
      })
    }
  }
}
</script>
<style scoped lang="css">
  .top{
    display: flex;
    flex-direction: row-reverse;
    margin-bottom:20px;
  }
</style>
