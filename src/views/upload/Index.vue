<!-- 上传管理 -->
<template>
  <page-header-wrapper>
    <template v-if="$isCenter">
      <a-tabs v-if="this.proId" :tabBarStyle="tabBarStyle" default-active-key="1" type="card">
        <a-tab-pane key="1" tab="上传结果"><UploadFinishPaneL ref="childFinish" v-if="this.proId" /></a-tab-pane>
      </a-tabs>
      <div v-else>
        <a-empty />
      </div>
    </template>
    <template v-else>
      <a-tabs v-if="this.proId" :tabBarStyle="tabBarStyle" default-active-key="1" @change="callback" type="card">
        <a-tab-pane key="1" tab="上传"><UploadPaneL ref="childUpload" v-if="this.proId" /></a-tab-pane>
        <a-tab-pane key="2" tab="上传结果"><UploadFinishPaneL ref="childFinish" v-if="this.proId" /></a-tab-pane>
      </a-tabs>
      <div v-else>
        <a-empty />
      </div>
    </template>
  </page-header-wrapper>
</template>

<script>

import UploadPaneL from './components/UploadPaneL.vue'
import UploadFinishPaneL from './components/UploadFinishPaneL.vue'

export default {
  components: {
    UploadPaneL,
    UploadFinishPaneL
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
    if (this.$isCenter) {
      this.$nextTick(() => {
        this.$refs.childFinish.getList()
      })
    }
  },
  methods: {
    callback (key) {
      console.log(this.$refs.childUpload)
      if (key === '1') {
        this.$nextTick(() => {
          this.$refs.childUpload.getList()
        })
      } else if (key === '2') {
        this.$nextTick(() => {
          this.$refs.childFinish.getList()
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
