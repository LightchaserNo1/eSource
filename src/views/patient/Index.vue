<!-- 患者检索 -->
<template>
  <page-header-wrapper @back="$router.go(-1)">
    <a-row :gutter="15" v-if="proId">
      <a-col :md="6" :sm="24">
        <a-card title="查询" style="min-height: 750px">
          <div class="form-wrapper">
            <a-form-model :model="queryParam">
              <a-form-model-item label="时间">
                <a-range-picker @change="rangeChange" style="width: 100%" />
              </a-form-model-item>
              <a-form-model-item label="科室">
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
              </a-form-model-item>
              <a-form-model-item label="病症/疾病">
                <a-select
                  show-search
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="null"
                  @change="sickChange"
                  @search="sickSearch"
                  v-model="queryParam.symptom"
                  :allowClear="true"
                >
                  <a-select-option v-for="(item,index) in sickList" :key="index" :value="item.diagName" >
                    {{ item.diagName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-form-model>
            <div style="margin-top:100px;text-align:center;">
              <a-button type="primary" @click="clickSeaech" style="width:70%;" :loading="btnLoading">查询</a-button>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :md="18" :sm="24">
        <in-page-switch :firstView="firstView" @goBack="handleGoBack">
          <div style="width: 100%; min-height: 750px" slot="firstShow">
            <div class="top">
              <a-card :loading="!showTop" :bordered="false">
                <a-row :gutter="10">
                  <a-col :md="8" :sm="24">
                    <a-card>
                      <div class="info">
                        <div class="title">符合条件档案</div>
                        <div class="show">
                          <div class="show-icon">
                            <a-icon type="user" style="color: #FD972B; font-size: 24px;"/>
                          </div>
                          <div class="show-number">
                            <div class="number-top">
                              <span class="top-number">{{ showRight ? (topData.ptsCount?topData.ptsCount:0) : 0 }}</span>
                              <span class="top-unit">(人)</span>
                            </div>
                            <div class="number-button">人数</div>
                          </div>
                        </div>
                      </div>
                    </a-card>
                  </a-col>
                  <a-col :md="16" :sm="24">
                    <a-card>
                      <div class="info">
                        <!-- <div class="title">男女性别比例:{{ showRight ? percent : '1:1' }}</div> -->
                        <div class="title">男女性别比例</div>
                        <div style="display: flex; width: 100%;">
                          <div class="show" style="width: 50%; border-right: 1px solid #F1F5F8">
                            <div class="show-icon" style="background: rgba(28, 194, 253, 0.2); border: 1px solid #1CC2FD;">
                              <a-icon type="man" style="color: #1CC2FD; font-size: 24px;"/>
                            </div>
                            <div class="show-number">
                              <div class="number-top">
                                <span class="top-number">{{ showRight ? (topData.manCount?topData.manCount:0) : 0 }}</span>
                                <span class="top-unit">(人)</span>
                              </div>
                              <div class="number-button">男性</div>
                            </div>
                          </div>
                          <div class="show" style="width: 50%;">
                            <div class="show-icon" style="background: rgba(240, 47, 47, 0.2); border: 1px solid #F02F2F;">
                              <a-icon type="woman" style="color: #F02F2F; font-size: 24px;"/>
                            </div>
                            <div class="show-number">
                              <div class="number-top">
                                <span class="top-number">{{ showRight ? (topData.womanCount?topData.womanCount:0) : 0 }}</span>
                                <span class="top-unit">(人)</span>
                              </div>
                              <div class="number-button">女性</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a-card>
                  </a-col>
                </a-row>
              </a-card>
            </div>
            <a-card class="table" style="min-height: 547px;">
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
            </a-card>
          </div>
          <div slot="skipIn" v-if="enrolleeId">
            <AllFile :enrolleeId="enrolleeId" :ptsNo="ptsNo"/>
          </div>
        </in-page-switch>
      </a-col>
    </a-row>
  </page-header-wrapper>
</template>

<script>
import { debounce } from '@/utils/util'
import { getSickList, getSearchList, getOfficeList } from '@/api/patient/patientSearch'
import { buildPaginationObj } from '@/components/Table'
import AllFile from '../project/components/AllFile.vue'
export default {
  components: {
    AllFile
  },
  data () {
    return {
      ptsNo: null,
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
        return getSearchList({ ...parameter, ...this.params })
        .then(
          res => {
            // return res.content[0].paDiagInfoList
            // res.content[0].paDiagInfoList.forEach((item, index) => {
            //   item.virtiulId = index
            // })
            this.showTop = true
            this.btnLoading = false
            // return res
            if (res.content.length) {
              const { ptsCount, indexCount, manCount, womanCount } = res.content[0]
              this.topData = { ptsCount, indexCount, manCount, womanCount }
              return buildPaginationObj(res.content[0].paDiagInfoList)
            } else {
              return buildPaginationObj([])
            }
            // return res.content.length ? buildPaginationObj(res.content[0].paDiagInfoList) : buildPaginationObj([])
          }
        ).catch(row => {
          console.log(row)
        })
      },
      params: {},
      // 定义病症列表
      sickList: [],
      showFile: false,
      columns: [
        // {
        //   title: '编号',
        //   align: 'center',
        //   dataIndex: 'subjectId'
        // },
        {
          title: '疾病名称',
          align: 'center',
          dataIndex: 'diagName'
        },
        // {
        //   title: '患者姓名',
        //   align: 'center',
        //   dataIndex: 'patientName'
        // },
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
        // {
        //   title: '入院科室',
        //   align: 'center',
        //   dataIndex: 'admitDeptName'
        // },
        // {
        //   title: '入院时间',
        //   align: 'center',
        //   dataIndex: 'admitDate',
        //   scopedSlots: { customRender: 'admitDate' }
        // },
        // {
        //   title: '出院科室',
        //   align: 'center',
        //   dataIndex: 'dischargeDeptName'
        // },
        // {
        //   title: '出院时间',
        //   align: 'center',
        //   dataIndex: 'dischargeDate',
        //   scopedSlots: { customRender: 'dischargeDate' }
        // },
        // {
        //   title: '出院方式',
        //   align: 'center',
        //   dataIndex: 'exitMethod'
        // },
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
    // getSickList().then(res => {
    //   console.log(res)
    //   this.sickList = res
    // })
    // 获取科室列表
    getOfficeList().then(res => {
      console.log(res, '科室列表')
      this.officeList = res.slice(10)
      console.log(this.officeList)
    })
  },
  methods: {
    sickSearch (e) {
      if (!e) {
        this.sickList = []
        this.$forceUpdate()
        return
      }
      debounce(getSickList({ diagName: e }).then(res => {
        console.log(res, 'sickList')
        this.sickList = res
      }), 700)
    },
    sickChange (e) {
      if (!e) {
        this.sickList = []
        this.$forceUpdate()
      }
      console.log(e)
    },
    rangeChange (_, e) {
      console.log(e)
      this.params.beginTime = e[0]
      this.params.beginTime = e[0]
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
      this.ptsNo = rc.ptsNo
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
    flex-direction: column;
    .title{
      display: inline-block;
      width: 100%;
      height: 45px;
      margin-bottom: 15px;
      font-size: 16px;
      line-height: 30px;
      border-bottom: 1px solid #F1F5F8;
      color:black;
      text-align: start;
    }
    .show {
      display: flex;
      justify-content: center;
      align-items: center;
      .show-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 66px;
        height: 66px;
        margin-right: 20px;
        background: rgba(253, 182, 43, 0.2);
        border: 1px solid #FDB62B;
        border-radius: 50%;
        opacity: 1;
      }
      .show-number {
        display: flex;
        flex-direction: column;
        .top-number {
          margin-right: 5px;
          font-size: 28px;
          color: #0F121B;
        }
        .top-unit {
          font-size: 16px;
          color: #CCD4E1;
        }
        .number-button {
          font-size: 16px;
          color: #8193B1;
        }
      }
    }
    .value{
      font-weight: bold;
      font-size:40px;
      color:#3C92FF
    }
  }
  .table{
    margin-top:15px;
  }
</style>
