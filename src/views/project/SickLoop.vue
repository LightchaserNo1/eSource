<template>
  <page-header-wrapper @back="$router.go(-1)">
    <a-card
      :loading="cardLoading"
      :border="false">
      <div class="top-nav">
        <div
          class="form-wrapper"
          style="width: 80%">
          <a-form-model
            :form="form"
            layout="inline"
            label-align="left"
            :labelCol="{ style: 'width: 110px' }">
            <a-row :gutter="48">
              <a-col
                :md="8"
                :sm="24">
                <a-form-model-item label="受试者编号">
                  <a-input-search
                    placeholder="请输入受试编号"
                    v-model="paramser.ptsNo"
                    @search="clickSearch" />
                </a-form-model-item>
              </a-col>
              <a-col
                :md="8"
                :sm="24">
                <a-form-model-item label="入组患者人数">
                  {{ totalCount }}
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
        <div class="btn-wrap">
          <!-- <a-button
            type="primary"
            v-if="$options.filters.isHasAuth(this.$const.ROLE_TYPE.CRC.value)||$options.filters.isHasAuth(this.$const.ROLE_TYPE.YW_ADMIN.value)"
            style="float: right"
            @click="clickAdd()"
          >
            <a-icon type="plus" />新增
          </a-button> -->
          <a-button
            type="primary"
            v-if="$auth('PROJECT.PROJECT_PATIENT_ADD')"
            style="float: right"
            @click="clickAdd()"
          >
            <a-icon type="plus" />新增
          </a-button>
          <!-- <a-button style="margin-right:20px;" @click="clickReset">重置</a-button> -->
        </div>
      </div>
      <div>
        <!-- :scroll="{x:2300}" -->
        <a-table
          v-if="userList && userList.length>0"
          :data-source="userList"
          ref="table"
          style="min-height:600px"
          :rowKey="(record) => record.id"
          :columns="dealColumns"
          @change="returnSize"
        >
          <!-- // 有些列的展示内容，要根据权限来定 -->
          <template
            slot="nos"
            slot-scope="text,record,index">
            {{ (thisSize * (thisCurrent - 1)) + index + 1 }}
          </template>
          <template
            slot="sex"
            slot-scope="text, record">
            <div>
              {{ record.sex == 0 ? '女' : '男' }}
            </div>
          </template>
          <template
            slot="dateBirth"
            slot-scope="text, record">
            <div>
              {{ record.dateBirth | moment('YYYY-MM-DD') }}
            </div>
          </template>
          <template
            slot="file"
            slot-scope="text, record"
            v-if="$auth('PROJECT.PROJECT_PATIENT_FILES')">
            <div>
              <!-- 查看患者档案 -->
              <a
                href="javascript:;"
                @click="clickWatchFile(record)">查看</a>
            </div>
          </template>
          <template
            slot="upload"
            slot-scope="text, record"
            v-if="$auth('PROJECT.PROJECT_PATIENT_UPLOAD_FILES')">
            <div>
              <!-- 当前为中心端且身份为CRC时，禁掉 -->
              <a
                :disabled="isCrc&&$isCenter"
                href="javascript:;"
                @click="clickUpload(record)">上传</a>
            </div>
          </template>
          <template
            slot="catch"
            slot-scope="text, record"
            v-if="$auth('PROJECT.PROJECT_PATIENT_SCAN_DETAIL')">
            <!-- 查看抓取情况 -->
            <div>
              <a
                href="javascript:;"
                @click="clickWatchCatch(record)">查看</a>
            </div>
          </template>
          <template
            slot="fallDown"
            slot-scope="text, record"
            v-if="$auth('PROJECT.PROJECT_PATIENT_SCAN')">
            <!-- 停止脱落 -->
            <div>
              <!-- 医院端可操作，中心端不可操作 -->
              <div v-if="!$isCenter">
                <!-- <a-button type="primary" style="margin-right: 1rem;" :disabled="!(record.offStatus==1)" @click="clickDealCatch(record, 1)">停止</a-button>
                <a-button type="primary" :disabled="!(record.offStatus==-1)" @click="clickDealCatch(record, 2)">同步</a-button> -->
                <a-switch
                  checked-children="同步"
                  un-checked-children="停止"
                  :checked="record.offStatus === -1 ? false : true"
                  @change="(val) => onChange(val,record)"
                />
                <!-- <a-radio-group
                  size="small"
                  :value="record.offStatus"
                  button-style="solid">

                  <a-radio-button
                    :value="-1"
                    @click="clickDealCatch(record, 1)">
                    停止
                  </a-radio-button>
                  <a-radio-button
                    :value="1"
                    @click="clickDealCatch(record, -1)">
                    同步
                  </a-radio-button>
                </a-radio-group> -->
              </div>
              <span v-else>
                <span v-if="record.offStatus==1">同步</span>
                <span v-else-if="record.offStatus==-1">停止</span>
              </span>
            </div>
          </template>
          <!-- 修改基线时间 -->
          <template
            slot="basicLineDate"
            slot-scope="text,record"
            v-if="$auth('PROJECT.PROJECT_PATIENT_BASETIME')">
            <div >
              <!-- 医院端可操作，中心端不可操作 -->
              <a-date-picker
                :disabled="$isCenter || !isCrc"
                v-if="record.basicLineDate"
                :allowClear="false"
                :default-value="record.basicLineDate | moment('YYYY-MM-DD')"
                format="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD"
                @change="timeOK($event,record)"
              />
              <a-date-picker
                v-else
                :disabled="$isCenter || !isCrc"
                :allowClear="false"
                :default-value="$options.filters.moment(Date.parse(new Date()), 'YYYY-MM-DD')"
                format="YYYY-MM-DD"
                valueFormat="YYYY-MM-DD"
                @change="timeOK($event,record)"
              />
            </div>
          </template>
          <template
            slot="assessSheet"
            slot-scope="text, record"
            v-if="$auth('PROJECT.PROJECT_PATIENT_ESTIMATE')">
            <!-- 录入评估表 -->
            <div>
              <a
                href="javascript:;"
                @click="clickEntering(record)">录入</a>
            </div>
          </template>
        </a-table>
        <div class="empty" v-else>
          <!-- <Empt /> -->
          <a-empty></a-empty>
        </div>
      </div>
      <StopCatch
        :visible="sropVisible"
        @modalOk="modalOk"
        @modalCancel="modalCancel"
        :status="status"/>
    </a-card>

    <ConfigList
      :visibleConfig="configVisible"
      @closeCatchData="closeCatchData()"
      :config="configListQueryData"
      @closeConfig="() => {configVisible = false}"
    />
  </page-header-wrapper>
</template>
<script>
// import Empt from '@/components/Empty/empty.vue'
import StopCatch from './components/StopCatch.vue'
import ConfigList from './ConfigList'
import { getPatientList, dealCatch, changeBaseTime } from '@/api/patient/patient'
import {
  YWColumns,
  CRAColumns,
  CRCColumns,
  PIColumns,
  ADMINColumns
} from './sick-loop-columns'
//, Empt
export default {
  components: {
    StopCatch, ConfigList
  },
  data () {
    return {
      // 当前处于第几页
      thisCurrent: 1,
      // 一页的条数
      thisSize: 10,
      catchParams: {},
      paramser: {},
      isCrc: this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.CRC.value),
      status: null,
      bufferTime: null,
      sropVisible: false,
      configVisible: false,
      configListQueryData: {},
      form: {},
      queryParam: this.$route.query,
      cardLoading: false,
      userList: [],
      totalCount: 0,
      columns: [
        {
          title: '序号',
          dataIndex: 'nos',
          scopedSlots: { customRender: 'nos' },
          align: 'center'
        },
        {
          title: '受试者编号',
          align: 'center',
          dataIndex: 'ptsNo'
        },
        {
          title: '访视阶段',
          align: 'center',
          dataIndex: 'visitStageName'
        },
        {
          title: '入组时间',
          align: 'center',
          dataIndex: 'basicLineDate',
          scopedSlots: { customRender: 'basicLineDate' }
        },
        {
          title: '档案',
          align: 'center',
          dataIndex: 'file',
          scopedSlots: { customRender: 'file' }
        },
        {
          title: '评估表',
          align: 'center',
          dataIndex: 'assessSheet',
          scopedSlots: { customRender: 'assessSheet' }
        }
      ],
      roleId: 1
    }
  },
  computed: {
    dealColumns () {
      if (this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.YW_ADMIN.value)) {
        return YWColumns
      } else if (this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.CRA.value)) {
        return CRAColumns
      } else if (this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.CRC.value)) {
        return CRCColumns
      } else if (this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.PI.value)) {
        return PIColumns
      } else if (this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.ADMIN.value)) {
        return ADMINColumns
      } else {
        return this.columns
      }
    }
  },
  created () {

  },
  mounted () {
    console.log('ADMIN', this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.ADMIN.value))
    console.log('YW_ADMIN', this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.YW_ADMIN.value))
    console.log('CRC', this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.CRC.value))
    console.log('CRA', this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.CRA.value))
    console.log('PM', this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.PM.value))
    console.log('PI', this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.PI.value))
    if (this.queryParam.researchId) {
      localStorage.setItem('sickLoopQuery', JSON.stringify(this.queryParam))
    }
    this.getUserList()
  },
  methods: {
    returnSize (e) {
      console.log(e)
      this.thisCurrent = e.current
      this.thisSize = e.pageSize
    },
    closeCatchData () {
      this.configVisible = false
      this.getUserList()
    },
    // 获取列表
    getUserList () {
      console.log(this.queryParam.researchId, this.queryParam.proId, this.paramser)
      if (this.queryParam.researchId && this.queryParam.proId) {
        console.log(1)
        getPatientList({ pageSize: 1, pageNumber: 10, researchId: this.queryParam.researchId, proId: this.queryParam.proId, ...this.paramser })
        .then((res) => {
          this.totalCount = res.totalCount
          this.userList = res.content
        })
      } else if (localStorage.getItem('sickLoopQuery')) {
        console.log(2)
        const sickLoopQuery = JSON.parse(localStorage.getItem('sickLoopQuery'))
        console.log(sickLoopQuery)
        getPatientList({ pageSize: 1, pageNumber: 10, researchId: sickLoopQuery.researchId, proId: sickLoopQuery.proId, ...this.paramser })
        .then((res) => {
          this.totalCount = res.totalCount
          this.userList = res.content
        })
      } else {
        console.log(3)
        this.userList = []
      }
    },
    clickReset () {
      this.paramser = {}
      this.getUserList()
    },
    // 录入评估表,点击后携带orgId，proId跳转到录入评估表页面，
    clickEntering (record) {
      console.log(record)
      this.$router.push({
        name: 'EstimateInput',
        query: {
          ptsId: record.ptsId,
          orgId: record.orgId || record.researchId,
          ptsName: record.ptsName
        }
      })
    },
    onChange (checked, record) {
      if (checked) {
        this.clickDealCatch(record, -1)
      } else {
        this.clickDealCatch(record, 1)
      }
    },
    handleSickChange (e) {
      console.log(e)
    },
    // 查看档案
    clickWatchFile (record) {
      console.log(record)
      console.log(JSON.stringify(record))
      sessionStorage.setItem('upLoadParams', JSON.stringify(record))
      setTimeout(() => {
        this.$router.push({
        name: 'SickFile',
        query: record
        })
      }, 100)
    },
    // 上传
    clickUpload (record) {
      console.log(record)
      this.$router.push({
        name: 'UploadIndex',
        query: record
      })
    },
    // 查看抓取情况
    clickWatchCatch (record) {
      // 路由传参不能用
      localStorage.setItem('orgName', record.orgName)
      console.log('查看抓取情况')
      this.$router.push({
        name: 'CaptureCase',
        query: record
      })
    },
    // 点击新增
    clickAdd () {
      console.log(this.$store.getters.project, this.queryParam)
      if (this.queryParam.orgId || this.queryParam.proId || this.queryParam.researchId) {
        const { proId, orgId, researchId } = this.queryParam
        localStorage.setItem('PROJECT_QUERYPARAM', JSON.stringify(this.queryParam))
        this.configListQueryData = { proId, orgId, researchId }
      } else {
        const { proId, orgId, researchId } = JSON.parse(localStorage.getItem('PROJECT_QUERYPARAM'))
        this.configListQueryData = { proId, orgId, researchId }
      }
      this.configVisible = true
    },
    // 停止抓取
    clickDealCatch (record, state) {
      if (record.offStatus === state) {
        this.status = record.offStaidtus
        console.log(record.id)
        const params = {
          // orgId: record.siteOrgId,
          // ptsNo: record.ptsNo,
          status: record.offStatus * -1,
          id: record.id
          // proId: record.proId
        }
        console.log(params)
        this.catchParams = { ...params }
        if (state === 1) {
          this.sropVisible = true
        } else {
          this.modalOk(false)
        }
      } else {
        console.log(record, state)
      }
    },
    // 进行搜索
    clickSearch (e) {
      console.log(e)
      this.paramser.ptsNo = e
      this.getUserList()
      // 要用这个e去做请求，重新刷新列表，这里参数未定，暂时不写。
    },
    modalOk (value) {
      let catchs = { }
      if (value) {
        catchs = { ...this.catchParams, reason: value.resource ? value.resource : value.other }
      } else {
        catchs = { ...this.catchParams }
      }
      dealCatch({ ...catchs }).then(res => {
        this.getUserList()
        this.$message.success('操作成功')
        this.sropVisible = false
      })
    },
    modalCancel () {
      this.catchParams = { ...{} }
      this.sropVisible = false
    },
    timeOK (e, record) {
      console.log(e, record)
      this.bufferTime = e
      const changeDateParams = {
        basicLineDate: e + ' 00:00:00',
        proId: record.proId,
        id: record.id
      }
      console.log(changeDateParams)
      changeBaseTime(changeDateParams).then(res => {
        this.getUserList()
        this.$message.success('修改成功')
      })
    },
    handleDateChange (e) {
      console.log(e)
      this.bufferTime = e
    }
  }
}
</script>
<style scoped lang="css">
.top-nav {
  display: flex;
  width: 100%;
  justify-content: space-center;
}
.btn-wrap {
  width: 20%;
  display: flex;
  flex-direction: row-reverse;
}
.empty{
  min-height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
