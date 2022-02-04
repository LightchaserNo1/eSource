<!--  -->
<template>
  <a-modal title="新增用户" :with-header="false" :visible="visible" :width="520" @cancel="cancelAdd">
    <a-form-model
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">
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
      <a-form-model-item label="职务" prop="position" v-if="form.type == $const.USER_TYPE.ZUZHI.value">
        <a-input v-model="form.position" />
      </a-form-model-item>
      <a-form-model-item label="机构" ref="orgId" prop="orgId" v-if="form.type == $const.USER_TYPE.ZUZHI.value">
        <a-select v-model="form.orgId" placeholder="请选择机构" @change="handleSelect">
          <a-select-option v-for="(item, index) in orgList" :value="item.id" :key="index">{{
            item.orgName
          }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="科室" prop="orgHospitalDeptId" v-if="form.type == $const.USER_TYPE.ZUZHI.value && isHospital">
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
      <a-form-model-item label="角色" prop="roleId" v-if="form.isAdmin">
        <a-select v-model="form.roleId" placeholder="请选择角色" allowClear>
          <a-select-option v-for="(item, index) in roleList" :value="item.id" :key="index">{{
            item.name
          }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="系统管理员" prop="isAdmin">
        <a-select v-model="form.isAdmin" @change="handleAdminChange" style="margin-bottom: 40px">
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
        zIndex: 1,
      }"
    >
      <a-space>
        <a-button type="primary" :loading="loading" @click="handleOk">确定</a-button>
        <a-button @click="cancelAdd">取消</a-button>
      </a-space>
    </div>
  </a-modal>
</template>

<script>
import { getUserList, getOrgList, getAreaList, addUser } from '@/api/system/user'
import { getRole } from '@/api/system/role'
export default {
  name: '',
  props: {
    visible: {
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
      form: {
        isAdmin: 0
      },
      isHospital: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      loading: false,
      orgList: [], // 机构list
      depList: [], // 科室list
      roleList: [],
      userAccount: [], // 所有用户账号
      userPhone: [], // 所有用户手机号
      rules: {
        account: [
          { required: true, message: '请输入账户' },
          { pattern: /^[0-9a-zA-Z_]{1,10}$/, message: '账户格式错误' }
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
        position: [{ required: true, message: '请输入职务' }],
        // orgId: [{ required: false, message: '请选择组织机构' }],
        // orgHospitalDeptId: [{ required: false, message: '请选择科室' }],
        type: [{ required: true, message: '请选择类型' }],
        isAdmin: [{ required: true, message: '请选择' }]
        // roleId: [{ required: false, message: '请选择角色' }]
      }
    }
  },
  watch: {
    visible (newValue) {
      if (newValue) {
        this.isHospital = false
        this.getThisUserList()
      }
    }
  },
  mounted () {
    this.getOrgList()
    this.getRole()
  },
  methods: {
    // 根据父元素获取到的所有消息的条数来获取所有用户
    getThisUserList () {
      getUserList({ pageNumber: 1, pageSize: 2000 })
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
    checkHospital () {
      if (this.orgList && this.orgList.length && this.form.orgId) {
        const data = this.orgList.find(item => { return item.id === this.form.orgId })
        this.isHospital = data.type === 2
      } else {
        this.isHospital = false
      }
    },
    // select 回调
    handleSelect () {
      this.checkHospital()
      this.depList = []
      this.getAreaList()
    },
    // 选择的是申办方则隐藏科室
    // hiddenDepartment () {
    //   const target = this.orgList.find(item => item.id === this.form.orgId)
    // },
    // 系统管理员下拉框改变
    handleAdminChange (val) {
      this.form.isAdmin = val
      this.$forceUpdate()
    },
    // 确定回调
    handleOk () {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          const userAccountExamine = this.userAccount.findIndex((item) => item === this.form.account)
          const userPhoneExamine = this.userPhone.findIndex((item) => item === this.form.phone)
          if (userAccountExamine !== -1) {
            this.$message.error('账户不得重复')
          } else if (userPhoneExamine !== -1) {
            this.$message.error('手机号不得重复')
          } else {
            addUser(this.form).then(res => {
              localStorage.setItem('newPhone', this.form.phone)
              this.$message.success('操作成功！')
              const formValue = { ...this.form }
              this.$emit('successCreate', formValue)
              this.$refs.formRef.resetFields()
            })
          }
        }
      })
    },
    cancelAdd () {
       this.$refs.formRef.resetFields()
       this.$emit('cancelCreate')
    },
    // 关闭对话框重置表单
    closeDrawer (val) {
      this.$emit('closeDrawer', val)
      this.$refs.formRef.resetFields()
      this.form = this.$options.data().form
    }
  }
}
</script>
<style scoped lang="less">
</style>
