<template>
  <div>
    <template v-if="list && list.length">
      <a-tabs
        :default-active-key="list[0].id"
        @change="callback">
        <a-tab-pane
          v-for="item in list"
          :key="item.id"
          :tab="item.name"
          style="width: 100%;">
          <a-card style="padding: 20px">
            <div style="margin:0 0 1rem 0;">
              <a-switch
                checked-children="已启用"
                un-checked-children="已禁用"
                :checked="item.status === -1 ? false : true"
                :disabled="true" />
            </div>
            <TimeLine
              :planList="planList" />
            <!-- <a-steps
              progress-dot
              :current="planList.length">
              <a-step
                v-for="ear in planList"
                :key="ear.id"
                :title="ear.name"
                :description="ear.showVisitContent" />
            </a-steps> -->
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </template>
    <template v-else>
      <a-empty />
    </template>
  </div>
</template>
<script>
import {
  visitPlanList,
  planTheList
  } from '@/api/patient/visitplan.js'
import TimeLine from './stepCreater.vue'
export default {
  props: {
    proId: {
      required: true,
      type: [String, Number]
    },
    isDetail: {
      default: false,
      type: Boolean
    }
  },
  components: {
    TimeLine
  },
  data () {
    return {
      list: [],
      planList: [],
      vno: {
        no: '',
        isones: true
      }
    }
  },
  mounted () {
    this.getVisitList()
  },
  methods: {
    // 获取版本列表
    getVisitList () {
      visitPlanList({ proId: this.proId }).then(res => {
        console.log(res, '####%$#$$$$')
        if (res && res.length) {
          this.list = [...res]
            this.vno.no = res[0].no
          this.getlist()
        }
      }).catch(() => {
        this.$message.error('版本列表请求失败')
      })
    },
    // 获取访视计划
    getlist () {
        planTheList({ proId: this.proId, vno: this.vno.no })
        .then(res => {
          if (res.length && res) {
            res.forEach((item, index) => {
              let firstUnit = ''
              let afterUnit = ''
              let unitVule = ''
              if (Number(item.endTime) > 0 || Number(item.startTime) > 0) {
                unitVule = '+'
              } else {
                unitVule = '-'
              }
              switch (item.firstAccessFreUnit) {
                case 1:
                  firstUnit = '月'
                  break
                case 2:
                  firstUnit = '天'
                  break
                default:
                  firstUnit = '时'
              }
              switch (item.afterAccessFreUnit) {
                case 1:
                  afterUnit = '月'
                  break
                case 2:
                  afterUnit = '天'
                  break
                default:
                  afterUnit = '时'
              }
              if (index > 0) {
                const lastStage = item.timePointName === '0' ? '入组时间' : item.timePointName

                const showVisitContent = lastStage.toString() + '(' + unitVule + (item.firstAccessFre ? item.firstAccessFre : 0).toString() + firstUnit + '±' + (item.afterAccessFre ? item.afterAccessFre : 0).toString() + afterUnit + ')'
                item.showVisitContent = showVisitContent
              }
            })
          }
          this.planList = res
          console.log(this.planList)
        })
        .catch(() => {
          this.$message.error('列表获取失败')
        })
    },
    // 切换
    callback (key) {
      console.log(key)
      this.list.forEach(item => {
        if (item.id === key) {
          this.vno.no = item.no
        }
      })
      this.getlist()
      this.planList = []
    }
  }
}
</script>
