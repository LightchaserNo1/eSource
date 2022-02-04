<template>
  <div>
    <a-card v-if="$props.raceParams.type!=3">
      <!-- <h1>检验</h1> -->
      <in-page-skip :firstView="firstView" @goBack="handleGoBack">
        <div slot="firstShow">
          <div style="margin-bottom:20px;">
            <a-row :gutter="48">
              <a-col :md="24" :sm="24">
                <div style="display: flex; justify-content: flex-end;">
                  <!-- <a-button :type="testItemTypeCode==1?'primary':'default'" @click="()=>{testItemTypeCode=1}">非培养类</a-button>
                  <a-button style="margin-left:20px;" :type="testItemTypeCode==2?'primary':'default'" @click="()=>{testItemTypeCode=2}">微生物培养类</a-button> -->
                  <a-radio-group default-value="1" button-style="solid">
                    <a-radio-button value="1" @click="()=>{testItemTypeCode=1}">
                      非培养类
                    </a-radio-button>
                    <a-radio-button value="2" @click="()=>{testItemTypeCode=2}">
                      微生物培养类
                    </a-radio-button>
                  </a-radio-group>
                </div>
              </a-col>
              <a-col :md="8" :sm="24"></a-col>
              <!-- <a-col :md="8" :sm="24">
                <div class="top-right">
                  <div class="top-left">
                    <a-button type="primary" style="margin-right:20px;" @click="clickWatchImg">核证副本</a-button>
                    <a-button type="primary" @click="toUpload" v-if="$auth('PROJECT.PROJECT_PATIENT_UPLOAD_FILES')">上传</a-button>
                  </div>
                </div>
              </a-col> -->
            </a-row>
          </div>
          <!-- 这两个值有了其中一个才展示 -->
          <s-table
            v-if="$props.raceParams.inhospIndexNo||$props.raceParams.outhospIndexNo"
            :rowKey="record=>record.id"
            :data="loadData"
            ref="table"
            :columns="columns">
            <div slot="applyDate" slot-scope="text,record">
              <span v-if="record.applyDate && record.applyDate">
                {{ record.applyDate | moment() }}
              </span>
              <span v-else></span>
            </div>
            <div slot="testDate" slot-scope="text,record">
              <span v-if="record.testDate != null && record.testDate">
                {{ record.testDate | moment() }}
              </span>
              <span v-else></span>
            </div>
            <div slot="sampleSamplingDate" slot-scope="text,record">
              <span v-if="record.sampleSamplingDate != null && record.sampleSamplingDate">
                {{ record.sampleSamplingDate | moment() }}
              </span>
              <span v-else></span>
            </div>
            <div slot="reportDate" slot-scope="text,record">
              <span v-if="record.reportDate != null && record.reportDate">
                {{ record.reportDate | moment() }}
              </span>
              <span v-else></span>
            </div>
            <div slot="testDetailItemName" slot-scope="text,record">
              <a href="javascript:;" @click="watchRecord(record.microbeCode)">{{ record.testDetailItemName }}</a>
            </div>
            <div slot="isValid" slot-scope="text,record">
              <span v-if="record.isValid==-1">异常无意义</span>
              <span v-else-if="record.isValid==0">未确认</span>
              <span v-else-if="record.isValid==1">正常</span>
              <span v-else-if="record.isValid==2">异常有意义</span>
            </div>
          </s-table>
        </div>
        <div slot="skipIn">
          <ImageText :params="imgParams" ref="imgText"/>
        </div>
      </in-page-skip>
    </a-card>
    <!-- type为3==>院外资料，直接展示图文材料 -->
    <a-card v-else>
      <ImageText :params="imgParams" ref="imgText"/>
    </a-card>
    <a-modal :visible="visible" title="药敏记录" @ok="()=>{visible=false}" @cancel="()=>{visible=false}">
      <s-table :data="loadRecord" :columns="recordColumns" :rowKey="record=>record.medicineName">

      </s-table>
    </a-modal>
  </div>
</template>
<script>
import { getMCheckOutInfo, getMedicineRecord } from '@/api/patient/patient'
import { buildPaginationObj } from '@/components/Table'
import ImageText from './ImageText.vue'
export default {
  props: {
    enrolleeId: {
      required: true,
      type: [String, Number],
      default: ''
    },
    raceParams: {
      required: true,
      type: Object,
      default: () => {}
    },
    metaCode: {
      required: true,
      type: [String, Number],
      default: ''
    }
  },
  components: {
    ImageText
  },
  data () {
    return {
      microbeCode: null,
      visible: false,
      blue: true,
      imgParams: {
        ptsId: this.$props.enrolleeId,
        metaCode: this.$props.metaCode,
        proId: this.$store.getters.project.id,
        pageNumber: 1,
        pageSize: 100,
        visitsProcessNo: this.$props.raceParams.inhospIndexNo || this.$props.raceParams.outhospIndexNo || this.$props.raceParams.visitsCode
      },
      firstView: true,
      testItemTypeCode: 1,
      columns1: [
        {
          title: '申请单号',
          dataIndex: 'testRequisitionNo',
          align: 'center'
        },
        {
          title: '检验主题',
          dataIndex: 'testItemName',
          align: 'center'
        },
        {
          title: '检验项目',
          dataIndex: 'testDetailItemName',
          align: 'center'
        },
        {
          title: '申请时间',
          dataIndex: 'applyDate',
          align: 'center',
          scopedSlots: { customRender: 'applyDate' }
        },
        {
          title: '采样时间',
          dataIndex: 'sampleSamplingDate',
          align: 'center',
          scopedSlots: { customRender: 'sampleSamplingDate' }
        },
        {
          title: '检查时间',
          dataIndex: 'testDate',
          align: 'center',
          scopedSlots: { customRender: 'testDate' }
        },
        {
          title: '报告时间',
          dataIndex: 'reportDate',
          align: 'center',
          scopedSlots: { customRender: 'reportDate' }
        },
        {
          title: '标本',
          dataIndex: 'sampleName',
          align: 'center'
        },
        {
          title: '结果',
          dataIndex: 'smearResult',
          align: 'center'
        },
        {
          title: '定性结果',
          dataIndex: 'testResultValue',
          align: 'center'
        },
        // {
        //   title: '申请时间',
        //   dataIndex: 'applyDate',
        //   align: 'center',
        //   scopedSlots: { customRender: 'applyDate' }
        // },
        {
          title: '参考范围',
          dataIndex: 'referenceValue',
          align: 'center'
        },
        // {
        //   title: '类型',
        //   dataIndex: 'testItemTypeName',
        //   align: 'center'
        // },
        // {
        //   title: '药敏记录',
        //   dataIndex: 'testDetailItemName',
        //   align: 'center',
        //   scopedSlots: { customRender: 'testDetailItemName' }
        // },
        {
          title: '是否有临床意义',
          dataIndex: 'isValid',
          align: 'center',
          scopedSlots: { customRender: 'isValid' }
        }
      ],
       columns2: [
         {
          title: '申请单号',
          dataIndex: 'testRequisitionNo',
          align: 'center'
        },
         {
          title: '检验主题',
          dataIndex: 'testItemName',
          align: 'center'
        },
        {
          title: '检验项目',
          dataIndex: 'testItemTypeName',
          align: 'center'
        },
        {
          title: '申请时间',
          dataIndex: 'applyDate',
          align: 'center',
          scopedSlots: { customRender: 'applyDate' }
        },
         {
          title: '采样时间',
          dataIndex: 'sampleSamplingDate',
          align: 'center',
          scopedSlots: { customRender: 'sampleSamplingDate' }
        },
        {
          title: '检查时间',
          dataIndex: 'testDate',
          align: 'center',
          scopedSlots: { customRender: 'testDate' }
        },
        {
          title: '报告时间',
          dataIndex: 'reportDate',
          align: 'center',
          scopedSlots: { customRender: 'reportDate' }
        },
        {
          title: '标本',
          dataIndex: 'sampleName',
          align: 'center'
        },
        {
          title: '结果',
          dataIndex: 'smearResult',
          align: 'center'
        },
        {
          title: '培养结果',
          dataIndex: 'bacteriaCultivateResult',
          align: 'center'
        },
        {
          title: '菌计数',
          dataIndex: 'bacterialColonyCount',
          align: 'center'
        },
        {
          title: '药敏记录',
          dataIndex: 'testDetailItemName',
          align: 'center',
          scopedSlots: { customRender: 'testDetailItemName' }
        },
        // {
        //   title: '申请时间',
        //   dataIndex: 'applyDate',
        //   align: 'center',
        //   scopedSlots: { customRender: 'applyDate' }
        // },
        // {
        //   title: '参考范围',
        //   dataIndex: 'referenceValue',
        //   align: 'center'
        // },
        // {
        //   title: '类型',
        //   dataIndex: 'testItemTypeName',
        //   align: 'center'
        // },
        {
          title: '是否有临床意义',
          dataIndex: 'isValid',
          align: 'center',
          scopedSlots: { customRender: 'isValid' }
        }
      ],
      recordColumns: [
        {
          title: '药物名称',
          dataIndex: 'testDetailItemName',
          align: 'center'
        },
        {
          title: '最低抑菌浓度',
          dataIndex: 'mic',
          align: 'center'
        },
        {
          title: 'KB值',
          dataIndex: 'diameter',
          align: 'center'
        }
      ],
      // 图文材料传的的数据参数
      listSource: [],
      loadData: parameter => {
        return getMCheckOutInfo({ ...parameter,
          enrolleeId: this.$props.enrolleeId,
          proId: this.$store.getters.project.id,
          ...this.$props.raceParams,
          testItemTypeCode: this.testItemTypeCode }).then(
          res => res
        )
      },
      loadRecord: parameter => {
        return getMedicineRecord({ ...parameter, microbeCode: this.microbeCode }).then(res => {
          console.log(res, '记录')
          return buildPaginationObj(res)
        })
      }
    }
  },
  computed: {
    testItemTypeName () {
      return this.testItemTypeCode === 1 ? '非培养类' : '微生物培养'
    },
    columns () {
      if (this.testItemTypeCode === 1) {
        return this.columns1
      } else {
        return this.columns2
      }
    }
  },
  watch: {
    testItemTypeCode () {
      console.log(this.testItemTypeCode)
      if (this.$props.raceParams.inhospIndexNo || this.$props.raceParams.outhospIndexNo) {
        this.$refs.table.refresh(true)
      }
    }
  },
  created () {
    console.log(this.$props.raceParams.inhospIndexNo || this.$props.raceParams.outhospIndexNo)
  },
  mounted () {
    if (this.$refs.imgText) {
      this.$bus.$on('getImgAuto', () => {
      console.log(this.$refs.imgText, '99999999999')
      this.getImg()
    })
    }
  },
  beforeDestroy () {
    this.$bus.$off('getImgAuto')
  },
  methods: {
    toUpload () {
      console.log({ ...this.$props, ...JSON.parse(sessionStorage.getItem('upLoadParams')) })
      this.$router.push({
        name: 'UploadIndex',
        query: { ...this.$props, ...JSON.parse(sessionStorage.getItem('upLoadParams')) }
      })
    },
    // 查看药敏记录
    watchRecord (e) {
      this.microbeCode = e
      this.visible = true
    },
    handleGoBack () {
      this.firstView = true
    },
    refreshTable () {
      this.$nextTick(() => {
        console.log(this.$props, 999)
        if (this.$props.raceParams.inhospIndexNo || this.$props.raceParams.outhospIndexNo) {
          this.$refs.table.refresh(true)
        }
      })
    },
    clickWatchImg () {
      this.$refs.imgText.getData().then(res => {
        this.firstView = false
      })
    },
    // type为3时自动获取图文材料
    getImg () {
      if (this.$refs.imgText) {
        this.$refs.imgText.getData().then(res => {
          console.log('自动请求图片成功')
        })
      }
    }
  }
}
</script>
<style scoped lang="css">
  .top-right{
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
  }
</style>
