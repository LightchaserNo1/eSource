<!--
 * @Author: your name
 * @Date: 2022-01-17 16:21:57
 * @LastEditTime: 2022-01-18 15:46:44
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \yk-prime-source-admin\src\views\project\SickFile.vue
-->
<template>
  <page-header-wrapper @back="$router.go(-1)">
    <!-- 只有CRA,CRC,PI,时才会展示CRF档案和全部档案 -->
    <div>
      <a-tabs default-active-key="1" @change="callback" type="card">
        <a-tab-pane key="1" tab="全部档案" force-render>
          <AllFile
            :enrolleeId="$route.query.ptsId"
            :ptsNo="$route.query.ptsNo"
          />
        </a-tab-pane>
        <a-tab-pane key="2" tab="直连EDC数据源" v-if="$auth('PROJECT.PROJECT_CRF_FILES')">
          <CrfFile
            :enrolleeId="$route.query.ptsId"
            :ptsId="$route.query.ptsId"
            :orgId="$route.query.orgId"
            :ptsName="$route.query.ptsName"
          />
        </a-tab-pane>
        <a-tab-pane key="3" tab="档案原件图片">
          <CertifiedCopy
            :ptsId="$route.query.ptsId"
            v-if="topTab ==='3'"
          />
        </a-tab-pane>
      </a-tabs>
    </div>
  </page-header-wrapper>
</template>
<script>

import CertifiedCopy from './CertifiedCopy.vue'
import AllFile from './components/AllFile'
import CrfFile from './components/CrfFile'
export default {
  props: {
  },
  components: {
    CertifiedCopy,
    AllFile,
    CrfFile
  },
  data () {
    return {
      isCrcOrCraOrPi: this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.CRC.value) || this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.CRA.value) || this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.PI.value),
      topTab: ''
    }
  },
  created () {

  },
  mounted () {
    console.log(this.isCrcOrCraOrPi)
  },
  methods: {
    callback (key) {
      this.topTab = key
    }
  }
}
</script>
<style scoped lang="">

</style>
