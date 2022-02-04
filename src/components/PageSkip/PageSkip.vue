<template>
  <div>
    <div v-show="firstView">
      <slot name="fitstShow"></slot>
    </div>
    <div v-show="!firstView">
      <a-button type="primary" @click="clickGoBack()" style="margin-bottom:16px">
        <a-icon type="left" />返回上一级</a-button
        >

      <a-button @click="addDepartment" class="clickAdd" type="primary">新增</a-button>
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
  components: {},
  data () {
    return {}
  },
  created () {},
  mounted () {},
  methods: {
    clickGoBack () {
      this.$emit('goBack')
    },
    addDepartment () {
      this.$emit('clickAdd')
    }
  }
}
</script>
<style scoped lang="less">
.clickAdd {
  position: absolute;
  right: 0;
}
</style>
