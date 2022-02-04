<template>
  <a-drawer
    class="drawer"
    width="35%"
    title="配置患者列表"
    placement="right"
    :visible="visibleConfig"
    @close="$emit('closeConfig')"
  >
    <div v-show="viewShow == 1">
      <div class="search">
        <div class="sl">
          <span>患者标识</span>
          <!-- 当其中一种类型有item了，类型不可再更换。 -->
          <a-select :disabled="listLength != 0" v-model="form.typeCode" @change="handleTypeChange">
            <a-select-option v-for="(item, index) in typeList" :key="index" :value="item.code">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </div>
        <div class="sr">
          <a-button @click="viewShow = 2">全部匹配</a-button>
          <a-button @click="viewShow = 3">历史记录</a-button>
          <a-button type="primary" @click="clickSend">发送</a-button>
        </div>
      </div>
      <a-table
        bordered
        :loading="memberLoading"
        :columns="columns"
        :dataSource="data"
        :pagination="false"
        size="small">
        <template v-for="col in [idType, 'ptsNo']" :slot="col" slot-scope="text, record">
          <a-input
            :key="col"
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="(e) => handleInputChange(e.target.value, record.key, col)"
          />
          <template v-else>{{ text }}</template>
        </template>
        <template slot="operation" slot-scope="text, record">
          <div class="op">
            <template v-if="record.editable">
              <template v-if="record.isNew">
                <div class="table-action" @click="saveRow(record)">添加</div>
                <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                  <div class="table-action">删除</div>
                </a-popconfirm>
              </template>
              <template v-else>
                <div class="table-action" @click="saveRow(record)">保存</div>
                <div class="table-action" @click="cancel(record.key)">取消</div>
              </template>
            </template>
            <template v-else>
              <div class="table-action" @click="toggle(record.key)">编辑</div>
              <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                <div class="table-action">删除</div>
              </a-popconfirm>
            </template>
          </div>
        </template>
      </a-table>
      <a-button
        style="width: 100%; margin-top: 16px; margin-bottom: 8px; color: #8193b1"
        type="dashed"
        icon="plus"
        @click="newMember"
      >
        添加受试者
      </a-button>
    </div>

    <AllMatch
      @back="
        () => {
          viewShow = 1
        }
      "
      v-if="viewShow === 2"
    />
    <HistoryList
      @back="
        () => {
          viewShow = 1
        }
      "
      v-else-if="viewShow === 3"
      :proId="config.proId"
      :orgId="config.orgId"
    />
  </a-drawer>
</template>

<script>
import AllMatch from './file-components/AllMatch.vue'
import HistoryList from './file-components/HistoryList.vue'
import { getSickType, addCatchData } from '@/api/patient/patient'
export default {
  name: 'EditTable',
  props: {
    visibleConfig: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    AllMatch,
    HistoryList
  },
  data () {
    return {
      // 设置要查重的字段diffProp
      diffProp: null,
      typeCode: 1,
      form: {
        typeCode: 1
      },
      // 控制视图展示，1为添加，2为全部任务   3为历史记录展示
      viewShow: 1,
      loading: true,
      title: null,
      listLength: 0,
      diffList: [],
      typeList: [],
      memberLoading: false,
      // table
      columns: [
        {
          title: '绑定受试者ID',
          dataIndex: 'ptsNo',
          key: 'ptsNo',
          width: '20%',
          scopedSlots: { customRender: 'ptsNo' }
        },
        {
          title: this.title,
          dataIndex: this.idType,
          key: this.idType,
          width: '20%',
          scopedSlots: { customRender: this.idType }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          width: '15%',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: []
    }
  },
  filters: {
    filterTimeFormat (val) {
      if (val) {
        const srt = val.toString()
        return srt.replace(',', ' ~ ')
      } else {
        return ''
      }
    }
  },
  computed: {
    // 传的参数是变的，根据code来配置columns
    idType () {
      if (this.typeCode === 1) {
        return 'empiId'
      } else if (this.typeCode === 2) {
        return 'outhospIndexNo'
      } else if (this.typeCode === 3) {
        return 'inhospIndexNo'
      } else if (this.typeCode === 4) {
        return 'ptsIdentity'
      } else {
        return ''
      }
    }
  },
  created () {
    console.log(this.$props)
    setTimeout(() => {
      this.loading = !this.loading
    }, 500)
  },
  mounted () {
    // 根绝请求回来的类型,动态设置表格参数。
    getSickType({}).then(res => {
      this.typeList = res
      this.title = this.typeList[0].name
      this.$set(this.columns[1], 'title', this.title)
      this.$set(this.columns[1], 'dataIndex', this.idType)
      this.$set(this.columns[1], 'key', this.idType)
      this.$set(this.columns[1], 'scopedSlots', { customRender: this.idType })
    })
  },
  methods: {
    handleTypeChange (e) {
      // 设置表头标题
      this.typeCode = e
      const target = this.typeList.find(item => item.code === e)
      this.title = target.name
      this.$set(this.columns[1], 'title', this.title)
      this.$set(this.columns[1], 'dataIndex', this.idType)
      this.$set(this.columns[1], 'key', this.idType)
      this.$set(this.columns[1], 'scopedSlots', { customRender: this.idType })
    },
    // 点击发送
    clickSend () {
      if (this.data.length === 0) {
        this.$message.error('请补全信息')
        return false
      }
      const unSave = this.data.some(item => item.editable)
      if (unSave) {
        this.$message.error('请保存完整信息')
        return false
      }
      // const deleteKeys = ['editable', 'key', 'isNew']
      this.data.forEach(item => {
        item.researchId = this.config.id || this.config.researchId
        item.proId = this.config.proId
        item.orgId = this.config.orgId
        item.type = this.typeCode
        // for (const key in item) {
        //   if (deleteKeys.indexOf(key) !== -1) {
        //     delete item[key]
        //   }
        // }
      })
      console.log(this.data)
      addCatchData({ json: JSON.stringify([...this.data]) }).then(res => {
        this.$message.success('添加成功')
        this.$emit('closeCatchData')
      })
    },
    // 新增
    newMember () {
      if (Object.keys(this.form).length === 0) {
        this.$message.error('请选择患者标识')
        return false
      }
      // 确定要查重的字段
      console.log(this.data.length)
      if (this.data.length > 0) {
        const propArr = ['empiId', 'outhospIndexNo', 'inhospIndexNo', 'ptsIdentity']
        const keyArrs = Object.keys(this.data[0])
        console.log(propArr, keyArrs)
        const crossArray = keyArrs.filter(item => {
          return propArr.findIndex(a => a === item) !== -1
        })
        this.diffProp = crossArray[0]
        console.log(this.diffProp, this.data)
      }
      const length = this.data.length
      this.data.push({
        key: length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString(),
        [this.idType]: '',
        ptsNo: '',
        editable: true,
        isNew: true
      })
    },
    // 删除行
    remove (key) {
      const newData = this.data.filter((item) => item.key !== key)
      this.data = newData
      this.listLength = this.data.length
    },
    // 行内编辑事件
    handleInputChange (value, key, column) {
      const newData = [...this.data]
      const target = newData.find((item) => key === item.key)
      if (target) {
        target[column] = value.trim()
        this.data = newData
      }
      this.diffList = this.data.filter(item => !item.editable)
      console.log(this.diffList)
    },
    // 编辑row
    toggle (key) {
      const target = this.data.find((item) => item.key === key)
      console.log(target)
      if (this.data.length > 0) {
        this.diffList = this.data.filter(item => (item.ptsNo) !== (target.ptsNo))
      }
      target._originalData = { ...target }
      target.editable = !target.editable
    },
    // row保存
    saveRow (record) {
      this.memberLoading = true
      const { key, ptsNo } = record // 需要校验的必填字段
      if (!record[this.idType] || !ptsNo) {
        this.memberLoading = false
        this.$message.error('请填写完整信息。')
        return
      }
      const isPtsNoRepeat = this.diffList.findIndex(item => item.ptsNo === record.ptsNo) !== -1
      const isIdRepeat = this.diffList.findIndex(item => item[this.diffProp] === record[this.diffProp]) !== -1
      if (isPtsNoRepeat) {
        this.$message.error('受试者Id重复')
        this.memberLoading = false
        return false
      } else if (isIdRepeat) {
        if (this.diffProp === 'empiId') {
          this.$message.error('患者Id重复')
        } else if (this.diffProp === 'outhospIndexNo') {
          this.$message.error('门诊id重复')
        } else if (this.diffProp === 'inhospIndexNo') {
          this.$message.error('住院id重复')
        } else {
          this.$message.error('身份证Id重复')
        }
        this.memberLoading = false
        return false
      }
      // 模拟网络请求、卡顿 200ms, 不需要走接口，去掉即可
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({ loop: false })
        }, 200)
      }).then(() => {
        const target = this.data.find((item) => item.key === key)
        target.editable = false
        target.isNew = false
        this.memberLoading = false
      })
      this.listLength = this.data.length
    },
    // 取消
    cancel (key) {
      const target = this.data.find((item) => item.key === key)
      Object.keys(target).forEach((key) => {
        target[key] = target._originalData[key]
      })
      target._originalData = undefined
    }
  }
}
</script>
<style lang="less" scoped>
.drawer {
  ::v-deep .ant-drawer-header {
    background: #abb8ce;
    .ant-drawer-title {
      color: #fff;
      font-weight: bold;
    }
    .anticon-close {
      color: #fff;
    }
  }
}
.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  .sl {
    display: flex;
    align-items: center;
    span {
      margin-right: 10px;
    }
  }
  .sr {
    display: flex;
    align-items: center;
    .ant-btn {
      // border: 1px solid #e5ebf3;
      // border-radius: 2px;
      // padding: 8px 15px;
      // font-size: 11px;
      // color: #8193b1;
      margin-left: 10px;
      // &.fill {
      //   background: #8193b1;
      //   border: none;
      //   color: #fff;
      // }
    }
  }
}
.op {
  display: flex;
  justify-content: center;
}
</style>
