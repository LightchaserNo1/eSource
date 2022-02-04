<template>
  <!-- 编辑试验阶段专用弹框 -->
  <div>
    <a-card>
      <a-modal
        :footer="null"
        :visible="visible"
        @ok="ok"
        @cancel="modalCancel"
        :width="900">
        <a-table
          :data-source="dataTable"
          :pagination="false"
          :columns="columns"
          :rowKey="record=>record.id">
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
          <template slot="stageCode" slot-scope="text,record">
            <div>
              <a-input
                :disabled="banCode"
                type="text"
                :value="text"
                style="margin: -5px 0"
                v-if="record.editable"
                @change="(e) => handleInputChange(e.target.value, record.id, 'stageCode')"/>
              <template v-else>{{ text }}</template>
            </div>
          </template>
          <template slot="action" slot-scope="text,record">
            <template v-if="record.editable">
              <span v-if="record.isNew">
                <a href="javascript:;" @click="saveRow(record,1)">添加</a>
                <a-divider type="vertical"></a-divider>
                <a-popconfirm title="是否确定删除?" @confirm="remove(record.id)" >
                  <a href="javascript:;">删除</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <a href="javascript:;" @click="saveRow(record,2)">保存</a>
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
    </a-card>
  </div>
</template>
<script>
import { getStageList, addStage, delStage, updateStage } from '@/api/project/project'
export default {
  props: {
    visible: {
      required: true,
      type: Boolean
    },
    proId: {
      required: true,
      type: [String, Number]
    }
  },
  components: {

  },
  data () {
    return {
      diffArr: [],
      banCode: false,
      dataTable: this.$props.stageArr,
      columns: [
        {
          title: '阶段名称',
          dataIndex: 'stageName',
          align: 'center',
          scopedSlots: { customRender: 'stageName' }
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
    console.log(this.$props, 'uuuu')
  },
  methods: {
    ok () {
      this.$emit('jdOk', this.dataTable)
    },
    modalCancel () {
      this.$emit('jdCancel', this.dataTable)
    },
    getStage () {
      return new Promise((resolve, reject) => {
        getStageList({ proId: this.$props.proId }).then(res => {
          res.forEach(item => {
            item.editable = false
            item.isNew = false
          })
          this.dataTable = res
          resolve('弹窗成功获取试验阶段')
        })
      })
    },
    addItem () {
      this.banCode = false
      this.dataTable.push({
        id: `jiaId${this.dataTable.length}`,
        isNew: true,
        editable: true,
        stageName: '',
        status: 1
      })
      console.log(this.dataTable)
      this.diffArr = this.dataTable.filter(item => !item.editable)
    },
    handleInputChange (value, id, key) {
      const newData = [...this.dataTable]
      const target = newData.find(item => item.id === id)
      if (target) {
        target[key] = value
        this.dataTable = newData
      }
    },
    saveRow (record, saveType) {
      const { stageName } = record
      if (!stageName) {
        this.$message.error('请补全信息')
        return false
      }
      const isRepeat = this.diffArr.findIndex(item => item.stageName === stageName) !== -1
      if (isRepeat) {
        this.$message.error('试验阶段已存在')
        return false
      }
      if (saveType === 1) { // 1为添加 2为编辑
        addStage({ stageName, proId: this.$props.proId, status: 1 }).then(res => {
          this.getStage().then(res => {
            this.$message.success('新增成功')
            const target = this.dataTable.find(item => item.id === record.id)
            console.log(target)
            target.editable = false
            target.isNew = false
            this.diffArr = this.dataTable.filter(item => !item.editable)
          })
        })
      } else if (saveType === 2) {
        updateStage({ stageName, proId: this.$props.proId, status: 1, id: record.id }).then(res => {
          this.getStage().then(res => {
            this.$message.success('修改成功')
            const target = this.dataTable.find(item => item.id === record.id)
            console.log(target)
            target.editable = false
            target.isNew = false
            this.diffArr = this.dataTable.filter(item => !item.editable)
          })
        })
      }
    },
    toggle (id) {
      this.banCode = true
      const target = this.dataTable.find((item) => item.id === id)
      this.diffArr = this.dataTable.filter(item => item.id !== id)
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
      if (id.toString().startsWith('jiaId')) {
        // 未添加成功时的数据，可直接本地删除
        const newData = this.dataTable.filter(item => item.id !== id)
        this.dataTable = newData
      } else {
        delStage({ id }).then(res => {
          this.getStage().then(res => {
            this.$message.success('删除成功')
          })
        })
      }
    }
  }
}
</script>
<style scoped lang="">

</style>
