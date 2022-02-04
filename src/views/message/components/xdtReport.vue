<!-- 检查 -->
<template>
  <page-header-wrapper @back="goBack">
    <div class="page-header-index-wide page-header-wrapper-grid-content-main">
      <a-row
        type="flex"
        justify="end">
        <a-col :span="2">
          <a-button
            type="primary"
            style="width: 120px; margin-bottom: 15px"
            @click="updateMsg"> 提交 </a-button>
        </a-col>
      </a-row>
      <a-row>
        <!-- 表格开始 -->
        <a-table
          :rowKey="(record, index) => index"
          size="middle"
          :pagination="pagination"
          @change="tableChange"
          :data-source="dataList"
          :columns="isBeyond == 0 ? projectColumns : beyondColumns"
          :loading="topTableloading"
        >
          <template
            slot="applyDate"
            slot-scope="text, record">
            <div>
              {{ record.applyDate | moment('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
          <template
            slot="reportDate"
            slot-scope="text, record">
            <div>
              {{ record.reportDate | moment('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
          <template
            slot="stageDate"
            slot-scope="text, record">
            <div>
              {{ record.stageDate | moment('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
          <template
            slot="afterStageDate"
            slot-scope="text, record">
            <div>
              {{ record.afterStageDate | moment('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
          <template
            slot="isBeyond"
            slot-scope="text, record">
            <div>
              {{ record.isBeyond == 0 ? '否' : '是' }}
            </div>
          </template>
          <template
            slot="action"
            slot-scope="text, record">
            <!-- 这里通过type、isVisit判断跳转到哪里 -->
            <a @click="handlePatientSelectChange(record)">查看</a>
          </template>
          <template
            slot="isVisit"
            slot-scope="text, record">
            <div>
              <a-select
                style="width: 100%"
                v-model="record.trueStageId"
                placeholder="请选择访视阶段"
                @change="(val) => handleTop(val, record.id, 'isVisit')"
              >
                <a-select-option
                  v-for="(trilItem, trilIndex) in listTrilStage"
                  :title="trilItem.name"
                  :key="trilIndex"
                  :value="trilItem.id"
                >
                  {{ trilItem.name }}
                </a-select-option>
              </a-select>
            </div>
          </template>
        </a-table>
        <!-- 表格结束 -->
      </a-row>
      <div>
        <a-card>
          <a-row
            type="flex"
            justify="center"
            align="top">
            <span class="title">{{ frelationList.unit ? frelationList.unit + '-' : '' }}检查报告</span>
          </a-row>
          <a-row class="rows">
            <a-col
              :span="2"
              :offset="4"><span class="leftText">检查部位</span></a-col>
            <a-col
              :span="18"
            ><span class="rightText">{{ frelationList.unit ? frelationList.unit : '' }}</span></a-col
            >
          </a-row>
          <a-row class="rows">
            <a-col
              :span="2"
              :offset="4"><span class="leftText">检查所见</span></a-col>
            <a-col
              :span="18"
            ><span class="rightText">{{ frelationList.examDesc }}</span></a-col
            >
          </a-row>
          <a-row class="rows">
            <a-col
              :span="2"
              :offset="4"><span class="leftText">诊断</span></a-col>
            <a-col
              :span="18"
            ><span class="rightText">{{ frelationList.result }}</span></a-col
            >
          </a-row>
          <a-row class="rows">
            <a-col
              :span="2"
              :offset="4"><span class="leftText">临床意义</span></a-col>
            <a-col :span="18">
              <a-select
                :disabled="editable"
                :value="frelationList.isValid == 0 ? '未确认' : frelationList.isValid"
                style="width: 400px"
                @change="(e) => handleChangeSelect(e)"
              >
                <a-select-option :value="-1"> 异常无临床意义 </a-select-option>
                <a-select-option :value="1"> 正常 </a-select-option>
                <a-select-option :value="2"> 异常有临床意义 </a-select-option>
              </a-select></a-col
            >
          </a-row>
          <a-row class="rows">
            <a-col
              :span="2"
              :offset="4"><span class="leftText">备注</span></a-col>
            <a-col
              :span="18"
            ><a-textarea
              :disabled="editable"
              style="margin: -5px 0; width: 400px"
              :value="frelationList.auditOpinion"
              :maxLength="400"
              :auto-size="{ minRows: 3 }"
              placeholder="备注最多400字"
              @change="(e) => handleChange(e.target.value)"
            /></a-col>
          </a-row>
          <a-row
            class="rows"
            type="flex"
            justify="center"
            align="top">
            <a-button
              type="primary"
              style="width: 100px; margin-left: 30px"
              @click="judgeResult">{{
                editable ? '修改' : '保存'
              }}</a-button>
          </a-row>
        </a-card>
      </div>
    </div>
  </page-header-wrapper>
</template>

<script>
import { ckList, listRep, upRepInfo, resultJudge, updateMsg } from '@/api/message/message'
import { listTrilStage } from '@/api/update/update'
export default {
  data () {
    return {
      editable: false,
      topTableloading: false,
      isBeyond: 0,
      // 项目表头
      projectColumns: [
        {
          title: '序号',
          dataIndex: 'num',
          customRender: (text, record, index) => `${(this.pagination.current - 1) * this.pagination.defaultPageSize + (index + 1)}`
        },
        {
          title: '申请单号',
          dataIndex: 'requisitionNo'
        },
        {
          title: '项目名称',
          dataIndex: 'itemTypeName'
        },
        {
          title: '申请时间',
          dataIndex: 'applyDate',
          scopedSlots: { customRender: 'applyDate' }
        },
        {
          title: '报告时间',
          dataIndex: 'reportDate',
          scopedSlots: { customRender: 'reportDate' }
        },
        {
          title: '最近访视批次时间',
          dataIndex: 'stageDate',
          scopedSlots: { customRender: 'stageDate' }
        },
        {
          title: '最近访视批次',
          dataIndex: 'stageName'
        },
        {
          title: '查看',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        },
        {
          title: '访视批次',
          dataIndex: 'isVisit',
          scopedSlots: { customRender: 'isVisit' }
        }
      ],
      // 项目表头
      beyondColumns: [
        {
          title: '序号',
          dataIndex: 'num',
          customRender: (text, record, index) => `${(this.pagination.current - 1) * this.pagination.defaultPageSize + (index + 1)}`
        },
        {
          title: '申请单号',
          dataIndex: 'requisitionNo'
        },
        {
          title: '项目名称',
          dataIndex: 'itemTypeName'
        },
        {
          title: '申请时间',
          dataIndex: 'applyDate',
          scopedSlots: { customRender: 'applyDate' }
        },
        {
          title: '报告时间',
          dataIndex: 'reportDate',
          scopedSlots: { customRender: 'reportDate' }
        },
        {
          title: '疑似超窗',
          dataIndex: 'isBeyond',
          scopedSlots: { customRender: 'isBeyond' }
        },
        {
          title: '前访视批次时间',
          dataIndex: 'stageDate',
          scopedSlots: { customRender: 'stageDate' }
        },
        {
          title: '前访视批次',
          dataIndex: 'stageName'
        },
        {
          title: '后访视批次时间',
          dataIndex: 'afterStageDate',
          scopedSlots: { customRender: 'afterStageDate' }
        },
        {
          title: '后访视批次',
          dataIndex: 'afterStageName'
        },
        {
          title: '报告明细',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        },
        {
          title: '访视批次',
          dataIndex: 'isVisit',
          scopedSlots: { customRender: 'isVisit' }
        }
      ],
      selectRows: null,
      // 项目列表 加载数据方法 必须为 Promise 对象
      dataList: [],
      listTrilStage: [],
      pagination: {
        total: 0,
        pageSize: 5, // 每页中显示5条数据
        showSizeChanger: true,
        pageSizeOptions: ['5', '10'], // 每页中显示的数据
        showTotal: total => `共有 ${total} 条数据` // 分页中显示总的数据
      },
      loading: false,
      columns: [
        {
          title: '检查申请单ID',
          dataIndex: 'requisitionNo', // null
          align: 'center'
        },
        {
          title: '检查项目',
          dataIndex: 'item',
          align: 'center',
          scopedSlots: { customRender: 'item' }
        },
        {
          title: '检查申请时间',
          dataIndex: 'testDate',
          align: 'center',
          scopedSlots: { customRender: 'testDate' }
        },
        {
          title: '检查报告时间',
          dataIndex: 'reportDate',
          align: 'center',
          scopedSlots: { customRender: 'reportDate' }
        },
        {
          title: '检查部位',
          width: 150,
          dataIndex: 'unit'
        },
        {
          title: '检查所见',
          width: 400,
          dataIndex: 'examDesc'
        },
        {
          title: '检查诊断',
          dataIndex: 'result'
        },
        {
          title: '临床意义',
          dataIndex: 'isValid',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'isValid' }
        },
        {
          title: '备注',
          dataIndex: 'auditOpinion',
          width: 150,
          scopedSlots: { customRender: 'auditOpinion' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: 100,
          scopedSlots: { customRender: 'operation' }
        }
      ],
      relationList: [],
      frelationList: [],
      parameter: {
        proId: this.$store.getters.project.id || null, // 项目ID this.$store.getters.project.id
        ptsId: this.$route.query.ptsId, // 受试者编码  this.$route.query.ptsId || null
        mId: this.$route.query.id // 消息ID  this.$route.query.id || null 175
      },
      cacheTop: [],
      finished: this.$route.query.finished !== '' ? JSON.parse(this.$route.query.finished) : false
    }
  },
  mounted () {
    this.getlistTrilStage()
    this.getListData()
  },
  methods: {
    goBack () {
      this.$router.push({
        name: 'Message',
        query: { activeKey: this.finished ? '1' : '2' }
      })
    },
    // 获取访视阶段列表
    getlistTrilStage () {
      const params = {
        proId: this.$store.getters.project.id
      }
      listTrilStage(params).then(res => {
        this.listTrilStage = res
      }, err => {
        console.log(err)
      })
    },
    upRepInfo (id, val) {
      const trueStageName = this.getTrialNoName(val)
      const form = new FormData()
      form.append('id', id)
      form.append('trueStageId', val)
      form.append('trueStageName', trueStageName)
      upRepInfo(form).then(res => {
        this.$message.success('保存成功')
      }).catch((err) => {
        console.log('报错信息', err)
        this.loading = false
      })
    },

    // 获取访视表格数据 reportNo	检查报告号 reportType报告类型
    getListData () {
      this.loading = true
      this.topTableloading = true
      ckList(this.parameter).then(res => {
        this.dataList = res
        this.cacheTop = this.dataList.map(item => ({ ...item }))
        this.pagination = {
          total: res.length, // 数据总数
          current: 1,
          defaultPageSize: 5,
          showSizeChanger: true, // 显示修改pageSize的下拉框
          pageSizeOptions: ['5', '10'], // 设置pageSize的可选值，页面啊可以通过下拉框进行选择
          showTotal: total => `共 ${total} 条数据` // 展示总共有几条数据
        }
        this.isBeyond = res[0].isBeyond
        this.relationList = res[0].relationList
        this.frelationList = this.relationList[0]
        this.topTableloading = false
        this.loading = false
      }).catch((err) => {
        console.log('报错信息', err)
        this.topTableloading = false
        this.loading = false
      })
    },
    // 获取表格数据 reportNo	检查报告号 reportType报告类型
    getData () {
      this.loading = true
      const form = new FormData()
      form.append('reportNo', this.selectRows.reportNo)
      form.append('reportType', this.selectRows.reportType)
      listRep(form).then(res => {
        this.relationList = res.relationList
        this.isBeyond = res[0].isBeyond
        this.frelationList = this.relationList[0]
        this.loading = false
      }).catch((err) => {
        console.log('报错信息', err)
        this.loading = false
      })
    },
    // 保存上表数据
    handleTop (e, id, column) {
      this.upRepInfo(id, e)
      const newData = [...this.dataList]
      const newCacheData = [...this.cacheTop]
      const target = newData.filter(item => id === item.id)[0]
      const targetCache = newCacheData.filter(item => id === item.id)[0]
      if (target && targetCache) {
        target[column] = e
        this.dataList = newData
        Object.assign(targetCache, target)
        this.cacheTop = newCacheData
      }
    },
    handleChange (value) {
      console.log(value)
      this.frelationList.auditOpinion = value
    },
    handleChangeSelect (value) {
      console.log(value)
      this.frelationList.isValid = value
    },
    judgeResult () {
      if (!this.editable) {
        const arr = [{
          'id': this.frelationList.id,
          'isValid': this.frelationList.isValid,
          'auditOpinion': this.frelationList.auditOpinion
        }]
        const form = new FormData()
        form.append('reportJson', JSON.stringify(arr))
        resultJudge(form).then(res => {
          this.$message.success('保存成功')
          this.editable = true
        }).catch((err) => {
          console.log('报错信息', err)
          this.loading = false
        })
      } else {
        this.editable = false
        console.log(this.editable)
      }
    },
    tableChange (pagination) {
      this.pagination = pagination
    },
    handlePatientSelectChange (rows) {
      this.loading = true
      this.selectRows = rows
      this.getData()
    },
    updateMsg () {
      const form = new FormData()
      form.append('id', this.$route.query.id)
      form.append('auditStatus', 1)
      updateMsg(form).then(res => {
        this.$message.success('保存成功')
        this.$router.go(-1)
      }).catch((err) => {
        console.log('报错信息', err)
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
.rows {
  padding: 15px 0;
}
.title {
  width: 100%;
  text-align: center;
  font-weight: bolder;
  font-size: 16px;
}
.leftText {
  width: 100%;
  font-weight: bolder;
}
.rightText {
  width: 100%;
}
</style>
