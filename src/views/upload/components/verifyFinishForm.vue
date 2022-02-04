<template>
  <div>
    <a-checkbox
class="selectAll"
v-if="auditStatus"
:checked="selectAll"
@change="onChange">
      <span>全选</span>
    </a-checkbox>
    <div
v-for="(item, index) in formData"
:key="index"
class="itemBorder">
      <div :class="['main',item.isSelect?'border-select':'']">
        <div :class="['main-check',item.isSelect?'main-check-select':'']">
          <a-checkbox
            ref="checkBox"
            :checked="item.isSelect"
            @change="(val) => onChangeSingel(val, index)" />
        </div>
        <div
class="main-img"
:style="{ backgroundImage: `url(${$options.filters.dealImageUrl(item.imageAt)})` }">
          <div
class="big"
@click.stop="handlePreview(item.imageAt)">
            <a-icon type="zoom-in" />
            点击放大
          </div>
        </div>
        <table>
          <tr>
            <td>核证副本类型</td>
            <td>
              {{ getTypeNoName(item.typeNo) }}
            </td>
            <td>访视阶段</td>
            <td>
              {{ getTrialNoName(item.trialStageNo) }}
            </td>
          </tr>
          <tr>
            <td>上传人姓名</td>
            <td>{{ item.uploader }}</td>
            <td>单项审核</td>
            <td>
              <a-button
              style="width: 120px"
              type="primary"
              @click="() => $emit('showModal', 1, index)">审核</a-button>
            </td>
          </tr>
          <tr>
            <td>上传人签字</td>
            <td>
              <img
:src="item.signImg | dealImageUrl"
@click.stop="handlePreview(item.signImg)" />
            </td>
            <td>拒绝审核</td>
            <td>
              <a-button
              style="width: 120px;color:red;border:1px solid red"
              @click="() => $emit('verifyCerSingel', index)">
                不通过
              </a-button>
            </td>
          </tr>
          <tr>
            <td>签名时间</td>
            <td>{{ item.createTime | dayjs }}</td>
            <td rowspan="2">备注信息</td>
            <td rowspan="2">
              <a-input
            type="textarea"
            style="width: 90%"
            v-model="item.remarks">
            </a-input>
            </td>

          </tr>
          <tr>
            <td>说明</td>
            <td>本人承诺上传文件与源文件容一致！</td>
          </tr>
        </table>
      </div>
    </div>
    <a-modal
:width="1200"
style="text-align: center"
:visible="previewVisible"
:footer="null"
@cancel="handleCancel">
      <img
alt="example"
style="width: 100%"
:src="previewImage | dealImageUrl" />
    </a-modal>
  </div>
</template>
<script>
import { ocrDis } from '@/api/update/update'
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
    },
    auditStatus: {
      type: Boolean
    }
  },
  data () {
    return {
      previewVisible: false, // 是否展示预览
      previewImage: '',
      loading: false,
      ocrVisible: false,
      selectImg: '', // 选中脱敏图片路径
      ocrText: '', // ocr识别文本
      length: this.formData.length,
      selectAll: false
    }
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
    // 全选
    onChange (e) {
      this.selectAll = e.target.checked
      const arr = this.formData.map(item => {
        const obj = {
          ...item
        }
        obj.isSelect = e.target.checked
        return obj
      })
      this.$emit('newFormdata', arr)
    },
    onChangeInput (e, index) {
      console.log(e)
      console.log(index)
    },
    onChangeSingel (e, index) {
      this.formData[index].isSelect = e.target.checked
      this.$nextTick(() => {
        setTimeout(() => {
          const arr = this.$refs.checkBox.filter(item => {
            return item.checked === true
          })
          console.log(arr.length === this.formData.length)
          if (arr.length === this.formData.length) {
            this.selectAll = true
          } else {
            this.selectAll = false
          }
        }, 50)
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    handlePreview (src) {
      this.previewImage = src
      console.log(this.previewImage)
      this.previewVisible = true
    },
    ocr (src) {
      this.selectImg = src
      this.loading = true
      this.loadImage().then(res => {
        this.getocrText(res)
      }
      )
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
    getocrText (form) {
      ocrDis(form).then(res => {
        this.ocrText = res
        this.ocrVisible = true
        this.loading = false
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
    }
  }
}
</script>

<style scoped lang="less">
.selectAll{
  margin-left:15px
}

.itemBorder {
  background: #f6f9fb;
  border-radius: 2px;
  padding: 20px;
  margin-bottom: 15px;
  .main {
    border: 1px solid transparent;
    display: flex;
    align-items: center;
  }
  .border-select{
  border: 1px solid #1CC2FD;
  box-sizing: border-box;
}
.main-check{
    position: relative;
    width: 60px;
    height:210px;
    display: flex;
    align-items: center;
    justify-content: center;
    ::deep .ant-checkbox-inner{
      border:1px solid #8193B1
    }
}
.main-check-select{
  background: rgba(29, 186, 248, 0.1);
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
        border: 1px solid #d6dfec;
        height: 38px;
        line-height: 38px;
        padding-left: 20px;
        color: #4d5c6f;
        background: #fff;
        text-align: left;
        width: 25%;

        &:nth-child(2n + 1) {
          width: 10%;
          color: #0f121b;
          background: rgba(241, 245, 248, 0.6);
          padding-right: 20px;
          text-align: right;
        }
        img {
          width: 99px;
          height: 49px;
        }
      }
    }
  }
  .main-bt {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    margin-top: 15px;
    .txt {
      .txt-value {
        margin-bottom: 10px;
      }
    }
    .rest {
      display: flex;
      .rest-item {
        margin-left: 20px;
        span {
          margin-bottom: 10px;
        }
        .rest-btn {
          padding: 6px 24px;
          background: #8193b1;
          min-width: 80px;
          min-height: 30px;
          border-radius: 2px;
          color: #fff;
        }
      }
    }
  }
}
</style>
