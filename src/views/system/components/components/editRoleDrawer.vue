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
        <a-form-model-item ref="name" label="角色名称" prop="name">
          <a-input v-model="form.name" :maxLength="10" />
        </a-form-model-item>
        <a-form-model-item ref="code" label="角色标识" prop="code">
          <a-input v-model="form.code" :maxLength="20" />
        </a-form-model-item>
        <a-form-model-item ref="account" label="权限">
          测试
          <a-tree
            v-model="checkedKeys"
            :default-checked-keys="hasPermissionArr"
            :replace-fields="replaceFields"
            checkable
            :tree-data="permission"
            @expand="onExpand"
            @select="onSelect"
            @check="checkedArr"
            checkStrictly
          />
        </a-form-model-item>
      </a-form-model>
      <div class="drawer-btn">
        <a-button :style="{ marginRight: '8px' }" @click="handleCancel"> 取消 </a-button>
        <a-button type="primary" @click="onSubmit"> 确定 </a-button>
      </div>
      <!-- <div>{{ form }}</div> -->
    </a-drawer>
  </div>
</template>

<script>
import { upDataRole, upDataRolePro } from '@/api/system/role.js'
export default {
  name: 'Transfermodal',
  props: {
    record: {
      default: () => {
        return {}
      },
      type: Object
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    rolePermission: {
      // 当前角色拥有的权限
      default: () => {
        return []
      },
      type: Array
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
  watch: {
    record (e) {
      // alert(e)
    }
  },
  data () {
    return {
      maskClosable: true,
      checkedKeys: this.rolePermission, // 树状keys
      hasPermissionArr: [527, 530, 531, 533, 532, 528],
      autoExpandParent: true,
      form: {
        id: this.$props.record.id,
        name: this.$props.record.name,
        code: this.$props.record.code,
        menuIds: this.$props.record.menuIds
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
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 10,
            message: '名称长度限制在10个字以内',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入标识',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '标识长度限制在20个字以内',
            trigger: 'blur'
          }
        ],
        description: [
          {
            required: false,
            trigger: 'blur'
          },
          {
            min: 1,
            max: 100,
            message: '描述过长',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      // console.log(this.rolePermission)
      // this.$refs.ruleForm.validate(valid => {
      //   if (valid) {
      //     this.form.menuIds = this.rolePermission.filter(n => n).toString()
      //     console.log(this.form)
      //     // this.form.menuIds = JSON.stringify(this.form.menuIds)
      //     upDataRole(this.form)
      //       .then(res => {
      //         this.buttonLoading = false
      //         this.$message.success('修改成功')
      //         // this.handleCancel()
      //         this.$parent.$refs.table.refresh(true)
      //       })
      //       .catch(() => {
      //         this.buttonLoading = false
      //       })
      //   } else {
      //     this.buttonLoading = false
      //     console.log('error submit!!')
      //     return false
      //   }
      // })

      // console.log(this.rolePermission)
      console.log(this.rolePermission, '||||||||||')
      console.log(this.$refs.ruleForm)
      console.log(this.checkedKeys.checked)
      if (this.checkedKeys.checked) {
        this.$refs.ruleForm.validate(valid => {
          console.log(valid)
          if (valid) {
            this.form.menuIds = this.checkedKeys.checked.filter(n => n).toString()
            console.log(this.form)
            if (this.$store.getters.project && this.$store.getters.project.id != null) {
              upDataRolePro({
                ...this.form,
                proId: this.$store.getters.project.id,
                systemId: this.$const.SYSTEM_TYPE.ESOURCE.value
                }).then(res => {
                  this.buttonLoading = false
                  this.$message.success('添加成功')
                  this.handleCancel()
                })
            } else {
              upDataRole(this.form).then(res => {
                this.buttonLoading = false
                this.$message.success('添加成功')
                this.handleCancel()
            })
            }
          } else {
            this.buttonLoading = false
            console.log('error submit!!')
            return false
          }
        })
      } else {
        this.handleCancel()
      }
    },
    onExpand (expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onSelect (selectedKeys, info) {
      console.log('onSelect', info)
      this.selectedKeys = selectedKeys
    },
    checkedArr (checkedKeys) {
      console.log(checkedKeys)
      // this.rolePermission = checkedKeys.checked.filter(n => n).toString()
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    // 选择集合
    collectRow (Rows) {
      this.selectedGroud = Rows
    },
    // 处理取消
    handleCancel () {
      this.$emit('cancel')
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
  text-align: right;
  z-index: 1;
}
</style>
