<!-- 评估管理 -->
<template>
  <page-header-wrapper>
    <a-card :body-style="{ padding: '18px' }" :bordered="false" v-if='proId'>
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="录入"><EstimateInputPane ref="inputPane" @saveSuccess="handleSaveSuccess" /></a-tab-pane>
        <a-tab-pane key="2" tab="查看完成"><EstimateFinishPane ref="finishPane" /></a-tab-pane>
      </a-tabs>
    </a-card>
    <a-card v-else>
      <a-empty></a-empty>
    </a-card>
  </page-header-wrapper>
</template>

<script>

import EstimateInputPane from './components/EstimateInputPane.vue'
import EstimateFinishPane from './components/EstimateFinishPane.vue'

export default {
  components: {
    EstimateInputPane,
    EstimateFinishPane
  },
  data () {
    return {
      proId: this.$store.getters.project && this.$store.getters.project.id
    }
  },
  mounted () {
    if (!this.proId) {
     this.$notification.warning({
        message: '警告',
        description: `请选中一个项目后查看`
      })
    }
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
