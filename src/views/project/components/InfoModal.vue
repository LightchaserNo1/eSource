<template>
  <!-- 成员信息弹窗 -->
  <div>
    <a-modal :width="1000" @ok="handleOk" @cancel="handleCancel" :visible="visible">
      <a-descriptions bordered title="受邀者信息">
        <a-descriptions-item label="身份证号">{{ infoObj.idCard }}</a-descriptions-item>
        <a-descriptions-item label="邀请状态">
          <span v-if="infoObj.status==2">已加入</span>
          <span v-else>已邀请</span>
        </a-descriptions-item>
        <a-descriptions-item label="姓名">{{ infoObj.name }}</a-descriptions-item>
        <a-descriptions-item label="邮箱">{{ infoObj.email }}</a-descriptions-item>
        <a-descriptions-item label="邀请时间">{{ infoObj.createTime| moment() }}</a-descriptions-item>
        <a-descriptions-item label="手机号">{{ infoObj.phone }}</a-descriptions-item>
        <a-descriptions-item label="身份">{{ infoObj.roleName }}</a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>
<script>

export default {
  props: {
    infoObj: {
      type: Object,
      default: () => {}
    },
    visible: {
      required: true,
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
    handleOk () {
      this.$emit('modalOk')
    },
    handleCancel () {
      this.$emit('modalCancel')
    }
  }
}
</script>
<style scoped lang="">

</style>
