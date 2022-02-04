<template>
  <page-header-wrapper @back="$router.go(-1)">
    <a-card :border="false" :loading="cardLoading" v-if="orgName">
      <s-table
        :data="loadData"
        :columns="columns"
        ref="table"
        :rowKey="record=>record.idJob">
        <template slot="errors" slot-scope="text,record">
          <div>
            <a-tag color="#69D724" v-if="record.errors==0">正常</a-tag>
            <a-tag color="#DD001B" v-else>报错</a-tag>
          </div>
        </template>
        <template slot="startdate" slot-scope="text,record">
          <div>
            {{ record.startdate | moment("YYYY-MM-DD") }}
          </div>
        </template>
        <template slot="enddate" slot-scope="text,record">
          <div>
            {{ record.enddate | moment("YYYY-MM-DD") }}
          </div>
        </template>
        <template slot="logField" slot-scope="text,record">
          <div>
            <a @click="clickDiffSick(record)">查看</a>
          </div>
        </template>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import { getProjectLog } from '@/api/patient/patient'
// import { buildPaginatioidJobbj } from '@/components/Table'
export default {
  props: {

  },
  components: {

  },
  data () {
    return {
      cardLoading: false,
       columns: [
        {
          title: '序号',
          align: 'center',
          dataIndex: 'idJob'
        },
        {
          title: '医疗机构',
          align: 'center',
          dataIndex: 'orgName',
          scopedSlots: { customRender: 'orgName' }
        },
        {
          title: '是否报错',
          align: 'center',
          dataIndex: 'errors',
          scopedSlots: { customRender: 'errors' }
        },
        {
          title: '开始时间',
          align: 'center',
          dataIndex: 'startdate',
          scopedSlots: { customRender: 'startdate' }
        },
        {
          title: '结束时间',
          align: 'center',
          dataIndex: 'enddate',
          scopedSlots: { customRender: 'enddate' }
        },
        {
          title: '查看',
          align: 'center',
          dataIndex: 'logField',
          scopedSlots: { customRender: 'logField' }
        }
      ],
      orgName: null,
      loadData: parameter => {
        return getProjectLog({ ...parameter, ...this.queryParam }).then(
          res => {
            // 组织机构这个字段是从上个页面带过来的
            res.content.forEach(item => {
              item.orgName = this.orgName
            })
            console.log(res)
            return res
          }
        )
      }
    }
  },
  created () {

  },
  mounted () {
    this.orgName = localStorage.getItem('orgName')
  },
  methods: {
    // 查看患者对比
    clickDiffSick (record) {
      this.$router.push({
        name: 'WatchLog',
        query: record
      })
    }
  }
}
</script>
<style scoped lang="">

</style>
