<template>
  <div>
    <a-modal
      :width="900"
      :title="title"
      :footer="null"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel">
      <a-card :loading="loading">
        <a-table
          :columns="columns"
          :pagination="false"
          :loading="tableLoading"
          :rowKey="record=>record.id"
          :dataSource="dataTable">
          <template slot="metaCode" slot-scope="text,record">
            <div>
              <a-input
                :disabled="banCode"
                key="metaCode"
                style="margin: -5px 0"
                v-if="record.editable"
                :value="text"
                @change="(e) => handleInputChange(e.target.value, record.id, 'metaCode')"/>
              <template v-else>{{ text }}</template>
            </div>
          </template>
          <template slot="metaName" slot-scope="text,record">
            <div>
              <a-input
                key="metaName"
                style="margin: -5px 0"
                v-if="record.editable"
                :value="text"
                @change="(e) => handleInputChange(e.target.value, record.id, 'metaName')"/>
              <template v-else>{{ text }}</template>
            </div>
          </template>
          <template slot="action" slot-scope="text, record">
            <template v-if="record.editable">
              <span v-if="record.isNew">
                <a href="javascript:;" @click="saveRow(record,1)">添加</a>
                <a-divider type="vertical" />
                <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key,record)">
                  <a href="javascript:;">删除</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <a href="javascript:;" @click="saveRow(record,2)">保存</a>
                <a-divider type="vertical" />
                <a href="javascript:;" @click="cancel(record.id)">取消</a>
              </span>
            </template>
            <span v-else>
              <a href="javascript:;" @click="toggle(record.id)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否要删除此行？" @confirm="remove(record.id,record)">
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
        <a-button
          style="width: 100%; margin-top: 16px; margin-bottom: 8px"
          type="dashed"
          icon="plus"
          @click="addItem">
          新增研究分期
        </a-button>
      </a-card>
    </a-modal>
  </div>
</template>
<script>
import { getDictionaryList, addDictionary, deleteDictionary, updateDictionary } from '@api/optionConfig/optionConfig'
export default {
  props: {
    visible: {
      required: true,
      type: Boolean
    },
    title: {
      required: true,
      type: String
    }
  },
  components: {

  },
  computed: {

  },
  watch: {
    visible (newv) {
      if (newv) {
        this.getList()
      }
    }
  },
  data () {
    // 有了数据之后，用两个列表传值，避免浅拷贝
    return {
      diffId: null,
      tableLoading: false,
      dataTable: [],
      jdVisible: false,
      banCode: true,
      loading: false,
      type: {// 添加研究分期用的参数
        typeCode: 10001009,
        typeName: '研究分期'
      },
      columns: [
        {
          title: '研究分期代码',
          dataIndex: 'metaCode',
          width: '40%',
          align: 'center',
          scopedSlots: { customRender: 'metaCode' }
        },
        {
          title: '研究分期',
          dataIndex: 'metaName',
          width: '40%',
          align: 'center',
          scopedSlots: { customRender: 'metaName' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    getTable1 () { // 获取研究分期列表
      getDictionaryList({ typeCode: this.type.typeCode, pageSize: 1000, pageNumber: 1 }).then(res => {
        res.forEach(item => {
          item.editable = false
          item.isNew = false
        })
        this.dataTable = res
        this.tableLoading = false
      })
    },
    // 请求列表
    getList () {
      this.loading = true
      getDictionaryList({ typeCode: this.type.typeCode, pageSize: 1000, pageNumber: 1 }).then(res => {
        res.forEach(item => {
          item.editable = false
          item.isNew = false
        })
        this.dataTable = res
        this.loading = false
      })
    },
    handleInputChange (value, id, column) {
      console.log(value.trim())
      const newData = [...this.dataTable]
      const target = newData.find((item) => id === item.id)
      if (target) {
        target[column] = value.trim()
        this.dataTable = newData
      }
    },
    remove (key, rc) {
      console.log(rc.id.toString())
      const newData = this.dataTable.filter((item) => item.key !== key)
      this.dataTable = newData
      if (!rc.id.toString().startsWith('jiaid')) { // 满足条件=>是后台请求来的真数据
        this.diffId = rc.id
        this.tableLoading = true
        deleteDictionary({ id: rc.id }).then(res => {
          this.$message.success('删除成功')
          this.getTable1()
        })
      }
    },
   addItem () {
    this.banCode = false
    // 下边的name是待定的
    console.log(this.dataTable)
    const length = this.dataTable.length
    this.dataTable.push({
      key: length === 0 ? '1' : (parseInt(this.dataTable[length - 1].key) + 1).toString(),
      metaName: '',
      editable: true,
      isNew: true,
      id: 'jiaid' + length + 1// 绑定假的id，避免报错
    })
  },
  toggle (key) {
    this.banCode = true
    const target = this.dataTable.find((item) => item.id === key)
    target._originalData = { ...target }
    target.editable = !target.editable
  },
  saveRow (record, e) {
    // e: 1为添加，2为编辑
    console.log(this.dataTable)
    this.memberLoading = true
    const { id, metaName, metaCode } = record // 需要校验的必填字段
    if (!metaName || !metaCode) {
      this.memberLoading = false
      this.$message.error('请填写完整信息')
      return
    }
    const target = this.dataTable.find((item) => item.id === id)
    console.log(target)
    this.tableLoading = true
    if (e === 1) { // 添加
      addDictionary({ metaName: target.metaName, metaCode: target.metaCode, ...this.type }).then(res => {
        this.getTable1()
      })
    } else {
      updateDictionary({ id: target.id, metaName: target.metaName, typeCode: this.type.typeCode }).then(res => {
        this.$message.success('修改成功')
        this.getTable1()
        console.log(res)
      })
    }
    this.memberLoading = false
  },
   // 取消
  cancel (id) {
    const target = this.dataTable.find((item) => item.id === id)
    Object.keys(target).forEach((id) => {
      target[id] = target._originalData[id]
    })
    target._originalData = undefined
  },
  handleOk () {
    this.$emit('modalOk')
  },
  handleCancel () {
    this.$emit('modalCancel', this.diffId)
  }
  }
}
</script>
<style scoped lang="">

</style>
