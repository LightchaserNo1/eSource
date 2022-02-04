<template>
  <page-header-wrapper>
    <template>
      <a-card>
        <a-tabs default-active-key="1" size="large" @change="callback">
          <a-tab-pane key="1" tab="公司" ><SponsorTab/></a-tab-pane>
          <a-tab-pane key="2" tab="医院及科室维护" ><SiteTab/></a-tab-pane>
          <!-- <a-tab-pane key="3" tab="机构管理组织(SMO)"><SmoTab /></a-tab-pane>
          <a-tab-pane key="4" tab="合同研究组织(CRO)"><CroTab /></a-tab-pane> -->
        </a-tabs>
      </a-card>
    </template>
  </page-header-wrapper>
</template>
<script>
import SponsorTab from './components/SponsorTab'
import SiteTab from './components/SiteTab'
export default {
  components: {
    SponsorTab,
    SiteTab
  },
  data () {
    return {
      activeIndex: 0
    }
  },
  methods: {
    // 用于切换状态的
    callback (key) {
      this.activeIndex = parseInt(key)
      console.log(this.activeIndex)
    }
  },
  mounted () {}
}
</script>
<style></style>
