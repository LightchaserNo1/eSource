<template>
  <a-modal title="编辑角色" :visible.sync="visible" width="500px" @cancel="handleCancel">
    <a-form ref="form" :form="form" laba-width="80px">
      <a-form-item label="id" style="display: none">
        <a-input
          v-decorator="[
            'id',
            {
              initialValue: record == null ? '' : record.id,
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="角色名称">
        <a-input
          v-decorator="[
            'name',
            {
              initialValue: record == null ? '' : record.name,
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
import { fetchRoleDetail } from '@/api/account/role'
export default {
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    record: {
      default: () => {
        return {}
      },
      type: Object
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
    record (e) {
      if (e != null) {
        this.fetchRoleInfo(e.id)
      }
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {

  },
  methods: {
    clearCheckedKeys () {
      this.checkedKeys = null
    },
    handleCancel () {
      this.$emit('handleCancel')
    },
    handleOk () {
      this.$emit('handleOk')
    },
    fetchRoleInfo (id) {
      fetchRoleDetail({
        roleId: id
      }).then(res => {
        this.checkedKeys = res.data.checkedIds
      })
    },
    dealChecked (data, checkedIds) {
      let checkIds = []
      data.forEach((item) => {
        if (checkedIds.indexOf(item.id) >= 0) {
          // 判断当children有值递归查询，直到没有childre最底层讲将id保存到checkIds中返回合并
          if (item.children && item.children.length > 0) {
            checkIds = checkIds.concat(this.dealChecked(item.children, checkedIds))
          } else {
            checkIds.push(item.id)
          }
        }
      })
      return checkIds
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
