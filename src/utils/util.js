export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome () {
  const arr = ['休息一会儿吧', '准备吃什么呢?']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () { }
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

export function getPhoneTail (phone) {
  phone = '' + phone
  if (phone == null || phone.length === 0) {
    return ''
  }
  return phone.substr(phone.length - 4, phone.length)
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}
export function scorePassword (pass) {
  let score = 0
  if (!pass) {
    return score
  }
  // award every unique letter until 5 repetitions
  const letters = {}
  for (let i = 0; i < pass.length; i++) {
    letters[pass[i]] = (letters[pass[i]] || 0) + 1
    score += 5.0 / letters[pass[i]]
  }

  // bonus points for mixing it up
  const variations = {
    digits: /\d/.test(pass),
    lower: /[a-z]/.test(pass),
    upper: /[A-Z]/.test(pass),
    nonWords: /\W/.test(pass)
  }

  let variationCount = 0
  for (var check in variations) {
    variationCount += (variations[check] === true) ? 1 : 0
  }
  score += (variationCount - 1) * 10

  return parseInt(score)
}
/**
   * 将base64转换成blob，再转换成form数据
   * @param {*} dataURI base64数据
   * @param {*} type 图片类型，如：image/png
   */
 export function dataURLtoFile (dataURI, type) {
  // btoa和atob是window对象的两个函数，其中btoa是binary to ascii，用于将binary的数据用ascii码表示，即Base64的编码过程，而atob则是ascii to binary，用于将ascii码解析成binary数据
  const binary = atob(dataURI.split(',')[1])
  const array = []
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i))
  }
  const fileData = new Blob([new Uint8Array(array)], {
    type: type
  })
  const form = new FormData()
  form.append('bizType', '9')
  const fileOfBlob = new File([fileData], 'demo.png')// 重命名了new Date() + '.png'
  form.append('file', fileOfBlob)
  return form
}
/**
   * 将文件转换成base64
   * @param {*} file base64数据
   */
export function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
export function exportExcel (key, data) {
  const name = key + new Date().getTime().toString()
  var fileName = `${name}.xls`
  var exporturl = window.URL.createObjectURL(new Blob([data], { type: 'application/octet-stream' }))
  var a = document.createElement('a')
  document.body.appendChild(a)
  a.href = exporturl
  a.download = fileName
  a.target = '_blank'
  a.click()
  document.body.removeChild(a)
}
export function exportWord (key, data) {
  const name = key + new Date().getTime().toString()
  var fileName = `${name}.txt`
  var exporturl = window.URL.createObjectURL(new Blob([data], { type: 'application/octet-stream' }))
  console.log(exporturl)
  var a = document.createElement('a')
  document.body.appendChild(a)
  a.href = exporturl
  a.download = fileName
  a.target = '_blank'
  a.click()
  document.body.removeChild(a)
}

export function downloadFile (file) {
  window.open(file, '_blank')
}
export function debounce (callBack, timeout) {
  let timer = null
  return function (e) {
    if (timer !== null) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      callBack.call(this, e)
      timer = null
    }, timeout)
  }
}
