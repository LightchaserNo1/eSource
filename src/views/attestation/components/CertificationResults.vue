<template>
  <div class="content">
    <h3 v-if="isAuthSuccess">您已成功完成实名认证</h3>
    <h3 v-else>实名认证失败</h3>
    <div class="user-info">
      <div class="info-item">
        <span class="item-hint">姓名</span>
        <span class="item-data">{{ userInfo.name }}</span>
      </div>
      <div class="info-item">
        <span class="item-hint">手机号</span>
        <span class="item-data">{{ userInfo.phone }}</span>
      </div>
      <div class="info-item">
        <span class="item-hint">身份证号</span>
        <span class="item-data">{{ userInfo.idCard }}</span>
      </div>
    </div>
    <a-button v-if="!isAuthSuccess" style="margin-top: 20px;" type="primary" @click="clickRestart">重试</a-button>
  </div>
</template>
<script>
export default {
  props: {
    isAuthSuccess: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      userInfo: null
    }
  },
  created () {
    const params = this.$route.query.params
    if (params) {
      this.userInfo = JSON.parse(decodeURI(params))
    }
  },
  mounted () {},
  methods: {
    clickRestart () {
      location.reload()
    }
  }
}
</script>
<style lang="less" scoped>
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 40px;
    h3 {
      font-size: 18px;
      color: #0A1422;
      font-weight: 600;
    }
    .user-info {
      width: 335px;
      margin: 20px auto 0;
      background-color: #fff;
      .info-item {
        display: flex;
        align-items: center;
        height: 50px;
        border-bottom: 1px solid #F1F3F6;
      }
      .item-hint {
        width: 100px;
      }
      .item-data {
        flex: 1;
      }
    }
    .relevance-btn {
      width: 280px;
      height: 44px;
      margin-top: 200px;
      background-color: #0FD3E5;
      text-align: center;
      line-height: 44px;
      color: #FFFFFF;
      font-size: 16px;
      font-weight: 600;
      border: none;
    }
  }
</style>
