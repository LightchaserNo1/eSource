<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd()">新建权限</a-button>
      </div>
      <s-table
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :expanded-row-keys.sync="expandedRowKeys">
        <span slot="action" slot-scope="text, record">
          <template>
            <div style="display: flex; flex-direction: column">
              <a v-if="record.pid == 0" @click="handleAdd(record)">添加下级权限</a>
              <div v-if="record.children != null" style="height: 5px"></div>
              <div style="display: flex; align-items: center">
                <a-popconfirm title="是否确认删除？" @confirm="handleDelete(record)">
                  <a>删除</a>
                </a-popconfirm>
              </div>
            </div>
          </template>
        </span>
      </s-table>
    </a-card>
    <PermissionCreateFormModal
      ref="collectionForm"
      :visible.sync="addVisible"
      :title="editType == 1 ? '编辑权限' : '新建权限'"
      :initialFormValue="formValue"
      @cancel="handleCancel"
      @submit="handleOk">

    </PermissionCreateFormModal>
  </page-header-wrapper>
</template>
<script>

import { fetchPermissionList, requestAddPermission, requestDeletePermission, requestUpdatePermission } from '@/api/account/pms'
import PermissionCreateFormModal from './components/PermissionCreateFormModal'
import { buildPaginationObj } from '@/components/Table'

const columns = [
  {
    title: '权限名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '权限标识',
    dataIndex: 'description',
    key: 'description'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '200px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  components: {
    PermissionCreateFormModal
  },
  data () {
    return {
      data: [],
      columns,
      expandedRowKeys: [],
      editType: 0, // 0: 添加  1: 编辑
      defFormValue: {
        description: '',
        name: '',
        pid: 0,
        pids: '0,'
      },
      formValue: {
        description: '',
        name: '',
        pid: 0,
        pids: '0,'
      },
      addVisible: false,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return fetchPermissionList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return buildPaginationObj(res)
          })
      }
    }
  },
  methods: {
    handleAdd (record) {
      if (record == null) {
        // 创建顶级权限
        this.formValue = this.defFormValue
      } else {
        this.formValue = {
          description: '',
          name: '',
          pid: record.id,
          pids: record.pids + record.id + ','
        }
      }
      this.addVisible = true
      this.editType = 0
    },
    handleEdit (record) {
      this.formValue = record
      this.addVisible = true
      this.editType = 1
      console.log('编辑: ', record)
    },
    handleDelete (record) {
      requestDeletePermission({
        id: record.id
      }).then(res => {
        this.$message.success('删除成功！')
        this.$refs.table.refresh(true)
      }).catch(_ => {

      })
    },
    handleCancel () {
      const form = this.$refs.collectionForm.form
      form.resetFields()
      this.formValue = this.defFormValue
      this.addVisible = false
    },
    handleOk () {
      const form = this.$refs.collectionForm.form
      form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)

          if (this.editType === 0) {
            requestAddPermission(values).then(res => {
              this.$message.success('操作成功！')
              this.handleCancel()
              this.$refs.table.refresh(true)
            }).catch(_ => {

            })
          } else {
            requestUpdatePermission(values).then(res => {
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
