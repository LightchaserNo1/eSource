<template>
  <page-header-wrapper @back="goBack">
    <a-card :body-style="{ padding: '18px' }" :bordered="false">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="已退回"><UploadPane /></a-tab-pane>
      </a-tabs>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import UploadPane from './components/UploadPanecrc.vue'

export default {
  components: {
    UploadPane
  },
  data () {
    return {
      finished: this.$route.query.finished !== '' ? JSON.parse(this.$route.query.finished) : false
    }
  },
  mounted () {
  },
  methods: {
    goBack () {
      console.log('finished', this.finished)
      this.$router.push({
        name: 'Message',
        query: { activeKey: this.finished ? '1' : '2' }
      })
    }
  }
}
</script>
<style scoped lang="less">
.top-nav {
  display: flex;
  width: 100%;
  justify-content: space-center;
}
.btn-wrap {
  width: 20%;
}
</style>
