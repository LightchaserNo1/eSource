<template>
  <a-modal
    :title="title"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @cancel="() => { $emit('cancel') }"
    @ok="() => { $emit('submit') }">

    <a-form layout="vertical" :form="form">
      <a-form-item label="手机号" >
        <div style="display: flex">
          <a-input
            v-decorator="[
              'newPhone',
              {
                rules: [{ required: true, message: '请输入手机号' }],
              }
            ]"
          />
          <a-button style="margin-left: 20px" type="primary" :loading="sendLoading" @click="clickSendEmailCode">{{ context }}</a-button>
        </div>
      </a-form-item>
      <a-form-item label="验证码" >
        <a-input
          v-decorator="[
            'newCode',
            {
              rules: [{ required: true, message: '请输入验证码' }],
            }
          ]"
        />
      </a-form-item>
    </a-form>

  </a-modal>
</template>

<script>

import { getPhoneCode } from '@/api/login'

export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      sendLoading: false,
      context: '获取验证码',
      totalTime: 60,
      canClick: true
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  methods: {
    clickSendEmailCode () {
      const phone = this.form.getFieldValue('newPhone')
      if (phone == null || phone.length === 0) {
        this.$message.error('请输入手机号')
        return
      }
      this.sendLoading = true
      getPhoneCode({
        phone: phone
      }).then(res => {
        this.sendLoading = false
        this.startCountDown()
      }).catch(() => {
        this.sendLoading = false
      })
    },
    startCountDown () {
      if (!this.canClick) return
      this.canClick = false
      this.context = this.totalTime + '秒后重选发送'
      const timer = setInterval(() => {
        this.totalTime--
        this.context = this.totalTime + '秒后重选发送'
        if (this.totalTime < 0) {
          clearInterval(timer)
          this.context = '重新发送验证码'
          this.totalTime = 60
          this.canClick = true
        }
      }, 1000)
    }
  }
}

</script>

<style lang="less" scoped>

</style>
