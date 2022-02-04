<template>
  <page-header-wrapper @back="$router.go(-1)">
    <a-card :body-style="{ padding: '18px' }" :bordered="false" :loading="cardLoading">
      <div class="top-nav">
        <a-descriptions title="中心基本信息"></a-descriptions>
        <!-- <div>
          <a-popconfirm
            title="是否删除项目？"
            ok-text="确定"
            cancel-text="取消">
            <a-button type="danger"><a-icon type="delete"/>删除中心</a-button>
          </a-popconfirm>
        </div> -->
      </div>
      <div class="form-wrapper">
        <a-form-model
          ref="ruleForm"
          layout="inline"
          :model="forms"
          :rules="rules">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="中心全名" prop="orgName" labelAlign="left">
                <a-select v-model="forms.orgName" @change="handleCenterChange($event)" disabled>
                  <a-select-option v-for="(item,index) in orgList" :key="index" :vlaue="item.orgName">
                    {{ item.orgName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="中心编号" prop="orgNo" labelAlign="left">
                <a-input v-model.trim="forms.orgNo" disabled/>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="中心短名" prop="shortName" labelAlign="left">
                <a-input v-model.trim="forms.shortName" disabled/>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="中心英文名" prop="englishName" labelAlign="left">
                <a-input v-model.trim="forms.englishName" style="width:100%" disabled/>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="中心状态" prop="active" labelAlign="left">
                <a-select v-model="forms.active" >
                  <a-select-option v-for="(item,index) in statusList" :key="index" :value="item.value">
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="中心地址" prop="address" labelAlign="left">
                <a-input v-model.trim="forms.address" disabled/>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="科室" labelAlign="left" prop="orgDeptId">
                <a-select
                  @change="handleOfficeChange"
                  v-model="forms.orgDeptId"
                  :disabled="officeDisabled"
                  mode="multiple"
                >
                  <a-select-option v-for="(item,index) in officeList" :key="index" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="主要研究者">
                <a-input v-model.trim="forms.mainResName"/>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="是否项目主要研究者">
                <a-checkbox @change="mainChange" :default-checked="checked"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <div style="clear:both;"></div>
          <a-descriptions title="联系人"></a-descriptions>
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="联系人">
                <a-input v-model.trim="forms.contacts"/>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="联系人电话" prop="phone">
                <a-input v-model.trim="forms.phone"/>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
        <div class="btn-wrapper">
          <a-button type="primary" @click="clickSave()" :loading="saveLoading">保存</a-button>
        </div>
        <div class="top-nav">
          <a-descriptions title="研究团队"></a-descriptions>
          <div><a-button
            v-if="$isCenter"
            type="primary"
            @click="clickAddMember"><a-icon type="plus"/>添加成员</a-button></div>
        </div>
      </div>
      <s-table
        ref="table"
        size="default"
        :rowKey="(record) => record.id"
        :columns="columns"
        :data="loadData"
      >
        <template slot="status" slot-scope="text,record">
          <div>
            <a-tag style="width:60px;" :color="record.status | enumValueByKey($const.INVITE_STATUS,'color')">
              {{ record.status | enumValueByKey($const.INVITE_STATUS) }}
            </a-tag>
          </div>
        </template>
        <template slot="action" slot-scope="text,record">
          <!-- <a href="javascript:;" @click="clickWatchInfo(record)">查看</a>
          <a-divider type="vertical"></a-divider> -->
          <a-popconfirm title="确定执行此操作？" @confirm="confirmDel(record)">
            <a href="javascript:;">删除</a>
          </a-popconfirm>
          <a-popconfirm title="确认重新发送？" @confirm="resetPin(record)">
            <a href="javascript:;" v-if="record.status !== $const.INVITE_STATUS.Reject.value" >
              <a-divider type="vertical"></a-divider> 重新发送pin码</a>
          </a-popconfirm>
        </template>
      </s-table>
      <Modal
        :type="4"
        :btnLoading="btnLoading"
        :roleList="roleList"
        :proId="$route.query.proId"
        @ok="modalOk"
        @cancel="modalCancel()"
        :visible="visible"/>
      <CreateAccount :visible="createVisible" @successCreate="successCreate" @cancelCreate="cancelCreate"/>
      <!-- 用户可见范围弹窗 -->
      <a-modal :visible="viewRoundVisible" title="创建用户可见范围" @ok="roundOk" @cancel="roundCancel" :loading="viewLoading">
        <a-form layout="vertical" :form="form">
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
    </a-card>
  </page-header-wrapper>
</template>
<script>
import Modal from './components/Modal.vue'
import CreateAccount from './components/CreateAccount.vue'
import { getInstitutionsUpdate } from '@/api/organization/organization'
import {
  studyCenterDetail,
  getCenterMemberList,
  getOfficeByOrg,
  updateStudyCenter,
  detailAdd,
  getInviter,
  getOrgList,
  deleteCenterMember,
  resetPin
} from '@/api/project/project'
import { getTreeList, getAdminList, addRange } from '@/api/visibleRange/visibleRange'
import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_ALL
export default {
  components: {
    Modal,
    CreateAccount
  },
  data () {
    const validatorPhone = (rule, value, callback) => {
      if (!value) {
        callback()
      }
      if (!/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(value)) {
        callback(new Error('手机号格式不正确'))
      } else {
        callback()
      }
    }
    return {
      step: 0,
      btnLoading: false,
      isHasMember: false,
      SHOW_PARENT,
      // 新增用户信息
      getAdminValue: {},
      // 可见范围弹窗loading
      viewLoading: false,
      viewRoundVisible: false,
      hospitalDataSource: null,
      initialFormValue: {},
      checked: null,
      roleList: [],
      proResName: null,
      forms: {},
      centerId: null,
      createVisible: false,
      cardLoading: false,
      officeList: [],
      rules: {
        orgName: [{ required: true, message: '请选择研究中心' }],
        active: [{ required: true, message: '请选择中心状态' }],
        orgDeptId: [{ required: true, message: '请选择科室' }],
        phone: [{ message: '请输入正确手机号', validator: validatorPhone }]
      },
      saveLoading: false,
      orgList: [],
      officeDisabled: true,
      list: [],
      statusList: [
        {
          value: 1,
          text: '活跃'
        },
        {
          value: 2,
          text: '非活跃'
        }
      ],
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return getCenterMemberList(Object.assign(parameter, { resId: this.$route.query.resId, proId: this.$route.query.proId }))
          .then(res => {
            this.list = res.content
            this.isHasMember = this.list.length > 0
            return res
          })
      },
      visible: false,
      columns: [
        {
          title: '研究成员编号',
          align: 'center',
          dataIndex: 'researchNo'
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '角色',
          align: 'center',
          dataIndex: 'roleName'
        },
        {
          title: '电话',
          align: 'center',
          dataIndex: 'phone'
        },
        {
          title: '邮件地址',
          align: 'center',
          dataIndex: 'email'
        },
        {
          title: '邀请状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center'
        }
      ],
      params: {}
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {

  },
  watch: {
    visible (newv) {
      if (!newv) {
        this.btnLoading = false
      }
    },
    step (newv) {
      if (newv === 2) {
        this.saveLoading = false
        this.$message.success('修改成功')
        this.$router.go(-1)
      }
    }
  },
  mounted () {
    this.getHospitalData()
    getInviter({ type: 3, proId: this.$route.query.proId }).then(res => {
      console.log(res, '受邀研究员')
      this.roleList = res
    })
    console.log(this.$route.query)
    this.getCenterDetail().then(res => {
      // 请求详情成功后，再请求所有机构列表
      getOrgList({ type: 2 }).then(res2 => {
        this.orgList = res2
        console.log(this.orgList)
      })
      getOfficeByOrg({ orgId: this.forms.orgId }).then(res3 => {
        this.officeList = res3
        this.officeDisabled = false
        this.cardLoading = false
      })
    })
  },
  methods: {
    // 发送pin码
    resetPin (record) {
      console.log(record)
      const params = {
        invitedUserId: record.adminId,
        proId: this.$route.query.proId
      }
      console.log(record, params)
      resetPin(params).then(res => {
        this.$message.success('重新发送pin码成功')
        console.log(res)
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
    // 确认删除/取消
    confirmDel (record) {
      console.log(record)
      deleteCenterMember({ id: record.id }).then(res => {
        this.$refs.table.refresh(true)
        this.$message.success('删除成功')
      })
    },
    mainChange (e) {
      console.log(e.target.checked)
      if (e.target.checked) {
        this.proResName = 1
      } else {
        this.proResName = -1
      }
    },
    // 获取研究中心详情
    getCenterDetail () {
      return new Promise((resolve, reject) => {
        this.cardLoading = true
        studyCenterDetail({ resId: this.$route.query.resId }).then(res => {
          this.checked = res.proResName === 1
          this.proResName = res.proResName
          this.centerId = res.id
          this.orgId = res.orgId
          res.contacts = res.info.contacts
          res.phone = res.info.phone
          res.address = res.info.address
          res.shortName = res.info.shortName
          res.englishName = res.info.englishName
          this.forms = { ...res }
          this.forms.orgDeptId = res.orgDeptId.split(',').map(item => Number(item))
          resolve()
        })
      })
    },
    handleOfficeChange (e) {
      console.log(e)
    },
    clickAddMember () {
      localStorage.setItem('newPhone', '')
      this.visible = true
    },
    handleCenterChange (e) {
      const target = this.orgList[e]
      this.forms = { ...target }
      this.orgId = target.id
      getOfficeByOrg({ orgId: target.id }).then(res => {
        this.forms.orgDeptId = []
        this.officeList = res
        this.officeDisabled = false
      })
    },
    modalOk (params) {
      this.btnLoading = true
      console.log(params, '弹框传的值')
      if (params) {
        const memberAdd = {
          researchNo: params.researchNo,
          roleId: params.roleId,
          phone: params.phone,
          name: params.name,
          email: params.email,
          orgId: this.forms.orgId,
          proId: this.$route.query.proId,
          researchId: this.$route.query.resId
        }
        console.log(memberAdd, '9999')
        detailAdd(memberAdd).then(res => {
          this.btnLoading = false
          this.visible = false
          this.showTable = true
          this.$refs.table.refresh(true)
        }).catch(_ => {
          this.btnLoading = false
        })
      } else {
        this.btnLoading = false
        this.visible = false
        this.createVisible = true
        this.$refs.table.refresh(true)
      }
    },
    successCreate (value) {
      this.createVisible = false
      this.Supplementary(value)
      // 新建用户成功后，打开用户可见范围弹窗
      this.viewRoundVisible = true
      this.viewLoading = true
    },
    cancelCreate () {
      this.createVisible = false
    },
    modalCancel () {
      this.visible = false
    },
    clickSave () {
       this.saveLoading = true
      // console.log(this.orgList, 'orgList')
      const deleteKeys = [
        'createTime',
        'authStatus',
        'email',
        'name',
        'refuseReason',
        'roleName',
        'userName',
        'phone',
        'researchId'
      ]
      this.list.forEach(item => {
        for (const key in item) {
          if (deleteKeys.indexOf(key) !== -1) {
            delete item[key]
          }
        }
      })
      const { orgName, orgDeptId, orgNo, mainResName, active, phone, contacts } = this.forms
      // this.forms.orgDeptId = e.join(',')
      const orgDeptIds = orgDeptId.join(',')
      const nameArr = this.officeList.filter(item => {
        return orgDeptId.findIndex(value => value === item.id) !== -1
      }).map(item2 => item2.name)
      const orgDeptNames = nameArr.join(',')
      this.forms.orgDeptName = nameArr.join(',')
      this.params = {
        proId: this.$route.query.proId,
        orgName,
        orgNo,
        orgDeptId: orgDeptIds,
        active,
        orgDeptName: orgDeptNames,
        id: this.centerId,
        orgId: this.orgId,
        mainResName,
        proResName: this.proResName
      }
      const target = this.orgList.find(item => item.orgName === this.forms.orgName)
      console.log(target)
      const { id, type, orgCode, address, orgType } = target
      console.log({ id, type, orgCode, address, orgName, phone, contacts, orgType })
      getInstitutionsUpdate({ id, type, orgCode, address, orgName, phone, contacts, orgType }).then(res => {
        console.log('success change phone concats')
        this.step++
      })
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          updateStudyCenter(this.params).then(res => {
            this.step++
          })
        }
      })
    }
  }
}
</script>
<style scoped lang="css">
  .top-nav{
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  .btn-wrapper{
    margin-top:30px;
    margin-bottom:30px;
    width:100%;
    display:flex;
    align-items:center;
    justify-content: center;
  }
</style>
