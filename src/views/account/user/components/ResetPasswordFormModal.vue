<template>
  <a-modal
    :visible="visible"
    title="重置密码"
    @cancel="() => { $emit('cancel') }"
    @ok="() => { $emit('submit') }"
  >
    <a-form layout="vertical" :form="form">
      <a-form-item label="id" style="display: none" >
        <a-input
          v-decorator="[
            'id',
            {
              initialValue: initialFormValue == null ? '' : initialFormValue.id
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="用户名" >
        <a-input
          :disabled="true"
          v-decorator="[
            'account',
            {
              initialValue: initialFormValue == null ? '' : initialFormValue.account,
              rules: [{ required: true, message: '请输入用户名' }],
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="密码">
        <a-input-password
          v-decorator="[
            'pwd',
            {
              rules: [{ required: true, message: '请输入密码' },
                      { validator: validatePwd, required: true, trigger: 'blur', message: '请输入6-16位密码' }],
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="确认密码">
        <a-input-password
          v-decorator="[
            'pwdAgain',
            {
              rules: [
                { required: true, message: '请再次输入密码' },
                { validator: validatePwdAgain, required: true, trigger: 'blur', message: '两次输入密码不一致' },
                { validator: validatePwd, required: true, trigger: 'blur', message: '请输入6-16位密码' }],
            }
          ]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>

export default {

  // eslint-disable-next-line vue/require-prop-types
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    initialFormValue: {
      type: Object,
			default: function () {
        return {}
      }
    }
  },
  data () {
    return {

    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  methods: {
    validatePwdAgain: function (rule, value, callback) {
      if (value !== this.form.getFieldValue('pwd')) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    },
    validatePwd: function (rule, value, callback) {
      if (value.length < 6 || value.length > 16) {
        callback(new Error('请输入6-16位密码'))
      } else {
        callback()
      }
    }
  }
}
</script>
