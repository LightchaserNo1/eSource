<template>
  <a-modal title="添加角色" :visible.sync="visible" width="500px" @cancel="handleCancel">
    <a-form ref="form" :form="form" laba-width="80px">
      <a-form-item label="角色名称">
        <a-input
          v-decorator="[
            'name',
            {
              initialValue: '',
              rules: [{ required: true, message: '请输入角色名称' }],
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="后台权限">
        <a-tree
          ref="tree"
          v-decorator="[
            'menuIds'
          ]"
          checkable
          :props="props"
          :replace-fields="{ title: 'description', key: 'id' }"
          node-key="id"
          :tree-data="sysPermission"
          show-checkbox
          v-model="checkedKeys"
          @check="handleCheckChange"
        />
      </a-form-item>
    </a-form>
    <div slot="footer" class="dialog-footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" :loading="loading" @click="handleOk">确认</a-button>
    </div>
  </a-modal>
</template>

<script>
export default {
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    sysPermission: {
      default: () => {
        return []
      },
      type: Array
    }
  },
  data () {
    return {
      loading: false,
      props: {
        label: 'description',
        children: 'children'
      },
      checkedKeys: null
    }
  },
  watch: {
    visible (e) {

    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  methods: {
    clearCheckedKeys () {
      this.checkedKeys = null
    },
    handleCancel () {
      this.$emit('handleCancel')
    },
    handleOk () {
      // const data = JSON.parse(JSON.stringify(this.form))
      // data.menuIds = data.menuIds.toString()
      this.$emit('handleOk')
    },
    handleCheckChange (e) {
      this.form.setFieldsValue({
        menuIds: e.join(',')
      })
    }
  }
}
</script>

<style>

</style>
