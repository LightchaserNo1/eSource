<template>
  <page-header-wrapper @back="$router.go(-1)">
    <a-card>
      <div class="btns">
        <a-button @click="clickExport()">导出</a-button>
        <a-button style="margin-right:20px;" v-print="'#nav'">打印</a-button>
      </div>
      <div id="nav">
        <a-card>
          <a-textarea
            class="text"
            disabled
            :value="filed"
            :auto-size="{ minRows: 20 }"></a-textarea>
        </a-card>
      </div>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import { exportLog } from '@/api/patient/patient'
import { exportWord } from '@/utils/util'
export default {
  props: {

  },
  components: {

  },
  data () {
    return {
      filed: this.$route.query.logField
    }
  },
  created () {

  },
  mounted () {
    console.log(this.$route.query.idJob)
  },
  methods: {
    clickExport () {
      exportLog({ idJob: this.$route.query.idJob }).then(res => {
        console.log(res)
        exportWord('抓取日志', res)
      }, err => {
        console.log(err)
      })
    }
  }
}
</script>
<style scoped lang="css">
  .btns{
    display: flex;
    flex-direction: row-reverse;
    margin-bottom:40px;
  }
  .text[disabled]{
    background-color: #fff;
    color:black;
    cursor:text;
  }
</style>
