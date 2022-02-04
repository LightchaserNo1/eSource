<template>
  <div>
    <a-dropdown v-if="currentUser && currentUser.name" placement="bottomRight">
      <span class="ant-pro-account-avatar">
        <a-avatar size="small" :src="getHeadImg" class="antd-pro-global-header-index-avatar" />
        <span>{{ $store.getters.nickname }}</span>
      </span>
      <template v-slot:overlay>
        <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
          <a-menu-item v-if="menu" key="center" @click="handleToCenter">
            <a-icon type="user" />
            {{ $t('menu.account.center') }}
          </a-menu-item>
          <a-menu-divider v-if="$store.getters.project" />
          <a-menu-item key="project" v-if="$store.getters.project" @click="handleChangeProject">
            <a-icon type="menu-fold" />切换项目
            <div style="color: #999999">
              {{ $store.getters.project.name }}
            </div>
          </a-menu-item>
          <a-menu-divider v-if="menu" />
          <a-menu-item v-if="menu" key="password" @click="clickEditPassword">
            <a-icon type="setting" />
            {{ '修改密码' }}
          </a-menu-item>
          <a-menu-divider v-if="menu" />
          <a-menu-item v-if="menu" key="logout" @click="handleLogout">
            <a-icon type="logout" />
            {{ $t('menu.account.logout') }}
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <span v-else>
      <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
    </span>
    <a-modal title="修改密码" :visible="modalVisible" @ok="handleOk" @cancel="handleCancel">
      <!-- <a-form-model layout="inline" :model="form" :rules="formRules" ref="formRef">
        <a-form-model-item label="请输入新密码" prop="pwd">
          <a-input-password v-model="form.pwd" />
        </a-form-model-item>
      </a-form-model> -->
      <!-- 修改密码框包括密码限制提示框start -->
      <a-form ref="formRegister" :form="form" id="formRegister">
        <a-popover
          placement="rightTop"
          :trigger="['focus']"
          :getPopupContainer="(trigger) => trigger.parentElement"
          v-model="state.passwordLevelChecked"
        >
          <template slot="content">
            <div :style="{ width: '240px' }">
              <div :class="['user-register', passwordLevelClass]">{{ $t(passwordLevelName) }}</div>
              <a-progress :percent="state.percent" :showInfo="false" :strokeColor="passwordLevelColor" />
              <div style="margin-top: 10px">
                <span>请至少输入 8 个字符。请不要使用容易被猜到的密码。</span>
              </div>
            </div>
          </template>
          <a-form-item label="请输入新密码">
            <a-input-password
              size="large"
              @click="handlePasswordInputClick"
              placeholder="请输入至少8位包含数字、英文字母、特殊符号组合"
              :maxLength="30"
              v-decorator="[
                'pwd',
                {
                  rules: [{ required: true, message: '请输入新密码' }, { pattern: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{8,}$/, message: '至少为8位包含数字、英文字母、特殊符号组合' }, { validator: this.handlePasswordLevel }],
                  validateTrigger: ['change', 'blur']
                }
              ]"
            ></a-input-password>
          </a-form-item>
        </a-popover>
      </a-form>
    <!-- 修改密码框包括密码限制提示框end -->
    </a-modal>
  </div>
</template>

<script>
import { Modal } from 'ant-design-vue'
import { scorePassword } from '@/utils/util'
import { updatePassword } from '@/api/system/user'
import { deviceMixin } from '@/store/device-mixin'

// 提示框样式
const levelNames = {
  0: 'user.password.strength.short',
  1: 'user.password.strength.low',
  2: 'user.password.strength.medium',
  3: 'user.password.strength.strong'
}
const levelClass = {
  0: 'error',
  1: 'error',
  2: 'warning',
  3: 'success'
}
const levelColor = {
  0: '#ff0000',
  1: '#ff0000',
  2: '#ff7e05',
  3: '#52c41a'
}

export default {
  name: 'AvatarDropdown',
  mixins: [deviceMixin],
  props: {
    currentUser: {
      type: Object,
      default: () => null
    },
    menu: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      defHeadImg: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      modalVisible: false,
      form: this.$form.createForm(this),
      // formRules: {
      //   pwd: [{ required: true, message: '请输入密码', trigger: 'change' }]
      // },
      // 密码提示框样式参数
      state: {
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      }
    }
  },
  computed: {
    getHeadImg () {
      if (this.$store.getters.avatar != null && this.$store.getters.avatar.length > 0) {
        return process.env.VUE_APP_BASE_IMAGE + this.$store.getters.avatar
      }
      return 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
    },
    // 更具密码改动改变提示框
    passwordLevelClass () {
      return levelClass[this.state.passwordLevel]
    },
    passwordLevelName () {
      return levelNames[this.state.passwordLevel]
    },
    passwordLevelColor () {
      return levelColor[this.state.passwordLevel]
    }
  },
  methods: {
    // 密码规范提示窗方法
    handlePasswordLevel (rule, value, callback) {
      console.log('11111111111111')
      if (value === '') {
        return callback()
      }
      console.log('scorePassword ; ', scorePassword(value))
      if (value.length >= 6) {
        if (scorePassword(value) >= 30) {
          this.state.level = 1
        }
        if (scorePassword(value) >= 60) {
          this.state.level = 2
        }
        if (scorePassword(value) >= 80) {
          this.state.level = 3
        }
      } else {
        this.state.level = 0
        callback(new Error(this.$t('user.password.strength.msg')))
      }
      this.state.passwordLevel = this.state.level
      this.state.percent = this.state.level * 33

      callback()
    },
    // 修改密码输入框开始输入触发事件
    handlePasswordInputClick () {
      console.log(this.isMobile)
      if (!this.isMobile) {
        this.state.passwordLevelChecked = true
        return
      }
      this.state.passwordLevelChecked = false
    },
    handleToCenter () {
      this.$router.push({ path: '/user-info' })
    },
    handleToSettings () {
      this.$router.push({ path: '/account/settings' })
    },
    handleChangeProject () {
      this.$router.push({ name: 'overview' })
    },
    handleLogout (e) {
      Modal.confirm({
        title: this.$t('layouts.usermenu.dialog.title'),
        content: this.$t('layouts.usermenu.dialog.content'),
        onOk: () => {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
          // }).catch(() => console.log('Oops errors!'))
          return this.$store.dispatch('Logout').then(() => {
            this.$router.push({ name: 'login' })
          })
        },
        onCancel () {}
      })
    },
    // 点击修改密码
    clickEditPassword () {
      this.modalVisible = true
    },
    handleOk (e) {
      e.preventDefault()
      const {
        form: { validateFields }, state } = this
      const validateFieldsKey = ['pwd']
      console.log(validateFieldsKey)
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          state.registerBtn = true
          console.log({ ...values })
          this.updatePassword(values)
        }
      })
    },
    updatePassword (parameter = {}) {
      updatePassword({ ...parameter })
        .then(res => {
          this.$message.success('密码修改成功')
          this.handleCancel()
          this.changePassword()
        })
        .catch(() => {})
    },
    // 点击取消关闭对话框并重置
    handleCancel () {
      this.modalVisible = false
      setTimeout(() => {
        this.$refs.formRef.resetFields()
      }, 200)
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
</style>
