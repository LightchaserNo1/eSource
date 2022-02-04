<!-- CRF配置 -->
<template>
  <page-header-wrapper>
    <a-tabs default-active-key="1" type="card">
      <a-tab-pane key="1" tab="CRF配置"><crfPane/></a-tab-pane>
      <a-tab-pane key="2" tab="辅助检查项目配置"><supportPane/></a-tab-pane>
    </a-tabs>
  </page-header-wrapper>
</template>

<script>
import crfPane from './components/crfPane.vue'
import supportPane from './components/supportPane.vue'
export default {
  components: {
    crfPane,
    supportPane
  },
  data () {
    return {

    }
  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style scoped lang="scss>

</style>
