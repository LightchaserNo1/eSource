<template>
  <a-menu
    @select="nowIcon"
    class="new-menu"
    mode="inline"
    theme="dark"
    :inline-collapsed="collapsed"
    :defaultSelectedKeys="[this.$router.history.current.path]"
  >
    <template v-for="(k, i) in menuShow">
      <template v-if="hasMenuPermission(k.name)">
        <a-menu-item :key="k.path" v-if="k.hideChildrenInMenu || !k.children" @click="jump(k)">
          <a-icon :component="k.meta.icon" />
          <span>{{ k.meta.title }}</span>
        </a-menu-item>
        <a-sub-menu :key="i" v-else>
          <span
            slot="title"
          >
            <a-icon :component="k.meta.icon" />
            <span>{{ k.meta.title }}</span>
          </span>
          <template v-for="(m, n) in k.children">
            <a-menu-item :key="`${i}-${n}`" v-if="hasMenuPermission(m.name)" @click="jump(m)">
              <a-icon :component="m.meta.icon" />
              {{ m.meta.title }}
            </a-menu-item>
          </template>
        </a-sub-menu>
      </template>
    </template>
  </a-menu>
</template>

<script>
import { mapState } from 'vuex'
import { asyncRouterMap } from '@/config/router.config'

export default {
  data () {
    return {
      menus: [],
      nowRoute: ''
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.addRouters,
      collapsed: state => state.app.sideCollapsed
    }),
    menuShow () {
      const arr = asyncRouterMap[0].children.filter(v => !v.hidden).map(m => {
        return {
          ...m,
          children: (m.children || []).filter(n => !n.meta.hidden)
        }
      })
      if (!this.$store.getters.project) {
         console.log('arr', arr.find(v => v.name === 'Config').children)
        return arr.find(v => v.name === 'Config').children
      }
      arr.pop()
      // arr.forEach(item => {
      //   if (item.meta.icons && item.meta.selectIcon) {
      //     item.meta.icons = require('../assets/icons/' + item.meta.icons)
      //     item.meta.selectIcon = require('../assets/icons/' + item.meta.selectIcon)
      //   }
      // })
      console.log('arr', arr)
      return arr
    }
  },
  created () {
    const routes = this.mainMenu.find(item => item.path === '/')
    this.menus = (routes && routes.children) || []
    this.nowRoute = this.$router.history.current.path
  },
  methods: {
    jump (row) {
      this.nowRoute = row.path
      this.$router.push(row.path)
    },
    hasMenuPermission (routeName) {
      return this.menus.some(v => {
        if (v.name === routeName) return true
        if (v.children) {
          return v.children.some(m => m.name === routeName)
        }
        return false
      })
    },
    nowIcon (e) {
      console.log(e)
    }
  }
}
</script>

<style lang="less" scoped>
.new-menu {
  background: #031f47;
  ::v-deep {
    .ant-menu-item,
    .ant-menu-submenu,
    .ant-menu-sub > .ant-menu-item {
      margin: 0;
      background: #031f47;
      text-align: center;
      height: 60px;
      line-height: 60px;
      border-left: 2px solid #031f47;
      font-size: 16px !important;
      padding: 0 10px 0 0 !important;
    }
    .ant-menu-sub {
      background: #031f47 !important;
    }

    .ant-menu-item-selected {
      border-left: 3px solid #fff;
      background: #092755 !important;
      box-sizing: border-box;
      color: @primary-color;
      .anticon {
        color: @primary-color;
      }
    }
  }
}
</style>
