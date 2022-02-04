<template>
  <!--    image="./empty.png"
       :image-style="{
      height: '120px',
    }" -->
  <a-empty
    :description="false"
  >
    <div slot="image">
      <img :src="imgSrc" alt="">
    </div>
  </a-empty>
</template>

<script>
export default {
  data () {
    return {
      imgSrc: require('./empty.png')
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped >
.ant-empty {
    position: absolute;
    height:100%;
    width: 100%;
    display: flex;
    vertical-align: middle;
    justify-content: center;
    align-items: center;
    .ant-empty-image {
      height:100px;
      img{
        height:100px;
        margin-top: -50px;
        }
    }
}
</style>
