<template>
  <page-header-wrapper @back="clickBack">
    <a-card :loading="cardLoading" :border="false">
      <s-table
        v-show="!showEmpty"
        :rowKey="record=>record.id"
        :data="loadData"
        ref="table"
        :columns="dealColumns">
        <template slot="already" slot-scope="text,record">

          <!-- {{ `${record.alreadyExistPts}/${record.recordCount}` }} -->
          {{ record.alreadyExistPts }}
        </template>
        <template slot="configList" slot-scope="text,record" v-if="$auth('PROJECT.PROJECT_PATIENT_ADD')">
          <a href="javascript:;" @click="clickConfigList(record)">配置患者列表</a>

        </template>
        <template slot="sickLoop" slot-scope="text,record" v-if="$auth('PROJECT.PROJECT_PATIENT_LIST')">
          <div class="table-action" @click="clickWatchSickLoop(record)">查看</div>

        </template>
        <template slot="projectLog" slot-scope="text,record">
          <div class="table-action" @click="clickWatchProjetcLog(record)">查看</div>

        </template>
        <template slot="ptsList" slot-scope="text,record">
          <div>{{ record.ptsList.map(item=>item.ptsNo).join(',') }}</div>
        </template>
        <template slot="managerTeamList" slot-scope="text, record">
          <a-descriptions size="small" :column="{md: 2, xxl: 2}" style="width: 100%;">
            <a-descriptions-item v-for="(item, index) in record.managerTeamList" :key="index" :label="item.roleName">
              {{ item.name }}
            </a-descriptions-item>
          </a-descriptions>
        </template>
      </s-table>
      <div class="empty" v-show="showEmpty">
        <a-empty></a-empty>
      </div>
    </a-card>
    <ConfigList :visible="configVisible" @closeCatchData="configVisible = false" :config="current"></ConfigList>
  </page-header-wrapper>
</template>
<script>
import ConfigList from './ConfigList'
import { getResearchList } from '@api/patient/patient'
import { buildPaginationObj } from '@/components/Table'
import {
  YWColumns,
  CRAClolumns,
  CRCColumns,
  PIColumns,
  PMColumns,
  ADMINColumns
} from './project-watch-columns'

export default {
  components: {
    ConfigList
  },
  data () {
    return {
      proId: this.$store.getters.project.id,
      configVisible: false,
      cardLoading: false,
      // 控制视图展示，1为添加，2为全部任务   3为历史记录展示
      viewShow: 1,
      current: {},
      showEmpty: false,
      columns: [
        {
          title: '项目编号',
          dataIndex: 'proNo',
          align: 'center'
        },
        {
          title: 'PROTOCOL',
          dataIndex: 'protocolNo',
          scopedSlots: { customRender: 'protocolNo' },
          align: 'center'
        },
        {
          title: '医疗机构',
          dataIndex: 'orgName',
          scopedSlots: { customRender: 'orgName' },
          align: 'center'
        },
        {
          title: '科室',
          dataIndex: 'orgDeptName',
          scopedSlots: { customRender: 'orgDeptName' },
          align: 'center'
        },
        {
          title: '配置患者列表',
          dataIndex: 'configList',
          scopedSlots: { customRender: 'configList' },
          align: 'center'
        },
        {
          title: '已入组患者',
          dataIndex: 'already',
          scopedSlots: { customRender: 'already' },
          align: 'center'
        },
        {
          title: '上报中心受试者',
          dataIndex: 'uploadPtsCount',
          scopedSlots: { customRender: 'uploadPtsCount' },
          align: 'center'
        },
        {
          title: '患者队列',
          dataIndex: 'sickLoop',
          scopedSlots: { customRender: 'sickLoop' },
          align: 'center'
        }
        // {
        //   title: '抓取情况',
        //   dataIndex: 'projectLog',
        //   scopedSlots: { customRender: 'projectLog' }
        // }
      ],
      loadData: parameter => {
        return getResearchList({ ...parameter, ...this.queryParam }).then(
          res => {
            if (res.length > 0) {
                this.showEmpty = false
            } else {
               this.showEmpty = true
            }
            console.log(this.showEmpty)
            return buildPaginationObj(res)
          }
        ).catch(row => {
          console.log(row)
        })
      },
      role: 3, // 用于判断角色身份
      queryParam: {
        proId: this.$store.getters.project.id
      }
    }
  },
  computed: {
    // 处理不同身份的列表配置columns
    dealColumns () {
      // const { roleId } = this.$store.getters.userInfo
      if (this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.YW_ADMIN.value)) {
        return YWColumns
      } else if (this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.PM.value)) {
        return PMColumns
      } else if (this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.CRA.value)) {
        return CRAClolumns
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
  methods: {
    clickBack () {
      this.$router.push({
        name: 'overview'
      })
    },
    clickWatchSickLoop (record) {
      console.log({
        proId: this.proId,
        siteOrgId: record.orgId,
        orgId: record.orgId,
        researchId: record.id
      })
      this.$router.push({
        name: 'sickLoop',
        query: {
          proId: this.proId,
          siteOrgId: record.orgId,
          orgId: record.orgId,
          researchId: record.id
        }
      })
    },
    clickWatchProjetcLog (record) {
       // 路由传参不能用
      localStorage.setItem('orgName', record.orgName)
      this.$router.push({
        name: 'projectLog',
        query: record
      })
    },
    // 点击配置患者列表
    clickConfigList (record) {
      this.current = JSON.parse(JSON.stringify(record))
      this.configVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
::v-deep .ant-table-body{
  min-height: 550px;
}
.empty{
  min-height: 550px;
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .ant-descriptions-item {
  width: 10px;
}
::v-deep .ant-descriptions-row {
  width: 20px;
}
</style>
