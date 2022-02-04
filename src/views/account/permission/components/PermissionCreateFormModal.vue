<template>
  <a-modal
    :visible="visible"
    :title="title"
    @cancel="() => { $emit('cancel') }"
    @ok="() => { $emit('submit') }"
  >
    <a-form layout="vertical" :form="form">
      <a-form-item label="权限名称" >
        <a-input
          v-decorator="[
            'name',
            {
              initialValue: initialFormValue.name,
              rules: [{ required: true, message: '请输入权限名称' }],
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="权限标识" >
        <a-input
          v-decorator="[
            'description',
            {
              initialValue: initialFormValue.description,
              rules: [{ required: true, message: '请输入权限标识' }],
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="pid" style="display: none">
        <a-input
          v-decorator="[
            'pid',
            {
              initialValue: initialFormValue.pid
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="pids" style="display: none">
        <a-input
          v-decorator="[
            'pids',
            {
              initialValue: initialFormValue.pids
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="id" style="display: none">
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
