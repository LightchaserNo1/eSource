<!--
 * @Author: Ling
 * @Descripttion:  上传审核
 * @Date: 2021-11-22 11:32:01
-->
<!-- 上传审核 -->
<template>
  <page-header-wrapper @back="goBack">
    <a-card
      :body-style="{ padding: '18px' }"
      :bordered="false">
      <a-tabs default-active-key="1">
        <a-tab-pane
          key="1"
          :tab="finished ? '上传审核' : '查看'"><verifyPane /></a-tab-pane>
      </a-tabs>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import verifyPane from './components/verifyPane.vue'
export default {
  components: {
    verifyPane
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
/* ::-webkit-scrollbar {
  width: 3px;
  height: 8px;
  background-color: #f5f5f5;
} */
</style>
