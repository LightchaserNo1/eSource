<template>
  <div>
    <div v-show="firstView">
      <slot name="firstShow"></slot>
    </div>
    <div v-show="!firstView">
      <a-button type="default" @click="clickGoBack()" style="margin-bottom:16px"> <a-icon type="left" />返回上一级</a-button>
      <slot name="skipIn"></slot>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    firstView: {
      default: true,
      type: Boolean
    }
  },
  components: {

  },
  data () {
    return {

    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    clickGoBack () {
      this.$emit('goBack')
    }
  }
}
</script>
<style scoped lang="">

</style>
