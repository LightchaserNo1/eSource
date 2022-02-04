<template>
  <div>
    <a-row
      v-for="(item, index) in formData"
      :key="index"
      class="itemBorder"
      type="flex"
      justify="center"
      align="middle"
    >
      <a-col :span="6">
        <!-- exam_item_name -->
        <div class="itemWrap">
          <span class="title"><span class="red">*</span>DWD字段:</span>
          <a-input style="width: 170px" default-value="exam_item_name" disabled />
        </div>
      </a-col>
      <a-col :span="6">
        <div class="itemWrap">
          <span class="title"><span class="red">*</span>DWD值域:</span>
          <a-select
            allowClear
            mode="multiple"
            placeholder="请选择DWD值域"
            style="width: 100%"
            :value="item.fieldValues"
            :disabled="item.disabled"
            @change="(val) => onTreeSelect(val, index)"
            @popupScroll="handlePopupScroll"
            @search="handleSearch"
          >
            <a-select-option v-for="frontSelect in frontDataZ" :key="frontSelect.valName">
              {{ frontSelect.valName }}
            </a-select-option>
          </a-select>
          <!-- <a-select
            mode="multiple"
            style="width: 170px"
            v-model="item.fieldValues"
            placeholder="请选择DWD值域"
            :disabled="item.disabled"
          >
            <a-select-option v-for="(child, childIndex) in listField" :key="childIndex" :value="child.valName + ''">
              {{ child.valName }}
            </a-select-option>
          </a-select> -->
        </div>
      </a-col>

      <a-col :span="6">
        <div class="itemWrap">
          <span class="title">CRF字段:</span>
          <a-input v-model="item.remarks" :disabled="item.disabled" style="width: 120px" default-value="" />
        </div>
      </a-col>
      <a-col :span="4">
        <div class="itemWrap">
          <a-button type="primary" @click="edit(index)">编辑</a-button>
          <a-button type="primary" style="margin-left: 10px" @click="remove(item.id, index)">删除</a-button>
        </div>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center" align="top">
      <a-button type="primary" style="width: 100px" @click="add">添加行</a-button>
      <a-button type="primary" style="width: 100px; margin-left: 30px" @click="submit">保存</a-button>
    </a-row>
  </div>
</template>
<script>
import { listCheck, listCheckValues, addOrUpdateCheck, delCheck } from '@/api/crf/assist' // listCheckField
export default {
  props: {
    assistConfigId: {
      type: String,
      default: ''
    }
  },
  components: {
    // BigSelect
  },
  data () {
    return {
      loading: false,
      formData: [],
      listTable: [],
      listField: [],
      frontDataZ: [], // 存放前100的数据
      sourceOwnerSystems: [],
      valueData: '',
      treePageSize: 100,
      scrollPage: 1,
      checkAll: true
    }
  },
  mounted () {
    // this.getlistTest()
    this.getlistCommValues()
  },
  methods: {
    // 辅助检验列表
    getlistTest () {
      const form = new FormData()
      form.append('fromId', this.assistConfigId)
      listCheck(form).then(res => {
        const arr = res.map(item => {
          const obj = {
            fieldName: item.fieldName,
            assistConfigId: this.assistConfigId,
            fieldValues: item.fieldValues === '' ? [] : item.fieldValues.split(','),
            remarks: item.remarks,
            childArr: [],
            disabled: true
          }
          if (item && item.id) {
            obj.id = item.id
          }
          return obj
        })
        this.formData = arr
      }).catch((err) => {
        console.log('报错信息', err)
        this.loading = false
      })
    },
    handleSearch (val) {
      this.valueData = val
      if (!val) {
        this.frontDataZ = this.listField.slice(0, 100)
        // console.log(this.frontDataZ)
      } else {
        this.frontDataZ = []
        this.scrollPage = 1
        this.listField.forEach(item => {
          if (item.valName.indexOf(val) >= 0) {
            this.frontDataZ.push(item)
          }
        })
        this.allDataZ = this.frontDataZ
        this.frontDataZ = this.frontDataZ.slice(0, 100)
      }
    },
    onTreeSelect (val, k) {
      this.formData[k].fieldValues = val
    },
    // 下拉框下滑事件
    handlePopupScroll (e) {
      const { target } = e
      const scrollHeight = target.scrollHeight - target.scrollTop
      const clientHeight = target.clientHeight
      // 下拉框不下拉的时候
      if (scrollHeight === 0 && clientHeight === 0) {
        this.scrollPage = 1
        // console.log(this.scrollPage)
      } else {
        // 当下拉框滚动条到达底部的时候
        if (scrollHeight < clientHeight + 5) {
          this.scrollPage = this.scrollPage + 1
          const scrollPage = this.scrollPage// 获取当前页
          const treePageSize = this.treePageSize * (scrollPage || 1)// 新增数据量
          const newData = [] // 存储新增数据
          let max = '' // max 为能展示的数据的最大条数
          if (this.listField.length > treePageSize) {
            // 如果总数据的条数大于需要展示的数据
            max = treePageSize
          } else {
            // 否则
            max = this.listField.length
          }
          // 判断是否有搜索
          if (this.valueData) {
            this.allDataZ.forEach((item, index) => {
              if (index < max) { // 当data数组的下标小于max时
                newData.push(item)
              }
            })
          } else {
            this.listField.forEach((item, index) => {
              if (index < max) { // 当data数组的下标小于max时
                newData.push(item)
              }
            })
          }

          this.frontDataZ = newData // 将新增的数据赋值到要显示的数组中
        }
      }
    },
    // 检查项目值域列表
    getlistCommValues () {
      const form = new FormData()
      form.append('fieldName', 'exam_item_name')
      listCheckValues(form).then(res => {
        this.listField = res.filter(item => item !== null)
        this.frontDataZ = this.listField.slice(0, 100)
        // console.log(this.formData)
      }).catch((err) => {
        console.log('报错信息', err)
        this.loading = false
      })
    },
    // 添加行
    add () {
      const item = {
        fieldName: 'exam_item_name',
        assistConfigId: this.assistConfigId,
        fieldValues: [],
        remarks: '',
        childArr: [],
        disabled: false
      }
      this.formData.push(item)
    },
    edit (index) {
      this.formData[index].disabled = false
    },
    remove (id, index) {
      if (!id) {
        this.formData.splice(index, 1)
        this.$message.success('删除成功')
      } else {
        const form = new FormData()
        form.append('id', id)
        delCheck(form).then(res => {
          this.formData.splice(index, 1)
          this.$message.success('删除成功')
        })
      }
    },
    // 提交
    submit () {
      this.checkAll = true
      const arr = this.formData.map(item => {
        const obj = {
          fieldName: item.fieldName,
          assistConfigId: this.assistConfigId,
          fieldValues: item.fieldValues.join(','),
          remarks: item.remarks
        }
        obj.fieldName = 'exam_item_name'
        if (item && item.id) obj.id = item.id
        if (obj.fieldValues === '') this.checkAll = false
        return obj
      })
      if (!this.checkAll) return this.$message.warning('请完成所有必填项')
      const form = new FormData()
      form.append('proJson', JSON.stringify(arr))
      addOrUpdateCheck(form).then((res) => {
        this.$message.success('保存成功')
        this.getlistTest()
      })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>

<style scoped lang="less">
.title {
  text-align: center;
  margin-right: 15px;
  .red {
    color: red;
  }
}
.icon {
  font-size: 6px;
}
.itemBorder {
  padding: 15px 10px;
  // border: 1px solid #ccc;
  // border-radius: 10px;
  // margin-bottom: 15px;
}
.itemWrap {
  margin-bottom: 20px;
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  .touMing {
    cursor: pointer;
    width: 120px;
    height: 120px;
    background: #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.flex {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  vertical-align: middle;
}
.picture-uploader > .ant-upload {
  width: 128px;
  height: 128px;
  img {
    width: 128px;
    height: 128px;
  }
}
.ant-upload-select-picture-card i {
  font-size: 24px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.ant-upload-picture-card-wrapper {
  display: flex;
  justify-content: center;
}
.dynamic-delete-button {
  cursor: pointer;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
  margin-left: 10px;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
