import initAopMonitor from 'aop-monitor'
import { recordLog } from '@/api/system/log'

const send = (params) => {
  // 这里做一些参数的检验或者自定义处理逻辑
  // 这里写你的发送埋点事件
  console.log('将要被埋点的参数', params)
  recordLog(params).then(res => {
    console.log(res)
  })
}

export default initAopMonitor(send)
