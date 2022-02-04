<template>
  <div>
    <a-card :loading="cardLoading" style="min-height:500px;">
      <div class="top">
        <a-button type="primary" @click="toUpload" v-if="$auth('PROJECT.PROJECT_PATIENT_UPLOAD_FILES')">上传</a-button>
      </div>
      <a-tabs :default-active-key="0" @change="callback">
        <a-tab-pane v-for="(item, indexs) in tabList" :key="indexs" :tab="item.name" style="justify-content: flex-start;">
          <a-form-model :model="form" :label-col="{ span: 2 }" :wrapper-col="{ span: 4 }">
            <a-form-model-item label="访视阶段:">
              <a-select v-model="form.Version" @change="changeSelect">
                <a-select-option v-for="itemser in listVersion" :key="itemser.id" :value="itemser.id">
                  {{ itemser.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-form-model>
          <div>
            <div v-if="listData.length>0">
              <a-row :gutter="20">
                <a-col :md="10" :xxl="isCenter ? 8 : 8" style="margin-bottom: 20px;">
                  <a-card>
                    <ul style="overflow-y: scroll; height: 390px; padding-left: 0;">
                      <li
                        @click="clickSelectInfo(index)"
                        v-for="(items,index) in listData"
                        :key="index"
                        :class="activeIndex==index?'active':'normal'">
                        <img :src="items.imageAt | dealImageUrl">
                        <div style="display: flex; align-items: center;">
                          <div>{{ items.createTime | moment('YYYY-MM-DD') }}</div>
                        </div>
                      </li>
                    </ul>
                  </a-card>
                </a-col>
                <a-col :md="14" :xxl="isCenter ? 16 : 8">
                  <a-card>
                    <img :src="showData.imageAt | dealImageUrl" alt="" style="width: 100%; height :357px;">
                    <!-- <div class="search-wrapper" @click="clickBlowUp">
                      <a-icon type="search" style="font-size:24px;color:#3C92FF"/><a>点击放大</a>
                    </div> -->
                    <div style="margin-top: 15px; display: flex; justify-content: space-around;">
                      <a-button
                        @click="clickBlowUp"
                        type="primary"
                        style="width: 168px"
                      >
                        <a-icon type="search" />点击放大
                      </a-button>
                      <a-button
                        v-if="showData.ocrText === null && isCenter"
                        @click="ocr(showData.ocrText, showData.imageAt, showData.id, activeIndex)"
                        type="primary"
                        style="width: 168px;margin-left:15px"
                      >
                        点击识别
                      </a-button>
                    </div>

                  </a-card>
                </a-col>
                <a-col :md="24" :xxl="8" v-if="!isCenter">
                  <a-card >
                    <a-col style="padding: 0 0 20px;">
                      <a-descriptions bordered size="small">
                        <a-descriptions-item label="上传人签名:" :span="3">
                          <img
                            style="width: 60px; height: 60px;"
                            :src="showData.signImg | dealImageUrl"
                            @click.stop="handlePreview(showData.signImg)"
                          />
                        </a-descriptions-item>
                        <a-descriptions-item label="上传人姓名:" :span="3">
                          {{ showData.uploader }}
                        </a-descriptions-item>
                        <a-descriptions-item label="签名时间:" :span="3">
                          {{ showData.createTime | dayjs }}
                        </a-descriptions-item>
                        <a-descriptions-item label="说明:" :span="3">
                          本人承诺上传文件与源文件容一致！
                        </a-descriptions-item>
                      </a-descriptions>
                    </a-col>
                    <a-col style="padding: 0;">
                      <a-descriptions bordered size="small">
                        <a-descriptions-item label="研究人员签名:" :span="3">
                          <img
                            style="width: 60px; height: 60px;"
                            :src="showData.verifySignImg | dealImageUrl"
                            @click.stop="handlePreview(showData.verifySignImg)"
                          />
                        </a-descriptions-item>
                        <a-descriptions-item label="研究人员姓名:" :span="3">
                          {{ showData.reviewerName }}
                        </a-descriptions-item>
                        <a-descriptions-item label="签名时间:" :span="3">
                          {{ showData.reviewerDate | dayjs }}
                        </a-descriptions-item>
                        <a-descriptions-item label="说明:" :span="3">
                          本人承诺上传文件与源文件容一致！
                        </a-descriptions-item>
                      </a-descriptions>
                    </a-col>
                  </a-card>
                </a-col>
              </a-row>
              <a-row :gutter="20" v-if="isCenter">
                <a-col :md="10" :xxl="8">
                  <a-card >
                    <a-textarea :value="showData.ocrText" disabled style="height:404px;" class="words-detail"/>
                  </a-card>
                </a-col>
                <a-col :md="14" :xxl="16">
                  <a-card >
                    <a-col style="padding: 0 0 20px;">
                      <a-descriptions bordered size="small">
                        <a-descriptions-item label="上传人签名:" :span="3">
                          <img
                            style="width: 60px; height: 60px;"
                            :src="showData.signImg | dealImageUrl"
                            @click.stop="handlePreview(showData.signImg)"
                          />
                        </a-descriptions-item>
                        <a-descriptions-item label="上传人姓名:" :span="3">
                          {{ showData.uploader }}
                        </a-descriptions-item>
                        <a-descriptions-item label="签名时间:" :span="3">
                          {{ showData.createTime | dayjs }}
                        </a-descriptions-item>
                        <a-descriptions-item label="说明:" :span="3">
                          本人承诺上传文件与源文件容一致！
                        </a-descriptions-item>
                      </a-descriptions>
                    </a-col>
                    <a-col style="padding: 0;">
                      <a-descriptions bordered size="small">
                        <a-descriptions-item label="研究人员签名:" :span="3">
                          <img
                            style="width: 60px; height: 60px;"
                            :src="showData.verifySignImg | dealImageUrl"
                            @click.stop="handlePreview(showData.verifySignImg)"
                          />
                        </a-descriptions-item>
                        <a-descriptions-item label="研究人员姓名:" :span="3">
                          {{ showData.reviewerName }}
                        </a-descriptions-item>
                        <a-descriptions-item label="签名时间:" :span="3">
                          {{ showData.reviewerDate | dayjs }}
                        </a-descriptions-item>
                        <a-descriptions-item label="说明:" :span="3">
                          本人承诺上传文件与源文件容一致！
                        </a-descriptions-item>
                      </a-descriptions>
                    </a-col>
                  </a-card>
                </a-col>
              </a-row>
            </div>
            <div v-else>
              <a-empty/>
            </div>
            <a-modal
              :width="850"
              :visible="visible"
              :footer="null"
              title="查看图片"
              @ok="handleModalOk"
              @cancel="handleModalCancel">
              <img :src="showData.imageAt | dealImageUrl" alt="" style="width:800px;height:500px;">
            </a-modal>
            <a-modal :visible="previewVisible" :footer="null" @cancel="() => {previewVisible = false}">
              <img alt="example" style="width: 100%" :src="previewImage | dealImageUrl" />
            </a-modal>
          </div>
          <ocrPane
            ref="ocrPane"
            :visible.sync="ocrVisible"
            :ocrText="ocrText"
            :selectImg.sync="selectImg"
            @cancel="cancelOcrPane"
            @ok="okOcrPane"
          ></ocrPane>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>
<script>
import ocrPane from '../upload/components/ocrPane.vue'
import { getTabList, getMaterialList } from '@/api/patient/certifiedApi.js'
import { planTheList } from '@/api/patient/visitplan.js'
import { ocrDis, updateOcr } from '@/api/update/update'
export default {
  props: {
    ptsId: {
      required: true,
      default: 0,
      type: [Number, String]
    }
  },
  components: {
    ocrPane
  },
  data () {
    return {
      ocrVisible: false,
      selectImg: '', // 选中脱敏图片路径
      ocrText: '', // ocr识别文本
      showOcr: false, // 是否显示orc按钮
      cardLoading: false,
      tabList: [],
      listData: [],
      showData: {},
      activeIndex: 0,
      visible: false,
      previewVisible: false,
      previewImage: '',
      no: '',
      isCenter: this.$isCenter,
      form: {},
      listVersion: []
    }
  },
  mounted () {
    this.getTab()
  },
  methods: {
    changeSelect (e) {
      this.getMaterial()
    },
  // 获取访视版本
    getvisit () {
      planTheList({ proId: this.$store.getters.project.id })
      .then(res => {
        console.log(res)
        this.listVersion = res
        this.form = { ...this.form, Version: res[0].id }
        this.form.Version = res[0].id
        this.getMaterial()
      })
      .catch(row => {
        console.log(row)
      })
    },
    ocr (ocrText, src, itemId, index) {
      this.selectImg = this.$options.filters.dealImageUrl(src)
      if (ocrText) {
        this.ocrText = ocrText
        this.ocrVisible = true
      } else {
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
        this.ocrVisible = true
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
      this.getMaterial()
    },
    okOcrPane () {
      this.ocrVisible = false
      this.getMaterial()
    },
    // 切换tab事件
    callback (key) {
      console.log(key)
      this.no = this.tabList[key].no
      this.getvisit()
    },
    // 获取tab列表
    getTab () {
      getTabList({ proId: this.$store.getters.project.id })
      .then((res) => {
        console.log(res)
        if (res || res.length) {
          this.tabList = res
          this.no = this.tabList[0].no
          this.getvisit()
        }
      })
      .catch((row) => {
        console.log(row)
      })
    },
    // 获取资料列表
    getMaterial () {
      const value = {
        proId: this.$store.getters.project.id,
        ptsId: this.ptsId,
        auditStatus: 1,
        typeNo: this.no,
        trialStageNo: this.form.Version
      }
      console.log(value)
      getMaterialList({ ...value })
      .then((res) => {
        console.log(res)
        this.listData = []
        if (res && res.temp && res.temp.length) {
          this.listData = res.temp
          this.showData = this.listData[0]
          this.selectImg = this.showData.imageAt
          this.showOcr = this.showData.ocrText === null
        }
      })
      .catch((row) => {
        console.log(row)
      })
    },
    // 列表单击事件
    clickSelectInfo (index) {
      this.activeIndex = index
      this.showData = this.listData[index]
    },
    // 图片放大
    clickBlowUp () {
      this.visible = true
    },
    // 放大弹窗控件
    handleModalOk () {
      this.visible = false
    },
    handleModalCancel () {
      this.visible = false
    },
    // 单击放大签字
    handlePreview (src) {
      this.previewImage = src
      console.log(this.previewImage)
      this.previewVisible = true
    },
    // 上传跳转页面
    toUpload () {
      console.log({ ...JSON.parse(sessionStorage.getItem('upLoadParams')) })
      this.$router.push({
        name: 'UploadIndex',
        query: { ...JSON.parse(sessionStorage.getItem('upLoadParams')) }
      })
    }
  }
}
</script>
<style scoped lang="less">
  .top{
    display: flex;
    flex-direction: row-reverse;
  }
.active {
    cursor: pointer;
    margin:4px 0;
    background-color: #EDF9FF;
    color:#3C71FA;
    list-style: none;
    display: flex;
    img{
      display: block;
      width:90px;
      margin-right:20px;
      height: 60px;
    }
  }
  .normal {
    margin:4px 0;
    cursor: pointer;
    list-style: none;
    display: flex;
    img{
      width:90px;
      margin-right:20px;
      height: 60px;
    }
  }
  .search-wrapper{
    display: flex;
    cursor: pointer;
    align-items: center;
    margin-top:30px;
    justify-content: center;
  }
  .words-detail[disabled]{
    background-color: #fff;
    color:#000;
    cursor:text;
  }
  .esignItem {
    margin-bottom: 8px;
    img {
      width: 60px;
      height: 60px;
    }
  }
</style>
