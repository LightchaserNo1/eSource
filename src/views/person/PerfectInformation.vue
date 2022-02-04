<!-- 1.完善个人信息 -->
<template>
  <div class="table-page-search-wrapper">
    <!-- <div> -->
    <!-- <a-form-model layout="inline" :model="user" :rules="formRules" ref="formRef" style="max-width: 500px; margin: 40px auto 0;"> -->
    <a-form-model layout="inline" :model="user" :rules="formRules" ref="formRef" :style="{'margin': '40px auto 0'}">
      <!-- 用户名 -->
      <a-row :gutter="48">
        <a-col :md="8" :sm="24" :offset="8">
          <a-form-model-item label="用户名">
            <span> {{ user.userName }} </span>
          </a-form-model-item>
        </a-col>
      </a-row>
      <!-- 姓名 -->
      <a-row :gutter="48">
        <a-col :md="8" :sm="24" :offset="8">
          <a-form-model-item label="姓名" prop="name">
            <a-input v-model="user.name" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <!-- 生日 -->
      <!-- <a-row :gutter="48">
        <a-col :md="8" :sm="24" :offset="8">
          <a-form-model-item label="生日" prop="birthday">
            <a-date-picker v-model="user.birthday" valueFormat="YYYY-MM-DD" />
          </a-form-model-item>
        </a-col>
      </a-row> -->
      <!-- 身份证 -->
      <a-row :gutter="48">
        <a-col :md="8" :sm="24" :offset="8">
          <a-form-model-item label="身份证" prop="idCard">
            <a-input v-model="user.idCard" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <!-- 手机号 -->
      <a-row :gutter="48">
        <a-col :md="8" :sm="24" :offset="8">
          <a-form-model-item label="手机号">
            <span>{{ user.phone }}</span>
          </a-form-model-item>
        </a-col>
      </a-row>
      <!-- 邮箱 -->
      <a-row :gutter="48">
        <a-col :md="8" :sm="24" :offset="8">
          <a-form-model-item label="邮箱">
            <span>{{ user.email }}</span>
          </a-form-model-item>
        </a-col>
      </a-row>
      <!-- 组织机构 -->
      <a-row :gutter="48">
        <a-col :md="8" :sm="24" :offset="8">
          <a-form-model-item label="组织机构">
            <span>{{ user.orgName }}</span>
          </a-form-model-item>
        </a-col>
      </a-row>
      <!-- 职务 -->
      <a-row :gutter="48">
        <a-col :md="8" :sm="24" :offset="8">
          <a-form-model-item label="职务">
            <span>{{ user.position }}</span>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="48">
        <a-col :md="8" :sm="24" :offset="10">
          <a-button type="primary" @click="nextStep">下一步</a-button>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import { getPersonDetail, updatePersonDetail } from '@/api/system/user'
export default {
  name: '',
  data () {
    return {
      user: {},
      formRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
        birthday: [{ required: true, message: '请选择生日', trigger: 'change' }],
        idCard: [
          { required: true, message: '请输入证件号码', trigger: 'change' },
          { pattern: /^\d{6}((((((19|20)\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(((19|20)\d{2})(0[13578]|1[02])31)|((19|20)\d{2})02(0[1-9]|1\d|2[0-8])|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))0229))\d{3})|((((\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|((\d{2})(0[13578]|1[02])31)|((\d{2})02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[048])0229))\d{2}))(\d|X|x)$/, message: '证件号码格式错误' }
        ]
      }
    }
  },
  created () {
    this.getPersonDetail()
  },
  methods: {
    // 获取个人详情
    getPersonDetail () {
      getPersonDetail()
        .then(res => {
          this.user = res
          console.log(res, '个人信息')
        })
        .catch(() => {})
    },
    // 更新个人信息
    updatePersonDetail () {
      const { userName, name, idCard, email, phone, position, orgName, birthday } = { ...this.user }
      const commitData = { userName, name, idCard, email, phone, position, orgName, birthday }
      updatePersonDetail({ ...commitData })
        .then(res => {
          this.$emit('userInfo', { name, idCard, phone })
          this.$emit('nextStep')
        })
        .catch(() => {})
    },
    // 点击下一步
    nextStep () {
      // this.$emit('nextStep')
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.updatePersonDetail()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
