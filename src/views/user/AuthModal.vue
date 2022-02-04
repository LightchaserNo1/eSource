<template>
  <a-modal width="60%" :visible="visible" :title="'实名认证'" @ok="handleCancel" @cancel="handleCancel">
    <Certification v-if="visible" @nextStep="handleCancel" :info="info" :type="1" />
  </a-modal>
</template>
<script>
import Certification from '../person/Certification.vue'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: null
    }
  },
  components: {
    Certification
  },
  methods: {
    handleCancel () {
      this.$emit('handleCancel')
    }
  }
}
</script>
