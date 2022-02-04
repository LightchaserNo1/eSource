<!--  -->
<template>
  <div>
    <s-table
      ref="table"
      rowKey="id"
      :columns="columns"
      bordered
      :loading="loading"
      :data="loadData">
      <!-- 表头区域 -->
      <template slot="title">
        <div style="display: flex;">
          <a-button
            style="margin-right: 8px"
            type="primary"
            @click="addVisible()"
            v-if="$auth('SYSTEM.SYSTEM_ACCOUNT_ADD')">新增成员</a-button>
          <a-button
            style="margin-right: 8px"
            type="default"
            @click="clickExport"
            v-if="$auth('SYSTEM.SYSTEM_ACCOUNT_EXPORT')">导出</a-button>
          <a-upload
            accept=".xlsx"
            name="file"
            ref="import"
            list-type="picture"
            :preview-file="clickImport"
            v-if="$auth('SYSTEM.SYSTEM_ACCOUNT_IMPORT')"
          >
            <a-button type="default">导入</a-button>
          </a-upload>
          <a-button
            v-if="$auth('SYSTEM.SYSTEM_ACCOUNT_IMPORT')"
            style="margin-left: 8px"
            type="link"
            @click="handleDownloadTemplate()"
          >
            下载导入模板
          </a-button>
        </div>
      </template>
      <!-- 职务根据用户类型显示 -->
      <template
        slot="position"
        slot-scope="text, record">
        <span v-if="record.type == 1">{{ '' }}</span>
        <span v-if="record.type == 2">{{ record.position }}</span>
      </template>
      <!-- 用户类型 -->
      <template
        slot="type"
        slot-scope="text, record">
        <span v-if="record.type == 1">个人</span>
        <span v-if="record.type == 2">组织</span>
      </template>
      <!-- 状态 -->
      <template
        slot="status"
        slot-scope="text, record">
        <span
          v-if="record.status == -1"
          style="color:#f50"
          @click="changeStatus(1)"
        >
          •&nbsp;禁用
        </span>
        <span
          v-if="record.status == 1"
          style="color:#87d068"
          @click="changeStatus(-1)"
        >
          •&nbsp;启用
        </span>
      </template>
      <!-- 操作区域 -->
      <template
        slot="operation"
        slot-scope="text, record">
        <a-space>
          <a-button
            v-if="record.status == 1"
            type="warning"
            size="small"
            @click="activeDisable(-1, record.id)">
            {{ record.status !== -1 ? '禁用' : '启用' }}
          </a-button>
          <a-button
            v-if="record.status == -1"
            type="warning"
            size="small"
            @click="activeDisable(1, record.id)">
            {{ record.status !== 1 ? '启用' : '禁用' }}
          </a-button>
          <a-button
            type="primary"
            size="small"
            @click="activeEdit(record)"
            v-if="$auth('SYSTEM.SYSTEM_ACCOUNT_EDIT')">编辑</a-button>
        </a-space>
      </template>
    </s-table>

    <!-- 抽屉add -->
    <AddDrawer
      :visible="drawerVisible"
      @closeDrawer="closeDrawer" />
    <!-- 编辑抽屉 -->
    <EditDrawer
      ref="editDrawer"
      :editDrawVisible="editDrawVisible"
      @closeEditDrawer="closeEditDrawer" />
    <!-- 用户可见范围弹窗 -->"
    <a-modal
      :visible="viewRoundVisible"
      title="创建用户可见范围"
      @ok="roundOk"
      @cancel="roundCancel"
      :loading="viewLoading">
      <a-form
        layout="vertical"
        :form="form" >
        <a-form-item label="账户" >
          <!-- 传account -->
          <a-input
            disabled
            v-decorator="[
              'account',
              {
                initialValue: initialFormValue.account,
                rules: [{ required: true, message: '请输入账号' }]
              }
            ]"
          >
          </a-input>
        </a-form-item>
        <a-form-item label="医院/科室" >
          <a-tree-select
            v-decorator="[
              'tree',
              {
                initialValue: initialFormValue == null ? '' : initialFormValue.tree,
                rules: [{ required: true, message: '请选择医院/科室' }]
              }
            ]"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
            :tree-data="hospitalDataSource"
            tree-checkable
            :show-checked-strategy="SHOW_PARENT"
            search-placeholder="请选择医院/科室"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
// import monitor from '@/utils/monitor'
// import user from '@/monitor/system/user'
import { downloadFile, exportExcel } from '@/utils/util'
import AddDrawer from './components/addDrawer'
import EditDrawer from './components/editDrawer'
import { getUserList, getUserListPro, updataForbidden, userImport, userExport } from '@/api/system/user'
import { getTreeList, getAdminList, addRange } from '@/api/visibleRange/visibleRange'
import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_ALL

const columns = [
  {
    title: '用户编号',
    dataIndex: 'userNo'
  },
  {
    title: '用户名',
    dataIndex: 'userName'
  },
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '账号',
    dataIndex: 'account'
  },
  {
    title: '邮箱',
    dataIndex: 'email'
  },
  {
    title: '手机号',
    dataIndex: 'phone'
  },
  {
    title: '职务',
    dataIndex: 'position',
		scopedSlots: { customRender: 'position' }
  },
  {
    title: '角色名',
    dataIndex: 'roleName'
  },
  // {
  //   title: '电子签名',
  //   dataIndex: 'esignUrl'
  // },
  {
    title: '用户类型',
    dataIndex: 'type',
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
// const watch = monitor(user)
export default {
  name: '',
  components: {
    AddDrawer,
    EditDrawer
  },
  data () {
    return {
      SHOW_PARENT,
      viewRoundVisible: false,
      roundForm: {},
      initialFormValue: {},
      hospitalDataSource: [],
      account: '',
      drawerVisible: false,
      editDrawVisible: false,
      columns,
      loading: false,
      queryParam: {},
      loadData: parameter => {
        if (this.$store.getters.project && this.$store.getters.project.id != null) {
          return getUserListPro(Object.assign(parameter, this.queryParam, { proId: this.$store.getters.project.id })).then(res => {
              return res
          })
        } else {
          return getUserList(Object.assign(parameter, this.queryParam)).then(res => {
              return res
          })
        }
      },
      // 新增用户信息
      getAdminValue: {},
      // 可见范围弹窗loading
      viewLoading: false
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
    this.getHospitalData()
  },
  methods: {
    // 新增抽屉
    addVisible () {
			this.$emit('listFreshen')
      this.drawerVisible = true
    },
    // 获取医院科室树
    getHospitalData () {
      getTreeList().then(res => {
        const result = res.map(org => {
          let subOrg = []
          if (org.areaDtoList != null) {
            subOrg = org.areaDtoList.map(sub => {
              let deptList = []
              if (sub.deptList != null) {
                deptList = sub.deptList.map(dept => {
                  return {
                    value: 'deptId_' + dept.deptId,
                    label: dept.deptName
                  }
                })
              }
              return {
                value: 'areaId_' + sub.areaId,
                label: sub.areaName,
                children: deptList
              }
            })
          }
          return {
            value: 'orgId_' + org.orgId,
            label: org.orgName,
            children: subOrg
          }
        })

        this.hospitalDataSource = result
      })
    },
    // 编辑当前行
    activeEdit (row) {
      const rowObj = JSON.parse(JSON.stringify(row))
      delete rowObj.createTime
      delete rowObj.roleName
      this.$refs.editDrawer.form = rowObj
      this.$refs.editDrawer.echoDepartment()
      this.editDrawVisible = true
    },
    // forbidden () {
    //   console.log('禁用')
    // },
    // enable () {
    //   console.log('启用')
    // },
    // 启用禁用操作
    activeDisable (flag, id) {
      // if (flag === 1) {
      //   this.enable()
      // } else {
      //   this.forbidden()
      // }
      updataForbidden({
        id,
        status: flag
      }).then(res => {
        this.$message.success('操作成功')
        this.$refs.table.refresh(true)
      })
    },
    // 获取所有用户列表
    Supplementary (value) {
      getAdminList().then((res) => {
        const resValue = res.flat()
        console.log(resValue, value)
        resValue.forEach(item => {
          if (item.account === value.account) {
            console.log(item, value)
            this.getAdminValue = item
            this.initialFormValue.account = this.getAdminValue.account
          }
        })
        this.viewLoading = false
      })
    },
    // 新增对话框关闭 刷新列表
    closeDrawer (val) {
      console.log('val', val)
      this.drawerVisible = false
      if (val) {
        this.Supplementary(val)
        this.$refs.table.refresh(true)
        // 新建用户成功后，打开用户可见范围弹窗
        this.viewRoundVisible = true
        this.viewLoading = true
      }
    },
    // 编辑对话框关闭 刷新列表
    closeEditDrawer (val) {
      this.editDrawVisible = false
      if (val) {
        this.$refs.table.refresh(true)
      }
    },
    clickExport () {
      const exportParams = this.queryParam
      userExport(exportParams).then(res => {
        console.log(res, 'export')
        exportExcel('日志', res)
      })
    },
    clickImport (file) {
      const isJpgOrPng = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!isJpgOrPng) {
        this.$notification.error({
          message: file.name,
          description: '仅支持文件格式: .xlsx 格式文件!'
        })
        return false
      } else {
        const params = new FormData()
        params.append('file', file)
        return userImport(params).then(res => {
          this.$notification.success({
            message: file.name,
            description: '上传成功'
          })
          console.log(res)
        }).finally(() => {
        this.$refs.import.sFileList = []
          this.$nextTick(() => {
            this.$nextTick(() => {
              this.$refs.table.refresh(true)
            })
          })
        })
      }
    },
    handleDownloadTemplate () {
      downloadFile(this.$const.EXCEL_TEMPLATE.USER_IMPORT)
    },
    roundOk () {
      const form = this.form
      console.log(form)
      form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          const orgIdList = []
          const areaIdList = []
          const deptIdList = []
          values.tree.forEach(item => {
            if (item.indexOf('orgId_') !== -1) {
              orgIdList.push(item.split('_')[1])
            } else if (item.indexOf('areaId_') !== -1) {
              areaIdList.push(item.split('_')[1])
            } else if (item.indexOf('deptId_') !== -1) {
              deptIdList.push(item.split('_')[1])
            }
          })
          const param = {
              account: values.account,
              orgIdJson: orgIdList.join(','),
              areaIdsJson: areaIdList.join(','),
              deptIdJson: deptIdList.join(',')
            }
          addRange(param)
          .then(res => {
            this.$message.success('操作成功！')
						this.$emit('listFreshen')
            // this.handleCancel()
            // this.$refs.table.refresh(true)
            this.form = this.$form.createForm(this)
          })
          .catch(() => {
            this.form = this.$form.createForm(this)
          })
        }
      })
      this.viewRoundVisible = false
    },
    roundCancel () {
      this.viewRoundVisible = false
      this.form = this.$form.createForm(this)
    }
  }
}
</script>
<style scoped lang="scss"></style>
