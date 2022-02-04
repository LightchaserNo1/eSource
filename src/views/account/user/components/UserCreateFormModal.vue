<template>
  <a-modal
    :visible="visible"
    :title="title"
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
          :disabled="isEdit"
          v-decorator="[
            'account',
            {
              initialValue: initialFormValue == null ? '' : initialFormValue.account,
              rules: [{ required: true, message: '请输入用户名' }],
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="密码" v-if="!isEdit">
        <a-input-password
          v-decorator="[
            'pwd',
            {
              initialValue: initialFormValue == null ? '' : initialFormValue.pwd,
              rules: [{ required: true, message: '请输入密码' },
                      { validator: validatePwd, required: true, trigger: 'blur', message: '请输入6-16位密码' }],
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="确认密码" v-if="!isEdit">
        <a-input-password
          v-decorator="[
            'pwdAgain',
            {
              initialValue: initialFormValue == null ? '' : initialFormValue.pwdAgain,
              rules: [
                { required: true, message: '请再次输入密码' },
                { validator: validatePwdAgain, required: true, trigger: 'blur', message: '两次输入密码不一致' },
                { validator: validatePwd, required: true, trigger: 'blur', message: '请输入6-16位密码' }],
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="姓名" >
        <a-input
          v-decorator="[
            'name',
            {
              initialValue: initialFormValue == null ? '' : initialFormValue.name,
              rules: [{ required: true, message: '请输入姓名' }],
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="手机号" >
        <a-input
          v-decorator="[
            'phone',
            {
              initialValue: initialFormValue == null ? '' : initialFormValue.phone,
              rules: [{ required: true, message: '请输入手机号' },
                      { validator: validateMobile, required: true, trigger: 'blur', message: '请输入正确的手机号' }],
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="所属部门">
        <a-select
          v-decorator="[
            'deptId',
            {
              initialValue: initialFormValue == null ? '' : initialFormValue.deptId,
              rules: [{ required: true, message: '请选择所属部门' }],
            }
          ]"
          placeholder="请选择">
          <a-select-option v-for="dept in deptDatasource" :key="dept.id" :value="dept.id">{{ dept.name }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="角色">
        <a-select
          v-decorator="[
            'roleId',
            {
              initialValue: initialFormValue == null ? '' : initialFormValue.roleId,
              rules: [{ required: true, message: '请选择角色' }],
            }
          ]"
          placeholder="请选择">
          <a-select-option v-for="role in roleDatasource" :key="role.id" :value="role.id">{{ role.name }}</a-select-option>
        </a-select>
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
    title: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    initialFormValue: {
      type: Object,
			default: function () {
        return {}
      }
    },
    deptDatasource: {
      type: Array,
      default: function () {
        return []
      }
    },
    roleDatasource: {
      type: Array,
      default: function () {
        return []
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
    },
    validateMobile: function (rule, value, callback) {
      // const regex = '((^(13|15|18)[0-9]{9}$)|(^0[1,2]{1}\\d{1}-?\\d{8}$)|(^0[3-9] {1}\\d{2}-?\\d{7,8}$)|(^0[1,2]{1}\\d{1}-?\\d{8}-(\\d{1,4})$)|(^0[3-9]{1}\\d{2}-? \\d{7,8}-(\\d{1,4})$))'
      // if (regex.test(value)) {
      if (value.length !== 11) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
  }
}
</script>
