<!-- 项目管理 -->
<template>
  <div>
    <!-- 顶部卡片组 -->
    <a-row :gutter="20">
      <a-col
        :sm="24"
        :md="12"
        :xl="6"
        :style="{ marginBottom: '20px',borderRadius:'10px' }"
        @click="skipRouter('All')">
        <OverviewCard
          :loading="loading"
          title="全部项目"
          subTitle="All items"
          :total="allNum"
          class="borderRadius">
          <a-tooltip
            :title="$t('dashboard.analysis.introduce')"
            slot="action">
            <a-icon
              type="right"
              :style="{ fontSize: '20px', color: '#AFAFAF' }" />
          </a-tooltip>
          <img
            src="@/assets/6221634179780_.pic.jpg"
            slot="img"
            style="width: 50px; height: 50px; margin-right: 10px" />
          <a-progress
            :percent="100"
            :show-info="false"
            stroke-color="#3CC2FF"
            slot="progress" />
        </OverviewCard>
      </a-col>

      <a-col
        :sm="24"
        :md="12"
        :xl="6"
        :style="{ marginBottom: '20px' }"
        @click="skipRouter('Ongoing')">
        <OverviewCard
          :loading="loading"
          title="进行中项目"
          subTitle="Ongoing"
          :total="goingNum"
          class="borderRadius">
          <a-tooltip
            :title="$t('dashboard.analysis.introduce')"
            slot="action">
            <a-icon
              type="right"
              :style="{ fontSize: '20px', color: '#AFAFAF' }" />
          </a-tooltip>
          <img
            src="@/assets/6231634179780_.pic.jpg"
            slot="img"
            style="width: 50px; height: 50px; margin-right: 10px" />
          <a-progress
            :percent="goingPercent"
            :show-info="false"
            stroke-color="#43D882"
            slot="progress" />
        </OverviewCard>
      </a-col>

      <a-col
        :sm="24"
        :md="12"
        :xl="6"
        :style="{ marginBottom: '20px' }"
        @click="skipRouter('Close')">
        <OverviewCard
          :loading="loading"
          title="关闭项目"
          subTitle="Close"
          :total="closeNum"
          class="borderRadius">
          <a-tooltip
            :title="$t('dashboard.analysis.introduce')"
            slot="action">
            <a-icon
              type="right"
              :style="{ fontSize: '20px', color: '#AFAFAF' }" />
          </a-tooltip>
          <img
            src="@/assets/6241634179782_.pic.jpg"
            slot="img"
            style="width: 50px; height: 50px; margin-right: 10px" />
          <a-progress
            :percent="closedPrecent"
            :show-info="false"
            stroke-color="#A5B1BE"
            slot="progress" />
        </OverviewCard>
      </a-col>
      <a-col
        :sm="24"
        :md="12"
        :xl="6"
        :style="{ marginBottom: '20px' }"
        @click="skipRouter('RouterUnStartProject')">
        <OverviewCard
          :loading="loading"
          title="未启用项目"
          subTitle="NotStart"
          :total="unstartNum"
          class="borderRadius">
          <a-tooltip
            :title="$t('dashboard.analysis.introduce')"
            slot="action">
            <a-icon
              type="right"
              :style="{ fontSize: '20px', color: '#AFAFAF' }" />
          </a-tooltip>
          <img
            src="@/assets/unstart.png"
            slot="img"
            style="width: 50px; height: 50px; margin-right: 10px" />
          <a-progress
            :percent="unStartPercent"
            :show-info="false"
            stroke-color="rgb(165,169,250)"
            slot="progress" />
        </OverviewCard>
      </a-col>
    </a-row>
    <a-card
      :loading="loading"
      :body-style="{ padding: '20px' }"
      :bordered="false">
      <router-view />
    </a-card>
  </div>

  <!-- 表格 -->
</template>

<script>
import {
  OverviewCard
} from '@/components'
export default {
  components: {
    OverviewCard
  },
  data () {
    return {
      loading: false,
      allNum: null,
      goingNum: null,
      closeNum: null,
      unstartNum: null
    }
  },
  computed: {
    // 进行中项目百分比
    goingPercent () {
      return parseFloat(this.goingNum / this.allNum) * 100
    },
    // 关闭项目百分比
    closedPrecent () {
      return parseFloat(this.closeNum / this.allNum) * 100
    },
    // 未开始项目百分比
    unStartPercent () {
      return parseFloat(this.unstartNum / this.allNum) * 100
    }
  },
  mounted () {
    console.log('==== 进入项目列表 ====')

    this.$bus.$on('projectNum', e => {
      console.log(e, '查看项目数量')
      this.allNum = e.allNum
      this.goingNum = e.proceedNum
      this.closeNum = e.closeNum
      this.unstartNum = e.unstartNum
    })
  },
  beforeDestroy () {
    this.$bus.$off('projectNum')
  },
  methods: {
    // 根据不同项目状态跳转
    skipRouter (params) {
      this.$router.push({
        name: params
      })
    }
  }
}
</script>

<style scoped lang="less">
::v-deep .card-title {
  span {
    color: #abb8ce;
  }
}
.borderRadius{
  border-radius: 5px;
}
</style>
