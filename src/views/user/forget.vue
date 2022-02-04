<template>
  <div class="user-layout-register">
    <div class="content">
      <a-icon type="left" style="cursor: pointer" @click="$parent.isForget = false" />
      <span class="title">忘记密码</span>
    </div>
    <a-form ref="formRegister" :form="form" id="formRegister">
      <a-form-item>
        <a-input
          size="large"
          :maxLength="11"
          placeholder="请输入手机号"
          v-decorator="[
            'phone',
            {
              rules: [
                {
                  required: true,
                  message: $t('user.phone-number.required'),
                  pattern: /^(1)\d{10}$/
                },
                { validator: this.handlePhoneCheck }
              ],
              validateTrigger: ['change', 'blur']
            }
          ]"
        >
          <a-select slot="addonBefore" size="large" defaultValue="+86">
            <a-select-option value="+86">+86</a-select-option>
            <a-select-option value="+87">+87</a-select-option>
          </a-select>
        </a-input>
      </a-form-item>

      <a-row :gutter="9">
        <a-col class="gutter-row" :span="16">
          <a-form-item>
            <a-input
              size="large"
              :placeholder="$t('user.login.mobile.verification-code.placeholder')"
              v-decorator="['code', { rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur' }]"
            >
              <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <a-button
            ghost
            type="primary"
            class="getCaptcha"
            :disabled="state.smsSendBtn"
            @click.stop.prevent="getCaptcha"
            v-text="(!state.smsSendBtn && $t('user.register.get-verification-code')) || state.time + ' s'"
          ></a-button>
        </a-col>
      </a-row>

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
        <a-form-item>
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

      <a-form-item>
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="registerBtn"
          @click.stop.prevent="handleSubmit"
          :disabled="registerBtn"
          block
        >确定更改
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { getPhoneCode, getReset } from '@/api/login'
import { scorePassword } from '@/utils/util'
import { deviceMixin } from '@/store/device-mixin'

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
  name: '',
  components: {},
  mixins: [deviceMixin],
  data () {
    return {
      form: this.$form.createForm(this),
      code: 333333,
      state: {
        time: 60,
        level: 0,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      registerBtn: false,
      timer: null
    }
  },
  computed: {
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
    handlePasswordLevel (rule, value, callback) {
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

    handlePhoneCheck (rule, value, callback) {
      callback()
    },

    getCaptcha (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        $notification
      } = this

      validateFields(['phone'], { force: true }, (err, values) => {
        if (!err) {
          state.smsSendBtn = true

          getPhoneCode({ phone: values.phone })
            .then((res) => {
              $notification['success']({
                message: '提示',
                description: '验证码获取成功',
                duration: 8
              })
              this.timer = setInterval(() => {
                if (state.time-- <= 0) {
                  state.time = 60
                  state.smsSendBtn = false
                  window.clearInterval(this.timer)
                }
              }, 1000)
            })
            .catch((err) => {
              state.time = 60
              state.smsSendBtn = false
              this.getVerification(err)
            })
        }
      })
    },

    handlePasswordInputClick () {
      if (!this.isMobile) {
        this.state.passwordLevelChecked = true
        return
      }
      this.state.passwordLevelChecked = false
    },

    handleSubmit (e) {
      console.log(e)
      e.preventDefault()
      const {
        form: { validateFields },
        state
      } = this

      const validateFieldsKey = ['phone', 'code', 'pwd']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = {}
          loginParams.phone = values.phone
          loginParams.code = values.code
          loginParams.pwd = values.pwd
          console.log('login form 提交表单参数', loginParams)
          state.registerBtn = true
          getReset(loginParams)
            .then((res) => this.loginSuccess(res))
            .catch((err) => this.requestFailed(err))
            .finally(() => {
              state.registerBtn = false
            })
        }
      })
    },
    loginSuccess (res) {
      this.$message.success('重置密码成功', 10)
      this.$router.push({ name: 'login' })
    },
    requestFailed (err) {
      this.$message.error('重置密码失败', 10)
      console.log('====重置密码失败====', err)
    },
    getVerification (err) {
      this.$message.error('验证码获取失败', 10)
      console.log('====验证码获取失败====', err)
    }
  },
  watch: {
    'state.passwordLevel' (val) {
      console.log(val)
    }
  },
  destroyed () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
</script>
<style lang="less">
.user-register {
  &.error {
    color: #ff0000;
  }

  &.warning {
    color: #ff7e05;
  }

  &.success {
    color: #52c41a;
  }
}

.user-layout-register {
  .ant-input-group-addon:first-child {
    background-color: #fff;
  }
}
</style>
<style lang="less" scoped>
.login-button {
  margin: auto;
}
.content {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 600;
  color: #181818;
  margin-bottom: 30px;
  .title {
    font-size: 23px;
    font-weight: bold;
    margin-left: 12px;
  }
}
.user-layout-register {
  ::v-deep .ant-input-suffix {
    color: #ABB8CE;
  }
  & > h3 {
    font-size: 16px;
    margin-bottom: 20px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .register-button {
    width: 50%;
  }

  .login {
    float: right;
    line-height: 40px;
  }
}
</style>
