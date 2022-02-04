<!-- 患者检索 -->
<template>
  <page-header-wrapper @back="$router.go(-1)">
    <!-- <h1>{{ enrolleeId }}</h1> -->
    <a-card :loading="loading" :body-style="{ padding: '18px',minHeight:'750px' }" :bordered="false" v-if="proId">
      <a-row :gutter="48">
        <a-form :model="queryParam" :label-col="{ span: 5 }" :wrapper-col="{ span:16 }">
          <a-col :md="8" :sm="24">
            <a-form-item label="选择日期">
              <a-range-picker @change="rangeChange" />
            </a-form-item>
          </a-col>
          <!-- <a-form-item label="开始时间">
                <a-date-picker
                  style="width:100%"
                  @change="beginChange"
                  v-model="queryParam.beginTime"
                  :disabled-date="disabledStartDate"
                  format="YYYY-MM-DD"
                  placeholder="请选择开始时间"
                  @openChange="handleStartOpenChange"
                />
              </a-form-item>
              <a-form-item label="结束时间">
                <a-date-picker
                  @change="endChange"
                  style="width:100%;"
                  v-model="queryParam.endTime"
                  :disabled-date="disabledEndDate"
                  format="YYYY-MM-DD"
                  placeholder="请选择结束时间"
                  :open="endOpen"
                  @openChange="handleEndOpenChange"
                />
              </a-form-item> -->
          <a-col :md="4" :sm="24">
            <a-form-item label="科室">
              <a-select
                :allowClear="true"
                v-model="queryParam.deptCode"
                show-search
                option-filter-prop="children"
                :filterOption="filterOption">
                <a-select-option v-for="(item,index) in officeList" :key="index" :value="item.deptCode">
                  {{ item.deptName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="病症/疾病">
              <a-select v-model="queryParam.symptom" :allowClear="true">
                <a-select-option v-for="(item,index) in sickList" :key="index" :value="item.diagName" >
                  {{ item.diagName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-button type="primary" @click="clickSeaech" style="width:70%;" :loading="btnLoading">查询</a-button>
            </a-form-item>
          </a-col>
        </a-form>
      </a-row>
      <a-row>
        <a-col v-if="showRight">
          <in-page-switch :firstView="firstView" @goBack="handleGoBack">
            <div style="width:100%;height:300px;" slot="firstShow">
              <div class="top">
                <a-card :loading="!showTop" :bordered="false">
                  <a-row :gutter="48">
                    <a-col :md="12" :sm="24">
                      <a-card>
                        <div class="info">
                          <div class="title">符合条件档案:</div>
                          <div class="value">{{ topData.indexCount?topData.indexCount:0 }}</div>
                          <div class="title">人数</div>
                          <div class="value">{{ topData.ptsCount?topData.ptsCount:0 }}</div>
                        </div>
                      </a-card>
                    </a-col>
                    <a-col :md="12" :sm="24">
                      <a-card>
                        <div class="info">
                          <div class="title">男女性别比例:{{ percent }}</div>
                          <div class="title">男性:</div>
                          <div class="value">{{ topData.manCount?topData.manCount:0 }}</div>
                          <div class="title">女性</div>
                          <div class="value">{{ topData.womanCount?topData.womanCount:0 }}</div>
                        </div>
                      </a-card>
                    </a-col>
                  </a-row>
                </a-card>
              </div>
              <div class="table">
                <s-table
                  :columns="columns"
                  ref="table"
                  :data="loadData">
                  <template slot="dateBirth" slot-scope="text,record">
                    <div>
                      {{ record.dateBirth | moment('YYYY-MM-DD') }}
                    </div>
                  </template>
                  <template slot="admitDate" slot-scope="text,record">
                    <div>
                      {{ record.admitDate | moment() }}
                    </div>
                  </template>
                  <template slot="dischargeDate" slot-scope="text,record">
                    <div>
                      {{ record.dischargeDate | moment() }}
                    </div>
                  </template>
                  <template slot="fileEnterTime" slot-scope="text,record">
                    <div>
                      {{ record.fileEnterTime | moment() }}
                    </div>
                  </template>
                  <template slot="action" slot-scope="text,record">
                    <div>
                      <a href="javascript:;" @click="clickWatch(record)" v-if="$auth('PatientManage.PATIENT_DETAIL')">查看</a>
                    </div>
                  </template>
                </s-table>
              </div>
            </div>
            <div slot="skipIn" v-if="enrolleeId">
              <AllFile :enrolleeId="enrolleeId"/>
            </div>
          </in-page-switch>
        </a-col>
        <!-- <a-col :md="19" :sm="24" v-else>
          <template>
            <div style="padding-top:180px;"><a-empty/></div>
          </template>
        </a-col> -->
      </a-row>
    </a-card>
    <!-- <a-card v-if="!showRight">
      <a-empty/>
    </a-card> -->
  </page-header-wrapper>
</template>

<script>
import { getSickList, getSearchList, getOfficeList } from '@/api/patient/patientSearch'
import { buildPaginationObj } from '@/components/Table'
import AllFile from '../project/components/AllFile.vue'
export default {
  components: {
    AllFile
  },
  data () {
    return {
      topData: {},
      showTop: false,
      proId: this.$store.getters.project.id || null,
      showRight: false,
      loading: false,
      // 下边这东西暂时写死
      enrolleeId: null,
      queryParam: {},
      btnLoading: false,
      endOpen: false,
      firstView: true,
      // 定义科室列表
      officeList: [],
      loadData: parameter => {
        return getSearchList({ ...parameter, ...this.params }).then(
          res => {
            // return res.content[0].paDiagInfoList
            const { ptsCount, indexCount, manCount, womanCount } = res.content[0]
            this.topData = { ptsCount, indexCount, manCount, womanCount }
            // res.content[0].paDiagInfoList.forEach((item, index) => {
            //   item.virtiulId = index
            // })
            this.showTop = true
            this.btnLoading = false
            return buildPaginationObj(res.content[0].paDiagInfoList)
          }
        )
      },
      params: {},
      // 定义病症列表
      sickList: [],
      showFile: false,
      columns: [
        {
          title: '编号',
          align: 'center',
          dataIndex: 'subjectId'
        },
        {
          title: '疾病名称',
          align: 'center',
          dataIndex: 'diagName'
        },
        {
          title: '患者姓名',
          align: 'center',
          dataIndex: 'patientName'
        },
        {
          title: '性别',
          align: 'center',
          dataIndex: 'sexName'
        },
        {
          title: '出生日期',
          align: 'center',
          dataIndex: 'dateBirth',
          scopedSlots: { customRender: 'dateBirth' }
        },
        {
          title: '入院科室',
          align: 'center',
          dataIndex: 'admitDeptName'
        },
        {
          title: '入院时间',
          align: 'center',
          dataIndex: 'admitDate',
          scopedSlots: { customRender: 'admitDate' }
        },
        {
          title: '出院科室',
          align: 'center',
          dataIndex: 'dischargeDeptName'
        },
        {
          title: '出院时间',
          align: 'center',
          dataIndex: 'dischargeDate',
          scopedSlots: { customRender: 'dischargeDate' }
        },
        {
          title: '出院方式',
          align: 'center',
          dataIndex: 'exitMethod'
        },
        {
          title: '档案入库时间',
          align: 'center',
          dataIndex: 'fileEnterTime',
          scopedSlots: { customRender: 'fileEnterTime' }
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  computed: {
    percent () {
      return (this.topData.manCount + ':' + this.topData.womanCount)
    }
  },
  mounted () {
    if (!this.proId) {
      this.$notification.warning({
        message: '警告',
        description: `请选中一个项目查看`
      })
    }
    // 获取病症列表
    getSickList().then(res => {
      this.sickList = res
    })
    // 获取科室列表
    getOfficeList().then(res => {
      console.log(res, '科室列表')
      this.officeList = res
    })
  },
  methods: {
    rangeChange (_, e) {
      console.log(e)
      this.params.beginTime = e[0]
      this.params.endTime = e[1]
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    beginChange (obj, e) {
      console.log(e)
      this.params.beginTime = e
    },
    endChange (obj, e) {
      console.log(e)
      this.params.endTime = e
    },
    disabledStartDate (beginTime) {
      const endTime = this.queryParam.endTime
      if (!beginTime || !endTime) {
        return false
      }
      return beginTime.valueOf() > endTime.valueOf()
    },
    disabledEndDate (endTime) {
      const beginTime = this.queryParam.beginTime
      if (!endTime || !beginTime) {
        return false
      }
      return beginTime.valueOf() >= endTime.valueOf()
    },
    handleStartOpenChange (open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleGoBack () {
      this.firstView = true
    },
    handleEndOpenChange (open) {
      this.endOpen = open
    },
    // 点击查询
    clickSeaech () {
      if (this.showTop) {
        this.showTop = false
      }
      const { symptom, deptCode } = this.queryParam
      this.params = { ...this.params, symptom, deptCode }
      console.log(this.params)
      for (const key in this.params) {
        if (!this.params[key]) {
          delete this.params[key]
        }
      }
      if (Object.keys(this.params).length === 0) {
        this.$message.error('请选择检索条件')
        return false
      } else {
        this.btnLoading = true
        this.showRight = true
        this.$nextTick(() => {
           this.$refs.table.refresh(true)
        })
      }
    },
    // 点击查看
    clickWatch (rc) {
      rc.ptsId = rc.enrolleeId
      console.log(rc)
      sessionStorage.setItem('upLoadParams', JSON.stringify(rc))
      this.enrolleeId = rc.enrolleeId
      this.firstView = false
    }
  }
}
</script>

<style scoped lang="less">
  .info{
    display: flex;
    align-items:center;
    justify-content: space-evenly;
    .title{
      font-weight:bold;
      font-size:20px;
      color:black;
    }
    .value{
      font-weight: bold;
      font-size:40px;
      color:#3C92FF
    }
  }
  .table{
    margin-top:30px;
  }
</style>
