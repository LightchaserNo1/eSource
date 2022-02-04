<template>
  <div>
    <!-- 诊断信息模块 -->
    <a-card v-if="$props.raceParams.type!==3">
      <in-page-skip :firstView="firstView" @goBack="handleGoBack">
        <div slot="firstShow">
          <div class="top">
            <!-- <a-button type="primary" @click="toUpload" v-if="$auth('PROJECT.PROJECT_PATIENT_UPLOAD_FILES')">上传</a-button>
            <a-button type="primary" style="margin-right:20px;" @click="clickWatchImg">核证副本</a-button> -->
          </div>
          <!-- 这两个值有了其中一个才展示 -->
          <div>
            <a-row :gutter="48">
              <a-col :md="4" :sm="24">
                <div
                  class="btns"
                  v-for="(item) in sideBtns"
                  :key="item.type">
                  <a-button
                    class="button"
                    style="display:block;width:75%;"
                    @click="clickButton(item.type)"
                    :type="item.type==activeIndex?'primary':'default'">
                    {{ item.desc }}
                  </a-button>
                </div>
              </a-col>
              <a-col :md="20" :sm="24">
                <a-card>
                  <s-table
                    v-if="$props.raceParams.inhospIndexNo||$props.raceParams.outhospIndexNo"
                    :rowKey="record=>record.id"
                    :data="loadData"
                    ref="table"
                    :columns="columns">
                    <template slot="recordDate" slot-scope="text,record">
                      <div>
                        {{ record.recordDate | moment() }}
                      </div>
                    </template>
                  </s-table>
                </a-card>
              </a-col>
            </a-row>
          </div>
        </div>
        <div slot="skipIn">
          <ImageText :params="imgParams" ref="imgText" />
        </div>
      </in-page-skip>
    </a-card>
    <a-card v-else>
      <ImageText :params="imgParams" ref="imgText"/>
    </a-card>
  </div>
</template>
<script>
import { getSignInfo } from '@/api/patient/patient'
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
      firstView: true,
      sideBtns: [
        {
          type: 1,
          desc: '体温'
        },
        {
          type: 2,
          desc: '呼吸'
        },
        {
          type: 3,
          desc: '脉搏'
        },
        {
          type: 4,
          desc: '血压'
        }
      ],
      activeIndex: 1,
      queryParam: {
        type: 1
      },
      columns1: [
        {
          title: '测量时间',
          dataIndex: 'recordDate',
          align: 'center',
          scopedSlots: { customRender: 'recordDate' }
        },
        {
          title: '测量值',
          dataIndex: 'measureItemValue',
          align: 'center'
        },
        {
          title: '物理降温后测量值',
          dataIndex: 'afterValue',
          align: 'center'
        },
        {
          title: '单位',
          dataIndex: 'measureItemUnit',
          align: 'center'
        }
      ],
      columns2: [
        {
          title: '测量时间',
          dataIndex: 'recordDate',
          align: 'center',
          scopedSlots: { customRender: 'recordDate' }
        },
         {
          title: '测量值',
          dataIndex: 'measureItemValue',
          align: 'center'
        },
         {
          title: '单位',
          dataIndex: 'measureItemUnit',
          align: 'center'
        }
      ],
      columns3: [
        {
          title: '测量时间',
          dataIndex: 'recordDate',
          align: 'center',
          scopedSlots: { customRender: 'recordDate' }
        },
         {
          title: '测量值',
          dataIndex: 'measureItemValue',
          align: 'center'
        },
         {
          title: '单位',
          dataIndex: 'measureItemUnit',
          align: 'center'
        }
      ],
      columns4: [
        {
          title: '测量时间',
          dataIndex: 'recordDate',
          align: 'center',
          scopedSlots: { customRender: 'recordDate' }
        },
        {
          title: '收缩压',
          dataIndex: 'systolicPressure',
          align: 'center'
        },
        {
          title: '舒张压',
          dataIndex: 'diastolicPressure',
          align: 'center'
        },
        {
          title: '单位',
          dataIndex: 'easureItemUnit',
          align: 'center'
        }
      ],
      loadData: parameter => {
        return getSignInfo({ ...parameter, enrolleeId: this.$props.enrolleeId, ...this.$props.raceParams, ...this.queryParam }).then(
          res => res
        )
      }
    }
  },
  created () {

  },
  computed: {
    columns () {
      if (this.activeIndex === 1) {
        return this.columns1
      } else if (this.activeIndex === 2) {
        return this.columns2
      } else if (this.activeIndex === 3) {
        return this.columns3
      } else {
        return this.columns4
      }
    }
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
    refreshTable () {
      if (this.$props.raceParams.inhospIndexNo || this.$props.raceParams.outhospIndexNo) {
        this.$refs.table.refresh(true)
      }
    },
    // 选择不同体征
    clickButton (index) {
      console.log(index, 'tznm')
      this.activeIndex = index
      this.queryParam.type = index
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
  .btns {
    width: 100%;
    display: flex;
    margin: 10px 0;
    align-items: center;
    justify-content: center;
  }
  .button {
    width: 80%;
  }
</style>
