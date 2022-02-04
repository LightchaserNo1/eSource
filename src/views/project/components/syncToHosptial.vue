<template>
  <div>
    <a-modal
      :width="675"
      @cancel="() => {this.$emit('cancelSync')}"
      @ok="sync()"
      :visible="visible"
      :title="openState === 1 ? '同步医院' : '导出'"
    >
      <a-card :body-style="{ padding: '18px' }" :bordered="false" style="height: ">
        <div style="overflow-y: scroll; height: 350px; padding-left: 0;">
          <a-form-model :model="form">
            <a-form-model-item>
              <a-radio-group v-model="form.resource" >
                <a-radio v-for="(item, index) in hosptialList" :key="index" :value="item.orgId"> {{ item.orgName }} </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-form-model>
        </div>
      </a-card>
    </a-modal>
  </div>
</template>

<script>
import { getStudyCenterList } from '@/api/project/project'
// import { syncHosptialList } from '@/api/project/project'

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    openState: {
      type: Number,
      required: true
    },
    proId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      form: {},
      hosptialList: []
    }
  },
  watch: {
    visible (newValue) {
      if (newValue) {
        this.getSyncHosptialList()
      }
    }
  },
  mounted () {
    console.log(111)
  },
  methods: {
    sync () {
      if (!this.form.resource) {
        this.$message.error('请选择中心')
      } else {
        console.log(this.form.resource)
        const resource = this.form.resource
        this.form = {}
        if (this.$props.openState === 1) {
          this.$emit('syncOk', resource)
        } else {
          this.$emit('downLoad')
        }
      }
    },
    // 获取列表
    getSyncHosptialList () {
      getStudyCenterList({ pageNumber: 1, pageSize: 1000, proId: this.$props.proId })
      .then((res) => {
        this.hosptialList = res
      })
      .catch((row) => {
        console.log(row)
      })
    }
  }
}
</script>

<style lang="less">

</style>
