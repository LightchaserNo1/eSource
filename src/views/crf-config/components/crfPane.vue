<template>
  <div>
    <a-row style="margin-bottom: 15px">
      <div
        class="titleWrap"
        style="margin-bottom: 15px">
        <div class="btn">
          <a-button
            type="primary"
            class="btnItem"
            @click="() => (addcrfVisible = true)"> 新增CRF </a-button>
          <a-button
            v-if="$isCenter"
            type="primary"
            @click="clickExport">导出CRF配置</a-button>
          <a-upload
            v-else
            accept=".txt"
            name="file"
            ref="import"
            list-type="text"
            class="btnItem"
            :customRequest="doUpload"
            :show-upload-list="false"
          >
            <a-button>导入CRF配置</a-button>
          </a-upload>
        </div>
      </div>
      <!-- 表格开始 -->
      <a-table
        ref="table"
        :rowKey="(record) => record.id"
        size="middle"
        bordered
        :pagination="pagination"
        @change="tableChange"
        :data-source="dataList"
        :row-selection="{ type: 'radio', onChange: handlePatientSelectChange, selectedRowKeys }"
        :columns="projectColumns"
        :loading="loading"
      >
        <template
          slot="createTime"
          slot-scope="text, record">
          <div>
            {{ record.createTime | moment('YYYY-MM-DD HH:mm:ss') }}
          </div>
        </template>
        <template
          slot="status"
          slot-scope="text, record">
          <a-switch
            v-if="$auth('CRF.CRF_CONFIG.update')"
            :checked="record.status === 1"
            @change="(e) => handleTop(e, record.id, 'status')"
          ></a-switch>
        </template>
      </a-table>
      <!-- 表格结束 -->
    </a-row>
    <a-row>
      <!-- updata 开始 -->
      <a-col :lg="24">
        <div
          class="titleWrap"
          style="margin: 15px 0">
          <div class="title">院内项目配置</div>
          <div class="btn">
            <a-button
              type="primary"
              class="btnItem"
              @click="addcrfCharpter"> 新增CRF模板</a-button>
            <a-button
              class="btnItem"
              @click="clickexpTemplate">导出章节配置</a-button>
            <a-upload
              accept=".txt"
              name="file"
              ref="importTem"
              list-type="text"
              class="btnItem"
              :customRequest="TemplateUpload"
              :show-upload-list="false"
            >
              <a-button>导入章节配置</a-button>
            </a-upload>
          </div>
        </div>
        <a-card style="padding: 0">
          <a-tabs
            :default-active-key="orgList[0].id ? orgList[0].id : 1"
            v-if="orgList.length>0"
            @change="callbackOrg"
            :forceRender="true">
            <a-tab-pane
              v-for="orgitem in orgList"
              :key="orgitem.id"
              :tab="orgitem.orgName">
              <a-tabs
                :default-active-key="stages && stages[0] && stages[0].id ? stages[0].id : 1"
                v-if="stages.length>0"
                @change="callbackStage"
                :forceRender="true">
                <a-tab-pane
                  v-for="item in stages"
                  :key="item.id"
                  :tab="item.stageName">
                  <a-tabs
                    :default-active-key="item.chapterList && item.chapterList[0] && item.chapterList[0].id ? item.chapterList[0].id : 1"
                    @change="callbacksubStage"
                    :forceRender="true">
                    <!-- checkProList -->
                    <a-tab-pane
                      v-for="(i, k) in item.chapterList"
                      :key="i.id"
                      :tab="i.chapterForm">
                      <div v-if="i.formTypeId === 1">
                        <inspectionModal
                          :key="k"
                          :proJson="i.checkProList"
                          :crfTrialStageId="i.id + ''"
                          :stageId="crfTrialStageId + ''"
                          @getList="callbackStage"
                        ></inspectionModal>
                      </div>
                      <div v-else>
                        <globalModal
                          :key="k"
                          :proJson="i.commonProList"
                          :crfTrialStageId="i.id + ''"
                          :stageId="crfTrialStageId + ''"
                          @getList="callbackStage"
                        ></globalModal>
                      </div>
                    </a-tab-pane>
                  </a-tabs>
                </a-tab-pane>
              </a-tabs>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
      <!-- updata 结束 -->
    </a-row>
    <!-- 新增CRF -->
    <a-modal
      title="新增CRF"
      :confirm-loading="addcrfLoading"
      :visible="addcrfVisible"
      centered
      :maskClosable="false"
      okText="保存"
      @ok="addcrfOk"
      @cancel="addcrfCancel"
    >
      <div>
        <a-form
          :label-col="{ span: 5 }"
          :form="queryParam"
          :wrapper-col="{ span: 16 }">
          <a-form-model-item
            label="开启"
            required>
            <a-radio-group v-model="queryParam.status">
              <a-radio value="1"> 是 </a-radio>
              <a-radio value="0"> 否 </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item
            label="项目ID"
            required>
            <a-select
              style="width: 220px"
              v-model="queryParam.proId"
              placeholder="请选择表单类型"
              default-value=""
              @change="(val) => handleChange(val)"
            >
              <a-select-option
                v-for="type in projectList"
                :key="type.id"
                :value="type.id + ''">
                {{ type.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            label="表ID"
            required>
            <a-input
              v-model="queryParam.tableId"
              placeholder="请输入表ID" />
          </a-form-model-item>
          <a-form-model-item
            label="表名"
            required>
            <a-input
              v-model="queryParam.tableName"
              placeholder="请输入表名" />
          </a-form-model-item>
          <a-form-model-item
            label="版本"
            required>
            <a-input
              v-model="queryParam.edition"
              placeholder="请输入版本" />
          </a-form-model-item>
          <a-form-model-item
            label="章节表单"
            required>
            <a-input
              v-model="queryParam.chapters"
              type="textarea"
              :maxLength="100"
              placeholder="请输入章节表单，以'，'隔开(最多100字)"
            />
          </a-form-model-item>
        </a-form>
      </div>
    </a-modal>
    <!-- 新增CRF模板 -->
    <a-modal
      title="新增CRF模板"
      :confirm-loading="addcrfLoading1"
      :visible="addcrfVisible1"
      centered
      :maskClosable="false"
      okText="保存"
      @ok="addcrfOk1"
      @cancel="addcrfCancel1"
    >
      <div>
        <a-form
          :form="modelParam"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16 }">
          <a-form-model-item
            label="模板类型"
            required>
            <a-select
              style="width: 220px"
              v-model="modelParam.formTypeId"
              placeholder="请选择模板类型"
              default-value=""
            >
              <a-select-option
                v-for="type in formTypeList"
                :key="type.id"
                :value="type.id">
                {{ type.value }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            label="章节名称"
            required>
            <a-select
              style="width: 220px"
              v-model="modelParam.chapterFormId"
              placeholder="请选择章节名称"
              default-value=""
              @change="(val) => handlechapterChange(val)"
            >
              <a-select-option
                v-for="type in unusedChapterArr"
                :key="type.id"
                :value="type.id">
                {{ type.dictionaryName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script>
import inspectionModal from './inspectionModal.vue' // 检查配置组件
import globalModal from './globalModal.vue' // 通用配置组件
import { getListFrom, listChapter, listOrg, listChapterByFrom, listProceedPro, addFrom, addChapter, expCrf, impCrf, expTemplate, impTemplate, updateTable } from '@/api/crf/crf'
import { stageList } from '@/api/update/update'
import { exportWord } from '@/utils/util'
export default {
  components: {
    inspectionModal,
    globalModal
  },
  data () {
    return {
      addcrfLoading: false,
      addcrfVisible: false,
      addcrf: null,
      queryParam: {},
      addcrfLoading1: false,
      addcrfVisible1: false,
      addcrf1: null,
      loading: false,
      listTrilStage: [],
      // 项目表头
      projectColumns: [
        /*  {
           title: '序号',
           dataIndex: 'num',
           customRender: (text, record, index) => `${(this.pagination.current - 1) * this.pagination.defaultPageSize + (index + 1)}`
         }, */
        {
          title: '项目ID',
          dataIndex: 'proId'
        },
        {
          title: '表ID',
          dataIndex: 'tableId'
        },
        {
          title: '表名',
          dataIndex: 'tableName'
        },
        {
          title: '版本',
          dataIndex: 'edition'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '创建人',
          dataIndex: 'creatorName'
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          scopedSlots: { customRender: 'status' }
        }
      ],
      selectProid: null,
      tableType: '',
      tableName: '',
      selectedRowKeys: [],
      // 项目列表 加载数据方法 必须为 Promise 对象
      dataList: [],
      projectList: [],
      orgList: [],
      orgId: null,
      orgName: null,
      stages: [],
      chapterList: [], // 章节项目名列表
      chapterArr: [], // 章节下拉框列表
      unusedChapterArr: [], // 未使用章节下拉框列表
      cacheChapter: [],
      formTypeList: [{
        id: '1',
        value: '检验项目模板'
      }, {
        id: '2',
        value: '通用项目模板'
      }
      ],
      proCode: null,
      modelParam: {},
      ChapterForm: null, // 章节名
      crfTrialStageId: null, // 访视阶段ID
      crfFromInfoId: null, // 	表单信息ID
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10, // 每页中显示10条数据
        showSizeChanger: true,
        pageSizeOptions: ['10', '20'], // 每页中显示的数据
        showTotal: total => `共有 ${total} 条数据` // 分页中显示总的数据
      },
      cacheTop: []
    }
  },
  mounted () {
    this.getListData()
    this.getList()
  },
  methods: {
    // CRF表单列表
    getListData () {
      this.loading = true
      const form = new FormData()
      form.append('pageNumber', this.pagination.current)
      form.append('pageSize', this.pagination.pageSize || this.pagination.pageSize)
      getListFrom(form).then(res => {
        if (res.content.length > 0) {
          this.dataList = res.content
          this.cacheTop = this.dataList.map(item => ({ ...item }))
          this.stages = this.formatStage(res.content[0].stages)
          this.crfTrialStageId = this.stages.length > 0 ? this.stages[0].id : null
          this.selectProid = res.content[0].proId
          this.crfFromInfoId = res.content[0].id
          this.selectedRowKeys = []
          this.selectedRowKeys.push(res.content[0].id)
          this.pagination = {
            total: res.totalCount, // 数据总数
            current: res.pageNumber,
            pageSize: 10,
            showSizeChanger: true, // 显示修改pageSize的下拉框
            pageSizeOptions: ['10', '20'], // 设置pageSize的可选值，页面啊可以通过下拉框进行选择
            showTotal: total => `共 ${total} 条数据` // 展示总共有几条数据
          }
          this.listOrg(this.selectProid)
          this.getlistTrilStage()
        }
        this.loading = false
      }).catch((err) => {
        console.log('报错信息', err)
        this.loading = false
      })
    },
    // 保存上表数据
    handleTop (val, id, column) {
      console.log(val)
      const form = new FormData()
      const status = val === true ? 1 : 0
      form.append('id', id)
      form.append('status', status)
      updateTable(form).then(res => {
        this.$message.success('保存成功')
        const newData = [...this.dataList]
        const newCacheData = [...this.cacheTop]
        const target = newData.filter(item => id === item.id)[0]
        const targetCache = newCacheData.filter(item => id === item.id)[0]
        if (target && targetCache) {
          target[column] = status
          this.dataList = newData
          Object.assign(targetCache, target)
          this.cacheTop = newCacheData
        }
      }).catch((err) => {
        console.log(err)
        this.loading = false
      })
    },
    // format
    formatStage (arr) {
      const newArr = arr.map(item => {
        const obj = {
          id: item.id,
          stageName: item.name,
          chapterList: []
        }
        return obj
      })
      return newArr
    },
    callbackOrg (key) {
      this.orgId = key
      let aArr = []
      aArr = this.orgList.filter(item => item.id === key)
      this.orgName = aArr[0].orgName
      this.chapterByFrom()
      this.getlistChapter(this.crfTrialStageId)
    },
    callbackStage (key) {
      this.crfTrialStageId = key
      if (key) this.getlistChapter(key)
    },
    callbacksubStage (key) {
      console.log(key)
    },
    listOrg (key) {
      const form = new FormData()
      form.append('proId', key)
      listOrg(form).then(res => {
        this.orgList = res
        this.orgId = res.length > 0 ? res[0].id : null
        this.orgName = res.length > 0 ? res[0].orgName : null
        // if (this.crfTrialStageId) this.getlistChapter(this.crfTrialStageId)
      }).catch((err) => {
        console.log('报错信息', err)
      })
    },
    // 获取章节名chapterForm chapterFormId
    getChapterForm (key) {
      let aArr = []
      aArr = this.chapterArr.filter(item => item.id === key)
      this.chapterForm = aArr[0].dictionaryName
      this.chapterFormId = aArr[0].id
    },
    getlistChapter (key) {
      console.log(this.orgId)
      listChapter({ stageId: key, fromId: this.crfFromInfoId, orgId: this.orgId }).then(res => {
        const arr = [...this.stages]
        arr.map((item, index) => {
          const obj = {
            ...item
          }
          if (item.id + '' === key + '') {
            item.chapterList = res
            this.chapterList = res
          }
          return obj
        })
        this.stages = arr
        console.log(this.stages)
      }).catch((err) => {
        console.log('报错信息', err)
      })
    },
    // 项目列表
    getList () {
      listProceedPro().then(res => {
        this.projectList = res
      }).catch((err) => {
        console.log('报错信息', err)
      })
    },
    // 章节下拉框列表
    chapterByFrom () {
      listChapterByFrom({ fromId: this.crfFromInfoId }).then(res => {
        this.cacheChapter = res
        this.chapterArr = res
      }).catch((err) => {
        console.log('报错信息', err)
      })
    },
    // 获取章节名chapterForm
    handlechapterChange (value) {
      let aArr = []
      aArr = this.chapterArr.filter(item => item.id === value)
      this.chapterForm = aArr[0].dictionaryName
    },
    // 获取proCode
    handleChange (value) {
      let aArr = []
      aArr = this.projectList.filter(item => item.id + '' === value)
      this.proCode = aArr[0].no
    },
    // 获取访视阶段列表
    getlistTrilStage () {
      stageList({ proId: this.selectProid }).then(res => {
        this.stages = this.formatStage(res)
        this.crfTrialStageId = this.stages.length > 0 ? this.stages[0].id : null
        if (this.crfTrialStageId) this.getlistChapter(this.crfTrialStageId)
      }).catch((err) => {
        console.log('报错信息', err)
        this.loading = false
      })
    },
    tableChange (pagination, filters, sorter) {
      this.pagination = pagination
      this.getListData()
    },
    handlePatientSelectChange (keys, rows) {
      this.selectedRowKeys = keys
      this.selectProid = rows[0].proId
      this.crfFromInfoId = rows[0].id
      this.modelParam = {}
      this.queryParam = {}
      this.listOrg(this.selectProid)
      this.chapterByFrom()
      this.getlistTrilStage()
    },
    // 导出CRF配置
    clickExport () {
      expCrf().then(res => {
        exportWord('CRF', res)
      })
    },
    // 导入文件CRF配置
    doUpload (options) {
      const { file } = options
      console.log(file)
      console.log(file.type)
      const params = new FormData()
      params.append('file', file)
      return impCrf(params).then(res => {
        this.$notification.success({
          message: file.name,
          description: '上传成功'
        })
        this.getListData()
        this.getList()
      }).finally(() => {
        this.$refs.import.sFileList = []
      })
    },
    // 导出章节与配置
    clickexpTemplate () {
      const form = new FormData()
      form.append('formId', this.crfFromInfoId)
      form.append('orgId', this.orgId)
      form.append('stageId', this.crfTrialStageId)
      console.log(form)
      expTemplate(form).then(res => {
        exportWord('配置', res)
      })
    },
    // 导入章节与配置
    TemplateUpload (options) {
      const { file } = options
      console.log(file)
      console.log(file.type)
      const params = new FormData()
      params.append('formId', this.crfFromInfoId)
      params.append('orgId', this.orgId)
      params.append('stageId', this.crfTrialStageId)
      params.append('file', file)
      return impTemplate(params).then(res => {
        this.$notification.success({
          message: file.name,
          description: '上传成功'
        })
        this.getlistChapter(this.crfTrialStageId)
      }).finally(() => {
        this.$refs.importTem.sFileList = []
      })
    },
    // 新建CRF
    addcrfOk () {
      this.addcrfVisible = true
      const arr = Object.keys(this.queryParam)
      if (arr.length !== 6) {
        return this.$notification.warning({
          message: '警告',
          description: `请确认所有项目完成后添加`
        })
      }
      addFrom(Object.assign({ ...this.queryParam }, { proCode: this.proCode })).then(res => {
        this.$message.success('添加成功')
        this.queryParam = {}
        this.addcrfVisible = false
        this.addcrfLoading = false
        this.getListData()
      }, err => {
        console.log(err)
      })
    },
    addcrfCancel () {
      this.addcrfVisible = false
      this.queryParam = {}
    },
    // 打开新建CRF章节
    addcrfCharpter () {
      const array = []
      this.chapterList.map(item => {
        array.push(item.chapterForm)
      })
      let newArr = this.chapterArr
      array.forEach(value => {
        newArr = newArr.filter(item => value !== item.dictionaryName)
      })
      this.unusedChapterArr = newArr
      this.addcrfVisible1 = true // chapterArr
    },
    // 新建CRF章节
    addcrfOk1 () {
      this.addcrfVisible1 = true
      const arr = Object.keys(this.modelParam)
      if (arr.length !== 2) {
        return this.$notification.warning({
          message: '警告',
          description: `请确认所有项目选择后添加`
        })
      }
      addChapter(Object.assign({ ...this.modelParam }, { chapterForm: this.chapterForm, formType: this.modelParam.formTypeId === '1' ? '检验项目模板' : '通用项目模板', crfTrialStageId: this.crfTrialStageId, crfFromInfoId: this.crfFromInfoId, orgId: this.orgId, orgName: this.orgName })).then(res => {
        this.$message.success('添加成功')
        this.modelParam = {}
        this.addcrfVisible1 = false
        this.addcrfLoading1 = false
        this.callbackStage(this.crfTrialStageId)
      }, err => {
        console.log(err)
      })
    },
    addcrfCancel1 () {
      this.addcrfVisible1 = false
      this.modelParam = {}
    }
  }
}
</script>

<style scoped lang="less">
.titleWrap {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  .crf {
    font-weight: bolder;
  }
  .title {
    height: 30px;
    line-height: 30px;
    font-weight: bolder;
    margin-left: 20px;
  }
  .btn {
    margin-left: auto;
  }
  .btnItem {
    margin-right: 15px;
  }
}
.ml15 {
  margin-left: 15px;
}
.ant-switch-checked{
  background-color:#43D882
}
/deep/ .ant-card-body {
  padding: 16px;
}
/deep/ .ant-tabs-bar {
  margin: 0 0 5px 0 !important;
}
</style>
