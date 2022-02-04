<!-- 系统日志-->
<template>
  <page-header-wrapper>
    <a-card id="a" :bordered="false">
      <!-- tab 切换日志 start -->
      <a-tabs @change="handleTab">
        <a-tab-pane :tab="list.text" v-for="(list, index) in statusList" :key="index">
          <SystemLogList :activeIndex="statusIndex" :no="index"/>
        </a-tab-pane>
      </a-tabs>
      <!-- tab 切换日志  end -->
    </a-card>
  </page-header-wrapper>
</template>

<script>
import SystemLogList from './components/System-Log-List'

export default {
  data () {
    return {
      statusIndex: 1,

      statusList: [
        { status: 1, text: '系统日志' }
      ]
    }
  },
  components: {
    SystemLogList
  },
  mounted () {
    // this.fetchList()
  },
  methods: {
    // 用于切换状态的
    handleTab (key) {
      this.statusIndex = key + 1
    }
  }
}
</script>
