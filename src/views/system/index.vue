<!-- 系统父组件容器 -->
<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="账户管理" v-if="$auth('SYSTEM.SYSTEM_ACCOUNT')">
          <User @listFreshen="listFreshener"></User>
        </a-tab-pane>
        <a-tab-pane key="2" tab="角色权限" v-if="$auth('SYSTEM.SYSTEM_ROLE')">
          <Role></Role>
        </a-tab-pane>
        <a-tab-pane key="3" tab="权限管理" v-if="$auth('SYSTEM.SYSTEM_PMS')">
          <Pms></Pms>
        </a-tab-pane>
        <a-tab-pane key="4" tab="账户可见范围" v-if="$auth('SYSTEM.SYSTEM_VISIBLE')">
          <!-- <a-tab-pane key="4" tab="账户可见范围" v-if="$auth('SYSTEM.SYSTEM_VISIBLE')&&$store.getters.project"> -->
          <Visible ref="visibleList"></Visible>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import User from './components/user'
import Role from './components/role'
import Pms from './components/pms'
import Visible from '../account-visible/index.vue'

export default {
  name: 'System',
  components: {
    User,
    Role,
    Pms,
    Visible
  },
  data () {
    return {}
  },
  mounted () {
	},
  methods: {
		listFreshener () {
			if (this.$refs.visibleList.columns) {
				this.$refs.visibleList.freshenLister()
			}
		}
	}
}
</script>
<style scoped lang="scss"></style>
