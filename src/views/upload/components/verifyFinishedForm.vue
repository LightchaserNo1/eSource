<template>
  <div v-if="formData.length">
    <div
      v-for="(item, index) in formData"
      :key="index"
      class="itemBorder"
    >
      <div class="main">
        <div
          class="main-img"
          @click.stop="handlePreview(item.imageAt)"
          :style="{backgroundImage: `url(${$options.filters.dealImageUrl(item.imageAt)})`}">
            <div
            class="big"
            >
            <a-icon type="zoom-in" />
            点击放大
          </div>
        </div>
        <table>
          <tr>
            <td>核证副本类型</td>
            <td>{{ getTypeNoName(item.typeNo) }}</td>
            <td>访视阶段</td>
            <td> {{ getTrialNoName(item.trialStageNo) }}</td>
          </tr>
          <tr>
            <td>上传人签字</td>
            <td>
            <img
              :src="item.signImg | dealImageUrl"
              @click.stop="handlePreview(item.signImg)"
              />
            </td>
            <td>研究人员签字</td>
            <td>
            <img
               v-if="item.auditStatus === 1 && item.verifySignImg"
              :src="item.verifySignImg | dealImageUrl"
              @click.stop="handlePreview(item.verifySignImg)"
              />
            </td>
          </tr>
          <tr>
            <td>上传人姓名</td>
            <td>{{ item.uploader?item.uploader:'' }}</td>
            <td>上传人姓名</td>
            <td>
              <span v-if="item.auditStatus === 1">{{ item.reviewerName?item.reviewerName:'' }}</span>
            </td>
          </tr>
          <tr>
            <td>签名时间</td>
            <td>{{ item.createTime | dayjs }}</td>
            <td>签名时间</td>
            <td>
              <span v-if="item.auditStatus === 1 && item.reviewerDate">{{ item.reviewerDate | dayjs }}</span>
            </td>
          </tr>
          <tr>
            <td>说明</td>
            <td>本人承诺上传文件与源文件容一致！</td>
            <td>说明</td>
            <td>
              <span v-if="item.auditStatus === 1 && item.reviewerDate">本人承诺上传文件与源文件容一致！</span>
            </td>
          </tr>
        </table>
        </div>
        <div
style="margin-top:10px"
v-if="item.auditOpinion">备注：{{ item.auditOpinion }}</div>
    </div>

    <a-modal
      :width="1200"
      style="text-align:center"
      :visible="previewVisible"
      :footer="null"
      @cancel="handleCancel">
      <img
        alt="example"
        style="width: 100%"
        :src="previewImage" />
    </a-modal>
    <ocrPane
      ref="ocrPane"
      :visible.sync="ocrVisible"
      :ocrText="ocrText"
      :selectImg.sync="selectImg"
      @cancel="cancelOcrPane"
      @ok="okOcrPane"
    ></ocrPane>
  </div>
  <a-empty
style="padding-top: 150px;"
v-else />
</template>
<script>
import ocrPane from './ocrPane.vue'
import { ocrDis, updateOcr } from '@/api/update/update'
export default {
  props: {
    listTypeList: {
      type: Array,
      default: function () {
        return []
      }
    },
    listTrilStage: {
      type: Array,
      default: function () {
        return []
      }
    },
    formData: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  components: {
    ocrPane
  },
  data () {
    return {
      previewVisible: false, // 是否展示预览
      previewImage: '',
      loading: false,
      ocrVisible: false,
      selectImg: '', // 选中脱敏图片路径
      ocrText: '' // ocr识别文本
    }
  },
  beforeCreate () {

  },
  beforeMount () {
  },
  mounted () {
  },
  methods: {
    getTypeNoName (typeNo) {
      if (this.listTypeList.length === 0) return ''
      const res = this.listTypeList.find(v => v.no === typeNo) || {}
      return res.name
    },
    getTrialNoName (id) {
      if (this.listTrilStage.length === 0) return ''
      const res = this.listTrilStage.find(v => v.id + '' === id) || {}
      return res.name
    },
    handleCancel () {
      this.previewVisible = false
    },
    handlePreview (src) {
      this.previewImage = process.env.VUE_APP_BASE_IMAGE + src
      console.log(this.previewImage)
      this.previewVisible = true
    },
    ocr (ocrText, src, itemId, index) {
      this.selectImg = this.$options.filters.dealImageUrl(src)
      if (ocrText) {
        this.ocrText = ocrText
        this.ocrVisible = true
      } else {
        this.formData[index].loading = true
        this.loadImage().then(res => {
          this.getocrText(res, itemId, index)
        }
        )
      }
    },
    // 获取脱敏图片并将其转换成formData格式
    loadImage () {
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = this.selectImg
        const self = this
        image.setAttribute('crossOrigin', 'Anonymous')
        image.onload = () => {
          var base64 = self.getBase64Image(image)
          const form = new FormData()
          form.append('bizType', '9')
          // 转换base64到file
          const file = self.btof(base64, 'ocrPic')
          form.append('file', file)
          resolve(form)
        }
        image.onerror = reject
      })
    },
    getocrText (form, itemId, index) {
      ocrDis(form).then(res => {
        this.ocrText = res
        this.formData[index].ocrText = res
        this.ocrVisible = true
        this.formData[index].loading = false
        // 提交ocr
        const params = [{
          id: itemId,
          ocrText: this.ocrText
        }]
        const formData = new FormData()
        formData.append('cerInfnos', JSON.stringify(params))
        // 目前接口有问题
        updateOcr(formData).then(res => {
          console.log(res)
        })
      })
    },
    /** url 转换成img */
    getBase64Image (img) {
      var canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, img.width, img.height)
      var ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
      var dataURL = canvas.toDataURL('image/' + ext)

      return dataURL
    },
    btof (data, fileName) {
      const dataArr = data.split(',')
      const byteString = atob(dataArr[1])
      const options = {
        type: 'image/jpeg',
        endings: 'native'
      }
      const u8Arr = new Uint8Array(byteString.length)
      for (let i = 0; i < byteString.length; i++) {
        u8Arr[i] = byteString.charCodeAt(i)
      }
      return new File([u8Arr], fileName + '.png', options)
    },
    cancelOcrPane () {
      this.ocrVisible = false
    },
    okOcrPane () {
      this.ocrVisible = false
    },
    remove (k) {
      this.formData.splice(k, 1)
      console.log(this.formData)
    }
  }
}
</script>

<style scoped lang="less">
.itemBorder {
  background: #F6F9FB;
  border-radius: 2px;
  padding: 20px;
  margin-bottom: 15px;
  .main {
  display: flex;
  align-items: center;
    }
  .main-img {
    position: relative;
    width: 210px;
    height: 210px;
    background-size: 100% 100%;
    cursor: pointer;
    margin-right: 17px;
    .big {
      position: absolute;
      left: 0;
      right: 0;
      height: 38px;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 0px 0px 2px 2px;
      color: #fff;
      text-align: center;
      line-height: 38px;
    }
  }
  table {
    flex: 1;
    tr {
      width: 100%;
      td {
        border: 1px solid #D6DFEC;
        height: 38px;
        line-height: 38px;
        padding-left: 20px;
        color: #4D5C6F;
        background: #fff;
        text-align: left;
        width: 32%;

        &:nth-child(2n+1) {
          width: 18%;
          color: #0F121B;
          background: rgba(241, 245, 248, 0.6);
          padding-right: 20px;
          text-align: right;
        }
        img {
          width: 99px;
          height: 49px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
