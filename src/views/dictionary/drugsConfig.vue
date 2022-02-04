<template>
  <page-header-wrapper>
    <a-card :loading="cardLoading">
      <a-row :gutter="48">
        <a-col
          :md="5"
          :sm="24">
          <a-card>
            <div
              v-for="(item,index) in treeList"
              :key="index">
              <a-button
                @click="treeTab(index,item)"
                style="width: 100%; margin-bottom: 10px;"
                :type="index==activeIndex?'primary':'default'">
                {{ item.typeName }}
              </a-button>
            </div>
          </a-card>
        </a-col>
        <a-col
          :md="19"
          :sm="24">
          <a-card>
            <div>
              <a-row :gutter="48">
                <a-col
                  :md="19"
                  :sm="24">
                  <a-descriptions title="配置"></a-descriptions>
                </a-col>
                <a-col
                  :md="5"
                  :sm="24">
                  <div class="btn-wrapper">
                    <a-button
                      type="primary"
                      @click="openModal"><a-icon type="plus"/>新增</a-button>
                  </div>
                </a-col>
              </a-row>
            </div>
            <div>
              <s-table
                :pageSize="100"
                v-if="showList"
                :columns="columns"
                :data="loadData"
                ref="table"
                :rowKey="record=>record.id">
                <template
                  slot="status"
                  slot-scope="text,record">
                  <div>
                    <a-tag :color="record.status | enumValueByKey($const.USE_STATUS,'color')">
                      {{ record.status | enumValueByKey($const.USE_STATUS) }}
                    </a-tag>
                  </div>
                </template>
                <template
                  slot="action"
                  slot-scope="text,record">
                  <div>
                    <a-popconfirm
                      title="是否确认删除"
                      @confirm="handleDelete(record.id)"
                      ok-text="确认"
                      cancel-text="取消" >
                      <a-icon
                        type="delete"
                        style="font-size:18px;color:#3C92FF; cursor: pointer;;"/>
                    </a-popconfirm>
                  </div>
                </template>
              </s-table>
            </div>
          </a-card>
        </a-col>
      </a-row>
      <a-modal
        :visible="visible"
        title="新增"
        @ok="modalOk"
        @cancel="modalCancel"
        :width="700">
        <div
          class="form-wrapper"
          style="padding:16px;">
          <a-form-model
            ref="ruleForm"
            :model="form"
            :rules="rules"
            :label-col="labelCol"
            label-align="left"
            :wrapper-col="wrapperCol">
            <a-form-model-item
              label="字典编码"
              prop="metaCode">
              <a-input
                v-model="form.metaCode"
                :disabled="codeDisabled"/>
            </a-form-model-item>
            <a-form-model-item
              label="字典编码中文"
              prop="metaName">
              <a-input v-model="form.metaName"/>
            </a-form-model-item>
          </a-form-model>
        </div>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import { getTreeList, getDictionaryList, addDictionary, deleteDictionary, getRandomCode } from '@/api/optionConfig/optionConfig'
import { buildPaginationObj } from '@/components/Table'
export default {
  props: {

  },
  components: {

  },
  data () {
    return {
      rules: {
        metaCode: [{ required: true, message: '此项为必填项' }],
        metaName: [{ required: true, message: '此项为必填项' }]
      },
      codeDisabled: false,
      target: {},
      typeCode: null,
      form: {},
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      visible: false,
      queryParam: { typeCode: null },
      activeIndex: 0,
      cardLoading: false,
      treeList: [],
      showList: false,
      loadData: parameter => {
        return getDictionaryList(Object.assign(parameter, this.queryParam)).then(res => {
          return buildPaginationObj(res)
        })
      },
      randomCode: '',
      columns: [
        {
          title: '类型编码',
          align: 'center',
          dataIndex: 'typeCode'
        },
        {
          title: '类型中文说明',
          align: 'center',
          dataIndex: 'typeName'
        },
        {
          title: '字典编码',
          align: 'center',
          dataIndex: 'metaCode'
        },
        {
          title: '字典编码中文',
          align: 'center',
          dataIndex: 'metaName'
        },
        {
          title: '字典编码英文',
          align: 'center',
          dataIndex: 'englishName'
        },
        {
          title: '使用状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  watch: {
    showList (newv) {
      if (newv) {
        this.queryParam = { typeCode: this.treeList[0].typeCode }
      }
    }
  },
  created () {

  },
  mounted () {
    getTreeList({}).then(res => {
      console.log(res, 'tree')
      this.target = res[0]
      this.treeList = res
      this.showList = true
    })
  },
  methods: {
    handleDelete (id) {
      console.log('确认删除')
      deleteDictionary({ id }).then(res => {
        this.$refs.table.refresh(true)
        this.$message.success('删除成功')
      })
    },
    openModal () {
      // 如果是研究分期，则要请求一个随机数填充进去。
      if (parseInt(this.typeCode) === 10001009) {
        getRandomCode().then(res => {
          console.log(res)
          this.codeDisabled = true
          this.form.metaCode = res
          this.visible = true
        })
      } else {
        this.codeDisabled = false
        this.visible = true
      }
    },
    modalCancel () {
      this.visible = false
      this.form = {}
    },
    modalOk () {
      const { typeCode, typeName } = this.target
      console.log(typeCode, typeName)
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          addDictionary({ ...this.form, typeCode, typeName }).then(res => {
            this.$refs.table.refresh(true)
            this.$message.success('添加成功')
            this.visible = false
            this.form = {}
          })
        } else {
          return false
        }
      })
    },
    treeTab (index, target) {
      this.form = {}
      this.activeIndex = index
      this.target = target
      console.log(this.target)
      const typeCode = target.typeCode
      this.typeCode = typeCode
      this.queryParam = { typeCode }
      console.log(this.activeIndex, target.typeCode)
      this.$refs.table.refresh(true)
    }
  }
}
</script>
<style scoped lang="css">
  .btn-wrapper{
    width: 100%;
    margin-bottom: 20px;
    display: flex;
    flex-direction:row-reverse;
  }
</style>
