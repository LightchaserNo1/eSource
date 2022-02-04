<template>
  <!-- 编辑试验阶段列表 -->
  <div>
    <a-modal
      :width="900"
      :title="title"
      @ok="modalOk"
      @cancel="modalCancel"
      :visible="jdVisible">
      <a-table :columns="columns" :data-source="dataTable" :rowKey="record=>record.id">
        <template slot="stageName" slot-scope="text,record">
          <div>
            <a-input
              type="text"
              :value="text"
              style="margin: -5px 0"
              v-if="record.editable"
              @change="(e) => handleInputChange(e.target.value, record.id, 'stageName')"/>
            <template v-else>{{ text }}</template>
          </div>
        </template>
        <!-- <template slot="stageCode" slot-scope="text,record">
          <div>
            <a-input
              type="text"
              :value="text"
              style="margin: -5px 0"
              v-if="record.editable"
              @change="(e) => handleInputChange(e.target.value, record.id, 'stageCode')"/>
            <template v-else>{{ text }}</template>
          </div>
        </template> -->
        <template slot="action" slot-scope="text,record">
          <template v-if="record.editable">
            <span v-if="record.isNew">
              <a href="javascript:;" @click="saveRow(record)">添加</a>
              <a-divider type="vertical"></a-divider>
              <a-popconfirm title="是否确定删除?" @confirm="remove(record.id)" >
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a href="javascript:;" @click="saveRow(record)">保存</a>
              <a-divider type="vertical"></a-divider>
              <a href="javascript:;" @click="cancel(record.id)">取消</a>
            </span>
          </template>
          <span v-else>
            <a href="javascript:;" @click="toggle(record.id)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" @confirm="remove(record.id)">
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
        新增访视阶段
      </a-button>
    </a-modal>
  </div>
</template>
<script>

export default {
  props: {
    jdVisible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    stageArr: {
      type: Array,
      required: true
    }
  },
  components: {

  },
  data () {
    return {
      columns: [
        {
          title: '阶段名称',
          dataIndex: 'stageName',
          align: 'center',
          scopedSlots: { customRender: 'stageName' }
        },
        // {
        //   title: '阶段编码',
        //   dataIndex: 'stageCode',
        //   align: 'center',
        //   scopedSlots: { customRender: 'stageCode' }
        // },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataTable: this.$props.stageArr,
      diffArr: []
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    modalOk () {
      const allSave = this.dataTable.every(item => !item.editable)
      if (!allSave) {
        this.$message.error('请保存全项目阶段')
        return false
      }
      console.log(this.dataTable)
      this.$emit('jdOk', this.dataTable)
    },
    modalCancel () {
      this.$emit('jdCancel')
    },
    addItem () {
      console.log(this.dataTable)
      this.dataTable.push({
        id: `jiaId${this.dataTable.length}`,
        isNew: true,
        editable: true,
        stageName: '',
        stageCode: '',
        status: 1
      })
      this.diffArr = this.dataTable.filter(item => !item.editable)
      console.log(this.diffArr)
    },
    handleInputChange (value, id, key) {
      const newData = [...this.dataTable]
      const target = newData.find(item => item.id === id)
      if (target) {
        target[key] = value.trim()
        this.dataTable = newData
      }
    },
    saveRow (record) {
      console.log(this.diffArr)
      const { stageName } = record
      const isRepeat = this.diffArr.findIndex(item => item.stageName === stageName) !== -1
      if (!stageName) {
        this.$message.error('请补全信息')
        return false
      }
      if (isRepeat) {
        this.$message.error('试验阶段已存在')
        return false
      }
      const target = this.dataTable.find(item => item.id === record.id)
      console.log(target)
      target.editable = false
      target.isNew = false
      this.diffArr = this.dataTable.filter(item => !item.editable)
    },
    toggle (id) {
      console.log(this.dataTable)
      this.diffArr = this.dataTable.filter(item => item.id !== id)
      const target = this.dataTable.find((item) => item.id === id)
      target._originalData = { ...target }
      target.editable = !target.editable
    },
    cancel (id) {
      const target = this.dataTable.find((item) => item.id === id)
      Object.keys(target).forEach((id) => {
        target[id] = target._originalData[id]
      })
      target._originalData = undefined
    },
    remove (id) {
      const newData = this.dataTable.filter(item => item.id !== id)
      this.dataTable = newData
    }
  }
}
</script>
<style scoped lang="">

</style>
