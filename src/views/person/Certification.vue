<!-- 2.实名认证 -->
<template>
  <div>
    <!-- 信息说明 -->
    <!-- <a-row :gutter="48">
      <a-col :md="18" :sm="24" :offset="8">
        <vue-qr
          v-if="qrUrl"
          rclass="qrcode"
          ref="qrCodeUrl"
          style="margin: 20px 0"
          :text="qrUrl"
          :size="150"></vue-qr>
      </a-col>
    </a-row>
    <a-row :gutter="48">
      <a-col :md="18" :sm="24" :offset="8">
        <span>本过程需要您本人亲自完成，预计需要1分钟</span>
        <br/>
        <span>您提交的资料只会用于实名认证审核</span>
        <br/>
        <span>实名认证将会用于eConsent、ePayment等业务功能</span>
      </a-col>
    </a-row> -->
    <!-- <center>
      <div class="card-view">
        <div class="card-view-label">姓名:</div>
        <div>{{ info.name }}</div>
      </div>
      <div class="card-view">
        <div class="card-view-label">身份证:</div>
        <div>{{ info.idCard }}</div>
      </div>
      <div class="card-view">
        <div class="card-view-label">手机号:</div>
        <div>{{ info.phone }}</div>
      </div>
    </center> -->
    <a-row style="padding-top:80px" :gutter="48">
      <a-col :md="18" :sm="24" :offset="8">
        <div class="card-view">
          <div class="card-view-label">姓名:</div>
          <div>{{ info.name }}</div>
        </div>
        <div class="card-view">
          <div class="card-view-label">身份证:</div>
          <div>{{ info.idCard }}</div>
        </div>
        <div class="card-view">
          <div class="card-view-label">手机号:</div>
          <div>{{ info.phone }}</div>
        </div>
      </a-col>
    </a-row>
    <a-row style="margin-top:20px" :gutter="48">
      <a-col :md="18" :sm="24" :offset="8">
        <a-button type="primary" :style="{ 'margin': '50px 50px 0 0'}" @click="validAction">{{ isValid == 1 ? '返回上一步' : '点击实名认证' }}</a-button>
        <a-button v-if="type == 0" @click="nextStep">跳过</a-button>
      </a-col>
    </a-row>

  </div>
</template>

<script>
// import vueQr from 'vue-qr'
// import { getSendValidateVideo } from '@/api/attestation/attestation'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  // components: { vueQr },
  name: '',
  props: {
    info: {
      type: Object,
      default: null
    },
    type: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      httpUrl: '',
      timeout: null,
      qrUrl: '',
      isValid: 0 // 1认证失败
    }
  },
  mounted () {
    this.httpUrl = window.location.origin + '/'
    // this.creatQrCode()
    // this.timeout = setInterval(() => {
    //   getSendValidateVideo().then(res => {
    //     if (parseInt(res) === 1) {
    //       clearInterval(this.timeout)
    //       this.$message.success('实名认证已通过')
    //       this.nextStep()
    //     }
    //   })
    // }, 2000)
  },
  // destroyed () {
  //   if (this.timeout != null) {
  //     clearInterval(this.timeout)
  //   }
  // },
  methods: {
    validAction () {
      if (this.isValid === 1) {
        this.$emit('backStep', 1)
      } else {
        if (this.info.status === false) {
          this.isValid = 1
          this.$notification.error({
            message: '实名认证失败',
            description: '实名认证信息不匹配！'
          })
        } else {
          this.$notification.success({
            message: '实名认证成功'
          })
          this.nextStep()
        }
      }
    },
    creatQrCode () {
      this.qrUrl = this.httpUrl + 'attestation?params=' + this.getParams()
      // const qrcode = new QRCode(this.$refs.qrCodeUrl, {
      //   text: this.httpUrl + 'attestation?params=' + this.getParams(),
      //   width: 150,
      //   height: 150,
      //   colorDark: '#000000',
      //   colorLight: '#ffffff',
      //   correctLevel: QRCode.CorrectLevel.H
      // })
      // console.log(qrcode)
    },
    // 获取参数
    getParams () {
      const param = {
        name: this.info.name,
        idCard: this.info.idCard,
        phone: this.info.phone,
        token: storage.get(ACCESS_TOKEN)
      }
      return encodeURI(JSON.stringify(param))
    },
    nextStep () {
      this.$emit('nextStep', 1)
    }
  }
}
</script>

<style lang="less" scoped>
.qrcode{
  display: inline-block;
  img {
      width: 132px;
      height: 132px;
      background-color: #fff; //设置白色背景色
      padding: 6px; // 利用padding的特性，挤出白边
      box-sizing: border-box;
  }
}
.card-view{
  font-size: 16px;
  display: flex;
  margin-top: 10px;

  &-label{
      width: 90px;
      text-align: right;
      padding-right:15px ;
    }

}
</style>
