<template>
  <!-- 停止抓取弹框组件 -->
  <div>
    <a-modal
      title="停止同步原因"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel">
      <!-- <div class="box">
        <a-checkbox v-model="check" ></a-checkbox>
        <a style="margin-left:14px;" v-if="status==1">确定该受试者不在进行临床试验项目,并停止该患者诊疗数据的持续追踪</a>
        <a style="margin-left:14px;" v-else>确定该受试者继续进行临床试验项目,并继续该患者诊疗数据的持续追踪</a>
      </div> -->
      <a-form-model :model="form" :rules="rules" ref="ruleForm">
        <a-form-model-item>
          <a-radio-group v-model="form.resource" @change="onChange">
            <a-radio value="受试者已完成试验">
              受试者已完成试验
            </a-radio>
            <a-radio value="受试者脱落">
              受试者脱落
            </a-radio>
            <a-radio value="受试者停止试验">
              受试者停止试验
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="其它原因:">
          <a-input v-model="form.other" title="其它" type="textarea" @change="() => {form.resource = ''}" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>

export default {
  props: {
    visible: {
      required: true,
      type: Boolean
    },
    status: {
      default: null,
      type: [String, Number]
    }
  },
  components: {

  },
  data () {
    return {
      form: {},
      rules: {
        other: [{ max: 8, message: '字数不可超过800字', trigger: 'blur' }]
      }
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    onChange (e) {
      console.log('radio checked')
      this.form.other = ''
    },
    handleOk () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          console.log(this.form)
          if (!this.form.length && !this.form.other && !this.form.resource) {
            this.$message.error('请选择停止同步原因')
            return false
          }
          const form = { ...this.form }
          this.form = {}
          this.$emit('modalOk', form)
        }
      })
    },
    handleCancel () {
      this.check = false
      this.$emit('modalCancel')
    }
  }
}
</script>
<style scoped lang="">

</style>
