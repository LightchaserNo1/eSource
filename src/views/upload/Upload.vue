<!-- 上传管理 -->
<template>
  <page-header-wrapper>
    <a-card :body-style="{ padding: '18px' }" :bordered="false">
      <a-tabs v-if="this.proId" :tabBarStyle="tabBarStyle" default-active-key="1">
        <a-tab-pane key="1" tab="上传"><UploadPane v-if="this.proId" /></a-tab-pane>
        <a-tab-pane key="2" tab="上传结果"><UploadFinishPane v-if="this.proId" /></a-tab-pane>
      </a-tabs>
      <div v-else>
        <a-empty />
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>

import UploadPane from './components/UploadPaneL.vue'
import UploadFinishPane from './components/UploadFinishPaneL.vue'

export default {
  components: {
    UploadPane,
    UploadFinishPane
  },
  data () {
    return {
      proId: this.$store.getters.project.id || null,
      tabBarStyle: {
        width: '100%',
        display: 'flex',
        justfyContent: 'space-center'
      }
    }
  },
  mounted () {
    if (!this.$store.getters.project.id) {
      this.$notification.warning({
        message: '警告',
        description: `请选中一个项目后上传`
      })
    }
  },
  methods: {

  }
}
</script>

<style scoped lang="scss>

</style>
