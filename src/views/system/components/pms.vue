<template>
  <div class="pms">
    <a-table rowKey="id" :columns="columns" :data-source="tableData" bordered>
      <!-- 表头区域 -->
      <template slot="title">
        <a-button type="primary" @click="handleAdd()" v-if="('SYSTEM.SYSTEM_PMS_ADD')">新增权限</a-button>
      </template>
      <template slot="isPublic" slot-scope="text">
        {{ text === 1 ? '公共权限' : '非公共权限' }}
      </template>
      <template slot="operation" slot-scope="text, record">
        <a-space>
          <a-button
            v-if="isShowAddSubButton(record) && $auth('SYSTEM.SYSTEM_PMS_ADD')"
            type="primary"
            size="small"
            @click="handleAdd(record)"
          >新增下级权限</a-button>
          <a-button type="default" size="small" @click="handleEdit(record)" v-if="$auth('SYSTEM.SYSTEM_PMS_EDIT')">编辑</a-button>
          <a-popconfirm title="是否要进行此操作?" ok-text="是" cancel-text="否" @confirm="activeDel(record.id)">
            <a-button type="warning" size="small" v-if="$auth('SYSTEM.SYSTEM_PMS_DELETE')">删除</a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>

    <AddPmsModal
      ref="collectionForm"
      :visible.sync="addVisible"
      :title="editType == 1 ? '编辑权限' : '新建权限'"
      :initialFormValue="formValue"
      @cancel="handleCancel"
      @submit="handleOk">

    </AddPmsModal>
  </div>
</template>
<script>
import { permissionList, permissionListPro, addPermission, addPermissionPro, updatePermission, updatePermissionPro, removePermission, removePermissionPro } from '@/api/system/pms'
import AddPmsModal from './components/addPmsModal.vue'

const columns = [
  {
    title: '权限名称',
    dataIndex: 'name'
  },
  {
    title: '权限标识(前端)',
    dataIndex: 'url'
  },
  {
    title: '权限标识(后端)',
    dataIndex: 'code'
  },
  {
    title: '类型',
    dataIndex: 'isPublic',
    key: 'isPublic',
    scopedSlots: { customRender: 'isPublic' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  components: {
    AddPmsModal
  },
  data () {
    return {
      columns,
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 18
      },
      queryParam: {},
      defFormValue: {
        name: '',
        url: '',
        code: '',
        pid: 0,
        pids: '',
        isPublic: -1,
        type: 1 // 类型 1资源菜单 2 按钮
      },
      formValue: {
        description: '',
        name: '',
        url: '',
        code: '',
        pid: 0,
        pids: '',
        isPublic: -1,
        type: 1 // 类型 1资源菜单 2 按钮
      },
      editType: 0, // 0: 添加  1: 编辑
      addVisible: false,
      tableData: []
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
			if (this.$store.getters.project && this.$store.getters.project.id != null) {
				permissionListPro({
					...this.queryParam,
					proId: this.$store.getters.project.id,
					systemId: this.$const.SYSTEM_TYPE.ESOURCE.value }).then(res => {
					this.tableData = res
				})
			} else {
				permissionList(this.queryParam).then(res => {
        this.tableData = res
        console.log(res)
      })
			}
    },
    isShowAddSubButton (record) {
      if (record.pids != null && record.pids.length > 0) {
        const pids = JSON.parse(record.pids)
        if (pids.length >= 3) {
          return false
        }
      }
      return true
    },
    // 新增权限
    handleAdd (record) {
      if (record == null) {
        // 创建顶级权限
        this.formValue = this.defFormValue
      } else {
        let pids = null
        if (record.pid === 0) {
          // 二级权限
          pids = [0, record.id]
        } else {
          pids = JSON.parse(record.pids)
          pids.push(record.id)
        }
        this.formValue = {
          description: '',
          name: '',
          pid: record.id,
          pids: JSON.stringify(pids),
          isPublic: -1,
          type: 2
        }
      }
      this.addVisible = true
      this.editType = 0
    },
    handleEdit (record) {
      this.formValue = record
      this.addVisible = true
      this.editType = 1
    },
    handleCancel () {
      const form = this.$refs.collectionForm.form
      form.resetFields()
      this.formValue = this.defFormValue
      this.addVisible = false
    },
    // 新增下级权限
    addSubPms (record) {
      this.visibleBtn = true
      this.addBtnForm.pid = record.id
      let pids = null
      if (record.pid === 0) {
        // 二级权限
        pids = [0, record.id]
      } else {
        pids = JSON.parse(record.pids)
        pids.push(record.id)
      }
      this.addBtnForm.pids = JSON.stringify(pids)
      console.log('record', this.addBtnForm)
    },
    // 按钮权限
    handleBtnCancel () {
      this.visibleBtn = false
      this.$refs.ruleBtnForm.resetFields()
    },
    handleOk () {
      const form = this.$refs.collectionForm.form
      form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)

          if (this.editType === 0) {
						if (this.$store.getters.project && this.$store.getters.project.id != null) {
							addPermissionPro({
								...values,
								proId: this.$store.getters.project.id,
								systemId: this.$const.SYSTEM_TYPE.ESOURCE.value })
								.then(res => {
                this.$message.success('操作成功！')
                this.handleCancel()
                this.getList()
							})
						} else {
              addPermission(values).then(res => {
                this.$message.success('操作成功！')
                this.handleCancel()
                this.getList()
            })
						}
          } else {
						if (this.$store.getters.project && this.$store.getters.project.id != null) {
							updatePermissionPro({
								...values,
								proId: this.$store.getters.project.id,
								systemId: this.$const.SYSTEM_TYPE.ESOURCE.value }).then(res => {
								this.$message.success('操作成功！')
                this.handleCancel()
                this.getList()
							})
						} else {
              updatePermission(values).then(res => {
                this.$message.success('操作成功！')
                this.handleCancel()
                this.getList()
            })
						}
          }
        }
      })
    },
    // 删除权限
    activeDel (id) {
			if (this.$store.getters.project && this.$store.getters.project.id != null) {
				removePermissionPro({
					...id,
					proId: this.$store.getters.project.id,
					systemId: this.$const.SYSTEM_TYPE.ESOURCE.value }).then(res => {
					console.log(res)
          this.$message.success('操作成功')
          this.getList()
				})
			} else {
        removePermission({ id }).then(res => {
          console.log(res)
          this.$message.success('操作成功')
          this.getList()
      })
			}
    }
  }
}
</script>
