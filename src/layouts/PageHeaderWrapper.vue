<template>
  <div>
    <div class="page-nav">
      <div @click="goback()" style="margin-right: 1rem; cursor: pointer;">
        <a-icon type="left" />
        返回上一级
      </div>
      <a-breadcrumb>
        <a-breadcrumb-item v-for="(k, i) in breadcrumb" :key="i">
          <router-link :to="k.path">{{ k.meta.title }}</router-link>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { asyncRouterMap } from '@/config/router.config'

export default {
  data () {
    return {
      breadcrumb: []
    }
  },
  created () {
    this.breadcrumb = this.findRoute('', asyncRouterMap[0].children)
    this.breadcrumb.unshift(asyncRouterMap[0])
  },
  methods: {
    findRoute (arr, targetArr) {
      if (!arr) {
        arr = []
      }
      for (const v of targetArr) {
        const arr2 = JSON.parse(JSON.stringify(arr))
        if (v.name === this.$route.name) {
          arr2.push(v)
          return arr2
        } else if (v.children) {
          arr2.push(v)
          const res = this.findRoute(arr2, v.children)
          if (res) return res
        }
      }
    },
    goback () {
      console.log(this.$router.history.current.name, this.$isCenter)
      if (this.$router.history.current.name === 'ProjectUpdate' ||
        this.$router.history.current.name === 'ProjectDetail' ||
        (this.$router.history.current.name === 'ProjectWatch' && this.$isCenter) ||
        (this.$router.history.current.name === 'sickLoop' && !this.$isCenter)
      ) {
        this.$forceUpdate()
        this.$router.push({ name: 'overview' })
      } else {
        this.$router.back()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.page-nav {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  i {
    cursor: pointer;
    margin-right: 6px;
  }
}
</style>
