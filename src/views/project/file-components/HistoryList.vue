<template>
  <div>
    <a-card v-if="!showContent">
      <a-button @click="clickBack" style="margin-bottom:24px;">返回上一级</a-button>
      <div>
        <s-table :rowKey="record=>record.id" :columns="columns" :data="loadData" ref="historyTable">
          <template slot="watchContent" slot-scope="text,record">
            <div>
              <a href="javascript:;" @click="clickWatch(record)">查看</a>
            </div>
          </template>
          <template slot="createTime" slot-scope="text,record">
            <div>
              {{ record.createTime | moment() }}
            </div>
          </template>
        </s-table>
      </div>
    </a-card>
    <a-card v-else>
      <a-button @click="()=>{showContent=false}" style="margin-bottom:24px;">
        返回上一级
      </a-button>
      <div>
        <s-table ref="contentTable" :data="loadContent" :columns="contentColumns" :rowKey="record=>record.id">
        </s-table>
      </div>
    </a-card>
  </div>
</template>
<script>
import { getHistory, watchContent } from '@/api/patient/patient'
export default {
  props: {
     orgId: {
      required: true,
      type: [String, Number]
    },
     proId: {
      required: true,
      type: [String, Number]
    }
  },
  components: {

  },
  watch: {
    showContent (v) {
      console.log(v)
      if (!v) {
        this.$nextTick(() => {
          this.$refs.historyTable.refresh(true)
        })
      }
      console.log(this.queryParams)
    }
  },
  data () {
    return {
      loadData: parameter => {
        return getHistory({ ...parameter, ...this.queryParams }).then(
          res => res
        )
      },
      loadContent: parameter => {
        return watchContent({ ...parameter, ...this.queryParam2, proId: this.$store.getters.project.id }).then(res => {
          console.log(res, 222)
          return res
        })
      },
      queryParams: {
        proId: this.$props.proId,
        orgId: this.$props.orgId
      },
      showContent: false,
      columns: [
        {
          title: '计划任务文件名称',
          dataIndex: 'planTitle'
        },
        {
          title: '内容查看',
          dataIndex: 'watchContent',
          scopedSlots: { customRender: 'watchContent' }
        },
        {
          title: '创建日期',
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '发送人员',
          dataIndex: 'sendName'
        }
      ],
      queryParam2: {},
      contentColumns: [
        {
          title: '任务名称',
          dataIndex: 'planTitle',
          align: 'center'
        },
        {
          title: '受试者编号',
          dataIndex: 'ptsNo',
          align: 'center'
        }
      ]
    }
  },
  created () {

  },
  mounted () {
    this.$bus.$on('getImgAuto', () => {
      this.$refs.imgText.getData()
    })
  },
  beforeDestroy () {
    this.$bus.$off('getImgAuto')
  },
  methods: {
    clickBack () {
      this.$emit('back')
    },
    clickWatch (record) {
      console.log(record)
      this.queryParam2.groupId = record.id
      this.showContent = true
      this.$nextTick(() => {
        this.$refs.contentTable.refresh(true)
      })
    }
  }
}
</script>
<style scoped lang="">

</style>
