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
      <a-col :span="5">
        <div class="itemWrap">
          <span class="title"><span class="red">*</span>表名:</span>
          <a-select
            style="width: 170px"
            v-model="item.tableName"
            placeholder="请选择表名"
            :disabled="item.disabled"
            @change="(val) => handleChange(val, index)"
          >
            <a-select-option
              v-for="(listItem, listIndex) in listTable"
              :key="listIndex"
              :value="listItem.dictionaryName"
            >
              {{ listItem.dictionaryName }}
            </a-select-option>
          </a-select>
        </div>
      </a-col>
      <a-col :span="5">
        <div class="itemWrap">
          <span class="title"><span class="red">*</span>DWD字段:</span>
          <a-select
            style="width: 170px"
            v-model="item.fieldName"
            placeholder="请选择DWD字段"
            :disabled="item.disabled"
            @change="(val) => handleField(val, item.tableName, index)"
          >
            <a-select-option v-for="(field, findex) in listField" :key="findex" :value="field.dictionaryName">
              {{ field.dictionaryName }}
            </a-select-option>
          </a-select>
        </div>
      </a-col>
      <a-col :span="5">
        <!-- <div class="itemWrap">
          <span class="title"><span class="red">*</span>DWD值域:</span>
          <a-select
            mode="multiple"
            style="width: 170px"
            v-model="item.fieldValues"
            placeholder="请选择DWD值域"
            :disabled="item.disabled"
          >
            <a-select-option v-for="(child, childIndex) in item.childArr" :key="childIndex" :value="child.valName + ''">
              {{ child.valName }}
            </a-select-option>
          </a-select>
        </div> -->
        <!-- 暂时去除了必选 -->
        <div class="itemWrap">
          <span class="title">DWD值域:</span>
          <a-select
            mode="multiple"
            style="width: 170px"
            v-model="item.fieldValues"
            :disabled="item.disabled"
          >
            <a-select-option v-for="(child, childIndex) in item.childArr" :key="childIndex" :value="child.valName + ''">
              {{ child.valName }}
            </a-select-option>
          </a-select>
        </div>
      </a-col>

      <a-col :span="5">
        <div class="itemWrap">
          <span class="title">CRF字段:</span>
          <a-input v-model="item.crfField" :disabled="item.disabled" style="width: 120px" default-value="" />
        </div>
      </a-col>
      <a-col :span="4">
        <div class="itemWrap">
          <a-button type="primary" @click="edit(item.tableName, item.fieldName, index)">编辑</a-button>
          <a-button type="primary" style="margin-left: 10px" @click="remove(item.id, index)">删除</a-button>
        </div>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center" align="top">
      <div style="align-self: flex-start">
        <a-popconfirm title="确认取消?" @confirm="delTemplate">
          <a-button type="primary" style="width: 100px">删除章节</a-button>
        </a-popconfirm>
      </div>
      <div style="flex: 1; text-align: center">
        <a-button type="primary" style="width: 100px; margin-left: 30px" @click="add">添加行</a-button>
        <a-button type="primary" style="width: 100px; margin-left: 30px" @click="submit">保存</a-button>
      </div>
    </a-row>
  </div>
</template>
<script>
import { listTable, listField, listCommValues, addOrUpdateCommPro, listChapterBytemplate, delComm, delTemplate } from '@/api/crf/crf'
export default {
  props: {
    crfTrialStageId: {
      type: String,
      default: ''
    },
    stageId: {
      type: String,
      default: ''
    },
    proJson: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  components: {
  },
  data () {
    return {
      loading: false,
      formData: [],
      listTable: [],
      listField: [],
      tableName: undefined,
      checkAll: true
    }
  },
  beforeCreate () {

  },
  beforeMount () {
  },
  mounted () {
    this.getlistTable()
    if (this.proJson) {
      const arr = this.proJson.map(item => {
        let obj = {}
        if (item.fieldValues === '') {
            obj = {
              crfTrialStageId: item.crfTrialStageId,
              tableName: item.tableName,
              fieldName: item.fieldName,
              crfField: item.crfField,
              childArr: [],
              disabled: false
            }
        } else {
          console.log(item)
          obj = {
            crfTrialStageId: item.crfTrialStageId,
            tableName: item.tableName,
            fieldName: item.fieldName,
            fieldValues: item.fieldValues.split(','),
            crfField: item.crfField,
            childArr: [],
            disabled: false
          }
        }
        this.tableName = item.tableName
        if (item && item.id) {
          obj.id = item.id
          obj.disabled = true
        }
        return obj
      })
      this.formData = arr
    } else {
      this.getChapterBytemplate()
    }
  },
  methods: {
    // 获取列表
    getlistTable () {
      listTable().then(res => {
        this.listTable = res.filter(item => item !== null)
        if (this.tableName) {
          this.handleChange(this.tableName)
        }
      }).catch((err) => {
        console.log('报错信息', err)
        this.loading = false
      })
    },
    // 根据表字段获取DWD字段列表
    handleChange (value, index) {
      const aArr = this.listTable.filter(item => item.dictionaryName === value)
      this.tableName = value
      this.formData[index].fieldName = []
      this.formData[index].fieldValues = []
      this.getlistField(aArr[0].id)
    },
    // 获取列表
    getlistField (tableId) {
      const form = new FormData()
      form.append('tableId', tableId)
      listField(form).then(res => {
        this.listField = res
      }).catch((err) => {
        console.log('报错信息', err)
        this.loading = false
      })
    },
    handleField (fieldName, tableName, index) {
      console.log(fieldName, tableName)
      const form = new FormData()
      form.append('fieldName', fieldName)
      form.append('tableName', tableName)
      this.formData[index].fieldValues = []
      this.getlistCommValues(form, index)
    },
    // 获取列表
    getlistCommValues (form, index) {
      this.formData[index].fieldChildValues = []
      listCommValues(form).then(res => {
        this.formData[index].childArr = res.filter(item => item !== null)
        console.log(this.formData)
      }).catch((err) => {
        console.log('报错信息', err)
        this.loading = false
      })
    },
    getChapterBytemplate () {
      const form = new FormData()
      form.append('templateId', this.crfTrialStageId)
      listChapterBytemplate(form).then(res => {
        const arr = res.map(item => {
          let obj = {}
          if (item.fieldValues === '') {
            obj = {
              crfTrialStageId: item.crfTrialStageId,
              tableName: item.tableName,
              fieldName: item.fieldName,
              crfField: item.crfField,
              childArr: [],
              disabled: false
            }
          } else {
            console.log(item)
            obj = {
              crfTrialStageId: item.crfTrialStageId,
              tableName: item.tableName,
              fieldName: item.fieldName,
              fieldValues: item.fieldValues.split(','),
              crfField: item.crfField,
              childArr: [],
              disabled: false
            }
          }
          if (item && item.id) {
            obj.id = item.id
            obj.disabled = true
          }
          return obj
        })
        this.formData = arr
      }).catch((err) => {
        console.log('报错信息', err)
        this.loading = false
      })
    },

    // 添加行
    add () {
      const item = {
        crfTrialStageId: this.crfTrialStageId,
        tableName: this.tableName,
        fieldName: undefined,
        fieldValues: [],
        crfField: '',
        childArr: [],
        disabled: false
      }
      this.formData.push(item)
    },
    edit (tableName, fieldName, index) {
      // const values = Object.values(value).join(',')
      // console.log(values)
      const form = new FormData()
      form.append('fieldName', fieldName)
      form.append('tableName', tableName)
      this.formData[index].disabled = false
      this.getlistCommValues(form, index)
    },
    remove (id, index) {
      if (!id) {
        this.formData.splice(index, 1)
        this.$message.success('删除成功')
      } else {
        const form = new FormData()
        form.append('id', id)
        delComm(form).then(res => {
          this.formData.splice(index, 1)
          this.$message.success('删除成功')
        })
      }
    },
    // 删除检查/通用表
    delTemplate () {
      const form = new FormData()
      form.append('id', this.crfTrialStageId)
      form.append('type', '2')
      delTemplate(form).then(res => {
        this.$message.success('删除成功')
        this.$emit('getList', this.stageId)
      })
    },
    // 提交
    submit () {
      this.checkAll = true
      const arr = this.formData.map(item => {
        const obj = {
          crfTrialStageId: this.crfTrialStageId,
          tableName: item.tableName,
          fieldName: item.fieldName,
          fieldValues: item.fieldValues.join(','),
          crfField: item.crfField
        }
        if (item && item.id) obj.id = item.id
        // if (obj.tableName === '' || obj.fieldName === '' || obj.fieldValues === '') this.checkAll = false
        return obj
      })
      if (!this.checkAll) return this.$message.warning('请完成所有必填项')
      const form = new FormData()
      form.append('proJson', JSON.stringify(arr))
      addOrUpdateCommPro(form).then((res) => {
        this.$message.success('保存成功')
        this.getChapterBytemplate()
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
