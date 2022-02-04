<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="">
                <a-input v-model="queryParam.kw" placeholder="可输入姓名或手机号"/>
              </a-form-item>
            </a-col>
            <!-- <a-col :md="8" :sm="24">
              <a-form-item label="手机号">
                <a-input v-model="queryParam.phone" placeholder=""/>
              </a-form-item>
            </a-col> -->
            <template v-if="advanced">
              <!-- <a-col :md="8" :sm="24">
                <a-form-item label="所属部门">
                  <a-select v-model="queryParam.dept" placeholder="请选择" default-value="">
                    <a-select-option v-for="dept in deptDatasource" :key="dept.id" :value="dept.id">{{ dept.name }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col> -->
              <a-col :md="8" :sm="24">
                <a-form-item label="所属角色">
                  <a-select v-model="queryParam.roleId" placeholder="请选择" default-value="">
                    <a-select-option v-for="role in roleDatasource" :key="role.id" :value="role.id">{{ role.name }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <!-- <a-col :md="8" :sm="24">
                <a-form-item label="更新日期">
                  <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入更新日期"/>
                </a-form-item>
              </a-col> -->
              <a-col :md="8" :sm="24">
                <a-form-item label="用户状态">
                  <a-select v-model="queryParam.status" placeholder="请选择" default-value="1">
                    <a-select-option value="1">启用</a-select-option>
                    <a-select-option value="-1">禁用</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd()">新建用户</a-button>
      </div>

      <s-table
        ref="table"
        size="default"
        :rowKey="(record) => record.id"
        :columns="columns"
        :data="loadData"
      >
        <span slot="createTime" slot-scope="text">{{ text | moment }}</span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
          </template>
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleResetPassword(record)">重置密码</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleStatus(record)">{{ record.status === 1 ? '禁用' : '启用' }}</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="是否确认删除？" @confirm="handleDelete(record)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </s-table>
    </a-card>
    <UserCreateFormModal
      ref="collectionForm"
      :visible.sync="addVisible"
      :title="editType == 1 ? '编辑用户' : '新建用户'"
      :isEdit="editType == 1"
      :initialFormValue="formValue"
      :roleDatasource="roleDatasource"
      :deptDatasource="deptDatasource"
      @cancel="handleCancel"
      @submit="handleOk">
    </UserCreateFormModal>
    <ResetPasswordFormModal
      ref="resetForm"
      :visible.sync="resetVisible"
      :initialFormValue="resetFormValue"
      @cancel="handleResetCancel"
      @submit="handleResetOk">
    </ResetPasswordFormModal>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { fetchUserList, requestAddUser, requestUpdateUser, requestDeleteUser } from '@/api/account/user'
import { fetchDepartmentList } from '@/api/account/dept'
import { fetchRoleList } from '@/api/account/role'
import UserCreateFormModal from './components/UserCreateFormModal'
import ResetPasswordFormModal from './components/ResetPasswordFormModal'

export default {
  name: 'AccountList',
  components: {
    UserCreateFormModal,
    ResetPasswordFormModal
  },
  data () {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '用户ID',
          dataIndex: 'id'
        },
        {
          title: '账号',
          dataIndex: 'account'
        },
        {
          title: '姓名',
          dataIndex: 'name'
        },
        {
          title: '手机号',
          dataIndex: 'phone'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        // {
        //   title: '所属部门',
        //   dataIndex: 'deptName'
        // },
        {
          title: '用户角色',
          dataIndex: 'roleName'
        },
        {
          title: '状态',
          dataIndex: 'status',
          needTotal: true,
          customRender: (status) => status === 1 ? '启用' : '禁用'
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
        return fetchUserList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          })
      },
      addVisible: false,
      resetVisible: false,
      formValue: null,
      resetFormValue: null,
      editType: 0, // 0: 添加  1: 编辑
      roleDatasource: null,
      deptDatasource: null
    }
  },
  created () {
    this.getRoleList()
    this.getDeptList()
  },
  methods: {
    getRoleList () {
      fetchRoleList().then(res => {
        this.roleDatasource = res
      })
    },
    getDeptList () {
      fetchDepartmentList().then(res => {
        this.deptDatasource = res
      })
    },
    handleAdd () {
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
      requestDeleteUser({
        id: record.id
      }).then(res => {
        this.$message.success('删除成功！')
        this.$refs.table.refresh(true)
      }).catch(_ => {

      })
    },
    handleStatus (record) {
      const status = record.status === 0 ? 1 : 0
      requestUpdateUser({
        id: record.id,
        account: record.account,
        status: status
      }).then(res => {
        this.$message.success('操作成功！')
        this.$refs.table.refresh(true)
      }).catch(_ => {

      })
    },
    handleCancel () {
      const form = this.$refs.collectionForm.form
      form.resetFields()
      this.formValue = {}
      this.addVisible = false
    },
    handleOk () {
      const form = this.$refs.collectionForm.form
      form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          if (this.editType === 0) {
            requestAddUser(values).then(res => {
              this.confirmLoading = false
              this.$message.success('操作成功！')
              this.handleCancel()
              this.$refs.table.refresh(true)
            }).catch(_ => {

            })
          } else {
            requestUpdateUser(values).then(res => {
              this.$message.success('操作成功！')
              this.handleCancel()
              this.$refs.table.refresh(true)
            }).catch(_ => {

            })
          }
        }
      })
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    handleResetPassword (record) {
      this.resetFormValue = record
      this.resetVisible = true
    },
    handleResetCancel () {
      const form = this.$refs.resetForm.form
      form.resetFields()
      this.resetFormValue = {}
      this.resetVisible = false
    },
    handleResetOk () {
      const form = this.$refs.resetForm.form
      form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.confirmLoading = true
            requestUpdateUser(values).then(res => {
              this.confirmLoading = false
              this.$message.success('操作成功！')
              this.resetVisible = false
            }).catch(_ => {
              this.confirmLoading = false
            })
        }
      })
    }
  }
}
</script>
