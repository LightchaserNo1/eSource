<template>
  <div>
    <!--
      in-page-skip组件使用说明:(没有自闭和功能)
      参数：
        firstView必传，初始值定位true，用于显示初始试图，
        可根据业务需求在适合的位置改为false，用于隐藏初始视图跳转到其他视图。
      两个具名插槽:(定义在初始视图和跳转后视图最外层的组件或标签之上)
        插槽名为firstShow的为第一次展示的，
        插槽名为skipIn的为跳转后展示的。
        #以上两个名字的插槽不可写到in-page-skip组件本身上。只能写到组件内部的标签或组件上#
        可根据需求在最外层父盒子或者父组件上定义slot来限定哪部分为第一次展示和跳转后展示。
      自定义事件：
        goBack事件，用于跳回初始试图。
     -->
    <PageSkip :firstView="firstView" @goBack="handleGoBack()" @clickAdd="addDepartment">
      <a-card slot="fitstShow">
        <div class="table-page-search-wrapper">
          <a-form-model layout="inline" :model="queryParam">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-model-item label="医院列表" labelAlign="left">
                  <a-input v-model="queryParam.kw" />
                </a-form-model-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-button @click="activeSearch" type="primary" class="search">搜索</a-button>
                <a-button @click="activeReset" type="default" class="search" style="margin-left:20px;">重置</a-button>
              </a-col>
              <a-col :md="8" :sm="24" style="display: flex; justify-content: flex-end;">
                <a-button type="primary" @click="handleAdd" v-if="$auth('ORGANIZATION.ORGANIZATION_HOS_ADD')">新增</a-button>
                <a-button
                  v-if="$auth('ORGANIZATION.ORGANIZATION_HOS_IMPORT')"
                  style="margin-left:10px"
                  type="primary"
                  :href="'/source/muban/科室字典.xlsx'|dealImageUrl"
                  icon="download"
                >
                  下载模板
                </a-button>
              </a-col>
              <!-- <a-col :md="3" :sm="24" v-if="isSupperAdmin">
                <a-button v-if="!$isCenter">导入</a-button>
                <a-button v-else>导出</a-button>
              </a-col> -->
            </a-row>
            <s-table
              ref="table"
              size="default"
              :rowKey="record => record.id"
              :scroll="{ x: 1700 }"
              :columns="columns"
              :data="loadData"
            >
              <span slot="officeDictionary" slot-scope="text, record">
                <a href="javascript:;" size="small" type="primary" @click="watchDictionary(record)" v-if="$auth('ORGANIZATION.ORGANIZATION_HOS_DETAIL')">查看</a>
                <a-divider type="vertical" />
                <a-upload
                  accept=".xlsx"
                  name="file"
                  :before-upload="beforeUpload"
                  list-type="picture"
                  :preview-file="previewFile"
                >
                  <a href="javascript:;" size="small" type="primarys" @click="clickUpload(record)" v-if="$auth('ORGANIZATION.ORGANIZATION_HOS_IMPORT')">上传</a>
                </a-upload>
              </span>
              <span slot="operation" slot-scope="text, record">
                <template>
                  <a href="javascript:;" @click="openUpload(record)" v-if="$auth('ORGANIZATION.ORGANIZATION_HOS_EDIT')">编辑</a>
                  <a-divider type="vertical" />
                  <a-popconfirm title="是否要删除此行？" ok-text="确定" cancel-text="取消" @confirm="confirm(record)">
                    <a href="javascript:;" v-if="$auth('ORGANIZATION.ORGANIZATION_HOS_DELETE')">删除</a>
                  </a-popconfirm>
                </template>
              </span>
            </s-table>
            <AddModal
              :visible="showModal"
              @modalOk="addSubmit"
              @modalCancel="addCancel"
              :type="currentType"
              :openType="openType"
              :editContent="modify"
              :business="business"
            />
          </a-form-model>
        </div>
      </a-card>
      <a-card slot="skipIn">
        <div>
          <a-row :gutter="48">
            <a-col :md="4" :sm="12">
              <a-card>
                <a-tree
                  :selected-keys="selectedKeys"
                  :replaceFields="replaceFields"
                  :auto-expand-parent="autoExpandParent"
                  :tree-data="treeData"
                  @dragenter="onDragEnter"
                  ref="tree"
                  @select="onSelect"
                  v-if="treeData && treeData.length > 0"
                  default-expand-all
                  :defaultExpandAllRows="true"
                  :default-expanded-keys="expandedKeys"
                />
                <a-empty v-if="emptyPrompt == null" />
              </a-card>
            </a-col>
            <a-col
              :md="20"
              :sm="24"
            ><div>
              <a-table
                ref="tableS"
                :loading="treeLoading"
                size="default"
                :rowKey="record => record.id"
                :columns="dictionaryList"
                :data-source="rightList"
                :hideOnSinglePage="true"
              >
                <span slot="input" slot-scope="text, record">
                  <template>
                    <span>{{ record.input | moment('YYYY-MM-DD') }}</span>
                  </template>
                </span>
                <span slot="clincOrHospital" slot-scope="text, record">
                  <template>
                    <span>{{ record.clincOrHospital == 1 ? '门诊' : '住院' }}</span>
                  </template>
                </span>
                <span slot="internalOrSurgery" slot-scope="text, record">
                  <template>
                    <span>{{ record.internalOrSurgery == 0 ? '内科' : '外科' }}</span>
                  </template>
                </span>
                <span slot="deleted" slot-scope="text, record">
                  <template>
                    <span>{{ record.deleted == 1 ? '停用' : '未停用' }}</span>
                  </template>
                </span>
                <span slot="action" slot-scope="text, record">
                  <template>
                    <!-- 科室编辑，这里回显要调接口的小老弟 -->
                    <a href="javascript:;" @click="openEditor(record)">编辑</a>
                    <a-divider type="vertical" />
                    <a href="javascript:;" @click="switchBan(record)">{{ record.deleted == 0 ? '禁用' : '启用' }}</a>
                  </template>
                </span>
              </a-table>
            </div>
            </a-col>
          </a-row>
        </div>
      </a-card>
    </PageSkip>
    <HospitalAdd
      :visible="visible"
      @modalOk="addUpload"
      @modalCancel="downAdd"
      :department="department"
      :bouncedState="bouncedState"
      ref="hospitalAddRef"
    />
  </div>
</template>
<script>
import { buildPaginationObj } from '@/components/Table'
import monitor from '@/utils/monitor'
import SiteTab from '@/monitor/organization/SiteTab'

import moment from 'moment'
import HospitalAdd from './hospitalAdd.vue'
import {
  getInstitutionsList,
  getInstitutionsAdd,
  getInstitutionsUpdate,
  getTreeNode,
  getTreeList,
  getUpload,
  getDictionary,
  getAddDept,
  getUpdateDept,
  getDeleteDept,
  getInvoke,
  getInstitutionsDetail,
  getInstitutionsDelete
} from '@/api/organization/organization'
import AddModal from './AddModal.vue'
import cloneDeep from 'lodash.clonedeep'
const watch = monitor(SiteTab)
export default {
  props: {},
  components: {
    AddModal,
    HospitalAdd
  },
  data () {
    return {
      isSupperAdmin: this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.ADMIN.value),
      defaultExpandAll: true,
      editorID: null,
      department: {},
      bouncedState: 0,
      orgId: null,
      hospitalAreaId: null,
      emptyPrompt: [],
      business: [],
      uploadId: 0,
      openType: 0, // 通过这个判断 状态是 添加 编辑 详情
      currentType: 2, // tab状态
      modify: {}, // 编辑某一行
      detailsInfo: {}, // 编辑某一行
      treeData: [], // 树形控件左侧内容
      rightList: [], // 树形右边数据列表源
      storage: [], // 点击左侧控件切换 存储的右边内容
      queryParam: {
        kw: '',
        type: 2
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getInstitutionsList(Object.assign(parameter, this.queryParam)).then(res => {
          return buildPaginationObj(res)
        })
      },
      addId: 0,
      firstView: true,
      showModal: false,
      modalTilte: '新增研究机构',
      notWatch: true,
      treeLoading: false,
      selectedKeys: [],
      expandedKeys: ['0-0', '0-0-0', '0-0-0-0'],
      autoExpandParent: true,
      replaceFields: {
        key: 'id',
        title: 'name',
        children: 'children'
      },
      visible: false,
      parametersDictionary: {
        pageNumber: 1,
        pageSize: 20
      },
      judgeMark: null,
      infoId: null,
      columns: [
        {
          title: 'ID',
          dataIndex: 'id'
        },
        {
          title: '医院编号',
          dataIndex: 'orgNo'
        },
        {
          title: '组织机构名称',
          dataIndex: 'orgName'
        },
        {
          title: '组织机构代码',
          dataIndex: 'orgCode'
        },
        {
          title: '英文名称',
          dataIndex: 'englishName'
        },
        {
          title: '简称',
          dataIndex: 'shortName'
        },
        {
          title: '类型',
          dataIndex: 'typeName'
        },
        {
          title: '地址',
          dataIndex: 'address'
        },
        {
          title: '联系人',
          dataIndex: 'contacts'
        },
        {
          title: '联系人电话',
          dataIndex: 'phone'
        },
        {
          title: '联系人邮箱',
          dataIndex: 'email'
        },
        {
          title: '科室字典',
          dataIndex: 'officeDictionary',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'officeDictionary' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      dictionaryList: [
        {
          title: 'ID',
          dataIndex: 'id'
        },
        {
          title: '科室名称',
          dataIndex: 'name'
        },
        {
          title: '科室代码',
          dataIndex: 'dcode'
        },
        {
          title: '父科室名称',
          dataIndex: 'pidName'
        },
        {
          title: '父科室代码',
          dataIndex: 'pidDcode'
        },
        {
          title: '科室别称',
          dataIndex: 'epithet'
        },
        {
          title: '门诊住院标记',
          dataIndex: 'clincOrHospital',
          scopedSlots: { customRender: 'clincOrHospital' }
        },
        {
          title: '内外科标记',
          dataIndex: 'internalOrSurgery',
          scopedSlots: { customRender: 'internalOrSurgery' }
        },
        {
          title: '所属医院',
          dataIndex: 'affiliationHospital'
        },
        {
          title: '录入时间',
          dataIndex: 'input',
          scopedSlots: { customRender: 'input' }
        },
        {
          title: '停用标记',
          dataIndex: 'deleted',
          scopedSlots: { customRender: 'deleted' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  watch: {
    visible (nv) {
      if (nv === false) {
        this.department = {}
      }
    }
  },
  mounted () {
    this.getBodyType()
  },
  methods: watch({
    // 点击编辑这一行
    openUpload (record) {
      this.currentId = record.id
      getInstitutionsDetail({ id: record.id }).then(res => {
        const { orgName, orgCode, englishName, shortName, address, contacts, phone, email, orgType } = res
        this.modify = { orgName, orgCode, englishName, shortName, address, contacts, phone, email, orgType }
        this.openType = 1
        setTimeout(() => {
          this.showModal = true
        }, 10)
      })
    },
    // 点击删除这一行
    confirm (record) {
      getInstitutionsDelete({ id: record.id, type: 2 }).then(res => {
        this.$message.success('删除成功')
        this.$refs.table.refresh(true)
      })
    },
    // 禁用开启转换
    switchBan (record) {
      this.treeLoading = true
      if (record.deleted === 0) {
        getDeleteDept({
          id: record.id
        }).then(res => {
          this.$message.success('禁用成功')
          this.getListData()
          this.treeLoading = false
        })
      } else {
        getInvoke({
          id: record.id
        }).then(res => {
          this.$message.success('启用成功')
          this.getListData()
          this.treeLoading = false
        })
      }
    },
    // 点击编辑这一行
    openEditor (record) {
      record.input = this.$options.filters.moment(record.input, 'YYYY-MM-DD')
      this.editorID = record.id
      this.department = cloneDeep(record)
      console.log(this.department, 'showBack')
      this.bouncedState = 1
      this.visible = true
    },
    // 关闭新增科室弹框
    downAdd () {
      this.visible = false
      this.department = {}
    },
    // 点击确认新增(树页面)
    addUpload (e) {
      e.input = moment(e.input).format('YYYY-MM-DD')
      if (this.bouncedState === 0) {
        getAddDept({
          ...e,
          hospitalAreaId: this.hospitalAreaId,
          orgId: this.addId
        })
          .then(res => {
            this.$message.success('添加成功')
            this.$nextTick(() => {
              // 重新获取右侧列表
              this.getListData()
              // 获取树列表
              getTreeNode({
                orgId: this.orgId
              }).then(res => {
                this.emptyPrompt = res // 进入页面吧res存起来判断为不为空  用于为空提示组件
                this.treeData = []
                if (this.judgeMark === null) {
                  this.firstView = false
                  res = res || []
                  this.treeData = res.flatMap(item => {
                    return {
                      id: this.getRandom(),
                      areaId: item.id,
                      name: item.name,
                      children: [
                        {
                          id: this.getRandom(),
                          areaId: item.id,
                          internalOrSurgery: 0,
                          name: '内科',
                          children: item.innerChildren
                        },
                        {
                          id: this.getRandom(),
                          areaId: item.id,
                          internalOrSurgery: 1,
                          name: '外科',
                          children: item.outChildren
                        }
                      ]
                    }
                  })
                } else {
                  this.firstView = false
                  this.treeData = res.flatMap(item => {
                    return [
                      {
                        id: this.getRandom(),
                        name: item.name,
                        areaId: item.id,
                        children: [
                          {
                            id: this.getRandom(),
                            areaId: item.id,
                            internalOrSurgery: 0,
                            name: '内科',
                            children: item.innerChildren
                          },
                          {
                            id: this.getRandom(),
                            areaId: item.id,
                            internalOrSurgery: 1,
                            name: '外科',
                            children: item.outChildren
                          }
                        ]
                      }
                    ]
                  })
                  // 设置初始的院区id
                  this.hospitalAreaId = this.treeData[0].areaId
                }
              })
              console.log(this.expandedKeys)
              this.visible = false
            })
          })
          .catch(() => {
            this.visible = false
          })
        console.log('添加转入信息', e)
      } else {
        delete e.createTime
        delete e.pidName
        console.log('e', e)
        getUpdateDept({
          ...e,
          id: this.editorID
        }).then(res => {
          this.$message.success('修改成功')
          this.visible = false
          this.getListData()
        })
      }
    },
    // 点击新增科室
    addDepartment () {
      this.visible = true
      this.bouncedState = 0
      this.$refs.hospitalAddRef.departmentList = this.rightList
    },
    getBodyType () {
      getDictionary({
        typeCode: 10001012
      }).then(res => {
        this.business = res
      })
    },
    clickUpload (record) {
      console.log('当前数据源', record)
      this.orgId = record.id
    },
    beforeUpload (file) {
      // 定义可选文件类型
      const fileType = file.name.split('.')[1]
      console.log(fileType)
      return false
    },
    previewFile (file) {
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
        params.append('orgId', this.orgId)
        return getUpload(params).then(res => {
          this.$notification.success({
            message: file.name,
            description: '上传成功'
          })
          console.log(res)
        })
      }
    },
    // 搜索
    activeSearch () {
      this.$refs.table.refresh(true)
    },
    // 重置
    activeReset () {
      this.queryParam = {}
      this.queryParam.type = 2
      this.$refs.table.refresh(true)
    },
    // 新增
    handleAdd () {
      this.modify = {}
      this.openType = 0
      this.showModal = true
    },
    // 关闭新增按钮
    addCancel () {
      this.showModal = false
    },
    onDragEnter (info) {
      console.log(info)
      // expandedKeys 需要受控时设置
      this.expandedKeys = info.expandedKeys
      console.log(this.expandedKeys)
      this.autoExpandParent = false
    },
    derpNodeclickv (item, e) {
      console.log('信息', item)
    },
    onSelect (selectedKeys, info) {
      console.log('areaId', info.selectedNodes[0].data.props)
      // 设置院区id
      this.hospitalAreaId = info.selectedNodes[0].data.props.areaId || info.selectedNodes[0].data.props.hospitalAreaId
      console.log(this.hospitalAreaId, '院区id')
      this.orderList = null
      const infoList = {
        orgId: this.infoId.id,
        internalOrSurgery: info.selectedNodes[0].data.props.internalOrSurgery,
        areaId: info.selectedNodes[0].data.props.areaId,
        dcode: info.selectedNodes[0].data.props.dcode
      }
      this.orderList = infoList
      this.getListData()
    },
    getListData () {
      this.treeLoading = true
      const parameter = Object.assign(this.parametersDictionary, this.orderList)
      console.log('参数', parameter)
      getTreeList(parameter).then(res => {
        this.rightList = res.content
        setTimeout(() => {
           this.treeLoading = false
        }, 100)
        console.log(this.autoExpandParent)
      })
    },
    // 获取指定位数的随机数
    getRandom () {
      return Math.floor(Math.random() * Math.pow(10, 10))
    },
    // 树形左边控件数据源
    watchDictionary (record) {
      this.orgId = record.id
      this.addId = record.id
      console.log('医院ID', this.addId)
      this.infoId = record
      this.judgeMark = record.areaId
      console.log('当前行数据判断标识', record)
      getTreeNode({
        orgId: record.id
      }).then(res => {
        this.emptyPrompt = res // 进入页面吧res存起来判断为不为空  用于为空提示组件
        this.treeData = []
        console.log(res, 'tree')
        if (record.areaIds === null) {
          this.firstView = false
          res = res || []
          this.treeData = res.flatMap(item => {
            return {
              id: this.getRandom(),
              areaId: item.id,
              name: item.name,
              children: [
                {
                  id: this.getRandom(),
                  areaId: item.id,
                  internalOrSurgery: 0,
                  name: '内科',
                  children: item.innerChildren
                },
                {
                  id: this.getRandom(),
                  areaId: item.id,
                  internalOrSurgery: 1,
                  name: '外科',
                  children: item.outChildren
                }
              ]
            }
          })
          console.log('不带园区的树形字典数据源', this.treeData)
        } else {
          this.firstView = false
          this.treeData = res.flatMap(item => {
            return [
              {
                id: this.getRandom(),
                name: item.name,
                areaId: item.id,
                children: [
                  {
                    id: this.getRandom(),
                    areaId: item.id,
                    internalOrSurgery: 0,
                    name: '内科',
                    children: item.innerChildren
                  },
                  {
                    id: this.getRandom(),
                    areaId: item.id,
                    internalOrSurgery: 1,
                    name: '外科',
                    children: item.outChildren
                  }
                ]
              }
            ]
          })
          console.log('带园区的树形字典数据源', this.treeData)
          // 设置初始的院区id
          this.hospitalAreaId = this.treeData[0].areaId
          console.log(this.hospitalAreaId, '院区id')
        }
      })
      this.orderList = null
      const infoList = {
        orgId: this.addId
      }
      this.orderList = infoList
      this.getListData()
    },
    // 点击确认新增
    addSubmit (e) {
      if (this.openType === 0) {
        getInstitutionsAdd({ ...e, type: this.currentType }).then(res => {
          this.showModal = false
          this.$message.success('添加成功')
          this.$refs.table.refresh(true)
        })
      } else {
        getInstitutionsUpdate({ ...e, id: this.currentId, type: this.currentType }).then(res => {
          this.$message.success('修改成功')
          this.showModal = false
          this.$refs.table.refresh(true)
        })
      }
    },
    // 返回上一级
    handleGoBack () {
      this.firstView = true
      this.treeData = []
      this.rightList = []
      this.$refs.table.refresh(true)
    },
    handleClickNode () {
      alert('a')
    }
  })
}
</script>
<style scoped lang=""></style>
