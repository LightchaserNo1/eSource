<template>
  <div class="table-page-search-wrapper">
    <a-form-model layout="inline" :model="user" :rules="formRules" ref="formRef" :style="{'margin': '40px auto 0'}">
      <a-row :gutter="48">
        <a-col :md="10" :sm="24" :offset="6">
          <a-form-model-item label="新密码" prop="pwd">
            <a-input-password v-model="user.pwd" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="48">
        <a-col :md="10" :sm="24" :offset="6">
          <a-form-model-item label="确认新密码" prop="pwdConfirm">
            <a-input-password v-model="user.pwdConfirm" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="48">
        <a-col :md="10" :sm="24" :offset="10">
          <a-button type="primary" style="width:100px" @click="nextStep">确定</a-button>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>
<script>
import { updatePassword } from '@/api/system/user'
export default {
  data () {
    const validatorConfirmPwd = (rule, value, callback) => {
      if (this.user.pwd === this.user.pwdConfirm) {
        callback()
      } else {
        callback(new Error('两次密码不一致！'))
      }
    }
    return {
      user: {
        pwd: '',
        pwdConfirm: ''
      },
      formRules: {
        pwd: [
          { required: true, message: '请输入新密码', trigger: 'change' },
          { pattern: /^[^\u4e00-\u9fa5]{8,}$/, message: '至少为8位包含数字、英文字母、特殊符号组合' }
        ],
        pwdConfirm: [
          { required: true, message: '请输入确认新密码', trigger: 'change' },
          { pattern: /^[^\u4e00-\u9fa5]{8,}$/, message: '至少为8位包含数字、英文字母、特殊符号组合' },
          { required: true, trigger: 'blur', validator: validatorConfirmPwd }
        ]
      }
    }
  },
  methods: {
    nextStep () {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.updatePassword()
        }
      })
    },
    updatePassword () {
      updatePassword({ pwd: this.user.pwd })
        .then(res => {
          this.$message.success('密码修改成功')
          this.$router.push({ path: '/' })
        })
        .catch(() => {})
    }
  }
}
</script>
