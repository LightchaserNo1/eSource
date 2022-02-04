<template>
  <div>
    <!-- 病理查询模块 -->
    <a-card v-if="$props.raceParams.type!==3">
      <in-page-skip :firstView="firstView" @goBack="handleGoBack">
        <div slot="firstShow">
          <!-- <div class="top">
            <a-button type="primary" @click="toUpload" v-if="$auth('PROJECT.PROJECT_PATIENT_UPLOAD_FILES')">上传</a-button>
            <a-button type="primary" style="margin-right:20px;" @click="clickWatchImg">核证副本</a-button>
          </div> -->
          <!-- 这两个值有了其中一个才展示 -->
          <s-table
            v-if="$props.raceParams.inhospIndexNo||$props.raceParams.outhospIndexNo"
            :rowKey="record=>record.id"
            :data="loadData"
            ref="table"
            :columns="columns">
            <template slot="applyDate" slot-scope="text,record">
              <div>
                {{ record.applyDate | moment() }}
              </div>
            </template>
            <template slot="examDate" slot-scope="text,record">
              <div>
                {{ record.examDate | moment() }}
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
  </div>
</template>
<script>
import { getPathology } from '@/api/patient/patient'
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
      firstView: true,
      imgParams: {
        ptsId: this.$props.enrolleeId,
        metaCode: this.$props.metaCode,
        proId: this.$store.getters.project.id,
        pageNumber: 1,
        pageSize: 100,
        visitsProcessNo: this.$props.raceParams.inhospIndexNo || this.$props.raceParams.outhospIndexNo || this.$props.raceParams.visitsCode
      },
      // 返回的字段不全
      columns: [
        {
          title: '申请号',
          dataIndex: 'pathologyExamRequisition_no',
          align: 'center'
        },
        {
          title: '病理项目',
          dataIndex: 'pathologyExamItemName',
          align: 'center'
        },
        {
          title: '申请时间',
          dataIndex: 'applyDate',
          align: 'center',
          scopedSlots: { customRender: 'applyDate' }
        },
        {
          title: '检查时间',
          dataIndex: 'examDate',
          align: 'center',
          scopedSlots: { customRender: 'examDate' }
        },
        {
          title: '检查类型',
          dataIndex: 'pathologyExamTypeName',
          align: 'center',
          scopedSlots: { customRender: 'pathologyExamTypeName' }
        },
        {
          title: '检查部位',
          dataIndex: 'pathologyExamPartName',
          align: 'center'
        },
        {
          title: '样本描述',
          dataIndex: 'sampleDesc',
          align: 'center'
        },
         {
          title: '肉眼所见',
          dataIndex: 'beSeenVisually',
          align: 'center'
        },
        {
          title: '镜下所见',
          dataIndex: 'microscopicFindings',
          align: 'center',
          scopedSlots: { customRender: 'microscopicFindings' }
        },
        {
          title: '病理诊断',
          dataIndex: 'diagDesc',
          align: 'center'
        }
      ],
      loadData: parameter => {
        return getPathology({ ...parameter, enrolleeId: this.$props.enrolleeId, ...this.$props.raceParams }).then(
          res => res
        )
      }
    }
  },
  created () {

  },
  mounted () {
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
