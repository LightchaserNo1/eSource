<template>
  <div>
    <a-steps class="steps" :current="currentTab" size="small" direction="horizontal">
      <a-step title="人脸识别" />
      <a-step title="认证结果" />
    </a-steps>
    <div class="content">
      <FaceDetection v-if="currentTab === 0" @nextStep="nextStep" />
      <CertificationResults v-if="currentTab === 1" :isAuthSuccess="isAuthSuccess" />
    </div>
  </div>
</template>

<script>
import FaceDetection from './components/FaceDetection'
import CertificationResults from './components/CertificationResults'

export default {
  components: {
    FaceDetection,
    CertificationResults
  },
  data () {
    return {
      currentTab: 0,
      isAuthSuccess: false
    }
  },
  created () {
  },
  methods: {
    nextStep (isAuthSuccess) {
      this.isAuthSuccess = isAuthSuccess
      this.currentTab = 1
    }
  }
}
</script>

<style lang="less" scoped>
  .steps {
    padding: 20px 20px 0;
  }
</style>
