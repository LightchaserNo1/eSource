<template>
  <div id="userLayout">
    <div
      class="container"
      :style="{'backgroundImage':( $isCenter? 'linear-gradient(226deg, #E0F4FE 0%, #B7D6FF 100%)':'linear-gradient(226deg, #E0F4FE 0%, #97E3D9 100%)')}">
      <section class="user-layout-lang">
        <select-lang class="select-lang-trigger" />
      </section>

      <section class="user-layout-content">
        <div
          class="show-image"
          :style="{'background':( $isCenter? 'url('+login_center+')':'url('+login+')')}"></div>
        <div class="main">
          <div class="main-top">
            <img
              v-if="$isCenter"
              src="./img/logo_center.png"
              class="prime-logo">
            <img
              v-else
              src="./img/logo_hospital.png"
              class="prime-logo">
            <template>
              <div v-if="!$isCenter" class="split-line"></div>
              <!-- <span v-if="$isCenter">智信</span> -->
              <span v-if="!$isCenter" style="color：#00CCA8">医院端</span>
            </template>
          </div>
          <!-- <h1 v-if="$isCenter">智信</h1>
          <h1 v-else>智源</h1> -->
          <h1>Prime</h1>
          <h2>智能临床研究加速器</h2>
          <!-- <h2 v-if="!isForget && !$isCenter">智能临床研究加速器</h2>
          <h2 v-if="!isForget && $isCenter">智能临床研究加速器</h2> -->
          <forget v-if="isForget"></forget>
          <login-form v-else></login-form>
        </div>
      </section>
      <div class="footer">
        <div class="links">
          <a
            href="./privacyPolicy"
            target="_blank">隐私政策</a>
          <a
            href="./agreement"
            target="_blank">用户协议</a>
        </div>
        <div class="copyright">
          <a
            href="#"
            target="_blank">Copyright © 2021 杭州璞睿生命科技有限公司</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SelectLang from '@/components/SelectLang'
import LoginForm from './loginForm'
import Forget from './forget'

export default {
  name: 'UserLayout',
  components: { SelectLang, LoginForm, Forget },
  data () {
    return {
      isForget: false,
      login: require('./img/login.png'),
      login_center: require('./img/login_center.png')
    }
  },
  mounted () {
    if (document.getElementById('setWatermark')) document.getElementById('setWatermark').style.visibility = 'hidden'
  }
}
</script>

<style lang="less" scoped>
#userLayout {
  height: 100%;

  .container {
    width: 100%;
    min-height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .user-layout-lang {
      width: 100%;
      height: 40px;
      line-height: 44px;
      text-align: right;

      .select-lang-trigger {
        cursor: pointer;
        padding: 12px;
        margin-right: 24px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        vertical-align: middle;
      }
    }

    .user-layout-content {
      width: 960px;
      height: 540px;
      display: flex;
      box-shadow: 0 40px 70px -20px rgba(0, 88, 200, 0.2);

      .show-image {
        width: 480px;
        height: 100%;
        background-repeat:no-repeat!important;
        background-size: 100% 100%!important;
      }

      .main {
        flex: 1;
        background: #fff;
        padding: 40px 80px;
        .main-top {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          .prime-logo {
            width: 128px;
          }
          .split-line {
            width: 0;
            height: 27px;
            border-left: 1px solid #CCD4E1;
            margin: 0 14px;
          }
          > span {
            font-size: 18px;
            color: #00CCA8;
            opacity: 1;
            white-space: nowrap;
            font-weight: 400;
          }
        }

        h1 {
          margin-top: 40px;
          margin-bottom: 0;
          font-family: Saira;
          font-size: 32px;
          font-weight: bold;
        }

        h2 {
          font-size: 23px;
          font-weight: bold;
          color: #0F121B;
          margin-bottom: 30px;
        }
      }
    }
.footer {
      margin: 48px 0 24px 0;
      padding: 0 16px;
      text-align: center;
      .links {
        margin-bottom: 5px;
      }
      a,.copyright {
        font-size: 14px;
        font-family: Noto Sans CJK;
        color: #1CC2FD;
        line-height: 24px;
        font-weight: 400;
        padding: 0 15px;
      }
      .copyright {
        opacity: 1;
        padding-bottom: 20px;
    }
    }
  }
}
</style>
