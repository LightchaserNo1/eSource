<!-- 数据源配置 -->
<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="24">
      <a-col :md="24" :lg="7">
        <a-card title="数据源名称" :headStyle="headStyle" >
          <a-button
            style="height: 50px; width: 100%; border-radius: 10px; margin-bottom: 20px; font-size: 18px;"
            :type="selectDatasourceIndex === index ? 'primary' : 'default'"
            v-for="(data, index) in datasource"
            :key="index"
            @click="clickRowButton(index)">
            {{ data.name }}
          </a-button>

        </a-card>
      </a-col>
      <a-col :md="24" :lg="17">
        <a-card>
          <a-form-model
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 10 }"
            :model="form"
            @submit="handleSubmit">
            <a-form-model-item label="数据源名称" >
              <a-input v-model="form.name"/>
            </a-form-model-item>
            <a-form-model-item label="驱动" >
              <a-input v-model="form.databaseContypeName"/>
            </a-form-model-item>
            <a-form-model-item label="URL" >
              <a-input v-model="form.hostName"/>
            </a-form-model-item>
            <a-form-model-item label="端口" >
              <a-input v-model="form.port"/>
            </a-form-model-item>
            <a-form-model-item label="用户名称" >
              <a-input v-model="form.name"/>
            </a-form-model-item>
            <a-form-model-item label="服务名称" >
              <a-input v-model="form.servername"/>
            </a-form-model-item>
            <a-form-model-item label="数据库名称" >
              <a-input v-model="form.databaseName"/>
            </a-form-model-item>
          </a-form-model>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { getDataSource } from '@/api/task/task'
export default {
  data () {
    return {
      headStyle: {
        'background-color': '#FAFAFA',
        'position': 'sticky',
        'text-align': 'center',
        // 'position': '-webkit-sticky',
        'top': 0
      },
      datasource: [],
      selectDatasourceIndex: 0,
      form: {}
    }
  },
  beforeMount () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
    getDataSource().then(res => {
      console.log(res)
      this.datasource = res.content
      this.form = this.datasource[0]
    })
  },
  methods: {
    clickRowButton (index) {
      this.selectDatasourceIndex = index
      console.log(index)
      console.log(this.datasource[index])
      this.form = this.datasource[index]
    },
    clickTest () {
      console.log('#### test ####')
    },
    handleSubmit () {

    }
  }
}
</script>

<style lang="less" scoped>

</style>
