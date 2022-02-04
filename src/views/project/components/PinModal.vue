<template>
  <a-modal
    :visible.sync="joinProjectVisible"
    title="加入项目"
    :confirm-loading="confirmLoading"
    @cancel="clickClose(0)"
    @ok="clickConfirm"
    width="500px"
    okText="保存"
  >
    <a-form>
      <!-- 输入PIN码 -->
      <a-row :gutter="48" style="margin: 0 0 20px 5px">
        {{ '请输入项目PIN码' }}
      </a-row>
      <a-row :gutter="48">
        <!-- <a-col :md="24" :sm="24" :offset="8"> -->
        <a-col :md="24" :sm="24">
          <a-row :gutter="48">
            <a-col :md="4" :sm="24" v-for="(item, index) in list" :key="item.id">
              <a-input
                v-model="item.value"
                :maxLength="1"
                :auto-focus="focusValue == index"
                :ref="'input' + index"
                @change="e => handleInputChange(e.target.value, index)"
              />
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
// import monitor from '@/utils/monitor'
// import joinProjectModal from '@/monitor/views/overview/allItems/joinProjectModal.js'

import { joinProject } from '@/api/project/project'

// const watch = monitor(joinProjectModal)

export default {
  props: {
    joinProjectVisible: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      confirmLoading: false,
      focusValue: 0,
      PINValue: '123456',
      commitValue: '',
      list: [
        {
          id: 1,
          value: null
        },
        {
          id: 2,
          value: null
        },
        {
          id: 3,
          value: null
        },
        {
          id: 4,
          value: null
        },
        {
          id: 5,
          value: null
        },
        {
          id: 6,
          value: null
        }
      ]
    }
  },
  methods: {
    // PIN码校验
    clickConfirm () {
      let isShow = false
      let value = ''
      this.list.forEach(item => {
        if (item.value === null || item.value === undefined || item.value === '') {
          isShow = true
        }
        value = value + '' + item.value
      })
      if (isShow) {
        this.$message.warning('请按正确格式输入')
        return false
      }
      // if (value !== this.PINValue) {
      //   this.$message.error('PIN码错误')
      //   return false
      // }
      this.commitValue = value
      this.actionjoinProject()
    },
    // 发起请求
    actionjoinProject () {
      this.joinProjectPoint()
      console.log('pin码', this.commitValue)
      joinProject({ pin: this.commitValue })
        .then(res => {
          console.log(res)
          this.$message.success('操作成功')
          this.clickClose(1)
        })
        .catch(() => { this.clearInput() })
    },
    // 关闭弹窗重置表格
    clickClose (val) {
      this.$emit('closeJoinProject', val)
      this.list.forEach(item => {
        item.value = null
      })
    },
    // input输入框有值输入后自动聚焦到下一个
    handleInputChange (value, index) {
      if ((value !== null || value !== undefined) && value !== '' && index !== 5) {
        const refIndex = 'input' + (index += 1)
        this.$refs[refIndex][0].focus()
      } else {
      }
    },
    // pin码输入错误 清空输入框
    clearInput () {
      this.list.forEach(item => { item.value = null })
      this.focusValue = 0
      this.$forceUpdate()
    },
    // 加入项目埋点
    joinProjectPoint () {}
  }
}
</script>
