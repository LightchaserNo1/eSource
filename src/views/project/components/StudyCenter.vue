<template>
  <div>
    <div
      class="btnWrap"
      v-if="$auth('PROJECT.PROJECT_SITE_ADD') && !$props.isDetail">
      <!-- 有权限且不为详情页，展示。 -->
      <div style="margin-bottom:20px;">
        <a-button
          type="primary"
          @click="skipAddCenter">
          <a-icon type="plus"/>添加中心
        </a-button>
      </div>
    </div>
    <div>
      <s-table
        :data="loadData"
        :columns="columns"
        ref="table"
        :rowKey="record=>record.id"
      >
        <template
          slot="centerName"
          slot-scope="text,record">
          <a-input
            key="centerName"
            v-if="record.editable"
            style="margin: -5px 0;width: 70%"
            :value="text"
            @change="(e) => handleInputChange(e.target.value, record.id, 'centerName')"
          />
          <template v-else>{{ text }}</template>
        </template>
        <template
          slot="office"
          slot-scope="text,record">
          <a-select
            key="office"
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="(e) => handleInputChange(e, record.id, 'office')"
          >
            <a-select-option
              v-for="(item) in officeList"
              :key="item.vlaue"
              :value="item.name">{{ item.name }}</a-select-option>
          </a-select>
          <template v-else>{{ text }}</template>
        </template>
        <template
          slot="active"
          slot-scope="text,record">
          <span
            :style="{'color':(record.active ==1 ? '#43D882' : '#8193B1')}"
          >
            •&nbsp;{{ record.active | enumValueByKey($const.ACTIVE_STATUS) }}
          </span>
        </template>
        <template
          slot="action"
          slot-scope="text,record">
          <template v-if="record.editable">
            <a @click="saveRow(record)">保存</a>
            <a-divider type="vertical" />
            <a @click="cancel(record.id,record.key)">取消</a>
          </template>
          <template v-else>
            <!-- <a-icon
              @click="clickUpdate(record.id)"
              type="edit"
              style="font-size:20px;color:#3C92FF;cursor:pointer"/> -->
            <a
              href="javascript:;"
              @click="clickUpdate(record.id)"
              v-if="$auth('PROJECT.PROJECT_SITE_EDIT')">编辑</a>
            <a-divider
              type="vertical"
              v-if="$auth('PROJECT.PROJECT_SITE_EDIT')"/>
            <a-popconfirm
              title="是否确认删除？"
              @confirm="confirmDel(record.id)"
              ok-text="确认"
              cancel-text="取消">
              <!-- <a-icon type="delete" style="font-size:20px;color:#3C92FF;cursor:pointer"></a-icon> -->
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </template>
        </template>
      </s-table>
    </div>
  </div>
</template>
<script>
import { getStudyCenterList, deleteStudyCenter } from '@/api/project/project'
import { buildPaginationObj } from '@/components/Table'
export default {
  props: {
    proId: {
      required: true,
      type: [String, Number]
    },
    isDetail: {
      default: false,
      type: Boolean
    }
  },
  components: {

  },
  computed: {
    columns () {
      if (this.$props.isDetail) {
        return this.detailColumns
      } else {
        return this.actionColumns
      }
    }
  },
  data () {
    return {
      queryParam: {
        proId: this.$props.proId,
        deleted: 0
      },
      loadData: parameter => {
        return getStudyCenterList(Object.assign(parameter, this.queryParam))
          .then(res => {
            console.log(res)
            return buildPaginationObj(res)
        })
      },
      actionColumns: [
        {
          title: '中心编号',
          dataIndex: 'orgId',
          key: 'orgId',
          scopedSlots: { customRender: 'orgId' },
          align: 'center'
        },
        {
          title: '中心名称',
          dataIndex: 'orgName',
          key: 'orgName',
           width: '25%',
          scopedSlots: { customRender: 'orgName' },
          align: 'center'
        },
        {
          title: '科室',
          width: '33%',
          dataIndex: 'orgDeptName',
          key: 'orgDeptName',
          scopedSlots: { customRender: 'orgDeptName' },
          align: 'center'
        },
        {
          title: '主要研究员',
          dataIndex: 'mainResName',
          key: 'mainResName',
          scopedSlots: { customRender: 'mainResName' },
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'active',
          key: 'active',
          scopedSlots: { customRender: 'active' },
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center'
        }
      ],
      detailColumns: [
        {
          title: '中心编号',
          dataIndex: 'orgId',
          key: 'orgId',
          scopedSlots: { customRender: 'orgId' },
          align: 'center'
        },
        {
          title: '中心名称',
          dataIndex: 'orgName',
          key: 'orgName',
           width: '25%',
          scopedSlots: { customRender: 'orgName' },
          align: 'center'
        },
        {
          title: '科室',
          width: '33%',
          dataIndex: 'orgDeptName',
          key: 'orgDeptName',
          scopedSlots: { customRender: 'orgDeptName' },
          align: 'center'
        },
        {
          title: '主要研究员',
          dataIndex: 'mainResName',
          key: 'mainResName',
          scopedSlots: { customRender: 'mainResName' },
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'active',
          key: 'active',
          scopedSlots: { customRender: 'active' },
          align: 'center'
        }
      ],
      dataTable: [],
      // 科室列表是请求来的
      officeList: [
        {
          value: 1,
          name: '神经外科'
        },
        {
          value: 2,
          name: '皮肤外科'
        },
        {
          value: 3,
          name: '骨科'
        },
        {
          value: 4,
          name: '五官科'
        }
      ]
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    // 行内编辑事件
     handleInputChange (value, key, column) {
      console.log(value)
      const newData = [...this.dataTable]
      const target = newData.find((item) => item.id === key)
      if (target) {
        target[column] = value
        this.dataTable = newData
      }
    },
    // 确认删除研究中心
    confirmDel (id) {
      deleteStudyCenter({ id }).then(res => {
        this.$message.success('删除成功')
        this.$refs.table.refresh(true)
      })
    },
    // 编辑之后保存
    saveRow (record) {
      const { centerName, id } = record // 需要校验的必填字段
      if (!centerName) {
        this.$message.error('请填写完整信息。')
        return
      }
      const target = this.dataTable.find((item) => item.id === id)
      target.editable = false
    },
    // 编辑结束后取消编辑
    cancel (id, key) {
      const target = this.dataTable.find((item) => item.id === id)
      Object.keys(target).forEach((key) => {
        target[key] = target._originalData[key]
      })
      target._originalData = undefined
    },
    // 点击编辑
    clickUpdate (id) {
      this.$router.push({
        name: 'UpdateStudyCenter',
        query: {
          resId: id,
          proId: this.$props.proId
        }
      })
    },
    // 跳转到添加中心
    skipAddCenter () {
      const { proId } = this.$props
      this.$router.push({
        name: 'AddStudyCenter',
        query: {
          proId
        }
       })
    }
  }
}
</script>
<style scoped lang="css">
.btnWrap{
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.top-nav{
  width: 100%;
  height:40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
