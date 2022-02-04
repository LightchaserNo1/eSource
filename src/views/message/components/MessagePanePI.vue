<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="24">
      <!-- 右侧表单 开始 -->
      <a-col
        :md="24"
        :lg="24">
        <a-card bordered>
          <a-form
            layout="inline"
            :form="queryParam"
            class="form">
            <a-col type="flex">
              <!-- 评估表 条件 开始 -->
              <a-row
                type="flex"
                align="top"
                :gutter="16">
                <a-col
                  :xl="{ span: 6 }"
                  :lg="{ span: 8 }"
                  :md="{ span: 12 }"
                  :sm="24">
                  <a-form-item label="受试者编号">
                    <a-input
                      style="width: 140px"
                      v-model="queryParam.pts"
                      placeholder="请输入受试者编号"> </a-input>
                  </a-form-item>
                </a-col>
                <a-col
                  :xl="{ span: 6 }"
                  :lg="{ span: 8 }"
                  :md="{ span: 12 }"
                  :sm="24">
                  <a-form-item label="开始时间">
                    <a-date-picker
                      style="width: 155px"
                      @change="beginChange"
                      v-model="queryParam.startDate"
                      :disabled-date="disabledStartDate"
                      format="YYYY-MM-DD"
                      placeholder="请选择开始时间"
                      @openChange="handleStartOpenChange"
                    />
                  </a-form-item>
                </a-col>
                <a-col
                  :xl="{ span: 6 }"
                  :lg="{ span: 8 }"
                  :md="{ span: 12 }"
                  :sm="24">
                  <a-form-item label="结束时间">
                    <a-date-picker
                      @change="endChange"
                      style="width: 155px"
                      v-model="queryParam.endDate"
                      :disabled-date="disabledEndDate"
                      format="YYYY-MM-DD"
                      placeholder="请选择结束时间"
                      :open="endOpen"
                      @openChange="handleEndOpenChange"
                    />
                  </a-form-item>
                </a-col>
                <a-col
                  :xl="{ span: 6 }"
                  :lg="{ span: 8 }"
                  :md="{ span: 12 }"
                  :sm="24"
                  style="text-align: center">
                  <a-button
                    type="primary"
                    style="width: 120px"
                    @click="search">搜索</a-button>
                </a-col>
              </a-row>
              <a-row
                type="flex"
                justify="space-between"
                :gutter="16"
                style="margin-top: 10px">
                <a-col
                  :xl="{ span: 6 }"
                  :lg="{ span: 8 }"
                  :md="{ span: 12 }"
                  :sm="24">
                  <a-form-item label="消息类型">
                    <a-select
                      style="width: 155px"
                      placeholder="请选择消息类型"
                      v-model="queryParam.messType">
                      <a-select-option
                        v-for="(item, index) in messageTypeList"
                        :key="index"
                        :value="item.value">
                        {{ item.name }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <!-- 评估表 条件 结束 -->
              <a-divider dashed></a-divider>
              <!-- Message表格开始 -->
              <s-table
                ref="table"
                :rowKey="(record) => record.id"
                size="middle"
                :data="loadData"
                :columns="columns">
                <template
                  slot="type"
                  slot-scope="text, record">
                  <div>
                    <span>{{ record.type == 2 ? '核证副本' : record.type == 1 ? '检查访视' : '检验访视' }}</span>
                  </div>
                </template>
                <template
                  slot="modifyTime"
                  slot-scope="text, record">
                  <div>
                    {{ record.modifyTime | moment('YYYY-MM-DD HH:mm:ss') }}
                  </div>
                </template>
                <template
                  slot="action"
                  slot-scope="text, record">
                  <!-- 这里通过type、isVisit判断跳转到哪里 -->
                  <a-button
                    type="primary"
                    size="small"
                    @click="clickProject(record)"
                    v-if="record.type == 2 && !$isCenter">审核</a-button>
                  <a-button
                    type="primary"
                    size="small"
                    title="审核在医院端进行"
                    @click="clickProject(record)"
                    v-if="record.type == 2 && $isCenter"
                    disabled>审核</a-button>
                  <a-button
                    type="primary"
                    size="small"
                    @click="clickxdtReport(record)"
                    v-if="record.type == 1"
                  >
                    判断
                  </a-button>
                  <a-button
                    type="primary"
                    size="small"
                    @click="clickcbcReport(record)"
                    v-if="record.type == 0"
                  >
                    判断
                  </a-button>
                </template>
              </s-table>
              <!-- 表格结束 -->
            </a-col>
          </a-form>
        </a-card>
      </a-col>
      <!-- 右侧表单 结束 -->
    </a-row>
  </div>
</template>

<script>
import { getList } from '@/api/message/message'
export default {
  data () {
    return {
      endOpen: false,
      // 消息类型 列表
      messageTypeList: [{
        value: -1,
        name: '全部'
      }, {
        value: 0,
        name: '检验访视'
      }, {
        value: 1,
        name: '检查访视'
      }, {
        value: 2,
        name: '核证副本'
      }],
      loading: false,
      columns: [
        {
          title: '序号',
          dataIndex: 'id',
          width: 100,
          align: 'center'
        },
        {
          title: '类型',
          dataIndex: 'type',
          width: 200,
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '受试者编号',
          dataIndex: 'ptsNo',
          width: 200
        },
        {
          title: '消息内容',
          dataIndex: 'content',
          ellipsis: true
        },
        {
          title: '更新时间',
          dataIndex: 'modifyTime',
          width: 200,
          align: 'center',
          scopedSlots: { customRender: 'modifyTime' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 150,
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      queryParam: {
        proId: this.$store.getters.project.id || null, // 项目ID
        mStatus: 0,
        startDate: null,
        endDate: null
      },
      params: {},
      // 项目列表 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        Object.keys(this.queryParam).forEach(item => {
          if (this.queryParam[item] === null || this.queryParam[item] === undefined) delete this.queryParam[item]
        })
        return getList(Object.assign({ ...parameter, ...this.queryParam }))
          .then(res => {
            return res
          })
      }
    }
  },
  methods: {
    // ********** 点击搜索 **************
    beginChange (obj, e) {
      console.log(e)
      this.queryParam.startDate = e
    },
    endChange (obj, e) {
      console.log(e)
      this.queryParam.endDate = e
    },
    disabledStartDate (startDate) {
      const endDate = this.queryParam.endDate
      if (!startDate || !endDate) {
        return false
      }
      return startDate.valueOf() > endDate.valueOf()
    },
    disabledEndDate (endDate) {
      const startDate = this.queryParam.startDate
      if (!endDate || !startDate) {
        return false
      }
      return startDate.valueOf() >= endDate.valueOf()
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
    // ********** 跳转审核页 **************
    clickProject (record) {
      console.log(record)
      this.$router.push({
        name: 'uploadVerify',
        query: { ptsId: record.ptsId, messId: record.id, ptsNo: record.ptsNo, auditStatus: true, fliterable: true, finished: true }
      })
    },
    // ********** 跳转血常规 检验结果报告单 **************
    clickcbcReport (record) {
      console.log(record)
      this.$router.push({
        name: 'cbcReport',
        query: { id: record.id, ptsId: record.ptsId, isVisit: record.isVisit, editable: false, finished: true }
      })
    },
    // ********** 跳转心电图报告单 **************
    clickxdtReport (record) {
      console.log(record)
      this.$router.push({
        name: 'xdtReport',
        query: { id: record.id, ptsId: record.ptsId, isVisit: record.isVisit, editable: false, finished: true }
      })
    },
    // ********** 点击搜索 **************
    search () {
      console.log(this.queryParam)
      this.$nextTick(() => {
        this.$refs.table.refresh(true)
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
