<template>
  <div>
    <a-modal
      :visible="visible"
      :width="1000"
      @cancel="handelModalCancel"
      @ok="handleModalOk"
      :confirm-loading="btnLoading"
      okText="保存"
      layout="inline"
      :labelCol="{ style: 'width: 110px' }">
      <div class="form-wrapper" style="padding:25px;">
        <a-form-model
          :model="form"
          :rules="rules"
          ref="ruleForm"
          label-align="left"
          :label-col="labelCol"
          :wrapper-col="wrapperCol">
          <a-row :gutter="48">
            <a-col :md="16" :sm="24">
              <a-form-model-item label="手机号" prop="phone">
                <a-input v-model.trim="form.phone" @change="phoneChange($event)" @keyup.delete="handleDelete" :max-length="11"/>
              </a-form-model-item>
              <a-form-model-item label="研究员编号" prop="userNo" v-if="$props.type==4">
                <a-input v-model.trim="form.userNo" :max-length="11" disabled/>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item>
                <a-button type="primary" @click="quickCreate">
                  账户不存在？ 快捷新建<a-icon type="caret-right" />
                </a-button>
              </a-form-model-item>
            </a-col>
            <a-col :md="16" :sm="24">
              <a-form-model-item label="用户" :prop="$props.type==4?'aaa':'name'">
                <a-input v-model.trim="form.name" disabled/>
              </a-form-model-item>
            </a-col>
            <div style="clear:both;"></div>
            <a-col :md="16" :sm="24">
              <a-form-model-item label="账户" v-if="$props.type!=4">
                <a-input v-model.trim="form.account" disabled/>
              </a-form-model-item>
            </a-col>
            <a-col :md="16" :sm="24">
              <a-form-model-item label="邮箱">
                <a-input v-model.trim="form.email" disabled/>
              </a-form-model-item>
            </a-col>
            <div style="clear:both;"></div>
            <a-col :md="16" :sm="24" v-if="$props.type==1||$props.type==2">
              <a-form-model-item label="用户编号" prop="userNo" >
                <a-input v-model.trim="form.userNo" disabled/>
              </a-form-model-item>
            </a-col>
            <div style="clear:both;"></div>
            <!-- <a-col :md="16" :sm="24">
              <a-form-model-item label="组织机构内单位">
                <a-input disabled v-model="form.deptName"/>
              </a-form-model-item>
            </a-col> -->
            <div style="clear:both;"></div>
            <a-col :md="16" :sm="24">
              <a-form-model-item label="角色" prop="roleId">
                <a-select v-model="form.roleId" @change="handleRoleChange">
                  <a-select-option v-for="(item,index) in $props.roleList" :key="index" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { getUserInfoByPhone } from '@/api/project/project'
export default {
  props: {
    btnLoading: {
      default: false,
      type: Boolean
    },
    visible: {
      required: true,
      type: Boolean
    },
    type: {
      required: true,
      type: Number
    },
    proId: {
      required: true,
      type: [String, Number]
    },
    roleList: {
      type: Array,
      default: () => []
    },
    pm: {
      default: null,
      type: [String, Number]
    }
  },
  components: {

  },
  data () {
    return {
      roleCode: null,
      bufferPhone: null,
      rules: {
        phone: [{ required: true, message: '此项为必填项' }],
        roleId: [{ required: true, message: '请选择角色' }],
        name: [{ required: true, message: '请选择角色' }],
        researchNo: [{ required: true, message: '请输入研究员编号' }],
        userNo: [{ required: true, message: '请输入成员编号' }]
      },
      infoEmpty: false,
      labelCol: { span: 4 },
      phonePass: true,
      wrapperCol: { span: 20 },
      form: {}
    }
  },
  watch: {
    visible (newv) {
      if (newv === true) {
        console.log(this.$props)
        this.form.phone = localStorage.getItem('newPhone') || ''
        if (this.form.phone) {
          getUserInfoByPhone({ phone: this.form.phone }).then(res => {
            if (!res) {
              this.infoEmpty = true
            } else {
              this.infoEmpty = false
            }
            const { name, account, orgName, deptName, id, email, userNo } = res
            this.form = { ...this.form, userNo, name, email, account, orgName, deptName, invitedUserId: id, phone: localStorage.getItem('newPhone') }
            console.log(this.form, 8882322)
          })
        }
        this.form = { ...{} }
      }
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    handleModalOk () {
      console.log(this.form)
      if (!this.phonePass) {
        this.$message.error('请输入正确手机号')
        return false
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
         // 表单里拿的
        const { phone, roleId, name, email, invitedUserId, userNo } = this.form
        // 父组件带的
        const { type, proId } = this.$props
        const orgId = this.orgId
        // 发送邀请要用的参数
        const params = { phone, type, proId, roleId, researchNo: userNo, userNo, invitedUserId, orgId, name, email, pm: this.$props.pm, roleCode: this.roleCode }
        console.log(params, 222)
        this.$emit('ok', params)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 监听删除手机号,表单置空
    handleDelete () {
      console.log('删除')
       this.form.roleId = ''
       this.form.name = ''
       this.form.account = ''
       this.form.email = ''
       this.form.userNo = ''
    },
    handelModalCancel () {
      this.$emit('cancel')
    },
    quickCreate () {
      this.$emit('ok')
    },
    phoneChange (e) {
      const phone = e.target.value
      if (phone.length === 11) {
        const isPass = this.$options.filters.phoneNumberReg(phone)
        this.phonePass = true
        if (isPass) {
          getUserInfoByPhone({ phone }).then(res => {
            if (!res) {
              this.infoEmpty = true
              this.$message.info('此用户不存在')
            } else {
              this.infoEmpty = false
            }
            const { name, account, orgName, deptName, id, email, userNo } = res
            this.form = { ...this.form, name, account, orgName, deptName, invitedUserId: id, email, userNo: userNo, researchNo: userNo }
            console.log(this.form)
          })
        } else {
          this.phonePass = false
        }
      }
    },
    handleRoleChange (e) {
      console.log(e)
      const target = this.$props.roleList.find(item => item.id === e)
      this.roleCode = target.code
    }
  }
}
</script>
<style scoped lang="">

</style>
