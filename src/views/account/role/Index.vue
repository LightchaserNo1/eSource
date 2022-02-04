<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- add 添加角色 -->
      <div class="add-operator">
        <div class="add-role">角色</div>
        <a-button type="primary" icon="plus" @click="handleAdd()">新建角色</a-button>
      </div>
      <div>
        <div class="role-vip">管理员</div>
        <div v-for="(item, index) in name" :key="index" style="margin-bottom:10px">{{ item }}</div>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
export default {
  name: 'DepartmentList',
  data () {
    return {
      name: ['大哥', '大弟', '2弟']
    }
  },
  mounted () {
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.add-operator {
  display: flex;
  justify-content: space-between;
  width: 20%;
  .add-role {
    margin-bottom: 30px;
    font-size: 20px;
    font-weight: 600;
  }
}
.role-vip{
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 16px;
}
</style>
