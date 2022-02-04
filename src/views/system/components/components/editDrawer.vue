<!--  -->
<template>
  <a-drawer title="编辑用户" :with-header="false" :visible.sync="editDrawVisible" :width="520" @close="closeDrawer(0)">
    <a-form-model ref="formRef" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="账户" prop="account">
        <a-input v-model="form.account" />
      </a-form-model-item>
      <a-form-model-item label="用户名" prop="userName">
        <a-input v-model="form.userName" />
      </a-form-model-item>
      <a-form-model-item label="成员姓名" prop="name">
        <a-input v-model="form.name" />
      </a-form-model-item>
      <a-form-model-item label="邮箱" prop="email">
        <a-input v-model="form.email" />
      </a-form-model-item>
      <a-form-model-item label="手机" prop="phone">
        <a-input v-model="form.phone" />
      </a-form-model-item>
      <a-form-model-item v-if="form.type == $const.USER_TYPE.ZUZHI.value" label="职务" prop="position">
        <a-input v-model="form.position" />
      </a-form-model-item>
      <a-form-model-item label="机构" ref="orgId" prop="orgId" v-if="form.type == $const.USER_TYPE.ZUZHI.value">
        <a-select v-model="form.orgId" placeholder="请选择机构" @change="handleSelect(form.orgId)">
          <a-select-option v-for="(item, index) in orgList" :value="item.id" :key="index">{{
            item.orgName
          }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="科室" prop="orgHospitalDeptId" v-if="form.type == $const.USER_TYPE.ZUZHI.value">
        <a-select v-model="form.orgHospitalDeptId" placeholder="请选择所属科室">
          <a-select-option v-for="(item, index) in depList" :value="item.id" :key="index">{{
            item.name
          }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="用户类型" prop="type">
        <a-select v-model="form.type" placeholder="请选择用户类型">
          <a-select-option v-for="(item, index) in $const.USER_TYPE" :value="item.value" :key="index">{{
            item.desc
          }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <!-- <a-form-model-item label="角色" prop="roleId" v-if="roleHidden"> -->
      <a-form-model-item label="角色" prop="roleId" v-if="form.isAdmin">
        <a-select v-model="form.roleId" placeholder="请选择角色" style="margin-bottom: 40px" allowClear>
          <a-select-option v-for="(item, index) in roleList" :value="item.id" :key="index">{{
            item.name
          }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="系统管理员" prop="isAdmin">
        <a-select v-model="form.isAdmin" @change="handleAdminChange" disabled>
          <a-select-option :value="1">是</a-select-option>
          <a-select-option :value="0">否</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
    <!-- 操作栏 -->
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1
      }"
    >
      <a-space>
        <a-button type="primary" :loading="loading" @click="handleOk">确定</a-button>
        <a-button @click="closeDrawer(0)">取消</a-button>
      </a-space>
    </div>
  </a-drawer>
</template>

<script>
import { getUserList, getOrgList, getAreaList, updateUser } from '@/api/system/user'
import { getRole } from '@/api/system/role.js'
export default {
  name: '',
  props: {
    editDrawVisible: {
      type: Boolean,
      default: false
    },
    totalCount: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      roleHidden: true,
      userInformation: '',
      form: {
        isAdmin: 0
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      loading: false,
      orgList: [], // 机构list
      depList: [], // 科室list
      roleList: [],
      userAccount: [], // 所有用户账号
      userPhone: [], // 所有用户手机号
      backUpsForm: {}, // 备份form初始化数据
      rules: {
        account: [
          { required: true, message: '请输入账户' },
          { pattern: /^[0-9a-zA-Z_]{1,10}$/, message: '账户格式错误或长度过长' }
        ],
        userName: [{ required: true, message: '请输入用户名' }],
        name: [
          { required: true, message: '请输入姓名' },
          { pattern: /^.{1,10}$/, message: '姓名格式错误' }
        ],
        email: [
          { required: true, message: '请输入邮箱' },
          { pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: '邮箱格式错误' }
        ],
        phone: [
          { required: true, message: '请输入手机' },
          { pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '手机号格式错误' }
        ],
        position: [{ required: false, message: '请输入职务' }],
        orgId: [{ required: true, message: '请选择组织机构' }],
        // orgHospitalDeptId: [{ required: true, message: '请选择科室' }],
        type: [{ required: true, message: '请选择类型' }],
        isAdmin: [{ required: true, message: '请选择' }]
        // roleId: [{ required: true, message: '请选择角色' }]
      }
    }
  },
  mounted () {
    this.getOrgList()
    this.getRole()
    this.userInformation = this.$store.getters.nickname
    // if (this.userInformation === 'CRC' || this.userInformation === 'PM') {
    //   this.roleHidden = false
    // }
  },
  watch: {
    editDrawVisible (newValue) {
      if (newValue) {
        this.getThisUserList()
        this.backUpsForm = { ...this.form }
      }
    }
  },
  methods: {
    // 根据父元素获取到的所有消息的条数来获取所有用户
    getThisUserList () {
      getUserList({ pageNumber: 1, pageSize: this.totalCount })
      .then(res => {
        res.content.forEach(item => {
          this.userPhone.push(item.phone)
          this.userAccount.push(item.account)
        })
        console.log('全部用户账号和用户名', this.userAccount, this.userPhone)
      })
      .catch(() => {})
    },
    // 获取组织机构
    getOrgList () {
      getOrgList().then(res => {
        this.orgList = res
      })
    },
    // 获取角色list
    getRole () {
      getRole().then(res => {
        this.roleList = res
      })
    },
    // 获取科室列表
    getAreaList () {
      getAreaList({ orgId: this.form.orgId })
        .then(res => {
          this.depList = res
        })
        .catch(() => {})
    },
    // select 回调
    handleSelect () {
      this.depList = []
      this.getAreaList()
    },
    // 系统管理员下拉框改变
    handleAdminChange (val) {
      this.form.isAdmin = val
      this.$forceUpdate()
    },
    // 确定回调
    handleOk () {
      console.log(this.form, '222222222222')
      this.$refs.formRef.validate(valid => {
        if (valid) {
          const userAccountExamine = this.userAccount.findIndex((item) => item === this.form.account)
          const userPhoneExamine = this.userPhone.findIndex((item) => item === this.form.phone)
          if (userAccountExamine !== -1 && this.backUpsForm.account !== this.form.account) {
            this.$message.error('账户已使用')
          } else if (userPhoneExamine !== -1 && this.backUpsForm.phone !== this.form.phone) {
            this.$message.error('手机号已使用')
          } else {
            updateUser(this.form).then(res => {
              this.$message.success('操作成功！')
              this.closeDrawer(this.form)
            })
          }
        }
      })
    },
    // 关闭对话框重置表单
    closeDrawer (val) {
      this.$emit('closeEditDrawer', val)
      this.$refs.formRef.resetFields()
      this.form = this.$options.data().form
    },
    // 所选科室进行回显
    echoDepartment () {
      if (this.form.orgId) {
        this.getAreaList()
      }
    }
  }
}
</script>
<style scoped lang="less"></style>
