<!-- 3.加入项目 -->
<template>
  <div>
    <a-form>
      <!-- 展示信息 -->
      <a-row v-if="user.verifiedStatus == 1" :gutter="48" class="spaceing">
        <a-col :md="10" :sm="24" :offset="10">您已成功完成实名认证</a-col>
      </a-row>
      <a-row :gutter="48" class="spaceing">
        <a-col :md="10" :sm="24" :offset="10">姓名：{{ user.name }}</a-col>
      </a-row>
      <a-row :gutter="48" class="spaceing">
        <a-col :md="10" :sm="24" :offset="10">手机号：{{ user.phone }}</a-col>
      </a-row>
      <a-row :gutter="48" class="spaceing">
        <a-col :md="10" :sm="24" :offset="10">证件号码：{{ user.idCard }}</a-col>
      </a-row>
      <a-row :gutter="48" class="spaceing">
        <a-col :md="10" :sm="24" :offset="10">请输入手机或邮件邀请信息里的项目PIN码</a-col>
      </a-row>
      <!-- 输入PIN码 -->
      <a-row style="margin-top:60px" :gutter="48" class="spaceing">
        <a-col :md="10" :sm="24" :offset="7">
          <a-row :gutter="48">
            <center>
              <a-col :md="4" :sm="24" v-for="(item, index) in list" :key="item.id" @click="handleInputChange()">
                <a-input
                  v-model="item.value"
                  :maxLength="1"
                  :auto-focus="focusValue == index"
                  :ref="'input' + index"
                  @change="e => handleInputChanges(e.target.value, index)"
                  @keydown.delete="e => continuousDelete(e.target.value, index)"
                />
              </a-col>
            </center>
          </a-row>
        </a-col>
      </a-row>
      <!-- 点击完成 -->
      <a-row style="margin-top:30px" :gutter="48" class="spaceing">
        <a-col :md="10" :sm="24" :offset="7">
          <center>
            <a-button type="primary" @click="clickFinish">完成</a-button>

            <a-popconfirm title="确认要跳过？" ok-text="确定" cancel-text="取消" @confirm="toProject()">
              <a-button style="margin-left:20px" >跳过</a-button>
            </a-popconfirm>
          </center>

        </a-col>

      </a-row>
    </a-form>
  </div>
</template>

<script>
import { getPersonDetail, joinProject } from '@/api/system/user'
export default {
  name: '',
  components: {
  },
  data () {
    return {
      focusValue: 0,
      PINValue: '',
      user: {},
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
  created () {
    this.getPersonDetail()
  },
  methods: {
    // 获取详情
    getPersonDetail () {
      getPersonDetail()
        .then(res => {
          this.user = res
        })
        .catch(() => {})
    },
    // 加入项目
    joinProject () {
      joinProject({ 'pin': this.PINValue })
        .then(res => {
          this.$message.success('操作成功')
          setTimeout(() => {
            this.$router.push({ path: '/' })
          }, 300)
          // console.log(res, '返回的详情')
          // if (res.status === '1') {
          //   this.$router.go(-1)
          // }
        })
        .catch(() => {})
    },
    // 点击完成结束校验
    clickFinish () {
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
      this.PINValue = value
      this.joinProject()
    },
    // input输入框有值输入后自动聚焦到下一个
    handleInputChanges (value, index) {
      console.log('value', value)
      console.log('index', index)
      if ((value !== null || value !== undefined) && value !== '' && index !== 5) {
        const refIndex = 'input' + (index += 1)
        this.$refs[refIndex][0].focus()
      } else {
      }
    },
    handleInputChange () {
      console.log(this.list)
      let refIndexs = {
        id: 0,
        value: null
      }
      this.list.forEach(item => {
        if (item.value || item.value === 0) {
          refIndexs = { ...item }
        }
      })
      console.log(refIndexs)
      if (refIndexs.id > 5) {
        refIndexs.id = 5
      }
      const refIndex = 'input' + refIndexs.id
      console.log(refIndex)
      this.$refs[refIndex][0].focus()
      console.log(this.list[refIndexs.id], refIndexs, 'wwww')
    },
    continuousDelete (value, index) {
      console.log('value', value)
      console.log('index', index)
      if ((value === null || value === undefined || value === '') && index !== 0) {
        const refIndex = 'input' + (index -= 1)
        this.$refs[refIndex][0].focus()
      } else {
      }
    },
    toProject () {
      setTimeout(() => {
        this.$router.push({ path: '/' })
      }, 300)
    }
  }
}
</script>
<style lang="less" scoped>
  .spaceing {
    margin: 20px 0;
  }
</style>
