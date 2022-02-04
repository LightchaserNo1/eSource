<!--
 * @Author: Ling
 * @Descripttion: 图片脱敏
 * @Date: 2021-11-11 16:26:53
-->
<template>
  <div>
    <a-modal
      :visible="visible"
      width="1400"
      centered
      :maskClosable="false"
      :destroyOnClose="true"
      title="图片脱敏"
      okText="提交"
      @cancel="
        () => {
          $emit('cancel')
        }
      "
      @ok="
        () => {
          $emit('ok')
        }
      "
    >
      <a-row>
        <a-col span="12" class="left">
          <img :src="selectImg !== null ? selectImg : null | dealImageUrl" alt="原始图片" />
        </a-col>
        <a-col span="12" class="right">
          <!-- 使用这个签名组件 -->
          <esign
            ref="esign"
            class="mySign"
            id="mySign"
            :width="width - 0"
            :height="height - 0"
            :isCrop="isCrop"
            :lineWidth="Width"
            :lineColor="Color"
            :bgColor.sync="bgColor"
          />
        </a-col>
      </a-row>
      <span slot="footer" class="dialog-footer">
        <span style="margin-right: 15px">
          粗细选择:
          <a-select style="width: 100px; margin-left: 10px" v-model="Width" placeholder="画笔粗细">
            <a-select-option v-for="(i, k) in 20" :key="k" :value="i">
              {{ i }}
            </a-select-option>
          </a-select>
        </span>
        <a-button @click="colorShow = !colorShow" type="primary">颜色选择</a-button>
        <a-button @click="handlePre" type="primary">上一步</a-button>
        <a-button @click="handleGenerate" type="primary">生成图片</a-button>
        <a-button @click="handleReset">清空</a-button>
      </span>
      <a-modal
        width="400px"
        title="颜色选择器"
        :visible="colorShow"
        centered
        :maskClosable="false"
        okText="保存"
        @ok="colorOk"
        @cancel="colorCancel"
      >
        <a-row type="flex" justify="center" align="top">
          <sketch-picker v-model="colors" />
        </a-row>
      </a-modal>
    </a-modal>
  </div>
</template>
<script>
import { updateImage } from '@/api/update/update'
import { Sketch } from 'vue-color'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '400'
    },
    height: {
      type: String,
      default: '300'
    },
    isCrop: {
      type: Boolean,
      default: false
    },
    lineWidth: {
      type: Number,
      default: null
    },
    lineColor: {
      type: String,
      default: '#fff'
    },
    bgColor: {
      type: String,
      default: ''
    },
    selectImg: {
      type: String,
      default: null
    }
  },
  components: {
    'sketch-picker': Sketch
  },
  data () {
    return {
      colorShow: false,
      colors: {
        hex: '#194d33',
        hex8: '#194D33A8',
        hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
        hsv: { h: 150, s: 0.66, v: 0.30, a: 1 },
        rgba: { r: 25, g: 77, b: 51, a: 1 },
        a: 1
      },
      Width: this.lineWidth,
      Color: this.lineColor
    }
  },
  beforeCreate () {

  },
  mounted () {

  },
  methods: {
    // 颜色设置完成
    colorOk () {
      this.Color = this.colors.hex
      this.colorShow = false
    },
    // 颜色设置关闭
    colorCancel () {
      this.colorShow = false
    },
    buildSignImage () {
      const canvas = document.getElementById('mySign')
      const context = canvas.getContext('2d')
      const img = new Image()
      console.log(this.selectImg)
      img.src = process.env.VUE_APP_BASE_IMAGE + this.selectImg
      console.log(img.src)
      img.setAttribute('crossOrigin', 'anonymous')
      // 图片加载完后，将其显示在canvas中
      img.onload = function () {
        context.drawImage(img, 0, 0, 700, 700)
      }
    },
    // 清空画板
    handleReset () {
      this.$refs.esign.reset()
      this.buildSignImage()
    },
    // 上一步
    handlePre () {
      this.$refs.esign.last()
    },
    // 生成图
    handleGenerate () {
      if (this.selectImg === '') return this.$message.warning('图片获取失败,请先上传原始图片')
      const _this = this
      this.$refs.esign.generate().then(res => {
        var blob = _this.dataURLtoBlob(res)
        console.log(blob)
        _this.updateImg(blob)
      }).catch(err => {
        console.log(err)
        _this.$message.warning('请先进行脱敏操作')
      })
    },
    // 将base64转换为blob
    dataURLtoBlob (dataurl) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },

    b64toBlob (b64Data, contentType, sliceSize) {
      contentType = contentType || ''
      sliceSize = sliceSize || 512
      var byteCharacters = atob(b64Data.substring(b64Data.indexOf(',') + 1))
      var byteArrays = []
      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize)
        var byteNumbers = new Array(slice.length)
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }
        var byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }
      var blob = new Blob(byteArrays, { type: contentType })
      return blob
    },
    // 上传图片
    updateImg (imageFile) {
      const params = new FormData()
      params.append('file', imageFile, 'tuomin.png')
      updateImage(params).then(res => {
        this.$message.success('生成脱敏图片成功')
        console.log('生成图片成功：', res)
        this.$emit('ok', res)
      })
    }
  }
}

</script>

<style scoped lang="less">
.left,
.right {
  width: 700px;
}
.left {
  margin-right: 20px;
  img {
    width: 700px;
  }
}
.mySign {
  border: 1px dashed #000;
}
</style>
