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
              rules: [{ required: true, message: '请输入权限名称' }, { min: 1, max: 20, message: '名称长度限制在20个字以内' }],
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="权限标识(前端)" >
        <a-input
          v-decorator="[
            'url',
            {
              initialValue: initialFormValue.url,
              rules: [{ required: true, message: '请输入权限标识' }, { min: 1, max: 60, message: '标识长度限制在60个字以内' }],
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="权限标识(后端)" >
        <a-input
          v-decorator="[
            'code',
            {
              initialValue: initialFormValue.code,
              rules: [{ required: false, message: '请输入权限标识' }, { min: 1, max: 60, message: '标识长度限制在60个字以内' }],
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="类型" >
        <a-select
          v-decorator="[
            'isPublic',
            {
              initialValue: initialFormValue == null ? -1 : initialFormValue.isPublic,
              rules: [{ required: true, message: '请选择类型' }],
            }
          ]"
          placeholder="请选择">
          <a-select-option v-for="type in publicOptions" :key="type.value" :value="type.value">{{ type.label }}</a-select-option>
        </a-select>
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
      <a-form-item label="type" style="display: none">
        <a-input
          v-decorator="[
            'type',
            {
              initialValue: initialFormValue.type
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
  data () {
    return {
      publicOptions: [
        { label: '公共权限', value: 1 },
        { label: '非公共权限', value: -1 }
      ]
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  }
}
</script>
