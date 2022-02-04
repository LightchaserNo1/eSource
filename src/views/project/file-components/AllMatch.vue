<template>
  <div>
    <a-card>
      <a-button @click="clickBack" style="margin-bottom:24px;">返回上一级</a-button>
      <div>
        <s-table
          :rowKey="record=>record.id"
          :columns="columns"
          ref="table"
          :data="loadData">
          <template slot="type" slot-scope="text,record">
            <div>
              <span v-if="record.type==1">患者id:     {{ record.empiId }}</span>
              <span v-else-if="record.type==2">门诊Id:    {{ record.outhospIndexNo }}</span>
              <span v-else-if="record.type==3">住院Id:   {{ record.inhospIndexNo }}</span>
              <span v-else-if="record.type==4">身份证Id:     {{ record.ptsIdentity }}</span>
            </div>
          </template>
          <template slot="action" slot-scope="text,record">
            <div>
              <div class="table-action" @click="clickUpdate(record)">编辑</div>
              <a-popconfirm title="是否确认删除？" @confirm="confirmDelete(record)">
                <div class="table-action">删除</div>
              </a-popconfirm>
            </div>
          </template>
        </s-table>
      </div>
      <a-modal :visible="visible" :width="600" @ok="modalOk" @cancel="modalCancel">
        <div style="width:80%;">
          <a-form-model
            :model="form"
            :rules="rules"
            ref="ruleForm"
            label-align="left"
            :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <a-form-model-item :label="formTitle" :prop="formProp">
              <a-input v-model.trim="form.empiId" v-if="updateType==1"/>
              <a-input v-model.trim="form.outhospIndexNo" v-else-if="updateType==2"/>
              <a-input v-model.trim="form.inhospIndexNo" v-else-if="updateType==3"/>
              <a-input v-model.trim="form.ptsIdentity" v-else-if="updateType==4"/>
            </a-form-model-item>
            <a-form-model-item label="受试者编号" prop="ptsNo">
              <a-input v-model.trim="form.ptsNo"/>
            </a-form-model-item>
          </a-form-model>
        </div>
      </a-modal>
    </a-card>
  </div>
</template>
<script>
import { getWorkList, updateCatchTask, deleteCatchTask } from '@/api/patient/patient'
export default {
  props: {

  },
  components: {

  },
  data () {
    return {
      visible: false,
      formProp: '',
      rules: {
        empiId: [{ required: true, message: '请输入患者id' }],
        outhospIndexNo: [{ required: true, message: '请输入门诊id' }],
        inhospIndexNo: [{ required: true, message: '请输入与住院id' }],
        ptsIdentity: [{ required: true, message: '请输入身份证Id' }],
        ptsNo: [{ required: true, message: '请输入受试者编号' }]
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 24 },
      form: {},
      mainId: null,
      updateType: null,
      commonParamter: null,
      formTitle: null,
      queryParams: {},
      columns: [
         {
          title: '患者标识',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '受试者编号',
          dataIndex: 'ptsNo'
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        return getWorkList({ ...parameter, ...this.queryParam, proId: this.$store.getters.project.id }).then(
          res => res
        )
      }
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    clickBack () {
      this.$emit('back')
    },
    clickUpdate (record) {
      const { empiId, outhospIndexNo, inhospIndexNo, ptsIdentity, type, ptsNo, id } = record
      this.mainId = id
      this.form = { empiId, outhospIndexNo, inhospIndexNo, ptsIdentity, ptsNo }
      this.commonParamter = empiId || outhospIndexNo || inhospIndexNo || ptsIdentity
      this.updateType = type
      if (type === 1) {
        this.formProp = 'empiId'
        this.formTitle = '患者id:'
      } else if (type === 2) {
        this.formProp = 'outhospIndexNo'
        this.formTitle = '门诊id:'
      } else if (type === 3) {
        this.formProp = 'inhospIndexNo'
        this.formTitle = '住院Id'
      } else {
        this.formProp = 'ptsIdentity'
        this.formTitle = '身份证Id'
      }
      this.visible = true
    },
    // 确认删除
    confirmDelete (record) {
      console.log('确认删除')
      deleteCatchTask({ id: record.id }).then(res => {
        this.$refs.table.refresh(true)
        this.$message.success('删除成功')
      })
    },
    modalOk () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          updateCatchTask({ ...this.form, id: this.mainId, type: this.updateType }).then(res => {
            this.$refs.table.refresh(true)
            this.$message.success('修改成功')
            this.visible = false
            this.$refs.ruleForm.resetFields()
          })
        }
      })
    },
    modalCancel () {
      this.visible = false
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>
<style scoped lang="">

</style>
