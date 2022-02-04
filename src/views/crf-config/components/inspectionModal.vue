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
          <a-input
            style="width: 170px"
            default-value="test_item_name"
            disabled />
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
            <a-select-option
              v-for="(item1, index1) in subjectArr"
              :key="index1"
              :value="item1.valName">
              {{ item1.valName }}
            </a-select-option>
          </a-select>
        </div>
      </a-col>
      <a-col :span="4">
        <div class="itemWrap">
          <span class="title"> 检验子项:</span>
          <a-input
            style="width: 170px"
            default-value="test_detail_item_name"
            disabled />
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
            <a-select-option
              v-for="(child, childIndex) in item.childArr"
              :key="childIndex"
              :value="child.valName + ''">
              {{ child.valName }}
            </a-select-option>
          </a-select>
        </div>
      </a-col>

      <a-col :span="4">
        <div class="itemWrap">
          <span class="title">CRF字段:</span>
          <a-input
            v-model="item.crfField"
            :disabled="item.disabled"
            style="width: 120px"
            default-value="" />
        </div>
      </a-col>
      <a-col :span="4">
        <div class="itemWrap">
          <a-button
            type="primary"
            @click="edit(item.fieldValues, index)">编辑</a-button>
          <a-button
            type="primary"
            style="margin-left: 10px"
            @click="remove(item.id, index)">删除</a-button>
        </div>
      </a-col>
    </a-row>
    <a-row
      type="flex"
      justify="start"
      align="top">
      <div style="align-self: flex-start">
        <a-popconfirm
          title="确认取消?"
          @confirm="delTemplate">
          <a-button
            type="primary"
            style="width: 100px">删除章节</a-button>
        </a-popconfirm>
      </div>
      <div style="flex: 1; text-align: center">
        <a-button
          type="primary"
          style="width: 100px; margin-left: 30px"
          @click="add">添加行</a-button>
        <a-button
          type="primary"
          style="width: 100px; margin-left: 30px"
          @click="submit">保存</a-button>
      </div>
    </a-row>
  </div>
</template>
<script>
import { subjectList, childValues, addOrUpdateTestCrfPro, listChapterBytemplate, delTest, delTemplate } from '@/api/crf/crf'
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
      // formData: this.proJson && this.proJson.length ? this.proJson : [ ],
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
    this.getsubjectList()
    if (this.proJson) {
      const arr = this.proJson.map(item => {
        const obj = {
          crfField: item.crfField,
          crfTrialStageId: item.crfTrialStageId,
          fieldChildValues: item.fieldChildValues === '' ? [] : item.fieldChildValues.split(','),
          fieldValues: item.fieldValues === '' ? [] : item.fieldValues.split(','),
          childArr: [],
          disabled: false
        }
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
    // 获取主题值域列表
    getsubjectList () {
      console.log('主题值域')
      subjectList().then(res => {
        this.subjectArr = res.filter(item => item !== null)
      }).catch((err) => {
        console.log('报错信息', err)
        this.loading = false
      })
    },
    // 获取子列表
    getchildValues (form, index) {
      this.formData[index].fieldChildValues = []
      childValues(form).then(res => {
        this.formData[index].childArr = res
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
          const obj = {
            crfField: item.crfField,
            crfTrialStageId: item.crfTrialStageId,
            fieldChildValues: item.fieldChildValues === '' ? [] : item.fieldChildValues.split(','),
            fieldValues: item.fieldValues === '' ? [] : item.fieldValues.split(','),
            childArr: [],
            disabled: false
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
    handleSubject (value, index) {
      const values = Object.values(value).join(',')
      const form = new FormData()
      form.append('values', values)
      this.getchildValues(form, index)
    },
    // 添加行
    add () {
      const item = {
        crfField: '',
        crfTrialStageId: this.crfTrialStageId,
        fieldChildValues: [],
        fieldValues: [],
        childArr: []
      }
      this.formData.push(item)
    },
    edit (value, index) {
      const values = Object.values(value).join(',')
      console.log(values)
      const form = new FormData()
      form.append('values', values)
      this.getchildValues(form, index)
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
    // 删除检验表
    delTemplate () {
      const form = new FormData()
      form.append('id', this.crfTrialStageId)
      form.append('type', '1')
      delTemplate(form).then(res => {
        this.$message.success('删除成功')
        this.$emit('getList', this.stageId)
      })
    },
    // 提交
    submit () {
      this.checkAll = true
      console.log(this.formData)
      const arr = this.formData.map(item => {
        const obj = {
          crfField: item.crfField,
          crfTrialStageId: this.crfTrialStageId,
          fieldChildValues: item.fieldChildValues.join(','),
          fieldValues: item.fieldValues.join(',')
        }
        if (item && item.id) obj.id = item.id
        if (obj.fieldChildValues === '' || obj.fieldValues === '') this.checkAll = false
        return obj
      })
      console.log(arr)
      if (!this.checkAll) return this.$message.warning('请完成所有必填项')
      const form = new FormData()
      form.append('proJson', JSON.stringify(arr))
      addOrUpdateTestCrfPro(form).then((res) => {
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
.itemBorder {
  padding: 15px 10px;
}
.itemWrap {
  margin-bottom: 20px;
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  .title {
    text-align: center;
    margin-right: 15px;
    .red {
      color: red;
    }
  }
}
</style>
