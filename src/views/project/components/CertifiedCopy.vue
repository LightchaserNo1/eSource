<template>
  <div>
    <a-row :gutter="48">
      <a-col :md="48">
        <a-table
          bordered
          :loading="memberLoading"
          :columns="columns"
          :dataSource="data"
          :pagination="false"
          size="small">
          <template
            slot="name"
            slot-scope="text, record">
            <a-input
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              @change="(e) => handleInputChange(e.target.value, record.id, 'name')"
            />
            <template v-else>{{ text }}</template>
          </template>
          <template
            slot="operation"
            slot-scope="text, record"
            v-if="!isDetail">
            <div>
              <template v-if="record.editable">
                <span v-if="record.isNew">
                  <a
                    href="javascript:;"
                    @click="saveRow(record)">添加</a>
                  <a-divider type="vertical" />
                  <a-popconfirm
                    title="是否要删除此行？"
                    @confirm="remove(record)">
                    <a href="javascript:;">删除</a>
                  </a-popconfirm>
                </span>
                <span v-else>
                  <a
                    href="javascript:;"
                    @click="saveRow(record)">保存</a>
                  <a-divider type="vertical" />
                  <a
                    href="javascript:;"
                    @click="cancel(record.id)">取消</a>
                </span>
              </template>
              <span v-else>
                <a
                  href="javascript:;"
                  @click="toggle(record.id)"
                  v-if="$auth('SYSTEM.PROJECT_CERTIFIED_TYPE_EDIT')">编辑</a>
                <a-divider
                  type="vertical"
                  v-if="$auth('SYSTEM.PROJECT_CERTIFIED_TYPE_EDIT') && $auth('SYSTEM.PROJECT_CERTIFIED_TYPE_DELETE')" />
                <a-popconfirm
                  title="是否要删除此行？"
                  @confirm="remove(record)"
                  v-if="$auth('SYSTEM.PROJECT_CERTIFIED_TYPE_DELETE')">
                  <a href="javascript:;">删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </a-table>
        <a-button
          style="width: 100%; margin-top: 16px; margin-bottom: 8px"
          type="dashed"
          icon="plus"
          @click="newMember"
          :disabled="!$auth('SYSTEM.PROJECT_CERTIFIED_TYPE_ADD') || isDetail"
        >
          添加
        </a-button>
      </a-col>
    </a-row>
  </div>

</template>
<script>
import { addCertifiedCopy, certifiedCopyList, deleteCertifiedCopy, updateCertifiedCopy } from '@api/patient/patient'

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
  data () {
    return {
      form: {},
      loading: true,
      diffList: [],
      memberLoading: false,
      // table
      data: null,
      columns: [
        {
          title: '核证副本类型',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
          width: '20%',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          width: '15%',
          scopedSlots: { customRender: 'operation' }
        }
      ]
    }
  },
  mounted () {
    this.getlist()
  },
  methods: {
    // 新增
    newMember () {
      console.log(this.proId)
      const length = this.data.length
      this.data.push({
        id: length === 0 ? '1' : (Number(this.data[length - 1].id) + 1).toString(),
        name: '',
        editable: true,
        isNew: true
      })
    },
    // 删除
    remove (value) {
      console.log(value)
      if (value.isNew) {
        const newData = this.data.filter((item) => item.id !== value.id)
        this.data = newData
      } else {
        this.memberLoading = true
        deleteCertifiedCopy({ id: value.id })
        .then(res => {
          const newData = this.data.filter((item) => item.id !== value.id)
          this.data = newData
          this.memberLoading = false
          console.log(res)
          this.$message.success('删除成功')
          this.getlist()
        })
        .catch(() => {
          this.$message.error('删除失败')
           this.memberLoading = false
        })
      }
    },
    // 行内编辑事件
    handleInputChange (value, id, column) {
      const newData = [...this.data]
      const target = newData.find((item) => id === item.id)
      if (target) {
        target[column] = value.trim()
        this.data = newData
      }
      this.diffList = this.data.filter(item => !item.editable)
      console.log(this.diffList)
    },
    // 编辑row
    toggle (id) {
      console.log(id)
      const target = this.data.find((item) => item.id === id)
      console.log(target)
      if (this.data.length > 0) {
        this.diffList = this.data.filter(item => (item.id) !== (target.id))
      }
      target._originalData = { ...target }
      target.editable = !target.editable
    },
    // 列表请求
    getlist () {
      this.memberLoading = true
      certifiedCopyList({ proId: this.proId })
      .then(res => {
        this.memberLoading = false
        // this.$message.success('列表获取成功')
        console.log(res)
        if (this.data) {
          this.data.forEach(item => {
            res.forEach(ftem => {
              if (item.name === ftem.name || !item.isNew || !item.editable) {
                item = {
                  isNew: item.isNew,
                  editable: item.editable,
                  ...ftem
                }
              }
            })
          })
          console.log(this.data)
        } else {
          res.forEach(item => {
            item.isNew = false
            item.editable = false
          })
          this.data = [...res]
          console.log(this.data)
        }
        this.$forceUpdate()
      })
      .catch((res) => {
        console.log(res)
        this.memberLoading = false
        this.$message.error('列表获取失败')
      })
    },
    // row保存
    saveRow (record) {
      console.log(record)
      let repetition = true
      if (!record.name) {
        repetition = false
        this.$message.error('核证副本类型不可为空')
      }
      const newData = this.data.filter((item) => item.id !== record.id)
      newData.forEach(item => {
        if (item.name === record.name) {
          this.$message.error('核证副本类型不可重复')
          repetition = false
        }
      })
      if (repetition) {
        if (record.isNew) {
          const parma = JSON.stringify([{ proId: this.proId, name: record.name }])
          console.log(parma)
          this.memberLoading = true
          addCertifiedCopy({ proCopyType: parma })
          .then((res) => {
            this.$message.success('添加成功')
            console.log(res)
            this.memberLoading = false
            record.editable = false
            record.isNew = false
            this.getlist()
          })
          .catch(() => {
            this.$message.error('添加失败')
            this.memberLoading = false
          })
        } else {
          console.log(record)
          this.memberLoading = true
          updateCertifiedCopy({ id: record.id, name: record.name })
          .then(res => {
            console.log(res)
            this.data.forEach(item => {
              if (item.id === record.id) {
                item.editable = false
              }
            })
            this.memberLoading = false
            this.$message.success('修改成功')
          })
          .catch(() => {
            this.memberLoading = false
            this.$message.errror('修改失败')
          })
        }
      }
    },
    // 取消
    cancel (id) {
      console.log(id)
      const target = this.data.find((item) => item.id === id)
      Object.keys(target).forEach((id) => {
        target[id] = target._originalData[id]
      })
      target._originalData = undefined
    }
  }
}
</script>
