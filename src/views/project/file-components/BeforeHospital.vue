<template>
  <!-- 院前资料,与其他不确定的视图，只展示图文材料和上传按钮，且初始没有图文数据，上传了之后才会有。 -->
  <div>
    <div class="top">
      <a-button type="primary" @click="toUpload" v-if="$auth('PROJECT.PROJECT_PATIENT_UPLOAD_FILES')">上传</a-button>
    </div>
    <ImageText :params="imgParams" ref="imageText"/>
  </div>
</template>
<script>
import ImageText from './ImageText.vue'
export default {
  name: 'BeforeHospital',
  props: {
    enrolleeId: {
      required: true,
      type: [String, Number]
    },
    metaCode: {
      required: true,
      type: [String, Number]
    },
    type: {
      required: true,
      type: [String, Number]
    },
    changeTimes: {
      required: true,
      type: [String, Number]
    }
  },
  components: {
    ImageText
  },
  data () {
    return {
      listData: [],
      imgParams: {
        pageNumber: 1,
        pageSize: 1000,
        proId: this.$store.getters.project.id,
        ptsId: this.$props.enrolleeId,
        metaCode: this.$props.metaCode
      }
    }
  },
  created () {

  },
  mounted () {
    // 请求图文材料用的参数
    console.log(this.imgParams)
    this.$refs.imageText.getData()
    this.$bus.$on('getImgAuto', () => {
      this.$refs.imgText.getData()
    })
  },
  beforeDestroy () {
    this.$bus.$off('getImgAuto')
  },
  watch: {
    type (newv) {
      const v = parseInt(newv)
      if (v === 1 || v === 3 || v === 2) {
        this.$refs.imageText.getData()
      }
    },
    changeTimes (newv) {
      this.$refs.imageText.getData()
    }
  },
  methods: {
    clickUpLoad () {
      console.log('跳转到上传页面')
    },
    toUpload () {
      this.$router.push({
        name: 'UploadIndex',
        query: { ...this.$props, ...JSON.parse(sessionStorage.getItem('upLoadParams')) }
      })
    }
  }
}
</script>
<style scoped lang="less">
  .top{
    display: flex;
    flex-direction: row-reverse;
    margin-bottom:20px;
  }
</style>
