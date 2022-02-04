<template>
  <!-- 病程记录模块 -->
  <div>
    <a-card>
      <in-page-skip :firstView="firstView" @goBack="handleGoBack">
        <div slot="firstShow">
          <!-- <div class="btn"><a-button @click="clickWatchImg" type="primary">核证副本</a-button></div> -->
          <a-row :gutter="48">
            <a-col :md="4" :sm="24">
              <div v-for="(item, index) in options" :key="index" class="btns">
                <a-button class="button" :type="index == activeIndex ? 'primary' : 'default'" @click="clickChange(index)">
                  {{ item }}
                </a-button>
              </div>
            </a-col>
            <a-col :md="20" :sm="24">
              <a-card :loading="loading" v-if="htmlValue.length" style="height: 350px; overflow-y: scroll;" >
                <div v-for="(item, index) in htmlValue" :key="index">
                  <div v-html="item.html"></div>
                  <a-divider />
                </div>
                <!-- <a-table
                    :data-source="dataTable"
                    :columns="columns"
                    :loading="loading"
                    bordered
                    :pagination="pagination"
                    @change="pageChange"
                  >
                  </a-table> -->
              </a-card>
              <a-empty v-else />
            </a-col>
          </a-row>
        </div>
        <div slot="skipIn">
          <ImageText :params="imgParams" ref="imgText"/>
        </div>
      </in-page-skip>
    </a-card>
  </div>
</template>
<script>
import { dailyRecord, exitHos, checkRoom, firstRecord, stageBrief } from '@/api/patient/record'
import InPageSkip from '@/components/InPageSkip/InPageSkip.vue'
import ImageText from './ImageText.vue'
export default {
  props: {
    enrolleeId: {
      type: [String, Number],
      required: true
    },
    inhospIndexNo: {
      type: [String, Number],
      default: ''
    },
    metaCode: {
      required: true,
      type: [String, Number]
    }
  },
  components: { InPageSkip, ImageText },
  data () {
    return {
      loading: false,
      params: {
        inhospIndexNo: this.$props.inhospIndexNo,
        enrolleeId: this.$props.enrolleeId
      },
      // dataTable: [],
      htmlValue: null,
      firstView: true,
      // options: ['日常病程记录', '出院小结', '查房记录', '第一次病程记录', '阶段小结'],
      options: ['首次病程', '日常病程', '查房记录', '阶段小结', '出院小结'],
      activeIndex: 0,
      // columns: [],
      // loading: false,
      imgParams: {
        ptsId: this.$props.enrolleeId,
        metaCode: this.$props.metaCode,
        proId: this.$store.getters.project.id,
        pageNumber: 1,
        pageSize: 100,
        visitsProcessNo: this.$props.inhospIndexNo
      }
      // pagination: {
      //   total: 0,
      //   current: 1,
      //   pageSize: 10,
      //   showSizeChanger: true,
      //   pageSizeOptions: ['5', '10', '20', '50'],
      //   showTotal: total => `共${total}条数据`
      // }
    }
  },
  created () {},
  mounted () {
    this.htmlValue = []
    this.loading = true
    firstRecord(this.params)
    .then(res => {
      console.log(res)
      res.forEach(item => {
        this.htmlValue.push({ html: item.htmlValue })
      })
      console.log(this.htmlValue)
      // this.dataTable = res
      // this.columns = [
      //   {
      //     title: '首次病程',
      //     align: 'center',
      //     dataIndex: 'tcmObserveResult'
      //   }
      // ]
      this.loading = false
    })
    .catch(() => { this.loading = false })
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
    clickWatchImg () {
      console.log(this.$props, 'vvvv')
      this.$refs.imgText.getData().then(res => {
        this.firstView = false
      })
    },
    // 本地分页
    // pageChange (val) {
    //   console.log(val)
    //   const pager = { ...this.pagination }
    //   pager.current = val.current
    //   pager.pageSize = val.pageSize
    //   this.pagination = pager
    // },
    clickChange (index) {
      this.activeIndex = index
      if (index === 0) {
        this.htmlValue = []
        this.loading = true
        firstRecord(this.params).then(res => {
          console.log(res)
          res.forEach(item => {
            this.htmlValue.push({ html: item.htmlValue })
          })
          console.log(this.htmlValue)
          // this.dataTable = res
          // this.columns = [
          //   {
          //     title: this.options[index],
          //     align: 'center',
          //     dataIndex: 'patChiefDesc'
          //   }
          // ]
          this.loading = false
        }).catch(() => { this.loading = false })
      } else if (index === 1) {
        this.htmlValue = []
        this.loading = true
        dailyRecord(this.params).then(res => {
          console.log(res)
          res.forEach(item => {
            this.htmlValue.push({ html: item.htmlValue })
          })
          console.log(this.htmlValue)
          // this.dataTable = res
          // this.columns = [
          //   {
          //     title: this.options[index],
          //     align: 'center',
          //     dataIndex: 'inhospProc'
          //   }
          // ]
          this.loading = false
        }).catch(() => { this.loading = false })
      } else if (index === 2) {
        this.htmlValue = []
        this.loading = true
        checkRoom(this.params).then(res => {
          console.log(res)
          res.forEach(item => {
            this.htmlValue.push({ html: item.htmlValue })
          })
          console.log(this.htmlValue)
          // this.dataTable = res
          // this.columns = [
          //   {
          //     title: this.options[index],
          //     align: 'center',
          //     dataIndex: 'roundsRecord'
          //   }
          // ]
          this.loading = false
        }).catch(() => { this.loading = false })
      } else if (index === 3) {
        this.htmlValue = []
        this.loading = true
        stageBrief(this.params).then(res => {
          console.log(res)
          res.forEach(item => {
            this.htmlValue.push({ html: item.htmlValue })
          })
          console.log(this.htmlValue)
          // this.dataTable = res
          // this.columns = [
          //   {
          //     title: this.options[index],
          //     align: 'center',
          //     dataIndex: 'currSituation'
          //   }
          // ]
          this.loading = false
        }).catch(() => { this.loading = false })
      } else if (index === 4) {
        this.htmlValue = []
        this.loading = true
        exitHos(this.params).then(res => {
          console.log(res)
          res.forEach(item => {
            this.htmlValue.push({ html: item.htmlValue })
          })
          console.log(this.htmlValue)
          // this.dataTable = res
          // this.columns = [
          //   {
          //     title: this.options[index],
          //     align: 'center',
          //     dataIndex: 'dischargeSymptomDesc'
          //   }
          // ]
          this.loading = false
        }).catch(() => { this.loading = false })
      }
    }
  }
}
</script>
<style scoped lang="css">
.btns {
  width: 100%;
  display: flex;
  margin: 10px 0;
  align-items: center;
  justify-content: center;
}
.btn{
  margin-bottom:20px;
display: flex;
flex-direction: row-reverse;
}
.button {
  width: 80%;
}
</style>
