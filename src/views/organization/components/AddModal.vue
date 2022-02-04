<template>
  <a-modal
    :visible="visible"
    :title="title"
    :backData="editContent"
    :openType="openType"
    @cancel="clickCancel()"
    @ok="clickConfirm()"
    width="650px"
    :ok-button-props="{ props: { disabled: stateInput } }"
  >
    <a-form-model :rules="rules" ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="组织机构名称" prop="orgName">
        <a-input v-model.trim="form.orgName" :disabled="stateInput" placeholder="组织机构名称" />
      </a-form-model-item>
      <a-form-model-item label="组织机构代码" prop="orgCode">
        <a-input v-model.trim="form.orgCode" :disabled="stateInput" placeholder="组织机构代码"> </a-input
        ></a-form-model-item>
      <a-form-model-item label="英文名" prop="englishName">
        <a-input v-model.trim="form.englishName" :disabled="stateInput" placeholder="英文名" />
      </a-form-model-item>
      <a-form-model-item label="简称" prop="shortName">
        <a-input v-model.trim="form.shortName" :disabled="stateInput" placeholder="简称" />
      </a-form-model-item>
      <a-form-model-item label="地址" prop="address">
        <a-input v-model.trim="form.address" :disabled="stateInput" placeholder="择地址" />
      </a-form-model-item>
      <a-form-model-item label="联系人" prop="contacts">
        <a-input v-model.trim="form.contacts" :disabled="stateInput" placeholder="联系人" />
      </a-form-model-item>
      <a-form-model-item label="联系方式" >
        <a-input v-model.trim="form.phone" :disabled="stateInput" placeholder="联系方式" />
      </a-form-model-item>
      <a-form-model-item label="联系人邮箱" prop="email">
        <a-input v-model.trim="form.email" :disabled="stateInput" placeholder="请选择联系人邮箱" />
      </a-form-model-item>
      <a-form-model-item label="机构类型" prop="orgType" v-if="!this.status">
        <a-select v-model="form.orgType" placeholder="请选择机构类型">
          <a-select-option v-for="item in business" :key="item.id" :value="item.id">
            {{ item.metaName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="机构类型" v-if="this.status === 1">
        {{ nowBusiness.metaName }}
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
export default {
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    business: {
      type: Array,
      default: () => []
    },
    editContent: {
      type: Object,
      default: () => {}
    },
    openType: {
      type: Number,
      default: 0
    },
    status: {
      type: Number,
      default: 0
    }
  },
  components: {},
  data () {
    return {
      dropList: [],
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
      opencloseBtn: null,
      nowBusiness: {}, // 默认选项
      title: '公司', // 动态标题
      stateInput: false, // 动态输入框状态
      form: {},
      rules: {
        orgName: [
          { required: true, trigger: 'change', message: '此项为必填项' },
          { min: 0, max: 30, message: '组织机构名称长度需限制在30个字符内' }
        ],
        orgCode: [{ required: true, trigger: 'change', message: '此项为必填项' }],
        address: [{ required: true, trigger: 'change', message: '此项为必填项' }],
        phone: [
          { required: true, message: '请输入手机' },
          { pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '手机号格式错误' }
        ],
        applyName: [{ required: false, trigger: 'change', message: '此项为必填项' }],
        englishName: [{ required: false, trigger: 'change', message: '此项为必填项' }],
        shortName: [{ required: false, trigger: 'change', message: '此项为必填项' }],
        contacts: [{ required: false, trigger: 'change', message: '此项为必填项' }],
        email: [{ required: false, trigger: 'change', message: '此项为必填项' }],
        orgType: [{ required: true, trigger: 'change', message: '此项为必填项' }]
      }
    }
  },
  mounted () {
    if (this.editContent.id != null) {
      this.form = this.editContent
    } else {
    }
  },
  watch: {
    business (val) {
      this.business = val
      console.log('66666', this.business)
    },
    visible (newv) {
      if (newv === true) {
        this.form = this.openType === 0 ? {} : this.editContent
      }
      if (this.openType === 0) {
        this.stateInput = false
        this.title = '新增'
      } else if (this.openType === 1) {
        this.stateInput = false
        this.title = '编辑'
        this.opencloseBtn = !null
      } else {
        this.stateInput = true
        this.title = '详情'
        this.opencloseBtn = null
      }
      if (this.status === 1) {
        this.business.forEach(item => {
          if (item.metaName === '申办方') {
            this.nowBusiness = item
            this.form.orgType = item.id
          }
        })
      }
    }
  },
  methods: {
    clickConfirm () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$emit('modalOk', this.form)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    clickCancel () {
      this.$emit('modalCancel')
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>
