<template>
  <canvas
    ref="canvas"
    @mousedown="mouseDown"
    @mousemove="mouseMove"
    @mouseup="mouseUp"
    @touchstart="touchStart"
    @touchmove="touchMove"
    @touchend="touchEnd"
  ></canvas>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 800
    },
    height: {
      type: Number,
      default: 300
    },
    lineWidth: {
      type: Number,
      default: 4
    },
    lineColor: {
      type: String,
      default: '#000000'
    },
    bgColor: {
      type: String,
      default: ''
    },
    isCrop: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      hasDrew: false,
      resultImg: '',
      points: [],
      canvasTxt: null,
      startX: 0,
      startY: 0,
      isDrawing: false,
      sratio: 1,
      cacheData: []
    }
  },
  computed: {
    ratio () {
      return this.height / this.width
    },
    stageInfo () {
      return this.$refs.canvas.getBoundingClientRect()
    },
    myBg () {
      return this.bgColor ? this.bgColor : 'rgba(255, 255, 255, 0)'
    }
  },
  watch: {
    'myBg': function (newVal) {
      this.$refs.canvas.style.background = newVal
    }
  },
  beforeMount () {
    window.addEventListener('resize', this.$_resizeHandler)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  mounted () {
    const canvas = this.$refs.canvas
    canvas.height = this.height
    canvas.width = this.width
    canvas.style.background = this.myBg
    this.$_resizeHandler()
    // 在画板以外松开鼠标后冻结画笔
    document.onmouseup = () => {
      this.isDrawing = false
    }
  },
  methods: {
    $_resizeHandler () {
      const canvas = this.$refs.canvas
      canvas.style.width = this.width + 'px'
      const realw = parseFloat(window.getComputedStyle(canvas).width)
      canvas.style.height = this.ratio * realw + 'px'
      this.canvasTxt = canvas.getContext('2d')
      this.canvasTxt.scale(1 * this.sratio, 1 * this.sratio)
      this.sratio = realw / this.width
      this.canvasTxt.scale(1 / this.sratio, 1 / this.sratio)
    },
    // pc
    mouseDown (e) {
      e = e || event
      e.preventDefault()
      this.isDrawing = true
      this.hasDrew = true
      const obj = {
        x: e.offsetX,
        y: e.offsetY
      }
      this.drawStart(obj)
    },
    mouseMove (e) {
      e = e || event
      e.preventDefault()
      if (this.isDrawing) {
        const obj = {
          x: e.offsetX,
          y: e.offsetY
        }
        this.drawMove(obj)
      }
    },
    mouseUp (e) {
      e = e || event
      e.preventDefault()
      const obj = {
        x: e.offsetX,
        y: e.offsetY
      }
      this.drawEnd(obj)
      this.isDrawing = false
    },
    // mobile
    touchStart (e) {
      e = e || event
      e.preventDefault()
      this.hasDrew = true
      if (e.touches.length === 1) {
        const obj = {
          x: e.targetTouches[0].clientX - this.$refs.canvas.getBoundingClientRect().left,
          y: e.targetTouches[0].clientY - this.$refs.canvas.getBoundingClientRect().top
        }
        this.drawStart(obj)
      }
    },
    touchMove (e) {
      e = e || event
      e.preventDefault()
      if (e.touches.length === 1) {
        const obj = {
          x: e.targetTouches[0].clientX - this.$refs.canvas.getBoundingClientRect().left,
          y: e.targetTouches[0].clientY - this.$refs.canvas.getBoundingClientRect().top
        }
        this.drawMove(obj)
      }
    },
    touchEnd (e) {
      e = e || event
      e.preventDefault()
      if (e.touches.length === 1) {
        const obj = {
          x: e.targetTouches[0].clientX - this.$refs.canvas.getBoundingClientRect().left,
          y: e.targetTouches[0].clientY - this.$refs.canvas.getBoundingClientRect().top
        }
        this.drawEnd(obj)
      }
    },
    // 绘制
    drawStart (obj) {
      this.canvas_copy()
      this.startX = obj.x
      this.startY = obj.y
      this.canvasTxt.beginPath()
      this.canvasTxt.moveTo(this.startX, this.startY)
      this.canvasTxt.lineTo(obj.x, obj.y)
      this.canvasTxt.lineCap = 'round'
      this.canvasTxt.lineJoin = 'round'
      this.canvasTxt.lineWidth = this.lineWidth * this.sratio
      this.canvasTxt.stroke()
      this.canvasTxt.closePath()
      this.points.push(obj)
    },
    drawMove (obj) {
      this.canvasTxt.beginPath()
      this.canvasTxt.moveTo(this.startX, this.startY)
      this.canvasTxt.lineTo(obj.x, obj.y)
      this.canvasTxt.strokeStyle = this.lineColor
      this.canvasTxt.lineWidth = this.lineWidth * this.sratio
      this.canvasTxt.lineCap = 'round'
      this.canvasTxt.lineJoin = 'round'
      this.canvasTxt.stroke()
      this.canvasTxt.closePath()
      this.startY = obj.y
      this.startX = obj.x
      this.points.push(obj)
    },
    drawEnd (obj) {
      this.canvasTxt.beginPath()
      this.canvasTxt.moveTo(this.startX, this.startY)
      this.canvasTxt.lineTo(obj.x, obj.y)
      this.canvasTxt.lineCap = 'round'
      this.canvasTxt.lineJoin = 'round'
      this.canvasTxt.stroke()
      this.canvasTxt.closePath()
      this.points.push(obj)
      this.points.push({ x: -1, y: -1 })
    },
    canvas_copy () {
      this.cacheData.push(this.canvasTxt.getImageData(0, 0, this.width, this.height))
    },
    // 撤回
    last () {
      if (this.cacheData.length === 0) {
        return this.$message.warning('已回到初试状态')
      } else {
        this.canvasTxt.putImageData(this.cacheData.pop(), 0, 0)
      }
    },
    // 操作
    generate () {
      const pm = new Promise((resolve, reject) => {
        if (!this.hasDrew) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(`未进行操作!`)
          return
        }
        var resImgData = this.canvasTxt.getImageData(0, 0, this.$refs.canvas.width, this.$refs.canvas.height)
        this.canvasTxt.globalCompositeOperation = 'destination-over'
        this.canvasTxt.fillStyle = this.myBg
        this.canvasTxt.fillRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height)
        this.resultImg = this.$refs.canvas.toDataURL()
        var resultImg = this.resultImg
        this.canvasTxt.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height)
        this.canvasTxt.putImageData(resImgData, 0, 0)
        this.canvasTxt.globalCompositeOperation = 'source-over'
        if (this.isCrop) {
          const cropArea = this.getCropArea(resImgData.data)
          var cropCanvas = document.createElement('canvas')
          const cropCtx = cropCanvas.getContext('2d')
          cropCanvas.width = cropArea[2] - cropArea[0]
          cropCanvas.height = cropArea[3] - cropArea[1]
          const cropImgData = this.canvasTxt.getImageData(...cropArea)
          cropCtx.globalCompositeOperation = 'destination-over'
          cropCtx.putImageData(cropImgData, 0, 0)
          cropCtx.fillStyle = this.myBg
          cropCtx.fillRect(0, 0, cropCanvas.width, cropCanvas.height)
          resultImg = cropCanvas.toDataURL()
          cropCanvas = null
        }
        resolve(resultImg)
      })
      return pm
    },
    reset () {
      this.canvasTxt.clearRect(
        0,
        0,
        this.$refs.canvas.width,
        this.$refs.canvas.height
      )
      this.$emit('update:bgColor', '')
      this.$refs.canvas.style.background = 'rgba(255, 255, 255, 0)'
      this.points = []
      this.cacheData = []
      this.hasDrew = false
      this.resultImg = ''
    },
    getCropArea (imgData) {
      var topX = this.$refs.canvas.width; var btmX = 0; var topY = this.$refs.canvas.height; var btnY = 0
      for (var i = 0; i < this.$refs.canvas.width; i++) {
        for (var j = 0; j < this.$refs.canvas.height; j++) {
          var pos = (i + this.$refs.canvas.width * j) * 4
          if (imgData[pos] > 0 || imgData[pos + 1] > 0 || imgData[pos + 2] || imgData[pos + 3] > 0) {
            btnY = Math.max(j, btnY)
            btmX = Math.max(i, btmX)
            topY = Math.min(j, topY)
            topX = Math.min(i, topX)
          }
        }
      }
      topX++
      btmX++
      topY++
      btnY++
      const data = [topX, topY, btmX, btnY]
      return data
    }
  }
}
</script>

<style scoped>
canvas {
  max-width: 100%;
  display: block;
}
</style>
