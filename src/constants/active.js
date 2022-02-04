/*
 * @Author: your name
 * @Date: 2021-11-26 17:57:19
 * @LastEditTime: 2022-01-18 16:58:31
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \yk-prime-source-admin\src\constants\active.js
 */
// 定义是否活跃
export const ACTIVE_STATUS = {
  Active: {
    value: 1,
    desc: '活跃',
    status: 1,
    color: '#FF201A'
  },
  UnActive: {
    value: 2,
    desc: '非活跃',
    status: 2,
    color: '#34C0F0'
  }
}
export default { ACTIVE_STATUS }
