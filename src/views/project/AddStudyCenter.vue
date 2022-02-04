<template>
  <page-header-wrapper @back="$router.go(-1)">
    <a-card :body-style="{ padding: '18px' }" :bordered="false">
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
      <br/>
      <div class="form-wrapper">
        <a-form-model
          ref="ruleForm"
          layout="inline"
          :model="form"
          :rules="rules">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="中心全名" prop="orgName" labelAlign="left">
                <a-select v-model="form.orgName" @change="handleCenterChange($event)" >
                  <a-select-option v-for="(item,index) in orgList" :key="index" :vlaue="item.orgName">
                    {{ item.orgName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="中心编号" prop="orgNo" labelAlign="left">
                <a-input v-model.trim="form.orgNo" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="中心短名" prop="shortName" labelAlign="left">
                <a-input v-model.trim="form.shortName" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="中心英文名" prop="englishName" labelAlign="left">
                <a-input v-model.trim="form.englishName" style="width:100%" disabled/>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="中心状态" prop="active" labelAlign="left">
                <a-select v-model.trim="form.active">
                  <a-select-option v-for="(item,index) in statusList" :key="index" :value="item.value">
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="中心地址" prop="address" labelAlign="left">
                <a-input v-model.trim="form.address" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="科室" prop="orgDeptName" labelAlign="left">
                <a-select
                  :disabled="officeDisabled"
                  mode="multiple"
                  v-model="form.orgDeptName"
                  @change="handleOfficeChange">
                  <a-select-option v-for="(item,index) in officeList" :key="index" :value="item.name">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="主要研究者">
                <a-input v-model.trim="form.mainResName"/>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="是否项目主要研究者">
                <a-checkbox @change="mainChange"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <div style="clear:both;"></div>
          <a-descriptions title="联系人"></a-descriptions>
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="联系人">
                <a-input v-model.trim="form.contacts" disabled/>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="联系人电话">
                <a-input v-model.trim="form.phone" disabled/>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
        <div class="btn-wrapper">
          <a-button type="primary" @click="clickSave()">保存</a-button>
        </div>
        <!-- <div class="top-nav">
          <a-descriptions title="研究团队"></a-descriptions>
          <div><a-button
            type="primary"
            :disabled="addMember"
            @click="clickAddMember"><a-icon type="plus"/>添加成员</a-button></div>
        </div> -->
      </div>
      <Modal
        :type="4"
        :proId="$route.query.proId"
        @ok="modalOk"
        @cancel="modalCancel()"
        :visible="visible"/>
      <s-table
        v-if="showTable&&resId"
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
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import Modal from './components/Modal'
import { actionInvite, getOrgList, getOfficeByOrg, addStudyCenter, detailAdd, getCenterMemberList } from '@/api/project/project'
export default {
  props: {
  },
  components: {
    Modal
  },
  data () {
    return {
      form: {
        orgNo: '',
        proResName: -1
      },
      addMember: true,
      queryParam: {
        proId: this.$route.query.proId
      },
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return getCenterMemberList(Object.assign(parameter, { resId: this.resId, proId: this.$route.query.proId }))
          .then(res => {
            return res
        })
      },
      userId: null,
      officeDisabled: true,
      visible: false,
      // 假数据，可选择的研究中心列表
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
      orgId: null,
      resId: null,
      showTable: false,
      params: {},
      rules: {
        orgName: [{ required: true, message: '请选择研究中心' }],
        orgNo: [
          { required: true, message: '请输入中心编号' },
          { min: 0, max: 20, message: '中心编号长度限制在20个字以内' },
          { pattern: /^[a-zA-Z0-9]+$/, message: '中心编号格式错误' }
        ],
        shortName: [{ min: 0, max: 10, message: '中心短名长度限制在10个字符内' }],
        englishName: [{ min: 0, max: 100, message: '中心英文名长度限制在100个字符内' }],
        active: [{ required: true, message: '请选择中心状态' }],
        orgDeptName: [{ required: true, message: '请选择科室' }],
        address: [{ min: 0, max: 50, message: '中心地址长度限制在50个字符内' }]
      },
      orgList: [],
      officeList: [],
      roleId: null,
      columns: [
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'userName'
        },
        {
          title: '职能',
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
        }
      ]
    }
  },
  watch: { // 此处有bug待解决，只要是关闭弹窗就会做请求。待解决。
    visible (newv) {
      if (!newv) {
        console.log('弹框关闭')
        const memberAdd = {
          roleId: this.roleId,
          orgId: this.orgId,
          proId: this.$route.query.proId,
          userId: this.userId,
          researchId: this.resId
        }
        console.log(memberAdd, '!!!')
        detailAdd(memberAdd).then(res => {
          this.showTable = true
          this.$refs.table.refresh(true)
        })
      }
    }
  },
  created () {

  },
  mounted () {
    console.log(this.$route.query)
    getOrgList({ type: 2 }).then(res => {
      console.log(res, '组织机构列表')
      this.orgList = res
    })
  },
  methods: {
    // 选择研究中心的事件回调
    handleCenterChange (e) {
      if (this.form.orgDeptName) {
        this.form.orgDeptName = []
      }
      console.log(e)
      const target = this.orgList[e]
      this.form = { ...target }
      this.form.orgNo = target.orgNo
      this.orgId = target.id
      console.log(this.form)
      getOfficeByOrg({ orgId: target.id }).then(res => {
        this.officeList = res
        this.officeDisabled = false
      })
    },
    // 添加成员，打开弹窗
    clickAddMember () {
      console.log('添加成员')
      this.visible = true
    },
    // 做完请求之后，关闭弹窗
    modalOk (params) {
      console.log(params, '弹框传的值')
      this.roleId = params.roleId
      this.userId = params.invitedUserId
      actionInvite(params).then(res => {
        this.$message.success('添加成功')
        console.log(res)
        // detailAdd()
        setTimeout(() => {
          this.visible = false
        }, 400)
      }, err => {
        console.log(err, '请求错误信息')
        this.visible = false
      })
      this.visible = false
    },
    modalCancel () {
      this.visible = false
    },
    handleOfficeChange (e) {
      console.log(e)
    },
    // 点击保存，添加
    clickSave () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 通过表单验证时，做表单参数处理。
          const { orgName, orgDeptName, orgNo, proResName, mainResName, active } = this.form
          const orgDeptNames = orgDeptName.join(',')
          const ordDeptIdsArr = this.officeList.filter(item => {
            return orgDeptName.findIndex(value => value === item.name) !== -1
          }).map(item2 => item2.id)
          const orgDeptIds = ordDeptIdsArr.join(',')
          this.params = { orgName, orgId: this.form.id, orgDeptId: orgDeptIds, orgDeptName: orgDeptNames, orgNo, proResName, mainResName, active }
          addStudyCenter({ ...this.queryParam, ...this.params }).then(res => {
            this.resId = res
            this.$message.success('添加成功')
            this.$router.go(-1)
            this.addMember = false
          })
        }
      })
    },
    mainChange (e) {
      console.log(e.target.checked)
      if (e.target.checked) {
        this.form.proResName = 1
      } else {
        this.form.proResName = -1
      }
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
    width:100%;
    display:flex;
    align-items:center;
    justify-content: center;
  }
</style>
