<!-- 登录页面 -->
<template>
  <div>
    <a-form id="formLogin" class="user-layout-login" ref="formLogin" :form="form" @submit="handleSubmit">
      <!-- 用户名输入框 开始 -->
      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="请输入用户名"
          v-decorator="[
            'username',
            { rules: [{ required: true, message: '请输入用户名' }], validateTrigger: 'change' }
          ]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: '#D6DFEC' }" />
        </a-input>
      </a-form-item>
      <!-- 用户名输入框 结束 -->

      <!-- 密码输入框 开始 -->
      <a-form-item>
        <a-input-password
          size="large"
          placeholder="请输入密码"
          v-decorator="['pwd', { rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur' }]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: '#D6DFEC' }" />
        </a-input-password>
      </a-form-item>
      <!-- 密码输入框 结束 -->
      <a-form-item>
        <!-- 登录 按钮 开始 -->
        <a-form-item style="margin-top: 10px">
          <a-button
            size="large"
            type="primary"
            htmlType="submit"
            class="login-button"
            :loading="state.loginBtn"
            :disabled="state.loginBtn"
          >登录</a-button>
        </a-form-item>
        <!-- 登录 按钮 结束 -->
        <div class="forget">
          <div class="forget-btn" @click="changePassword">忘记密码</div>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'

export default {
  components: {},
  data () {
    return {
      form: this.$form.createForm(this),
      state: {
        // 按钮是否可点击
        loginBtn: false
      }
    }
  },
  created () {},
  methods: {
    changePassword () {
      this.$parent.isForget = true
    },
    ...mapActions(['Login', 'Logout']),

    /**
     * @function 登录按钮点击事件
     * @description 登录按钮点击事件
     * @param e {Object} ：$event 事件参数
     * @return void
     * @author 蔡景鹏 2021/11/12
     */
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        Login
      } = this
      state.loginBtn = true

      const validateFieldsKey = ['username', 'pwd']
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = {}
          loginParams.account = values.username
          loginParams.pwd = values.pwd
          // 调用登录接口
          Login(loginParams)
            .then(res => this.loginSuccess(res))
            .catch(err => this.loginFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },

    /**
     * @function 登录成功
     * @description 登录接口调用成功后 跳转路由
     * @return void
     * @author 蔡景鹏 2021/11/12
     */
    loginSuccess (res) {
      // 没有认证的情况下跳去认证页
      // res[verified_status] == 0  跳转到 实名
      if (res['verified_status'] === 0) {
        this.$router.push({ path: '/person' })
      } else {
        this.$router.push({ path: '/' })
        // 延迟 1 秒显示欢迎信息
        setTimeout(() => {
          this.$notification.success({
            message: '欢迎',
            description: `${timeFix()}，欢迎回来`
          })
        }, 1000)
      }
    },

    /**
     * @function 登录失败处理函数
     * @description 登录失败处理函数
     * @param err {Object} 登录异常信息
     * @return void
     * @author 蔡景鹏 2015/11/12
     */
    loginFailed (err) {
      console.log('====登录失败====', err)
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  ::v-deep .ant-input-suffix {
    color: #ABB8CE;
  }
  /* 去除谷歌浏览器中input自动填充背景 */
  ::v-deep input {
    box-shadow: 0 0 0 1000px #fff inset;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .forget {
    font-size: 14px;
    color: #ABB8CE;
    text-align: center;
    position: relative;

    &:after {
      content: '';
      display: block;
      border-top: 1px solid #E5EBF3;
      width: 100%;
      height: 0;
      position: absolute;
      top: 50%;
      left: 0;
      z-index: 3;
    }

    .forget-btn {
      position: relative;
      display: inline-block;
      background: #fff;
      padding: 0 13px;
      z-index: 4;
      cursor: pointer;
    }
  }
}

</style>
