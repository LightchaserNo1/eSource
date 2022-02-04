<template>
  <div>
    <a-spin tip="验证中..." :spinning="spinning">
      <div class="certification-area">
        <span class="msg">{{ msg }}</span>
        <div class="certification-video">
          <!-- 人脸检测 -->
          <!-- v-show="showVideo" -->
          <div class="video">
            <video :src="url" ref="videoRef" autoplay playsinline x5-video-player-type="h5"></video>
          </div>
        </div>
        <!-- <button class="next-btn" @click="nextStep">下一步</button> -->
      </div>
    </a-spin>
    <!-- <video ref="videob" controls="" name="media"></video> -->
  </div>
</template>
<script>

import { getValidateData, sendValidateVideo } from '@/api/attestation/attestation'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { uploadFile } from '@/api/common'
// import fs from 'fs'

export default {
  data () {
    return {
      spinning: false,
      msg: '拿起手机，离近一点', // 提示语
      url: '', // 视频地址
      mediaRecorder: null,
      MediaStreamTrack: null,
      isAlreadyRecord: false,
      count: 5,
      countTimer: null,
      recordedBlobs: [],
      order: '',
      validateData: '',
      userInfo: null
    }
  },
  mounted () {
    const params = this.$route.query.params
    if (params) {
      this.userInfo = JSON.parse(decodeURI(params))
      storage.set(ACCESS_TOKEN, this.userInfo.token, 7 * 24 * 60 * 60 * 1000)
      console.log('userInfo', this.userInfo)
      this.getVerifyOrdinal()
    }
  },
  beforeDestroy () {
    this.MediaStreamTrack && this.MediaStreamTrack.stop()
    this.countTimer && clearTimeout(this.countTimer)
  },
  methods: {
    getVerifyOrdinal () {
      getValidateData().then(res => {
        this.validateData = res
        this.order = res.split(',')[0]
        if (this.order === '1') {
          this.msg = '拿起手机，眨眨眼'
        } else if (this.order === '2') {
          this.msg = '拿起手机，张张嘴'
        }
        this.getCamera()
        // this.sendValidateVideo()
      })
    },
    sendValidateVideo (videoUrl) {
      this.spinning = true
      // const params = new FormData()
      // params.append('idCard', this.userInfo.idCard)
      // params.append('name', this.userInfo.name)
      // params.append('validateData', this.validateData)
      // params.append('videoUrl', videoUrl)

      // console.log('###########', params)

      sendValidateVideo({
        idCard: this.userInfo.idCard,
        name: this.userInfo.name,
        validateData: this.validateData,
        videoUrl: videoUrl
      }).then(res => {
        this.spinning = false
        this.$emit('nextStep', res)
      })
    },
    sendVideoFile (file) {
      this.spinning = true
      const params = new FormData()
      params.append('file', file, 'test.mp4')
      uploadFile(params).then(res => {
        this.spinning = false
        this.sendValidateVideo(this.$options.filters.dealImageUrl(res))
      })
    },
    // 调用摄像头 开始录制
    async getCamera () {
      const that = this
      // 注意本例需要在HTTPS协议网站中运行，新版本Chrome中getUserMedia接口在http下不再支持。
      const constraints = {
        audio: false,
        video: {
          deviceId: 'default',
          facingMode: 'user' // 优先调前置摄像头
        }
      }

      // 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {}
      }

      // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia
      // 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          // 首先，如果有getUserMedia的话，就获得它
          //   var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
          var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia

          // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
          if (!getUserMedia) {
            that.$message.error('该浏览器不支持getUserMedia，请使用其他浏览器')
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
          }

          // 否则，为老的navigator.getUserMedia方法包裹一个Promise
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject)
          })
        }
      }
      // 调用摄像头
        await navigator.mediaDevices.getUserMedia(constraints).then(stream => {
          this.MediaStreamTrack = typeof stream.stop === 'function' ? stream : stream.getTracks()[0]
          console.log(stream)
          console.log(this.MediaStreamTrack)
          const winURL = window.URL || window.webkitURL
          // 获取摄像内容放到video中显示
          if ('srcObject' in this.$refs.videoRef) {
            this.$refs.videoRef.srcObject = stream
          } else {
            this.$refs.videoRef.src = winURL.createObjectURL(stream)
          }
          console.log(this.$refs.videoRef)
          // video组件准备好后显示录制框
          this.$refs.videoRef.onloadedmetadata = e => {
            this.isAlreadyRecord = false
            // 播放视频
            this.$refs.videoRef.play()
            // 开始录制
            this.saveVideo()
            // console.log(1111111)
          }

          const options = {
            videoBitsPerSecond: 2500000
          }
          this.mediaRecorder = new MediaRecorder(stream, options)
        })
        .catch(err => {
          console.log(err)
          that.$message.error('摄像头开启失败，请检查摄像头是否授权或是否可用！')
        })
    },
    // 保存录制视频
    saveVideo () {
      const that = this
      if (this.isAlreadyRecord) {
        // 当录制的数据可用时
        this.mediaRecorder.ondataavailable = e => {
          if (e.data && e.data.size > 0) {
            // let videoSize = e.data.size
            this.recordedBlobs.push(e.data)
            console.log('=========data=========', this.recordedBlobs)
            // var blob = new Blob(this.recordedBlobs, { type: 'video/mp4' })
            // this.isAlreadyRecord = false
            // this.sendValidateVideo(blob)
          }
        }
        this.mediaRecorder.stop()
        setTimeout(() => {
          var blob = new Blob(this.recordedBlobs, { type: 'video/mp4' })
          console.log('=========end=========', this.recordedBlobs)
          this.sendVideoFile(blob)
          // this.isAlreadyRecord = false
          // this.MediaStreamTrack && this.MediaStreamTrack.stop()
          // var reader = new FileReader()
          // reader.readAsDataURL(blob)
          // reader.onload = () => {
          //   console.log(reader.result)
          //   this.sendValidateVideo(reader.result)
          // }
        }, 1000)
      } else {
        // this.count = 5
        this.isAlreadyRecord = true
        this.mediaRecorder.start(6000)
        // this.mediaRecorder.onstart(() => {
        //   console.log('======开始播放=========')
        // })
        if (this.mediaRecorder.state === 'recording') {
          console.log(this.mediaRecorder)
          console.log('=======开始录制========', Math.round(+new Date() / 1000))
          setTimeout(() => {
            if (this.order === '1') {
              this.msg = '拿起手机，张张嘴'
            } else if (this.order === '2') {
              this.msg = '拿起手机，眨眨眼'
            }
          }, 2500)
          setTimeout(() => {
            that.msg = ''
            that.saveVideo()
          }, 5000)
        }
        // console.log(this.mediaRecorder.state)
        // let test = 0
        // setInterval(() => {
        //   console.log(test++)
        // }, 1000)
        // setTimeout(() => {
        //   if (this.order === '1') {
        //     this.msg = '拿起手机，张张嘴'
        //   } else if (this.order === '2') {
        //     this.msg = '拿起手机，眨眨眼'
        //   }
        // }, 1000)
        // setTimeout(() => {
        //   that.msg = ''
        //   that.saveVideo()
        //   // timer.clearInterval()
        // }, 5000)
      }
    },
    countDown () {
      const that = this
      setTimeout(() => {
        if (this.order === '1') {
          this.msg = '拿起手机，张张嘴'
        } else if (this.order === '2') {
          this.msg = '拿起手机，眨眨眼'
        }
      }, 2500)
      setTimeout(() => {
        that.msg = ''
        that.saveVideo()
        // console.log(this.mediaRecorder)
        // console.log('=======录制结束========', Math.round(+new Date() / 1000))
        // timer.clearInterval()
      }, 5000)
    }
  }
}
</script>
<style lang="less">
  .certification-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 40px;
    text-align: center;
    span {
      font-size: 20px;
      color: #333333;
      font-weight: 600;
    }
    .certification-video {
      overflow: hidden;
      width: 220px;
      height: 220px;
      margin-top: 20px;
      border: 2px solid #e6eaf2;
      border-radius: 50%;
      .video {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        -webkit-backface-visibility: hidden;
        -webkit-transform: translate3d(0, 0, 0);
      }

      .video video {
        // position: absolute;
        // top: 0;
        // left: 0;
        // z-index: 1;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        z-index: 0;
      }
    }
  }

  .msg {
    display: block;
    height: 40px;
  }

  .next-btn {
    width: 280px;
    height: 44px;
    margin: 100px auto 0;
    background-color: #0fd3e5;
    font-size: 16px;
    color: #ffffff;
    font-weight: 600;
    text-align: center;
    line-height: 44px;
    border: none;
  }
</style>
