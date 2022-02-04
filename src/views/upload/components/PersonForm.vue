<template>
  <div>
    <a-modal
      :visible="visible"
      title="身份验证"
      okText="验证"
      @cancel="
        () => {
          $emit('cancel')
        }
      "
      @ok="
        () => {
          $emit('ok')
        }
      "
    >
      <a-form :form="form" class="login-form">
        <a-form-item>
          <a-input
            v-decorator="['account', { rules: [{ required: true, message: '请输入账号!' }] }]"
            placeholder="Account"
          >
            <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="['pwd', { rules: [{ required: true, message: '请输入密码' }] }]"
            type="password"
            placeholder="Password"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-checkbox
            v-decorator="[
              'checked',
              {
                valuePropName: 'checked',
                initialValue: true,
              },
            ]"
          >
            我保证上传材料内容与对应原始文件内容保持一致！
          </a-checkbox>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
// import { getDictionaryList } from '@/api/optionConfig/optionConfig'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 评估方法
      modeList: []
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'form_in_modal' })
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style scoped lang="less">
.uploadItem {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-bottom: 10px;
  // /deep/.ant-upload-list-picture-card .ant-upload-list-item {
  //   width: 156px;
  //   height: 156px;
  // }
}
</style>
