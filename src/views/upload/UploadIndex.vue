<template>
  <page-header-wrapper @back="$router.go(-1)">
    <a-card :body-style="{ padding: '18px' }" :bordered="false">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="上传"><UploadPane /></a-tab-pane>
        <a-tab-pane key="2" tab="上传结果"><UploadFinishPane /></a-tab-pane>
      </a-tabs>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import UploadPane from './components/UploadPane.vue'
import UploadFinishPane from './components/UploadFinishPane.vue'

export default {
  components: {
    UploadPane,
    UploadFinishPane
  },
  data () {
    return {

    }
  },
  mounted () {
    // console.log(this.$route.query.ptsNo)
  },
  methods: {

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
