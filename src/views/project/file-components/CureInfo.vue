<template>
  <div>
    <!-- 诊断信息模块 -->
    <!-- 业务管理员视图+PI视图，业务管理员可切换列表与图文;PI只能看列表 -->
    <!-- v-if="roleId==$const.ROLE_TYPE.YW_ADMIN.value||roleId==$const.ROLE_TYPE.PI.value" -->
    <a-card v-if="$props.raceParams.type!==3">
      <in-page-skip :firstView="firstView" @goBack="handleGoBack">
        <div slot="firstShow">
          <!-- <div class="top">
            <a-button
              v-if="$auth('PROJECT.PROJECT_PATIENT_UPLOAD_FILES')"
              @click="toUpload"
              type="primary" >上传</a-button> -->
          <!-- PI不会点到这个图文材料按钮 -->
          <!-- <a-button
              type="primary"
              style="margin-right:20px;"
              @click="clickWatchImg"
            >
              核证副本
            </a-button>
          </div> -->
          <!-- 这两个值有了其中一个才展示 -->
          <s-table
            v-if="$props.raceParams.inhospIndexNo||$props.raceParams.outhospIndexNo"
            :rowKey="record=>record.id"
            :data="loadData"
            ref="table"
            :columns="columns">
            <template slot="diagDate" slot-scope="text,record">
              <div>
                {{ record.diagDate | moment() }}
              </div>
            </template>
          </s-table>
        </div>
        <div slot="skipIn">
          <ImageText :params="imgParams" ref="imgText"/>
        </div>
      </in-page-skip>
    </a-card>
    <a-card v-else>
      <ImageText :params="imgParams" ref="imgText"/>
    </a-card>
    <!--   CRA: 直接展示图文材料只有上传一个按钮
      CRC，直接展示图文材料，只有一个上传按钮 -->
    <!-- <a-card>
      <div class="top"><a-button>上传</a-button></div>
      <ImageText :params="imgParams" ref="imgText"/>
    </a-card> -->
  </div>
</template>
<script>
import { getCureInfo } from '@/api/patient/patient'
import ImageText from './ImageText.vue'
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
      listSource: [],
      firstView: true,
      columns: [
        {
          title: '诊断名称',
          dataIndex: 'diagName',
          align: 'center'
        },
        {
          title: '诊断编码',
          dataIndex: 'diagCode',
          align: 'center'
        },
        {
          title: '诊断类型',
          dataIndex: 'diagCategName',
          align: 'center'
        },
        // {
        //   title: '术前诊断名称',
        //   dataIndex: 'preSurgeryDiagName',
        //   align: 'center'
        // },
        {
          title: '主要诊断标志',
          dataIndex: 'mainDiagFlag',
          align: 'center'
        },
        {
          title: '诊断描述',
          dataIndex: 'diagDesc',
          align: 'center'
        },
        {
          title: '诊断时间',
          dataIndex: 'diagDate',
          align: 'center',
          scopedSlots: { customRender: 'diagDate' }
        },
        {
          title: 'ICD10',
          dataIndex: 'diagIcd10Code',
          align: 'center'
        }
      ],
      loadData: parameter => {
        return getCureInfo({ ...parameter, enrolleeId: this.$props.enrolleeId, ...this.$props.raceParams }).then(
          res => res
        )
      },
      roleId: 2
    }
  },
  created () {

  },
  mounted () {
    // this.roleId = this.$store.getters.userInfo.roleId
    console.log(this.imgParams)
      this.$bus.$on('getImgAuto', () => {
        this.$refs.imgText.getData()
     })
  },
  beforeDestroy () {
    this.$bus.$off('getImgAuto')
  },
  methods: {
    handleGoBack () {
      this.firstView = true
    },
    refreshTable () {
      if (this.$props.raceParams.inhospIndexNo || this.$props.raceParams.outhospIndexNo) {
        this.$refs.table.refresh(true)
      }
    },
    clickWatchImg () {
      console.log(this.$props, 'vvvv')
      this.$refs.imgText.getData().then(res => {
        this.firstView = false
      })
    },
    toUpload () {
      this.$router.push({
        name: 'UploadIndex',
        query: { ...this.$props, ...JSON.parse(sessionStorage.getItem('upLoadParams')) }
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
