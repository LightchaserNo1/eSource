<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd()">新建部门</a-button>
      </div>
      <s-table
        ref="table"
        size="default"
        :rowKey="(record) => record.id"
        :columns="columns"
        :data="loadData"
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm
              title="是否确认删除？"
              @confirm="handleDelete(record)"
            >
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </template>
        </span>
      </s-table>
    </a-card>
    <DeptCreateFormModal
      ref="collectionForm"
      :visible.sync="addVisible"
      :title="editType == 1 ? '编辑部门' : '新建部门'"
      :initialFormValue="formValue"
      @cancel="handleCancel"
      @submit="handleOk">
    </DeptCreateFormModal>
  </page-header-wrapper>
</template>

<script>
import { fetchDepartmentList, requestAddDepartment, requestUpdateDepartment, requestDeleteDepartment } from '@/api/account/dept'
import DeptCreateFormModal from './components/DeptCreateFormModal.vue'
import { buildPaginationObj } from '@/components/Table'

export default {
  name: 'DepartmentList',
  components: {
    DeptCreateFormModal
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '部门ID',
          dataIndex: 'id'
        },
        {
          title: '部门名称',
          dataIndex: 'name'
        },
        {
          title: '部门人数',
          dataIndex: 'num'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return fetchDepartmentList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return buildPaginationObj(res)
          })
      },
      editType: 0, // 0:新增部门 1:编辑部门
      formValue: {},
      addVisible: false
    }
  },
  created () {

  },
  methods: {
    handleAdd () {
      this.addVisible = true
      this.editType = 0
      this.formValue = {}
    },
    handleEdit (record) {
      this.editType = 1
      this.addVisible = true
      this.formValue = record
      console.log('编辑: ', record)
    },
    handleDelete (record) {
      console.log('删除: ', record)
      requestDeleteDepartment({
        id: record.id
      }).then(res => {
        this.$message.success('删除成功！')
        this.$refs.table.refresh(true)
      }).catch(_ => {

      })
    },
    handleCancel () {
      this.addVisible = false
      const form = this.$refs.collectionForm.form
      form.resetFields()
      this.formValue = {}
    },
    handleOk () {
      const form = this.$refs.collectionForm.form
      form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          if (this.editType === 0) {
            requestAddDepartment(values).then(res => {
              this.$message.success('操作成功！')
              this.handleCancel()
              this.$refs.table.refresh(true)
            }).catch(_ => {

            })
          } else {
            requestUpdateDepartment(values).then(res => {
              this.$message.success('操作成功！')
              this.handleCancel()
              this.$refs.table.refresh(true)
            }).catch(_ => {

            })
          }
        }
      })
    }
  }
}
</script>
