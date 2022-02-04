<template>
  <a-modal
    :visible="visible"
    :title="title"
    @cancel="() => { $emit('cancel') }"
    @ok="() => { $emit('submit') }"
  >
    <a-form layout="vertical" :form="form">
      <a-form-item label="账号" >
        <a-select
          :disabled="isEdit == 1"
          show-search
          placeholder="输入账号搜索"
          style="width: 200px"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          @search="handleSearch"
          v-decorator="[
            'account',
            {
              initialValue: initialFormValue == null ? '' : initialFormValue.account,
              rules: [{ required: true, message: '请输入账号' }]
            }
          ]"
        >
          <a-select-option v-for="d in accountDataSource" :key="d.account" :value="d.account">
            {{ d.account }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="">
        <a-radio-group
          v-decorator="[
            'isAll',
            {
              initialValue: initialFormValue == null ? 0 : initialFormValue.isAll
            }
          ]"
        >
          <a-radio v-for="(item, index) in typeOptions" :key="index" :value="item.value">
            {{ item.label }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <!-- {{ form.getFieldValue('isAll') == null ? (initialFormValue == null ? false : initialFormValue.isAll == 1) : form.getFieldValue('isAll') !== 0 }} -->
      <!-- {{ initialFormValue ? initialFormValue.isAll == 1 : (form.getFieldValue('isAll') == null ? false : form.getFieldValue('isAll') !== 0) }} -->
      <a-form-item label="医院/科室" v-if="form.getFieldValue('isAll') == null ? (initialFormValue == null ? false : initialFormValue.isAll == 1) : form.getFieldValue('isAll') !== 0">
        <a-tree-select
          v-decorator="[
            'tree',
            {
              initialValue: initialFormValue == null ? null : initialFormValue.tree,
              rules: [{ required: true, message: '请选择医院/科室' }]
            }
          ]"
          style="width: 100%"
          :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
          :tree-data="hospitalDataSource"
          tree-checkable
          :show-checked-strategy="SHOW_PARENT"
          search-placeholder="请选择医院/科室"
        />
      </a-form-item>

    </a-form>
  </a-modal>
</template>

<script>

import { TreeSelect } from 'ant-design-vue'
import { getAdminList } from '@/api/visibleRange/visibleRange'
const SHOW_PARENT = TreeSelect.SHOW_ALL

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
    hospitalDataSource: {
      type: Array,
			default: function () {
        return []
      }
    }
  },
  data () {
    return {
      value: 1,
      SHOW_PARENT,
      replaceFields: {
        children: 'children',
        title: 'label',
        key: 'value'
      },
      accountDataSource: [],
      typeOptions: [
        {
          label: '全部医院',
          value: 0
        },
        {
          label: '部分医院',
          value: 1
        }
      ]
    }
  },
  watch: {
    visible (newValue) {
      if (newValue && this.initialFormValue.isAll) {
        this.form.setFieldsValue({ isAll: this.initialFormValue.isAll })
      }
    }
  },
  computed: {
    showHospitalTree () {
      const formValue = this.form.getFieldValue('isAll')
      if (formValue != null) {
        return formValue !== 0
      }
      return this.initialFormValue !== 0
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
    console.log(this.form, '{{{{{')
  },
  methods: {
    handleSearch (value) {
      getAdminList({
        account: value
      }).then(res => {
        this.accountDataSource = res
      })
    }
  }
}
</script>
