<template>
  <a-modal
    :visible="visible"
    :title="title"
    @cancel="() => { $emit('cancel') }"
    @ok="() => { $emit('submit') }"
  >
    <a-form layout="vertical" :form="form">
      <a-form-item label="部门名称" >
        <a-input
          v-decorator="[
            'name',
            {
              initialValue: initialFormValue.name,
              rules: [{ required: true, message: '请输入部门名称' }],
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="id" style="display: none" >
        <a-input
          v-decorator="[
            'id',
            {
              initialValue: initialFormValue.id
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
    title: {
      type: String,
      default: ''
    },
    initialFormValue: {
      type: Object,
			default: null
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  }
}
</script>
