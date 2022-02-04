<!-- 评估管理 -->
<template>
  <page-header-wrapper>
    <a-card :body-style="{ padding: '18px' }" :bordered="false">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="录入"><EstimateInputPane ref="inputPane" @saveSuccess="handleSaveSuccess" :ptsId="ptsId" :orgId="orgId" :ptsName="ptsName" /></a-tab-pane>
        <a-tab-pane key="2" tab="查看完成"><EstimateFinishPane ref="finishPane" :ptsId="ptsId" :orgId="orgId" :ptsName="ptsName" /></a-tab-pane>
      </a-tabs>
    </a-card>
  </page-header-wrapper>
</template>

<script>

import EstimateInputPane from '../estimate/components/EstimateInputPane.vue'
import EstimateFinishPane from '../estimate/components/EstimateFinishPane.vue'

export default {
  components: {
    EstimateInputPane,
    EstimateFinishPane
  },
  data () {
    return {
      ptsId: this.$route.query.ptsId || '',
      orgId: this.$route.query.orgId || '',
      ptsName: this.$route.query.ptsName || ''
    }
  },
  mounted () {

  },
  methods: {
    handleSaveSuccess () {
      this.$refs.finishPane.reloadPageData()
    }
  }
}
</script>

<style scoped lang="scss>

</style>
