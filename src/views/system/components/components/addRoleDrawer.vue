<template>
  <div>
    <a-drawer
      :title="title"
      :width="width"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="handleCancel"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="角色名称" prop="name">
          <a-input v-model="form.name" :maxLength="10" />
        </a-form-model-item>
        <a-form-model-item label="角色标识" prop="code">
          <a-input v-model="form.code" :maxLength="20" />
        </a-form-model-item>
        <a-form-model-item label="描述" prop="description">
          <a-input v-model="form.description" :maxLength="100" />
        </a-form-model-item>
        <a-form-model-item ref="account" label="权限">
          <a-tree
            v-model="checkedKeys"
            :replaceFields="replaceFields"
            checkable
            :tree-data="permission"
            @expand="onExpand"
            @select="onSelect"
            @check="checkedArr"
            :checkStrictly="true"
          />
        </a-form-model-item>
      </a-form-model>
      <div class="drawer-btn">
        <a-button :style="{ marginRight: '8px' }" @click="handleCancel"> 取消 </a-button>
        <a-button :loading="buttonLoading" type="primary" @click="onSubmit"> 确定 </a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { addRole, addRolePro } from '@/api/system/role.js'
export default {
  props: {
    loading: {
      type: Boolean,
      default: () => false
    },
    permission: {
      default: () => {
        return []
      },
      type: Array
    },
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 620
    }
  },
  data () {
    return {
      // 确认按钮loading状态
      buttonLoading: false,
      maskClosable: true,
      checkedKeys: [], // 树状keys
      autoExpandParent: true,
      form: {
        name: '',
        code: '',
        description: ''
      },
      replaceFields: {
        children: 'children',
        title: 'name',
        key: 'id'
      },
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 18
      },
      other: '',
      rules: {
        name: [
          { required: true, message: '请输入名称' },
          { min: 1, max: 10, message: '名称长度限制在10个字以内' }
        ],
        code: [
          { required: true, message: '请输入标识', trigger: 'blur' },
          { min: 1, max: 20, message: '标识长度限制在20个字以内' }
        ],
        description: [
          { required: false, trigger: 'blur' },
          { min: 1, max: 100, message: '描述长度限制在100个字以内' }
        ]
      }
    }
  },
  watch: {
    visible (e) {
      if (!e) {
        this.resetForm()
      }
    }
  },
  methods: {
    onSubmit () {
      this.buttonLoading = true
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (!this.form.menuIds) {
            this.buttonLoading = false
            this.$message.warning('请选择权限')
            return
          }
          console.log(this.form)
					if (this.$store.getters.project && this.$store.getters.project.id != null) {
						addRolePro({
							proId: this.$store.getters.project.id,
							systemId: this.$const.SYSTEM_TYPE.ESOURCE.value,
							...this.form
						}).then(res => {
							this.buttonLoading = false
              this.$message.success('添加成功')
              this.handleOk()
						})
						.catch(() => {
              this.buttonLoading = false
            })
					} else {
						addRole(this.form).then(res => {
              this.buttonLoading = false
              this.$message.success('添加成功')
              this.handleOk()
            })
            .catch(() => {
              this.buttonLoading = false
            })
					}
        } else {
          this.buttonLoading = false
          console.log('error submit!!')
          return false
        }
      })
    },
    onExpand (expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys) {
      console.log('onCheck', checkedKeys)
      this.checkedKeys = checkedKeys
    },
    onSelect (selectedKeys, info) {
      console.log('onSelect', info)
      this.selectedKeys = selectedKeys
    },
    checkedArr (checkedKeys) {
      console.log(checkedKeys)
      this.form.menuIds = checkedKeys.checked.toString()
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
      this.checkedKeys = []
    },
    // 选择集合
    collectRow (Rows) {
      this.selectedGroud = Rows
    },
    // 处理取消
    handleCancel () {
      this.buttonLoading = false
      this.$emit('cancel')
    },
    // 处理确定按钮
    handleOk () {
      this.$emit('ok', this.form)
    }
  }
}
</script>

<style lang="less" scoped>
.drawer-btn {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  textalign: right;
  zindex: 1;
}
</style>
