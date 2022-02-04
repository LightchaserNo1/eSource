<!--
 * @Author: Ling
 * @Descripttion:  this.role 判断是当前角色 crc还是pi
 * @Date: 2021-10-25 10:46:57
-->
<!-- CRC消息管理 -->
<template>
  <page-header-wrapper>
    <a-card :body-style="{ padding: '18px' }" :bordered="false">
      <a-tabs v-if="this.proId" :tabBarStyle="tabBarStyle" :default-active-key="activeKey">
        <a-tab-pane key="1" tab="待处理">
          <div v-if="this.role === 'CRC'">
            <MessagePaneCRC />
          </div>
          <div v-if="this.role === 'PI'">
            <MessagePanePI />
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="已处理">
          <div v-if="this.role === 'CRC'">
            <MessageFinishPaneCRC />
          </div>
          <div v-if="this.role === 'PI'">
            <MessageFinishPanePI />
          </div>
        </a-tab-pane>
      </a-tabs>
      <div v-else>
        <a-empty />
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>

import MessagePaneCRC from './components/MessagePaneCRC.vue'
import MessageFinishPaneCRC from './components/MessageFinishPaneCRC.vue'
import MessagePanePI from './components/MessagePanePI.vue'
import MessageFinishPanePI from './components/MessageFinishPanePI.vue'
import { isUn } from '@/api/message/message'
export default {
  components: {
    MessagePaneCRC,
    MessagePanePI,
    MessageFinishPaneCRC,
    MessageFinishPanePI
  },
  data () {
    return {
      proId: this.$store.getters.project && this.$store.getters.project.id,
      activeKey: this.$route.query.activeKey || '1',
      role: '',
      tabBarStyle: {
        width: '100%',
        display: 'flex',
        justfyContent: 'space-center'
      }
    }
  },
  mounted () {
    console.log(this.$store.getters)
    if (!this.$store.getters.project.id) {
      this.$notification.warning({
        message: '警告',
        description: `请选中一个项目`
      })
    }
    this.role = this.$store.getters.roles && this.$store.getters.roles[0] && this.$store.getters.roles[0].code || ''
    this.isUn()
  },
  methods: {
    isUn () {
      const form = new FormData()
      form.append('proId', this.proId)
      isUn(form).then(res => {
        console.log(res)
      }).catch((err) => {
        console.log('报错信息', err)
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="scss>

</style>
