/*
 * @Author: your name
 * @Date: 2021-12-31 14:57:47
 * @LastEditTime: 2022-01-20 20:12:05
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \yk-prime-source-ui\src\components\watermark.js
 */
const watermark = {}

const setWatermark = (str) => {
  const id = 'setWatermark'

  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id))
  }

  // 创建一个画布
  const can = document.createElement('canvas')
  // 设置画布的长宽
  can.width = 200
  can.height = 200

  const cans = can.getContext('2d')
  // 旋转角度
  cans.rotate(-15 * Math.PI / 180)
  cans.font = '18px Vedana'
  // 设置填充绘画的颜色、渐变或者模式
  cans.fillStyle = 'rgba(200, 200, 200, 0.20)'
  // 设置文本内容的当前对齐方式
  cans.textAlign = 'left'
  // 设置在绘制文本时使用的当前文本基线
  cans.textBaseline = 'Middle'
  // 在画布上绘制填色的文本（输出的文本，开始绘制文本的X坐标位置，开始绘制文本的Y坐标位置）
  cans.fillText(str, can.width / 8, can.height / 2)

  const div = document.createElement('div')
  div.id = id
  div.style.pointerEvents = 'none'
  div.style.top = '30px'
  div.style.left = '0px'
  div.style.position = 'fixed'
  div.style.zIndex = '100000'
  div.style.width = document.documentElement.clientWidth + 'px'
  div.style.height = document.documentElement.clientHeight + 'px'
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
  document.body.appendChild(div)
  return id
}

// 该方法只允许调用一次
watermark.set = (str) => {
  let id = setWatermark(str)
  setInterval(() => {
    if (document.getElementById(id) === null) {
      id = setWatermark(str)
    }
  }, 500)
  window.onresize = () => {
    setWatermark(str)
  }
}

export default watermark