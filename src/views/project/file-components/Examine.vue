<template>
  <div>
    <!-- 检查信息模块 -->
    <!-- <h1>检查</h1> -->
    <a-card v-if="$props.raceParams.type!==3">
      <in-page-skip :firstView="firstView" @goBack="handleGoBack">
        <div slot="firstShow">
          <!-- <div class="top">
            <a-button type="primary" @click="toUpload" v-if="$auth('PROJECT.PROJECT_PATIENT_UPLOAD_FILES')">上传</a-button>
            <a-button type="primary" style="margin-right:20px;" @click="clickWatchImg">核证副本</a-button>
          </div> -->
          <s-table
            v-if="$props.raceParams.inhospIndexNo||$props.raceParams.outhospIndexNo"
            :rowKey="record=>record.id"
            ref="table"
            :data="loadData"
            :columns="columns"
            :scroll="{x: 1800}"
          >
            <template slot="applyDate" slot-scope="text,record">
              <span v-if="record.applyDate != null && record.applyDate">
                {{ record.applyDate | moment() }}
              </span>
              <span v-else></span>
            </template>
            <template slot="reportDate" slot-scope="text,record">
              <span v-if="record.reportDate != null && record.reportDate">
                {{ record.reportDate | moment() }}
              </span>
              <span v-else></span>
            </template>
            <template slot="isValid" slot-scope="text,record">
              <div>
                <span v-if="record.isValid==-1">异常无意义</span>
                <span v-else-if="record.isValid==0">未确认</span>
                <span v-else-if="record.isValid==1">正常</span>
                <span v-else-if="record.isValid==2">异常有意义</span>
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
import { getExamineInfo } from '@/api/patient/patient'
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
    },
    changeTimes: {
      default: 0,
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
      firstView: true,
      // 缺少给药结束时间，总量，给药方式三个字段
      columns: [
        {
          title: '检查申请单ID',
          dataIndex: 'examRequisitionNo',
          align: 'center'
        },
        {
          title: '检查项目',
          dataIndex: 'examItemName',
          align: 'center'
        },
        {
          title: '检查申请时间',
          dataIndex: 'applyDate',
          align: 'center',
          scopedSlots: { customRender: 'applyDate' }
        },
        {
          title: '检查报告时间',
          dataIndex: 'reportDate',
          align: 'center',
          scopedSlots: { customRender: 'reportDate' }
        },
        {
          title: '检查类型',
          dataIndex: 'examItemTypeName',
          align: 'center'
        },
        {
          title: '检查部位',
          dataIndex: 'examPartName',
          align: 'center'
        },
        {
          title: '检查所见',
          dataIndex: 'examDesc',
          align: 'center',
          width: '30%'
        },
        {
          title: '检查诊断',
          dataIndex: 'examResult',
          align: 'center'
        },
        {
          title: '是否有临床意义',
          dataIndex: 'isValid',
          align: 'center',
          scopedSlots: { customRender: 'isValid' }
        }
      ],
      loadData: parameter => {
        console.log(this.$props.raceParams, 99999)
        return getExamineInfo({ ...parameter, enrolleeId: this.$props.enrolleeId, ...this.$props.raceParams }).then(
          res => res
        )
      }
    }
  },
  created () {

  },
  mounted () {
    // console.log(this.$refs.imgText)
    this.$bus.$on('getImgAuto', () => {
      if (this.$refs.imgText) {
        this.$refs.imgText.getData()
      }
    })
  },
  watch: {
    changeTimes () {
      this.$bus.$on('getImgAuto', () => {
        if (this.$refs.imgText) {
          this.$refs.imgText.getData()
        }
      })
    }
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
    },
    handleGoBack () {
      this.firstView = true
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
