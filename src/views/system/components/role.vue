<template>
  <div>
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAddVisible(true)" v-if="$auth('SYSTEM.SYSTEM_ROLE_ADD')"> 添加角色</a-button>
    </div>
    <div class="table">
      <a-table :data-source="data" bordered size="middle">
        <a-table-column key="roleId" title="序号" data-index="id" align="center" />
        <a-table-column key="name" title="角色名称" data-index="name" align="center" />
        <a-table-column key="code" title="角色标识" data-index="code" align="center" />
        <a-table-column key="description" title="描述" data-index="description" align="center" />
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="text, record">
            <span>
              <a @click="editRow(record)" v-if="$auth('SYSTEM.SYSTEM_ROLE_EDIT')">编辑</a>
              <a-divider type="vertical" v-if="$auth('SYSTEM.SYSTEM_ROLE_DELETE')" />
              <a-popconfirm
                title="确定删除本条数据吗?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="deleteRow(record)"
              >
                <a v-if="$auth('SYSTEM.SYSTEM_ROLE_DELETE')">删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table-column>
      </a-table>
    </div>
    <TreeModel
      :visible="addVisible"
      :permission="permission"
      title="新增角色"
      @ok="handconfirm"
      @cancel="addVisible = false"
    />
    <TreeModelEdit
      v-if="editVisible"
      :record="rowRecord"
      ref="treeEdit"
      :visible="editVisible"
      :permission="permission"
      :rolePermission="rolePermission"
      title="编辑角色"
      @ok="editVisible = false"
      @cancel="editOk()"
    />
  </div>
</template>

<script>
import TreeModel from './components/addRoleDrawer.vue'
import TreeModelEdit from './components/editRoleDrawer.vue'
import { permissionList, permissionListPro } from '@/api/system/pms.js'
import { getRoleList, getRoleListPro, userRole, userRolePro, delRole, delRolePro } from '@/api/system/role.js'
import _ from 'lodash'

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows)
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows)
  }
}
export default {
  components: {
    TreeModel,
    TreeModelEdit
  },
  data () {
    return {
      data: [],
      rowRecord: {},
      permission: [],
      addVisible: false,
      editVisible: false,
      rolePermission: [], // 当前角色拥有的权限
      rowSelection,
      loading: false,
      expandedRowKeys: [],
      publicPermission: []
    }
  },
  mounted () {
    this.fetchPermissionList()
    this.fetchList()
  },
  methods: {
    editOk () {
      this.editVisible = false
      this.fetchList()
    },
    // 获取列表信息
    fetchList (params = {}) {
			if (this.$store.getters.project && this.$store.getters.project.id != null) {
				getRoleListPro({
					proId: this.$store.getters.project.id,
			systemId: this.$const.SYSTEM_TYPE.ESOURCE.value
			}).then(res => {
          this.data = res
				})
			} else {
        getRoleList().then(res => {
          this.data = res
      })
			}
    },
    // 获取权限列表
    fetchPermissionList () {
			if (this.$store.getters.project && this.$store.getters.project.id != null) {
				permissionListPro({
					proId: this.$store.getters.project.id,
					systemId: this.$const.SYSTEM_TYPE.ESOURCE.value }).then(res => {
				this.permission = res
        this.publicPermission = []
        this.permission.map(item => {
          // 公共权限不可编辑 (最多三级)
          item.disabled = item.isPublic === 1
          if (item.disabled) {
            this.publicPermission.push(item.id)
          }
          if (item.children != null) {
            item.children.map(sub => {
              sub.disabled = sub.isPublic === 1
              if (sub.disabled) {
                this.publicPermission.push(sub.id)
              }
              if (sub.children != null) {
                sub.children.map(child => {
                  child.disabled = child.isPublic === 1
                  if (child.disabled) {
                    this.publicPermission.push(child.id)
                  }
                })
              }
            })
          }
        })
        console.log('========', this.permission)
      })
			} else {
				permissionList({}).then(res => {
        this.permission = res
        this.publicPermission = []
        this.permission.map(item => {
          // 公共权限不可编辑 (最多三级)
          item.disabled = item.isPublic === 1
          if (item.disabled) {
            this.publicPermission.push(item.id)
          }
          if (item.children != null) {
            item.children.map(sub => {
              sub.disabled = sub.isPublic === 1
              if (sub.disabled) {
                this.publicPermission.push(sub.id)
              }
              if (sub.children != null) {
                sub.children.map(child => {
                  child.disabled = child.isPublic === 1
                  if (child.disabled) {
                    this.publicPermission.push(child.id)
                  }
                })
              }
            })
          }
        })
        console.log('========', this.permission)
      })
    }
		},
    // 确定处理
    handconfirm (value) {
      this.addVisible = false
      this.fetchList()
    },
    handleAddVisible (flag = false) {
      this.addVisible = flag
    },
    addPermission (row) {
      console.log(row)
    },
    // 编辑角色
    editRow (row) {
			if (this.$store.getters.project && this.$store.getters.project.id != null) {
				userRolePro({
					roleId: row.id,
					proId: this.$store.getters.project.id,
					systemId: this.$const.SYSTEM_TYPE.ESOURCE.value
				}).then(res => {
					console.log('res', res)
          const list = []
          res.forEach(element => {
          list.push(element.pmsId)
					})
        this.rolePermission = _.uniq([...this.publicPermission, ...list]) // 该用户拥有的权限
        this.rowRecord = row
        this.editVisible = true // 获取到后在弹出
				})
			} else {
        userRole({
        roleId: row.id
      }).then(res => {
        console.log('res', res)
        const list = []
        res.forEach(element => {
          list.push(element.pmsId)
        })
        this.rolePermission = _.uniq([...this.publicPermission, ...list]) // 该用户拥有的权限
        this.rowRecord = row
        this.editVisible = true // 获取到后在弹出
      })
		}
    },
    // 删除事件
    deleteRow (row) {
			const id = row.id
			if (this.$store.getters.project && this.$store.getters.project.id != null) {
        delRolePro({
				...id,
				proId: this.$store.getters.project.id,
			systemId: this.$const.SYSTEM_TYPE.ESOURCE.value }).then(res => {
				this.$message.success('删除成功')
        this.fetchList()
			})
			} else {
       delRole({
        id
      }).then(res => {
        this.$message.success('删除成功')
        this.fetchList()
      })
			}
    }
  }
}
</script>

<style></style>
