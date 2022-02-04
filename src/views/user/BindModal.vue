<template>
  <a-modal
    :title="title"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @cancel="() => { $emit('cancel') }"
    @ok="() => { $emit('submit') }">

    <a-form layout="vertical" :form="form">
      <a-form-item label="邮箱地址" >
        <div style="display: flex">
          <a-input
            v-decorator="[
              'newEmail',
              {
                rules: [{ required: true, message: '请输入邮箱地址' }],
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

import { getEmailCode } from '@/api/login'

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
      const email = this.form.getFieldValue('newEmail')
      if (email == null || email.length === 0) {
        this.$message.error('请输入邮箱地址')
        return
      }
      this.sendLoading = true
      getEmailCode({
        email: email
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
