<template>
  <div>
    <div
      class="top-nav"
      v-if="$auth('PROJECT.PROJECT_MEMBER_ADD') || $auth('PROJECT.PROJECT_MEMBER_ADD')">
      <!-- 是中心端且不是项目详情时才会展示 -->
      <div
        class="btns"
        v-if="($isCenter&&!$props.isDetail)">
        <a-button
          type="primary"
          @click="clickaAdd(1)"
          v-if="$auth('PROJECT.PROJECT_INVITE')">
          <a-icon type="plus"/>添加项目负责人
        </a-button>
        <div style="margin-right:40px;"></div>
        <a-button
          type="primary"
          @click="clickaAdd(2)"
          v-if="$auth('PROJECT.PROJECT_MEMBER_ADD')">
          <a-icon type="plus"/>添加成员
        </a-button>
      </div>
    </div>
    <div>
      <s-table
        :data="loadData"
        ref="table"
        :rowKey="record=>record.id"
        :columns="columns"
      >
        <!-- <template slot="centerName" slot-scope="text,record">
          <a-input
            key="centerName"
            v-if="record.editable"
            style="margin: -5px 0;width: 70%"
            :value="text"
            @change="(e) => handleInputChange(e.target.value, record.id, 'centerName')"
          />
          <template v-else>{{ text }}</template>
        </template> -->
        <!-- <template slot="office" slot-scope="text,record">
          <a-select
            key="office"
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="(e) => handleInputChange(e, record.id, 'office')"
          >
            <a-select-option v-for="(item) in officeList" :key="item.vlaue" :value="item.name">{{ item.name }}</a-select-option>
          </a-select>
          <template v-else>{{ text }}</template>
        </template> -->
        <template
          slot="status"
          slot-scope="text,record">
          <span
            :style="{'color':(record.status ==1 ? '#3C92FF' : record.status ==2 ? '#1CA261' : record.status ==3 ? '#43a' : '#e23f00')}"
          >
            •&nbsp;{{ record.status | enumValueByKey($const.INVITE_STATUS) }}
          </span>
        </template>
        <template
          slot="action"
          slot-scope="text,record">
          <a
            href="javascript:;"
            @click="clickWatchInfo(record)">查看</a>
          <a-divider type="vertical"></a-divider>
          <!-- <a href="javascript:;" @click="updateMember(record)">编辑</a>
          <a-divider type="vertical"></a-divider> -->
          <a-popconfirm
            title="确认重新发送？"
            @confirm="resetPin(record)">
            <a
              href="javascript:;"
              v-if="record.status !== $const.INVITE_STATUS.Reject.value"> 重新发送pin码
              <a-divider type="vertical"></a-divider>
            </a>
          </a-popconfirm>
          <a-popconfirm
            title="确定执行此操作？"
            @confirm="confirmDel(record)">
            <a href="javascript:;">删除</a>
          </a-popconfirm>
        </template>
      </s-table>
      <Modal
        :pm="pm"
        :btnLoading="btnLoading"
        :type="type"
        :proId="queryParam.proId"
        @ok="modalOk"
        :roleList="roleList"
        @cancel="modalCancel()"
        :visible="visible"/>
      <!-- 快速创建弹窗 -->
      <CreateAccount
        :visible="createVisible"
        @successCreate="successCreate"
        @cancelCreate="cancelCreate"/>
      <InfoModal
        :infoObj="infoObj"
        :visible="infoVisible"
        @modalOk="infoModalOk"
        @modalCancel="infoModalCancel"/>
      <!-- 用户可见范围弹窗 -->
      <a-modal
        :visible="viewRoundVisible"
        title="创建用户可见范围"
        @ok="roundOk"
        @cancel="roundCancel"
        :loading="viewLoading">
        <a-form
          layout="vertical"
          :form="form">
          <a-form-item label="账户">
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
      <a-modal
        title="编辑团队成员"
        :visible="updateModal"
        @ok="updateOk"
        @cancel="updateCancel">
        <a-form-model
          :model="updateForm"
          :rules="updateRules"
          ref="updateForm">
          <a-form-model-item
            label="职能"
            prop="position">
            <a-input
              @change="positionChange"
              v-model.trim="updateForm.position"/>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
  </div>
</template>
<script>
import {
  getResearcherList,
  actionInvite,
  getInviter,
  deleteMember,
  resetPin,
  actionInviteTeam,
  updateStudyMember,
  deleteCenterMember
} from '@/api/project/project'
import Modal from './Modal.vue'
import InfoModal from './InfoModal.vue'
import CreateAccount from './CreateAccount.vue'
import { getTreeList, getAdminList, addRange } from '@/api/visibleRange/visibleRange'
import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_ALL
export default {
  props: {
    proId: {
      required: true,
      type: [String, Number]
    },
    isDetail: {
      default: false,
      type: Boolean
    }
  },
  components: {
    Modal,
    CreateAccount,
    InfoModal
  },
  computed: {
    columns () {
      if (this.$props.isDetail) {
        return this.detailColumns
      } else {
        return this.actionColumns
      }
    }
  },
  data () {
    return {
      btnLoading: false,
      SHOW_PARENT,
      updateForm: {},
      updateModal: false,
      // 新增用户信息
      getAdminValue: {},
      // 可见范围弹窗loading
      viewLoading: false,
      updateRules: {
        position: [{ required: true, trigger: 'change', message: '此项为必填项' }]
      },
      viewRoundVisible: false,
      hospitalDataSource: null,
      initialFormValue: {},
      pm: null,
      infoVisible: false,
      infoObj: {},
      type: 1,
      createVisible: false,
      roleList: [],
      isAdd: true,
      visible: false,
      queryParam: {
        proId: this.$props.proId
      },
      backShow: {},
      actionColumns: [
        {
          title: '成员编号',
          dataIndex: 'memberNo',
          align: 'center'
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'name' },
          align: 'center'
        },
        {
          title: '角色',
          dataIndex: 'roleName',
          key: 'roleName',
          width: '25%',
          scopedSlots: { customRender: 'roleName' },
          align: 'center'
        },
        {
          title: '电话/手机',
          dataIndex: 'phone',
          key: 'phone',
          scopedSlots: { customRender: 'phone' },
          align: 'center'
        },
        {
          title: '邮件地址',
          dataIndex: 'email',
          key: 'email',
          scopedSlots: { customRender: 'email' },
          align: 'center'
        },
        {
          title: '邀请状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center'
        }
      ],
      detailColumns: [
        {
          title: '成员编号',
          dataIndex: 'memberNo',
          align: 'center'
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'name' },
          align: 'center'
        },
        {
          title: '角色',
          dataIndex: 'roleName',
          key: 'roleName',
          width: '25%',
          scopedSlots: { customRender: 'roleName' },
          align: 'center'
        },
        {
          title: '电话/手机',
          dataIndex: 'phone',
          key: 'phone',
          scopedSlots: { customRender: 'phone' },
          align: 'center'
        },
        {
          title: '邮件地址',
          dataIndex: 'email',
          key: 'email',
          scopedSlots: { customRender: 'email' },
          align: 'center'
        },
        {
          title: '邀请状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
          align: 'center'
        }
      ],
      loadData: parameter => {
        return getResearcherList(Object.assign(parameter, this.queryParam))
          .then(res => {
            console.log(res)
            return res
          })
      },
      dataTable: []
    }
  },
  created () {

  },
  watch: {
    visible (newv) {
      if (!newv) {
        this.btnLoading = false
      }
    }
  },
  mounted () {
    console.log(this.$props.proId, 222)
    this.getHospitalData()
    console.log(this.$auth('PROJECT'), this.$auth('PROJECT'))
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  methods: {
    positionChange (e) {
      console.log(e.target.value)
    },
    // 编辑成员
    updateMember (record) {
      console.log(record)
      this.updateForm = { position: record.position, userId: record.userId }
      this.updateModal = true
    },
    updateOk () {
      this.$refs.updateForm.validate(valid => {
        if (valid) {
            updateStudyMember(this.updateForm).then(res => {
            this.updateModal = false
            this.$message.success('修改成功')
            this.$refs.table.refresh(true)
          })
        }
      })
    },
    updateCancel () {
      this.updateModal = false
    },
    // eslint-disable-next-line vue/no-dupe-keys
    // 发送pin码
    resetPin (record) {
      console.log(record.adminId)
      const params = {
        invitedUserId: record.adminId,
        proId: this.$props.proId
      }
      resetPin(params).then(res => {
        this.$message.success('重新发送pin码成功')
        console.log(record)
      })
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
    // 用户可见范围弹窗取消事件
    roundCancel () {
      this.viewRoundVisible = false
      this.visible = true
      this.initialFormValue = {}
      this.form = this.$form.createForm(this)
    },
    // 用户可见范围弹窗确定事件
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
      this.visible = true
      this.initialFormValue = {}
    },
    // 行内编辑事件
    handleInputChange (value, key, column) {
      console.log(value)
      const newData = [...this.dataTable]
      const target = newData.find((item) => item.id === key)
      if (target) {
        target[column] = value
        this.dataTable = newData
      }
    },
    // 编辑之后保存
    saveRow (record) {
      const { centerName, id } = record // 需要校验的必填字段
      if (!centerName) {
        this.$message.error('请填写完整信息。')
        return
      }
      const target = this.dataTable.find((item) => item.id === id)
      target.editable = false
    },
    // 编辑结束后取消编辑
    cancel (id, key) {
      const target = this.dataTable.find((item) => item.id === id)
      Object.keys(target).forEach((key) => {
        target[key] = target._originalData[key]
      })
      target._originalData = undefined
    },
    // 点击编辑
    toggle (record) {
      // const target = this.dataTable.find((item) => item.id === id)
      // target._originalData = { ...target }
      // target.editable = !target.editable
      // console.log(record)
      // this.backShow = record
      // this.isAdd = false
      // this.visible = true
    },
    // 点击添加按钮打开弹框
    clickaAdd (type) {
      this.pm = type === 1 ? 1 : 0
      localStorage.setItem('newPhone', '')
      this.type = type
      console.log(this.type)
      console.log(this.$props.proId, 'ddd')
      // 获取受邀者列表
      getInviter({ type: this.type, proId: this.$props.proId }).then(res => {
        console.log(res, '999')
        this.roleList = res
        this.visible = true
      })
    },
    // 弹框确定事件处理函数
    modalOk (e) {
      console.log(e, 999999999)
      this.btnLoading = true
      if (e) { // 点了发送邀请之后关闭弹窗
        e.proUserNo = e.userNo
        if (this.type === 1) {
          // type为1，邀请项目负责人
          actionInvite(e).then(res => {
            console.log(res)
            this.$message.success('邀请成功')
            this.visible = false
            this.$refs.table.refresh(true)
          }, err => { // 由于服务器问题，请求失败也刷新列表
            console.log(err)
            this.btnLoading = false
            this.visible = false
            this.$refs.table.refresh(true)
          })
        } else { // type为2，邀请团队成员
          actionInviteTeam(e).then(res => {
            console.log(res)
            this.$message.success('邀请成功')
            this.visible = false
            this.$refs.table.refresh(true)
          }, err => { // 由于服务器问题，请求失败也刷新列表
            console.log(err)
            this.btnLoading = false
            this.visible = false
            this.$refs.table.refresh(true)
          })
        }
      } else { // 点了快速创建关闭弹窗
        this.btnLoading = false
        this.visible = false
        this.createVisible = true
      }
    },
    successCreate (value) {
      this.createVisible = false
      this.Supplementary(value)
      this.$refs.table.refresh(true)
      // 新建用户成功后，打开用户可见范围弹窗
      console.log(this.initialFormValue)
      this.viewRoundVisible = true
      this.viewLoading = true
    },
    cancelCreate () {
      this.createVisible = false
    },
    modalCancel () {
      this.visible = false
    },
    // 确认删除/取消
    confirmDel (record) {
      console.log(record)
      // deleteMember({ id: record.id }).then(res => {
      //   this.$refs.table.refresh(true)
      //   this.$message.success('删除成功')
      // })
      // 1为团队成员，2为中心的研究成员
      if (record.type === 1) {
        deleteMember({ id: record.id }).then(res => {
          this.$refs.table.refresh(true)
          this.$message.success('删除成功')
        })
      } else {
        deleteCenterMember({ id: record.id }).then(res => {
          this.$refs.table.refresh(true)
          this.$message.success('删除成功')
        })
      }
    },
    // 查看成员信息
    clickWatchInfo (record) {
      console.log(record)
      this.infoObj = record
      this.infoVisible = true
    },
    infoModalOk () {
      this.infoVisible = false
    },
    infoModalCancel () {
      this.infoVisible = false
    }
  }
}
</script>
<style scoped lang="css">
  .top-nav{
    width: 100%;
    height:40px;
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .btns{
    display: flex;
  }
</style>
