<template>
  <!-- <page-header-wrapper @back="$router.go(-1)"> -->
  <a-card :bordered="true">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="账号">
              <a-input v-model="queryParam.account" placeholder="账号"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="clickReset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator" style="display: flex; justify-content: flex-end; align-item: center;">
      <a-button type="primary" icon="plus" @click="handleAdd()" v-if="$auth('SYSTEM.SYSTEM_VISIBLE_ADD')">新建可见范围</a-button>
      <a-button type="default" @click="handleExport()" v-if="$auth('SYSTEM.SYSTEM_VISIBLE_EXPORT')">导出</a-button>
      <a-upload
        ref="import"
        accept=".xlsx"
        name="file"
        list-type="picture"
        :before-upload="beforeUpload"
        :preview-file="handleImport"
      >
        <a-button type="default" v-if="$auth('SYSTEM.SYSTEM_VISIBLE_IMPORT')">导入</a-button>
      </a-upload>

      <a-button type="link" v-if="$auth('SYSTEM.SYSTEM_VISIBLE_IMPORT')" @click="handleDownloadTemplate()">下载导入模板</a-button>
    </div>

    <s-table
      ref="table"
      bordered
      size="default"
      :rowKey="(record) => record.id"
      :columns="columns"
      :data="loadData"
    >
      <!-- <span slot="createTime" slot-scope="text">{{ text | moment }}</span> -->
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)" v-if="$auth('SYSTEM.SYSTEM_VISIBLE_EDIT')">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="是否确认删除？" @confirm="handleDelete(record)">
            <a v-if="$auth('SYSTEM.SYSTEM_VISIBLE_DELETE')">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </s-table>

    <AddAccountVisibleModal
      ref="collectionForm"
      :visible.sync="addVisible"
      :title="editType == 1 ? '编辑可见范围' : '新建可见范围'"
      :isEdit="editType == 1"
      :initialFormValue="formValue"
      :hospitalDataSource="hospitalDataSource"
      :accountDataSource="accountDataSource"
      @cancel="handleCancel"
      @submit="handleOk">
    </AddAccountVisibleModal>
  </a-card>
  <!-- </page-header-wrapper> -->

</template>

<script>
import { getRangeListPro } from '@/api/system/user'
import { getRangeList, deleteRange, getRange, getTreeList, addRange, updateRange, getAdminList, exportVisibleData, importVisibleData } from '@/api/visibleRange/visibleRange'
import AddAccountVisibleModal from './components/AddAccountVisibleModal.vue'
import { downloadFile, exportExcel } from '@/utils/util'

export default {
  components: {
    AddAccountVisibleModal
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '账号ID',
          dataIndex: 'adminId'
        },
        {
          title: '账号',
          dataIndex: 'account'
        },
        // {
        //   title: '创建时间',
        //   dataIndex: 'createTime',
        //   scopedSlots: { customRender: 'createTime' }
        // },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        if (this.$store.getters.project && this.$store.getters.project.id != null) {
          return getRangeListPro(Object.assign({ ...parameter, account: this.queryParam.account, proId: this.$store.getters.project.id })).then(res => {
            return res
          })
        } else {
          return getRangeList(Object.assign({ ...parameter, account: this.queryParam.account })).then(res => {
            return res
          })
        }
      },
      hospitalDataSource: null,
      accountDataSource: null,
      addVisible: false,
      formValue: null,
      editType: 0, // 0: 添加  1: 编辑
      checkedId: 0
    }
  },
  mounted () {
    this.getHospitalData()
    this.getAccountData()
  },
  methods: {
		freshenLister () {
			this.$refs.table.refresh(true)
		},
    getHospitalData () {
      console.log(this.$store.getters.project.id)
      let pramams = {}
      if (this.$store.getters.project.id) {
        pramams = { proId: this.$store.getters.project.id }
      }
      getTreeList({ ...pramams }).then(res => {
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
        // console.log('===原始数据===', res)
        // console.log('===处理数据===', result)
      })
    },
    getAccountData () {
      getAdminList().then(res => {
        this.accountDataSource = res
      })
    },
    handleAdd () {
      this.addVisible = true
      this.editType = 0
      this.formValue = null
    },
    beforeUpload () {
      return false
    },
    handleExport () {
      exportVisibleData(this.queryParam).then(res => {
        exportExcel('账户可见范围', res)
      })
    },
    handleImport (file) {
      const params = new FormData()
      params.append('file', file)
      return importVisibleData(params).then(res => {
        this.$notification.success({
          message: file.name,
          description: '上传成功'
        })
        this.$refs.table.refresh(true)
      }).finally(() => {
        this.$refs.import.sFileList = []
      })
    },
    handleDownloadTemplate () {
      downloadFile(this.$const.EXCEL_TEMPLATE.ACCOUNT_VISIBLE)
    },
    handleEdit (record) {
      this.checkedId = record.id
      getRange({
        account: record.account
      }).then(res => {
        console.log(res)
        let orgIds = []
        let areaIds = []
        let deptIds = []
        let isAll = 0
        if (Number(res.orgIdList[0]) === -1 && Number(res.deptIdList[0] === -1) && (!res.areaIdList || Number(res.areaIdList[0] === -1))) {
          isAll = 0
        } else {
          orgIds = res.orgIdList != null ? res.orgIdList.map(item => {
            return 'orgId_' + item
          }) : []
          areaIds = res.areaIdList != null ? res.areaIdList.map(item => {
            return 'areaId_' + item
          }) : []
          deptIds = res.deptIdList != null ? res.deptIdList.map(item => {
            return 'deptId_' + item
          }) : []
          isAll = 1
        }
        const tree = [...orgIds, ...areaIds, ...deptIds]
        this.editType = 1
        this.addVisible = true
        this.formValue = {
          account: record.account,
          isAll: isAll,
          tree: tree
        }
        console.log(this.formValue)
      })
    },
    clickReset () {
      this.queryParam = {}
      this.$refs.table.refresh(true)
    },
    handleDelete (record) {
      deleteRange({
        account: record.account
      }).then(res => {
        this.$refs.table.refresh(true)
        this.$message.success('删除成功')
      })
    },
    handleCancel () {
      this.addVisible = false
      const form = this.$refs.collectionForm.form
      console.log(form)
      form.resetFields()
      this.formValue = null
    },
    handleOk () {
      const form = this.$refs.collectionForm.form
      form.validateFields((err, values) => {
				console.log(values)
        if (!err) {
          console.log('Received values of form: ', values, this.hospitalDataSource)
          const orgIdList = []
          const areaIdList = []
          const deptIdList = []
					if (values.tree) {
            values.tree.forEach(item => {
              if (item.indexOf('orgId_') !== -1) {
                orgIdList.push(item.split('_')[1])
              } else if (item.indexOf('areaId_') !== -1) {
                areaIdList.push(item.split('_')[1])
              } else if (item.indexOf('deptId_') !== -1) {
                deptIdList.push(item.split('_')[1])
              }
            })
					}

          const param = {
              account: values.account,
              orgIdJson: orgIdList.join(',') || -1,
              areaIdsJson: areaIdList.join(',') || -1,
              deptIdJson: deptIdList.join(',') || -1
          }
          const params = {
              id: this.checkedId,
              orgIdJson: orgIdList.join(',') || -1,
              areaIdsJson: areaIdList.join(',') || -1,
              deptIdJson: deptIdList.join(',') || -1
          }
          console.log('######', param)
          if (this.editType === 0) {
            addRange(param).then(res => {
              this.$message.success('操作成功！')
              this.handleCancel()
              this.$refs.table.refresh(true)
            }).catch(_ => {

            })
          } else {
            updateRange(params).then(res => {
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

<style>
</style>
