<template>
  <div>
    <a-row v-for="(item, index) in formData" :key="index" class="itemBorder" justify="center" align="middle">
      <a-col :span="8">
        <div class="itemWrap" style="margin-bottom: 15px">
          <span class="title"><span class="red">*</span>核证副本</span>
          <a-select
            style="width: 100%"
            v-model="item.typeNo"
            placeholder="请选择核证副本"
            default-value=""
            @change="(val) => handleChange(val, index, 0)"
          >
            <a-select-option
              v-for="listItem in listTypeList"
              :key="listItem.no"
              :title="listItem.name"
              :value="listItem.no"
            >{{ listItem.name }}</a-select-option
            >
          </a-select>
        </div>
        <div class="itemWrap">
          <span class="title"><span class="red">*</span>访视阶段</span>
          <a-select
            style="width: 100%"
            v-model="item.trialStageNo"
            placeholder="请选择访视阶段"
            @change="(val) => handleChange(val, index, 1)"
          >
            <a-select-option
              v-for="(trilItem, trilIndex) in listTrilStage"
              :title="trilItem.name"
              :key="trilIndex"
              :value="trilItem.id + ''"
            >
              {{ trilItem.name }}
            </a-select-option>
          </a-select>
        </div>
      </a-col>
      <a-col :span="8" class="upload-wrap">
        <span><span class="red">*</span>上传图片</span>
        <a-upload
          list-type="picture-card"
          class="upload-field"
          :before-upload="beforeUpload"
          :show-upload-list="false"
          :customRequest="(file) => doImgUpload(file, index)"
          accept="image/jpeg,image/jpg,image/png"
        >
          <img
            v-if="item.imageOriginal"
            :src="item.imageOriginal | dealImageUrl"
            alt="picture"
            @click.stop="handlePreview(item.imageOriginal)"
          />
          <p v-if="item.imageOriginal" class="opt">
            <span @click.stop="handlePreview(item.imageOriginal)">放大</span>
            <span style="margin-left: 10px" @click.stop="deleteImg(index)">删除</span>
          </p>
          <img src="../img/upload-empty.png" v-else />
        </a-upload>
      </a-col>

      <a-col :span="8" class="upload-wrap">
        <span><span class="red">*</span>图片脱敏</span>
        <div class="tuoMing" v-if="!item.imageAt" @click="handleTuomin(item.imageOriginal, index)">
          <img src="../img/tuom.png" />
        </div>
        <div class="tuoMing" v-else>
          <div style="text-align: center">
            <img
              v-if="item.imageAt"
              :src="item.imageAt | dealImageUrl"
              alt="picture"
              @click.stop="handlePreview(item.imageAt)"
            />
            <p v-if="item.imageAt">
              <span @click.stop="deleteImageAt(index)">删除</span>
            </p>
          </div>
        </div>
      </a-col>
      <div class="remove" v-if="formData.length > 1">
        <a-icon class="dynamic-delete-button" type="delete" @click="() => remove(index)" />
      </div>
    </a-row>
    <a-row type="flex" justify="center" align="top">
      <a-button type="primary" style="width: 200px" @click="add"> <a-icon type="plus" />添加行</a-button>
    </a-row>
    <a-modal :width="1200" style="text-align:center" :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width:100%" :src="previewImage | dealImageUrl" />
    </a-modal>
    <tuomingPane
      :key="componentKey"
      ref="tuomingPane"
      :visible.sync="tuomingVisible"
      :width="width"
      :height="height"
      :lineWidth="lineWidth"
      :lineColor="lineColor"
      :bgColor="bgColor"
      :resultImg.sync="resultImg"
      :selectImg.sync="selectImg"
      :isCrop="isCrop"
      @cancel="cancelTuoming"
      @ok="okTuoming"
    ></tuomingPane>
  </div>
</template>
<script>
import tuomingPane from './tuomingPane.vue'
import { dataURLtoFile } from '@/utils/util'
import { updateImage } from '@/api/update/update'
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
    tuomingPane
  },
  data () {
    return {
      previewVisible: false, // 是否展示预览
      previewImage: '',
      loading: false,
      componentKey: 99999,
      selectIndex: '', // 选中图片index
      selectImg: '', // 选中脱敏图片路径
      resultImg: '', // 最终画布生成的base64图片路径
      tuomingVisible: false, // 签字板是否开启
      width: '700', // 签字板宽度
      height: '700', // 签字板高度
      lineWidth: 8, // 画笔的线条粗细
      lineColor: '#fff', // 画笔的颜色
      bgColor: '', // 画布的背景颜色
      isCrop: false // 是否裁剪，在画布设定尺寸基础上裁掉四周空白部分
    }
  },
  beforeCreate () {

  },
  beforeMount () {
  },
  mounted () {
  },
  methods: {
    handleCancel () {
      this.previewVisible = false
    },
    beforeUpload (file) {
      const isImg = /^image\/(jpeg|png|jpg)$/.test(file.type)
      if (!isImg) {
        this.$message.error('只能上传jpeg、png、jpgs图片格式!')
      }
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isLt20M) {
        this.$message.error('图片需小于20MB!')
      }
      return isImg && isLt20M
    },
    handlePreview (src) {
      this.previewImage = src
      console.log(this.previewImage)
      this.previewVisible = true
    },
    deleteImg (index) {
      this.formData[index].imageOriginal = ''
      this.formData[index].imageAt = ''
    },
    deleteImageAt (index) {
      this.formData[index].imageAt = ''
    },
    getValue (key, index, type) {
      let aArr = []
      if (type === 0) {
        aArr = this.listTypeList.filter(item => item.no + '' === key)
        console.log(aArr[0].name)
        this.formData[index].typeName = aArr[0].name
      } else {
        aArr = this.listTrilStage.filter(item => item.id + '' === key)
        console.log(aArr[0].name)
        this.formData[index].trialStageName = aArr[0].name
      }
    },
    handleChange (value, index, type) {
      this.getValue(value, index, type)
    },
    // 图片上传
    doImgUpload (options, index) {
      const { file } = options
      // start：进度条相关
      // 伪装成 handleChange里面的图片上传状态
      const reader = new FileReader()
      reader.readAsDataURL(file) // 读取图片文件
      reader.onload = (file) => {
        const blob = dataURLtoFile(file.target.result, 'image/png')
        // 上传图片的base64编码，调接口后，返回 imageId
        updateImage(blob)
          .then((res) => {
            this.formData[index].imageOriginal = res
          })
          .catch((e) => {
            console.log(e)
          })
      }
    },
    handleTuomin (url, index) {
      this.selectIndex = index // 选中图片index
      this.selectImg = url
      this.tuomingVisible = true
      this.$nextTick(() => {
        this.$refs.tuomingPane.buildSignImage()
      })
    },
    cancelTuoming () {
      this.tuomingVisible = false
      this.selectImg = ''
    },
    okTuoming (src) {
      this.tuomingVisible = false
      this.formData[this.selectIndex].imageAt = src
    },
    remove (k) {
      if (k < 1) {
        return false
      } else {
        this.formData.splice(k, 1)
        console.log(this.formData)
      }
    },

    add () {
      const item = {
        imageOriginal: '', // 核证原始图片
        imageAt: '', // 脱敏后图片
        typeNo: undefined, // 核证副本号
        typeName: '', // 核证副本名称
        trialStageNo: undefined, // 访视阶段号
        trialStageName: '', // 访视阶段名称
        signImg: '', // 上传人签名图片
        ptsId: '', // 受试者ID
        proId: this.$store.getters.project.id || null // 项目ID
      }
      this.formData.push(item)
    }
  }
}
</script>

<style scoped lang="less">
.icon {
  font-size: 6px;
}
.itemBorder {
  background: #f6f9fb;
  padding: 20px;
  border-radius: 2px;
  margin-bottom: 15px;
  position: relative;
  .remove {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 46px;
    background: #abb8ce;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #fff;
    .dynamic-delete-button {
      font-size: 24px;
      transition: all 0.3s;
    }
    .dynamic-delete-button[disabled] {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  .upload-field {
    ::v-deep .ant-upload {
      padding: 0;
      position: relative;
      display: block!important;
    }
    .opt {
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.4);
      color: #fff;
    }
  }

  .tuoMing {
    position: relative;
    cursor: pointer;
    display: flex;
    width: 104px;
    height: 104px;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
      height: 100%;
    }
    p {
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.4);
      color: #fff;
      margin-bottom: 0;
    }
  }

  .upload-wrap {
    display: flex;
    align-items: flex-start;
    > span {
      flex: none;
      font-size: 12px;
      margin-right: 20px;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
.itemWrap {
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .title {
    flex: none;
    text-align: center;
    margin-right: 5px;
  }
}
.red {
  color: red;
}
</style>
