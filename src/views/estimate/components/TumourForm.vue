<template>
  <a-row type="flex" :gutter="24">
    <a-col :md="24" :lg="17" type="flex">
      <!-- 患者信息 开始 -->
      <a-row type="flex" align="middle" class="form-row" :gutter="16">
        <a-tag class="step-card" color="green" v-if="step != null && step.length > 0">
          {{ step }}
        </a-tag>
        <a-tag class="step-card" color="green" v-else>
          ----
        </a-tag>
        <a-col>
          <a-row>受试者ID：{{ patientId }}</a-row>
          <a-row>患者姓名：{{ patientName }}</a-row>
        </a-col>
        <a-col>
          <a-row>
            <a-form-item
              label="评估方法"
              v-bind="topFormItemLayout"
            >
              <a-select
                :disabled="disabled"
                placeholder="请选择评估方法"
                v-decorator="[
                  'assessType',
                  {
                    rules: [{ required: true, message: '请选择评估方法'}]
                  }
                ]" >
                <a-select-option v-for="(mode, index) in modeList" :key="index" :value="mode.metaCode">{{ mode.metaName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-row>
          <a-row>
            <a-form-item
              label="评估日期"
              v-bind="topFormItemLayout"
            >
              <a-date-picker
                :disabled="disabled"
                v-decorator="[
                  'assessTime',
                  {
                    rules: [{ required: true, message: '请选择评估日期'}]
                  }
                ]" >
              </a-date-picker>
            </a-form-item>
          </a-row>
        </a-col>
      </a-row>
      <!-- 患者信息 结束 -->

      <a-divider dashed></a-divider>

      <!-- 动态表单 靶病灶位置、最长直径/淋巴结短径（mm）开始 -->
      <a-row>
        <a-col :span="12">
          <div style="display: flex; flex-direction: column;">
            <a-form-item
              labelAlign="left"
              style="margin-bottom: 10px"
              v-for="(k, index) in form.getFieldValue('babingzao')"
              :key="index"
              v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel"
              :label="index === 0 ? '靶病灶位置' : ''"
              :required="false"
            >
              <div style="display: flex;">
                <a-input
                  :disabled="disabled"
                  v-decorator="[
                    `babingzaoLocation[${index}]`,
                    {
                      validateTrigger: ['change', 'blur'],
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: '请输入靶病灶位置',
                        },
                      ],
                    },
                  ]"
                />
              </div>
            </a-form-item>
            <a-form-item v-bind="formItemLayoutWithOutLabel" v-if="disabled == false">
              <a-button type="dashed" style="width: 100px" @click="clickAddBabingZao()">
                <a-icon type="plus" />
              </a-button>
            </a-form-item>
          </div>
        </a-col>
        <a-col :span="12">
          <div style="display: flex; flex-direction: column;">
            <a-form-item
              labelAlign="left"
              style="margin-bottom: 10px"
              v-for="(k, index) in form.getFieldValue('babingzao')"
              :key="index"
              v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel"
              :label="index === 0 ? '最长直径/淋巴结短径（mm）' : ''"
              :required="false"
            >
              <div style="display: flex;">
                <a-input-number
                  style="width: 100%;"
                  :disabled="disabled"
                  v-decorator="[
                    `babingzaoSize[${index}]`,
                    {
                      validateTrigger: ['change', 'blur'],
                      rules: [
                        { required: true, message: '请输入最长直径/淋巴结短径（mm）', }
                      ],
                    },
                  ]"
                />
                <a-icon
                  v-if="form.getFieldValue('babingzao').length > 1 && disabled == false"
                  class="dynamic-delete-button"
                  type="minus-circle-o"
                  :disabled="form.getFieldValue('babingzao').length === 1"
                  @click="clickRemoveBabingZao(index)"
                />
              </div>
            </a-form-item>
          </div>
        </a-col>
      </a-row>
      <!-- 动态表单 靶病灶位置、最长直径/淋巴结短径（mm）结束 -->

      <a-divider dashed></a-divider>

      <!-- 动态表单 非靶病灶位置、非靶病灶其他描述 开始 -->
      <a-row>
        <a-col :span="12">
          <div style="display: flex; flex-direction: column;">
            <a-form-item
              labelAlign="left"
              style="margin-bottom: 10px"
              v-for="(k, index) in form.getFieldValue('feibabingzao')"
              :key="index"
              v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel"
              :label="index === 0 ? '非靶病灶位置' : ''"
              :required="false"
            >
              <div style="display: flex;">
                <a-input
                  :disabled="disabled"
                  v-decorator="[
                    `feibabingzaoLocation[${index}]`,
                    {
                      validateTrigger: ['change', 'blur'],
                      rules: [
                        {
                          required: false,
                          whitespace: false,
                          message: '请输入靶病灶位置',
                        },
                      ],
                    },
                  ]"
                />
              </div>
            </a-form-item>
            <a-form-item v-bind="formItemLayoutWithOutLabel" v-if="disabled == false">
              <a-button type="dashed" style="width: 100px" @click="clickAddFeiBabingZao()">
                <a-icon type="plus" />
              </a-button>
            </a-form-item>
          </div>
        </a-col>
        <a-col :span="12">
          <div style="display: flex; flex-direction: column;">
            <a-form-item
              labelAlign="left"
              style="margin-bottom: 10px"
              v-for="(k, index) in form.getFieldValue('feibabingzao')"
              :key="index"
              v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel"
              :label="index === 0 ? '非靶病灶其他描述' : ''"
              :required="false"
            >
              <div style="display: flex;">
                <a-input
                  :disabled="disabled"
                  v-decorator="[
                    `feibabingzaoOther[${index}]`,
                    {
                      validateTrigger: ['change', 'blur'],
                      rules: [
                        {
                          required: false,
                          whitespace: false,
                          message: '请输入非靶病灶其他描述',
                        },
                      ],
                    },
                  ]"
                />
                <a-icon
                  v-if="form.getFieldValue('feibabingzao').length > 1 && disabled == false"
                  class="dynamic-delete-button"
                  type="minus-circle-o"
                  :disabled="form.getFieldValue('feibabingzao').length === 1"
                  @click="clickRemoveFeiBabingZao(index)"
                />
              </div>
            </a-form-item>
          </div>
        </a-col>
      </a-row>
      <!-- 动态表单 非靶病灶位置、非靶病灶其他描述 结束 -->

      <a-divider dashed></a-divider>

      <!-- 新病灶 开始 -->
      <a-row type="flex" align="middle">
        <a-form-item
          v-bind="bottomFormItemLayout"
          labelAlign="left"
          label="新病灶"
        >
          <a-radio-group
            :disabled="disabled"
            v-decorator="[
              'isNewTarget',
              {
                initialValue: 0
              },
            ]">
            <a-radio :value="0">
              无
            </a-radio>
            <a-radio :value="1">
              有，病灶部位 →
            </a-radio>
          </a-radio-group>

        </a-form-item>
        <a-form-item
          style="margin-right: 10px;"
          v-show="form.getFieldValue('isNewTarget') === 1"
          v-for="(k, index) in form.getFieldValue('newDiseaseInput')"
          :key="index"
        >
          <a-input
            :disabled="disabled"
            v-decorator="[
              `disease[${index}]`,
              {
                rules: [
                  {
                    required: form.getFieldValue('isNewTarget') === 1,
                    whitespace: true,
                    message: '请输入病灶部位',
                  },
                ],
              },
            ]"
          >
            <a-icon v-if="form.getFieldValue('newDiseaseInput').length > 1 && disabled == false" slot="addonAfter" type="delete" @click="clickRemoveDisease(index)" />
          </a-input>
        </a-form-item>

        <a-button type="dashed" v-show="disabled == false && form.getFieldValue('isNewTarget') === 1" @click="clickAddDisease()">
          <a-icon type="plus" />
        </a-button>
      </a-row>
      <!-- 新病灶 结束 -->
    </a-col>
    <!-- 疗效评价 开始 -->
    <a-col :md="24" :lg="7" type="flex">
      <div style="font-size: 18px; font-weight: 500; color: #000000; margin-bottom: 10px;">疗效评价(CR、PR、SD、PD等)</div>
      <a-row :flex="1">
        <a-form-item
          label="靶病灶"
          labelAlign="left"
          v-bind="rightFormItemLayout"
        >
          <a-textarea
            :disabled="disabled"
            style="width: 100%"
            :rows="4"
            v-decorator="[
              `evTarget`,
              {
                validateTrigger: ['change', 'blur'],
                rules: [
                  {
                    required: false,
                    whitespace: false,
                    message: '请输入靶病灶评价',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
      </a-row>
      <a-row :flex="1">
        <a-form-item
          label="非靶病灶"
          labelAlign="left"
          v-bind="rightFormItemLayout"
        >
          <a-textarea
            :disabled="disabled"
            :rows="4"
            v-decorator="[
              `evUntarget`,
              {
                validateTrigger: ['change', 'blur'],
                rules: [
                  {
                    required: false,
                    whitespace: false,
                    message: '请输入非靶病灶评价',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
      </a-row>
      <a-row :flex="1">
        <a-form-item
          label="整体反应"
          labelAlign="left"
          v-bind="rightFormItemLayout"
        >
          <a-textarea
            :disabled="disabled"
            :rows="4"
            v-decorator="[
              `evReaction`,
              {
                validateTrigger: ['change', 'blur'],
                rules: [
                  {
                    required: false,
                    whitespace: false,
                    message: '请输入整体反应',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
      </a-row>
    </a-col>
    <!-- 疗效评价 结束 -->
  </a-row>
</template>

<script>

import { getDictionaryList } from '@/api/optionConfig/optionConfig'

export default {
  props: {
    form: {
      type: Object,
      default: null
    },
    // 受试者ID
    patientId: {
      default: null,
      type: [String, Number]
    },
    // 患者姓名
    patientName: {
      default: null,
      type: [String, Number]
    },
    // 试验阶段
    step: {
      default: null,
      type: [String, Number]
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 表单样式
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 24 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 }
        }
      },
      rightFormItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 24 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 24 }
        }
      },
      topFormItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      bottomFormItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 19 }
        }
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 0 }
        }
      },
      // 评估方法
      modeList: []
    }
  },
  mounted () {
    this.queryEstimateType()
    this.$emit('gainValue')
  },
  methods: {
    queryEstimateType () {
      getDictionaryList({
        typeCode: '10001010'
      }).then(res => {
        this.modeList = res
      })
    },
    clickAddBabingZao () {
      const { form } = this
      const keys = form.getFieldValue('babingzao')
      const nextKeys = keys.concat('')
      console.log('#####', nextKeys)
      form.setFieldsValue({
        'babingzao': nextKeys
      })
    },
    clickRemoveBabingZao (k) {
      const { form } = this
      const keys = form.getFieldValue('babingzao')

      if (keys.length === 1) {
        return
      }

      // 删除控制 单元格数量的字段
      keys.splice(k, 1)
      form.setFieldsValue({
        'babingzao': keys
      })
      // 删除 左侧 数据源
      const leftKeys = form.getFieldValue('babingzaoLocation')
      leftKeys.splice(k, 1)
      form.setFieldsValue({
        'babingzaoLocation': leftKeys
      })

      // 删除 右侧 数据源
      const rightKeys = form.getFieldValue('babingzaoSize')
      rightKeys.splice(k, 1)
      form.setFieldsValue({
        'babingzaoSize': rightKeys
      })
    },
    clickAddFeiBabingZao () {
      const { form } = this
      const keys = form.getFieldValue('feibabingzao')
      const nextKeys = keys.concat('')
      console.log('#####', nextKeys)
      form.setFieldsValue({
        'feibabingzao': nextKeys
      })
    },
    clickRemoveFeiBabingZao (k) {
      const { form } = this
      const keys = form.getFieldValue('feibabingzao')

      if (keys.length === 1) {
        return
      }

      // 删除控制 单元格数量的字段
      keys.splice(k, 1)
      form.setFieldsValue({
        'feibabingzao': keys
      })
      // 删除 左侧 数据源
      const leftKeys = form.getFieldValue('feibabingzaoLocation')
      leftKeys.splice(k, 1)
      form.setFieldsValue({
        'feibabingzaoLocation': leftKeys
      })

      // 删除 右侧 数据源
      const rightKeys = form.getFieldValue('feibabingzaoOther')
      rightKeys.splice(k, 1)
      form.setFieldsValue({
        'feibabingzaoOther': rightKeys
      })
    },
    clickAddDisease () {
      const { form } = this
      const keys = form.getFieldValue('newDiseaseInput')
      const nextKeys = keys.concat('')
      console.log('#####', nextKeys)
      form.setFieldsValue({
        'newDiseaseInput': nextKeys
      })
    },
    clickRemoveDisease (index) {
      const { form } = this
      const keys = form.getFieldValue('newDiseaseInput')

      if (keys.length === 1) {
        return
      }

      // 删除控制 单元格数量的字段
      keys.splice(index, 1)
      form.setFieldsValue({
        'newDiseaseInput': keys
      })
      // 删除 左侧 数据源
      const leftKeys = form.getFieldValue('disease')
      leftKeys.splice(index, 1)
      form.setFieldsValue({
        'disease': leftKeys
      })
    }
  }
}
</script>

<style scoped lang="less">

  .step-card {

    width: 100px;
    height: 60px;
    line-height: 60px;
    text-align: center;

    font-size: 20px;
    font-weight: 500;
  }

  .dynamic-delete-button {
    cursor: pointer;
    position: relative;
    top: 4px;
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

  .ant-form-item {
    margin-bottom: 0;
  }

</style>
