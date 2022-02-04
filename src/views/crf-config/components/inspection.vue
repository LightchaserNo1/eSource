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
      <a-col :span="4">
        <div class="itemWrap">
          <span class="title">检验主题:</span>
          <a-input style="width: 170px" default-value="test_item_type_name" disabled />
        </div>
      </a-col>
      <a-col :span="4">
        <div class="itemWrap">
          <span class="title"><span class="red">*</span>主题值域:</span>
          <a-select
            mode="multiple"
            style="width: 170px"
            v-model="item.fieldValues"
            placeholder="请选择主题值域"
            :disabled="item.disabled"
            @change="(val) => handleSubject(val, index)"
          >
            <a-select-option v-for="(item1, index1) in subjectArr" :key="index1" :value="item1.valName">
              {{ item1.valName }}
            </a-select-option>
          </a-select>
        </div>
      </a-col>
      <a-col :span="4">
        <div class="itemWrap">
          <span class="title"> 检验子项:</span>
          <a-input style="width: 170px" default-value="test_item_name" disabled />
        </div>
      </a-col>
      <a-col :span="4">
        <div class="itemWrap">
          <span class="title"><span class="red">*</span>子项值域:</span>
          <a-select
            mode="multiple"
            style="width: 170px"
            v-model="item.fieldChildValues"
            placeholder="请选择子项值域"
            :disabled="item.disabled"
          >
            <a-select-option v-for="(child, childIndex) in item.childArr" :key="childIndex" :value="child.valName + ''">
              {{ child.valName }}
            </a-select-option>
          </a-select>
        </div>
      </a-col>

      <a-col :span="4">
        <div class="itemWrap">
          <span class="title">CRF字段:</span>
          <a-input v-model="item.remarks" :disabled="item.disabled" style="width: 120px" default-value="" />
        </div>
      </a-col>
      <a-col :span="4">
        <div class="itemWrap">
          <a-button type="primary" @click="edit(item.fieldValues, index)">编辑</a-button>
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
import { listTest, listTestSubValues, listTestfieldValues, addOrUpdateTest, delTest } from '@/api/crf/assist'
export default {
  props: {
    assistConfigId: {
      type: String,
      default: ''
    }
  },
  components: {
  },
  data () {
    return {
      loading: false,
      formData: [],
      subjectArr: [],
      checkAll: true
    }
  },
  beforeCreate () {

  },
  beforeMount () {
  },
  mounted () {
    console.log(this.assistConfigId)
    this.getlistTestSubValues()
  },
  methods: {
    // 辅助检验列表
    getlistTest () {
      const form = new FormData()
      form.append('fromId', this.assistConfigId)
      listTest(form).then(res => {
        const arr = res.map(item => {
          const obj = {
            fieldValues: item.fieldValues.split(','),
            assistConfigId: this.assistConfigId,
            fieldChildValues: item.fieldChildValues.split(','),
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
    // 检验主题值域列表
    getlistTestSubValues () {
      listTestSubValues().then(res => {
        this.subjectArr = res.filter(item => item !== null)
      }).catch((err) => {
        console.log('报错信息', err)
      })
    },
    // 检验子项列表
    getlistTestfieldValues (form, index) {
      listTestfieldValues(form).then(res => {
        this.formData[index].childArr = res.filter(item => item !== null)
        console.log(this.formData)
      }).catch((err) => {
        console.log('报错信息', err)
      })
    },
    handleSubject (value, index) {
      const values = Object.values(value).join(',')
      const form = new FormData()
      form.append('values', values)
      this.getlistTestfieldValues(form, index)
    },
    // 添加行
    add () {
      const item = {
        fieldValues: [],
        assistConfigId: this.assistConfigId,
        fieldChildValues: [],
        remarks: '',
        childArr: [],
        disabled: false
      }
      this.formData.push(item)
    },
    edit (value, index) {
      const values = Object.values(value).join(',')
      console.log(values)
      const form = new FormData()
      form.append('values', values)
      this.getlistTestfieldValues(form, index)
      this.formData[index].disabled = false
    },
    remove (id, index) {
      if (!id) {
        this.formData.splice(index, 1)
        this.$message.success('删除成功')
      } else {
        const form = new FormData()
        form.append('id', id)
        delTest(form).then(res => {
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
          fieldValues: item.fieldValues.join(','),
          assistConfigId: this.assistConfigId,
          fieldChildValues: item.fieldChildValues.join(','),
          remarks: item.remarks
        }
        if (item && item.id) obj.id = item.id
        if (obj.fieldValues === '' || obj.fieldChildValues === '') this.checkAll = false
        return obj
      })
      if (!this.checkAll) return this.$message.warning('请完成所有必填项')
      const form = new FormData()
      form.append('proJson', JSON.stringify(arr))
      addOrUpdateTest(form).then((res) => {
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
