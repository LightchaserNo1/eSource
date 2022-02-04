<template>
  <a-modal
    :visible="visible"
    :title="title"
    @cancel="clickCancel()"
    @ok="clickConfirm()"
    width="650px"
    :ok-button-props="{ props: { disabled: stateInput } }"
  >
    <a-form-model :rules="rules" ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="科室名称" prop="name">
        <a-input v-model="form.name" :disabled="stateInput" placeholder="请输入科室名称" />
      </a-form-model-item>
      <a-form-model-item label="科室代码" prop="dcode">
        <a-input v-model="form.dcode" :disabled="stateInput" placeholder="请输入科室代码"> </a-input
        ></a-form-model-item>
      <a-form-model-item label="父科室名称" prop="pidName">
        <!-- <a-input v-model="form.pidName" :disabled="stateInput" placeholder="请输入父科室名称" /> -->
        <a-select v-model="form.pidDcode" placeholder="请选择父科室名称">
          <a-select-option :key="item.dcode" :value="item.dcode" v-for="item in departmentList">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="父科室代码" prop="pidDcode">
        <!-- <a-input v-model="form.pidDcode" :disabled="stateInput" placeholder="请输入父科室代码" /> -->
        <a-input v-model="form.pidDcode" disabled />
      </a-form-model-item>
      <a-form-model-item label="科室别称" prop="epithet">
        <a-input v-model="form.epithet" :disabled="stateInput" placeholder="请输入科室别称" />
      </a-form-model-item>
      <a-form-model-item label="请选择门诊/住院标记" prop="clincOrHospital">
        <a-select v-model="form.clincOrHospital" placeholder="请选择门诊/住院标记">
          <a-select-option :key="1" :value="1">
            门诊
          </a-select-option>
          <a-select-option :key="2" :value="2">
            住院
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="请选择内外科标记" prop="internalOrSurgery">
        <a-select v-model="form.internalOrSurgery" placeholder="请选择内外科标记">
          <a-select-option :key="0" :value="0">
            内科
          </a-select-option>
          <a-select-option :key="1" :value="1">
            外科
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="所属病区" prop="affiliationHospital">
        <a-input v-model="form.affiliationHospital" :disabled="stateInput" placeholder="请输入所属病区" />
      </a-form-model-item>
      <a-form-model-item label="录入日期" prop="input">
        <a-date-picker @change="onChange" v-model="form.input" :disabled="stateInput" />
      </a-form-model-item>
      <a-form-model-item label="停用标记" prop="deleted">
        <a-select v-model="form.deleted" placeholder="请选择停用标记">
          <a-select-option :key="0" :value="0">
            未停用
          </a-select-option>
          <a-select-option :key="1" :value="1">
            停用
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
 import { getTreeList } from '@/api/organization/organization'
export default {
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    department: {
      type: Object,
      default: () => {}
    },
    addHosObj: {
      type: Object,
      default: () => {}
    },
    bouncedState: {
      type: Number,
      default: 0
    }
  },
  components: {},
  data () {
    return {
      departmentList: [],
      dropList: [],
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      opencloseBtn: null,
      title: '公司', // 动态标题
      stateInput: false, // 动态输入框状态
      form: {},
      rules: {
        name: [{ required: true, trigger: 'change', message: '此项为必填项' }],
        dcode: [{ required: true, trigger: 'change', message: '此项为必填项' }],
        pidName: [{ required: false, trigger: 'change', message: '此项为必填项' }],
        pidDcode: [{ required: false, trigger: 'change', message: 'change' }],
        epithet: [{ required: false, trigger: 'change', message: 'change' }],
        clincOrHospital: [{ required: false, trigger: 'change', message: 'change' }],
        internalOrSurgery: [{ required: true, trigger: 'change', message: 'change' }],
        affiliationHospital: [{ required: false, trigger: 'change', message: 'change' }],
        input: [{ required: false, trigger: 'change', message: 'change' }],
        deleted: [{ required: false, trigger: 'change', message: 'change' }]
      }
    }
  },
  mounted () {
    // this.getDepartmentList()
  },
  watch: {
    visible (newv) {
      if (newv === true) {
        console.log(this.$props.department, '99999')
        this.form = this.bouncedState === 0 ? {} : this.$props.department
      }
      if (this.bouncedState === 0) {
        this.stateInput = false
        this.title = '新增'
      } else if (this.bouncedState === 1) {
        this.stateInput = false
        this.title = '编辑'
        this.opencloseBtn = !null
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
    onChange (date, dateString) {
      console.log(date, dateString)
    },
    clickCancel () {
      this.$emit('modalCancel')
      this.$refs.ruleForm.resetFields()
    },
    // 请求父科室列表
    getDepartmentList (obj) {
      // alert(123)
      getTreeList({ orgId: obj.orgId, areaId: obj.areaId })
        .then(res => {
          console.log(res, '-----------------------------')
          this.departmentList = res.content
          console.log(this.departmentList, '*****************')
        })
    }
  }
}
</script>
