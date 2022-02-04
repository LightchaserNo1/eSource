<!-- 数据任务 -->
<template>
  <page-header-wrapper>
    <a-card :body-style="{ padding: '18px' }" :bordered="false">
      <a-tabs default-active-key="1" v-if="!isCrc">
        <a-tab-pane key="1" tab="计划任务" v-if="$auth('DataTask.DATA_PLAN')"><PlanManagerPane/></a-tab-pane>
        <a-tab-pane key="2" tab="数据源配置" v-if="$auth('DataTask.DATA_SOURCE')"><DataSourceConfigPane/></a-tab-pane>
        <a-tab-pane key="3" tab="上报中心" v-if="$auth('DataTask.DATA_UPLOAD')"><DataUploadPane/></a-tab-pane>
        <a-tab-pane key="4" tab="数据上报审核" v-if="$auth('DataTask.DATA_UPLOAD_REVIEW')"><DataUploadReviewPane/></a-tab-pane>
      </a-tabs>
      <!-- 下边是crc专用的几个tab，涉及到两个端 -->
      <a-tabs default-active-key="1" v-else>
        <a-tab-pane key="1" tab="计划任务" v-if="$auth('DataTask.DATA_PLAN')"><PlanManagerPane/></a-tab-pane>
        <a-tab-pane key="2" tab="数据源配置" v-if="$auth('DataTask.DATA_SOURCE')"><DataSourceConfigPane/></a-tab-pane>
        <a-tab-pane key="3" tab="上报中心" v-if="$auth('DataTask.DATA_UPLOAD')&&!$isCenter"><DataUploadPane/></a-tab-pane>
        <a-tab-pane key="4" tab="数据上报审核" v-if="$auth('DataTask.DATA_UPLOAD_REVIEW')&&$isCenter"><DataUploadReviewPane/></a-tab-pane>
      </a-tabs>
    </a-card>
  </page-header-wrapper>
</template>

<script>

import PlanManagerPane from './components/PlanManagerPane.vue'
import DataSourceConfigPane from './components/DataSourceConfigPane.vue'
import DataUploadPane from './components/DataUploadPane.vue'
import DataUploadReviewPane from './components/DataUploadReviewPane.vue'
export default {
  components: {
    PlanManagerPane,
    DataSourceConfigPane,
    DataUploadPane,
    DataUploadReviewPane
  },
  data () {
    return {
      isCrc: this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.CRC.value)
    }
  },
  mounted () {
    console.log(this.isCrc)
  },
  // computed () {
  //   crcAndCenter() {

  //   }
  // },
  methods: {

  }
}
</script>

<style scoped lang="scss">

</style>
