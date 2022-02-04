<!--
 * @Author: Ling
 * @Descripttion:  PC签字板
 * @Date: 2021-11-11 16:26:53
-->
<template>
  <div>
    <a-modal
      :visible="visible"
      width="900"
      centered
      :maskClosable="false"
      title="手写签名"
      okText="上传"
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
      <!-- 使用这个签名组件 -->
      <esign
        ref="esign"
        class="mySign"
        :width="width - 0"
        :height="height - 0"
        :isCrop="isCrop"
        :lineWidth="Width"
        :lineColor="Color"
        :bgColor.sync="bgColor"
      />
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
        <a-button @click="handleGenerate" type="primary">生成签字图片</a-button>
        <a-button @click="handleReset">清空画板</a-button>
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
import { dataURLtoFile } from '@/utils/util'
import { Sketch } from 'vue-color'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '800'
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
      default: '#000000'
    },
    bgColor: {
      type: String,
      default: ''
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
      imgSrl: this.resultImg,
      imgsrc: null,
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
    // 清空画板
    handleReset () {
      this.$refs.esign.reset()
    },
    // 上一步
    handlePre () {
      this.$refs.esign.last()
    },
    // 生成签字图
    handleGenerate () {
      this.$refs.esign
        .generate() // 使用生成器调用把签字的图片转换成为base64图片格式
        .then((res) => {
          this.imgSrl = res
        })
        .catch(() => {
          // 画布没有签字时会执行这里提示一下
          this.$notification.warning({
            message: '警告',
            description: `请签名后再生成签字图片`
          })
        })

      // 在这里向后端发请求把转换后的base64文件传给后端，后端接收以后再转换成图片做静态图片存储
      // 当然也可以把base64转成流文件blob格式的，类似上传给后端这样，具体哪种方式看后端要求
      setTimeout(() => {
        // 这里要使用定时器稍微延后以后就能取到base64数据了，当然也可以再加一个确认按钮，如：确认使用这张base64签名图片
        // 点击确认以后，在其回调函数中，再把base64的签名图片传给后端用于存储
        const blob = dataURLtoFile(this.imgSrl, 'image/png')
        this.updateImg(blob)
      }, 200)
      this.dialogVisible = false
    },
    // 上传图片
    updateImg (formData) {
      updateImage(formData).then(res => {
        this.imgsrc = res
        this.$refs.esign.reset() // 重置画板
        this.$message.success('生成签字图片成功')
        this.$emit('ok', this.imgsrc)
      })
    }
  }
}

</script>

<style scoped lang="less">
.mySign {
  border: 1px dashed #000;
}
</style>
