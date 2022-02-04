<template>
  <div>
    <!-- 给药模块 -->
    <a-card v-if="$props.raceParams.type!==3">
      <in-page-skip :firstView="firstView" @goBack="handleGoBack">
        <div slot="firstShow">
          <!-- <div class="top">
            <a-button type="primary" @click="toUpload" v-if="$auth('PROJECT.PROJECT_PATIENT_UPLOAD_FILES')">上传</a-button>
            <a-button
              @click="clickWatchImg"
              type="primary"
              style="margin-right:20px;">核证副本</a-button>
          </div> -->
          <s-table
            v-if="$props.raceParams.inhospIndexNo||$props.raceParams.outhospIndexNo"
            :rowKey="record=>record.id"
            ref="table"
            :data="loadData"
            :columns="columns">
            <template slot="presOrderDate" slot-scope="text,record">
              <div v-if="record.presOrderDate">
                {{ record.presOrderDate | moment() }}
              </div>
            </template>
            <template slot="orderEndDate" slot-scope="text,record">
              <div>
                {{ record.orderEndDate | moment() }}
              </div>
            </template>
            <template slot="orderBeginDate" slot-scope="text,record">
              <div>
                {{ record.orderBeginDate | moment() }}
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
      <div class="top"><a-button v-if="$auth('PROJECT.PROJECT_PATIENT_UPLOAD_FILES')">上传</a-button></div>
      <ImageText :params="imgParams" ref="imgText"/>
    </a-card>
  </div>
</template>
<script>
import ImageText from './ImageText.vue'
import { getMedicineInfo } from '@/api/patient/patient'
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
      roleId: 2,
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
      // 缺少给药结束时间，总量，给药方式三个字段
      columns: [
        {
          title: '药物名词',
          dataIndex: 'medicineName',
          align: 'center'
        },
        {
          title: '给药开始时间',
          dataIndex: 'orderBeginDate',
          align: 'center',
          scopedSlots: { customRender: 'orderBeginDate' }
        },
        {
          title: '给药结束结束时间',
          dataIndex: 'orderEndDate',
          align: 'center',
          scopedSlots: { customRender: 'orderEndDate' }
        },
        {
          title: '给药方式',
          dataIndex: 'doseWayName',
          align: 'center'
        },
        {
          title: '单次剂量',
          dataIndex: 'dosage',
          align: 'center'
        },
        {
          title: '频次',
          dataIndex: 'frequency',
          align: 'center'
        },
        {
          title: '总量',
          dataIndex: 'packingSpecification',
          align: 'center',
          scopedSlots: { customRender: 'packingSpecification' }
        }
      ],
      loadData: parameter => {
        console.log(this.$props.raceParams, 99999)
        return getMedicineInfo({ ...parameter, enrolleeId: this.$props.enrolleeId, ...this.$props.raceParams }).then(
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
