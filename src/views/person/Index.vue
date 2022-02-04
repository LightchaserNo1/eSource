<template>
  <div class="content-view">
    <a-card :bordered="false">
      <a-steps class="steps" :current="currentTab">
        <a-step title="完善各人信息" description="请填写真实信息" />
        <a-step title="实名认证" description="根据监管要求进行实名认证"/>
        <a-step title="重置密码" description="首次登录,为了您的信息安全请重置密码" />
      </a-steps>
      <div class="content">
        <PerfectInformation v-if="currentTab === 0" @nextStep="nextStep" @userInfo="userInfo"/>
        <Certification v-if="currentTab === 1" @nextStep="nextStep" :info="info"/>
        <!-- <AddProject v-if="currentTab === 2" /> -->
        <ResetPwd v-if="currentTab === 2" />
      </div>
    </a-card>
  </div>
</template>

<script>
import PerfectInformation from './PerfectInformation'
import Certification from './Certification'
import AddProject from './AddProject'
import ResetPwd from './ResetPwd'

export default {
  name: 'StepForm',
  components: {
    PerfectInformation,
    Certification,
    AddProject,
    ResetPwd
  },
  data () {
    return {
      currentTab: 0,
      form: null,
      info: {}
    }
  },
  methods: {
    nextStep () {
      if (this.currentTab < 2) {
        this.currentTab += 1
      }
    },
    userInfo (info) {
      this.info = info
    }
  }
}
</script>

<style lang="less" scoped>
  .content-view{
    width: 1200px;
    margin: 20px auto 0 auto;
  }
</style>
