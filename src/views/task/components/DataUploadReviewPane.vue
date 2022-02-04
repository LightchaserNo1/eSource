<!-- 数据上传审核 -->
<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-card :bordered="false" v-if="!skipIn">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="18" :sm="24">
              <a-form-item label="项目">
                <a-select v-model="queryParam.proId">
                  <a-select-option v-for="(item,index) in projectList" :key="index" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="clickSearch()">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <s-table
        v-if="showTable"
        ref="table"
        size="default"
        :rowKey="(record) => record.id"
        :columns="columns"
        :data="loadData"
      >
        <span slot="uploadCount" slot-scope="text,record">
          <a href="javascript:;" @click="watchNum(record)">{{ record.uploadCount }}</a>
        </span>
        <span slot="scale" slot-scope="text,record">
          <!-- {{ `${record.uploadPtsCount}/${record.recordCount}` }} -->
          {{ `${record.uploadPtsCount}` }}
        </span>
        <span slot="newestDataTime" slot-scope="text,record">
          {{ record.newestDataTime | moment("YYYY-MM-DD") }}
        </span>
        <span slot="loop" slot-scope="text,record">
          <a href="javascript:;" @click="watchLoopDetail(record)">查看</a>
        </span>
      </s-table>
    </a-card>
    <a-card v-else>
      <div>
        <a-button @click="skipIn=false">返回上一级</a-button>
        <div style="margin-top:36px;">
          <!-- 患者队列 -->
          <a-table
            v-if="skipType==2"
            :rowKey="record=>record.deptId"
            :data-source="inTable"
            :columns="inColumns">
          </a-table>
          <a-table
            v-else
            :rowKey="record=>record.deptId"
            :data-source="numTable"
            :columns="numColumns">
            <span slot="createTime" slot-scope="text,record">
              {{ record.createTime | moment() }}
            </span>
          </a-table>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import { getProjectList, getUpCheckList, watchLoop, watchNum } from '@/api/task/task'
import { buildPaginationObj } from '@/components/Table'

export default {
  components: {

  },
  data () {
    return {
      skipType: null,
      inTable: [],
      inColumns: [
        {
          title: '受试者Id',
          dataIndex: 'ptsId',
          align: 'center'
        },
        {
          title: '档案数量',
          dataIndex: 'recordCount',
          align: 'center'
        },
        {
          title: '核证数量',
          dataIndex: 'certifiedCount',
          align: 'center'
        },
        {
          title: '评估数量',
          dataIndex: 'assessCount',
          align: 'center'
        }
      ],
      numColumns: [
        {
          title: '研究中心',
          dataIndex: 'orgName',
          align: 'center'
        },
        {
          title: '科室',
          dataIndex: 'deptName',
          align: 'center'
        },
        {
          title: '上传受试者人数',
          dataIndex: 'uploadPtsCount',
          align: 'center'
        },
        {
          title: '档案数',
          dataIndex: 'recordCount',
          align: 'center'
        },
        {
          title: '上传时间',
          dataIndex: 'createTime',
          align: 'center',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '入库时间',
          dataIndex: 'newestDataTime',
          align: 'center',
          scopedSlots: { customRender: 'newestDataTime' }
        }
      ],
      numTable: [],
      skipIn: false,
      projectList: [],
      mdl: {},
      showTable: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '医疗机构',
          align: 'center',
          dataIndex: 'orgName'
        },
        {
          title: '科室',
          align: 'center',
          dataIndex: 'deptName'
        },
        {
          title: '上传受试者人数',
          align: 'center',
          dataIndex: 'scale',
          scopedSlots: { customRender: 'scale' }
        },
        // {
        //   title: '上报次数',
        //   align: 'center',
        //   dataIndex: 'uploadCount',
        //   scopedSlots: { customRender: 'uploadCount' }
        // },
        {
          title: '患者队列',
          align: 'center',
          dataIndex: 'loop',
          scopedSlots: { customRender: 'loop' }
        },
        {
          title: '最新入库时间',
          align: 'center',
          dataIndex: 'newestDataTime',
          scopedSlots: { customRender: 'newestDataTime' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return getUpCheckList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return buildPaginationObj(res)
        })
      }
    }
  },
  mounted () {
    // 获取项目列表
    getProjectList({ status: 2, pageSize: 1000, pageNumber: 1 }).then(res => {
      console.log(res.page.content)
      this.projectList = res.page.content
    })
  },
  methods: {
    clickSearch () {
      console.log(Object.keys(this.queryParam))
      if (Object.keys(this.queryParam).length > 0) {
        this.showTable = true
        this.$nextTick(() => {
          this.$refs.table.refresh(true)
        })
      } else {
        this.$message.info('请先选择项目')
        return false
      }
    },
    // 查看患者详情
    watchLoopDetail (record) {
      this.skipType = 2
      const loopObj = {
        proId: this.queryParam.proId,
        orgId: record.orgId,
        deptId: record.deptId,
        pageSize: 1000,
        pageNumber: 1
      }
      watchLoop(loopObj).then(res => {
        console.log(res)
        this.inTable = res
        this.skipIn = true
      })
    },
    // 查看上传次数详情
    watchNum (record) {
      this.skipType = 1
      const numObj = {
        proId: this.queryParam.proId,
        orgId: record.orgId,
        deptId: record.deptId,
        pageSize: 1000,
        pageNumber: 1
      }
      watchNum(numObj).then(res => {
        console.log(res)
        this.numTable = res
         this.skipIn = true
      })
    }
  }
}
</script>
