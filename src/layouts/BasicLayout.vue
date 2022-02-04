<template>
  <div>
    <section class="head">
      <div
        class="logo"
        :class="{ coll: collapsed }">
        <img src="@/assets/WechatIMG244.svg" />
        <span v-if="!collapsed && !$isCenter">智源 iCRC</span>
        <span v-if="!collapsed && $isCenter">智信 iCRA</span>
      </div>
      <div class="nav">
        <div
          class="project-name"
          v-if="!hideMenu">
          <a-icon
            type="menu-fold"
            v-if="!collapsed"
            @click="handleCollapse(true)" />
          <a-icon
            type="menu-unfold"
            v-else
            @click="handleCollapse(false)" />
          <span
            class="page-name"
            v-if="$store.getters.project"
            :title="$store.getters.project.name">
            {{ ($store.getters.project.name.length > 20 ? (this.$store.getters.project.name.split('').splice(0, 30).join('') + '...') : $store.getters.project.name) }}
          </span>
          <div class="role" :style="{'background':( role === 'PI' || role === 'PM'? 'url('+PI+')': role === 'CRC' || role === 'CRA' ? 'url('+CRC+')':'url('+ELSE+')')}" v-show="proId"><span style="marginLeft:8px">当前角色：{{ role }}</span></div>
        </div>
        <div
          class="navs"
          v-else>
          <div class="nav-item active">首页</div>
          <div
            class="nav-item"
            v-if="$store.getters.menus.includes('SYSTEM')"
            @click="$router.push('/org-manage/index')">
            后台配置
          </div>
        </div>
        <right-content />
      </div>
    </section>
    <section class="main">
      <div
        class="menu"
        :class="{ coll: collapsed, hide: hideMenu }">
        <LeftMenu></LeftMenu>
      </div>
      <div class="content">
        <router-view class="content-main" />
        <div class="footer">
          <!-- <div class="links">
            <a
              href="#"
              target="_blank">帮助</a>
            <a
              href="#"
              target="_blank">隐私</a>
            <a
              href="#"
              target="_blank">条款</a>
          </div> -->
          <div class="copyright">
            <a
              href="#"
              target="_blank">Copyright © 璞睿生命科技</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { SIDEBAR_TYPE } from '@/store/mutation-types'

import RightContent from '@/components/GlobalHeader/RightContent'
import LeftMenu from './LeftMenu'

export default {
  name: 'BasicLayout',
  components: {
    RightContent,
    LeftMenu
  },
  data () {
    return {
      role: '',
      proId: this.$store.getters.project && this.$store.getters.project.id,
      CRC: require('./img/CRC.png'),
      PI: require('./img/PI.png'),
      ELSE: require('./img/ELSE.png')
    }
  },
  computed: {
    ...mapState({
      collapsed: state => state.app.sideCollapsed
    }),
    hideMenu () {
      return ['/overview/all', '/overview/ongoing', '/overview/close', '/overview/unstart'].includes(this.$route.path)
    }
  },
  created () {
  },
  mounted () {
    this.role = this.$store.getters.roles && this.$store.getters.roles[0] && this.$store.getters.roles[0].code || ''
  },
  methods: {
    handleCollapse (val) {
      this.$store.commit(SIDEBAR_TYPE, val)
    }
  }
}
</script>

<style lang="less" scoped>
.head {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  display: flex;
  z-index: 999;
  box-shadow: 0px 3px 5px rgba(77,92,111,0.1);
  .logo {
    width: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: @primary-color;
    flex: none;
    transition: width 0.3s;
    &.coll {
      width: 80px;
    }
    img {
      width: 27px;
      height: 27px;
      margin-right: 11px;
    }
    span {
      font-size: 18px;
      font-family: Noto Sans CJK;
      font-weight: bolder;
      color: #ffffff;
    }
  }
  .nav {
    flex: 1;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    .project-name {
      display: flex;
      align-items: center;
    }
    .page-name {
      display: inline-block;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-size: 16px;
      color: #232323;
      margin-left: 20px;
    }
    i {
      cursor: pointer;
    }
    .role {
      background: linear-gradient(180deg, #1CC2FD 0%, #00AFEC 100%);
      padding: 2px 5px;
      margin-left: 20px;
      font-size: 12px;
      font-family: Noto Sans CJK;
      font-weight: bold;
      line-height: 22px;
      color: #FFFFFF;
      background-repeat:no-repeat!important;
      background-size: 100% 100%!important;
    }
    .navs {
      display: flex;
      align-items: center;
      .nav-item {
        position: relative;
        height: 45px;
        line-height: 45px;
        font-size: 16px;
        color: #232323;
        margin-left: 45px;
        cursor: pointer;
        &.active{
          font-weight: bold;
        }
        &.active:after {
            content: '';
            display: block;
            height: 3px;
            background: @primary-color;
            position: absolute;
            left: 0;
            right: 0;
            bottom: -2px;
        }
        &:hover {
          font-weight: bold;
        }
      }
    }
  }
}
.main {
  display: flex;
  padding-top: 45px;
  background: #f1f5f8;
  .menu {
    flex: none;
    width: 180px;
    background: #031f47;
    height: calc(100vh - 45px);
    padding-top: 45px;
    transition: width 0.3s;
    &.coll {
      width: 80px;
    }
    &.hide {
      width: 0;
      overflow: hidden;
    }
  }
  .content {
    flex: 1;
    overflow: auto;
    height: calc(100vh - 45px);
    padding: 20px;
    display: flex;
    flex-direction: column;
    .content-main {
      flex: 1;
    }
    .footer {
      padding: 15px 15px 0;
      text-align: center;
      .links {
        margin-bottom: 5px;
      }
      a {
        color: #8193B1;
      }
    }
  }
}
</style>
