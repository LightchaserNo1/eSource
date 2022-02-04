<template>
  <!-- 图文组件 -->
  <div>
    <div v-if="listData.length>0">
      <a-row :gutter="48">
        <a-col :md="8" :sm="24">
          <a-card>
            <ul style="overflow-y:scroll;height:350px;">
              <li
                @click="clickSelectInfo(index)"
                v-for="(item,index) in listData"
                :key="index"
                :class="activeIndex==index?'active':'normal'">
                <img :src="item.imageOriginal | dealImageUrl" alt="">
                <div>
                  <div>{{ item.modifyTime | moment() }}</div>
                </div>
              </li>
            </ul>
          </a-card>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-card>
            <h1 >原始文件</h1>
            <img :src="showData.imageOriginal | dealImageUrl" alt="" style="width:100%;height:250px;">
            <div class="search-wrapper" @click="clickBlowUp">
              <a-icon type="search" style="font-size:24px;color:#3C92FF"/><a>点击放大</a>
            </div>
          </a-card>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-card>
            <h1>文字详情</h1>
            <a-textarea :value="showData.ocrText" disabled style="height:350px;" class="words-detail"/>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <div v-else>
      <a-empty/>
    </div>
    <a-modal
      :width="850"
      :visible="visible"
      :footer="null"
      title="查看图片"
      @ok="handleModalOk"
      @cancel="handleModalCancel">
      <img :src="showData.imageOriginal | dealImageUrl" alt="" style="width:800px;height:500px;">
    </a-modal>
  </div>
</template>
<script>
import { getImg } from '@/api/patient/patient'
export default {
  props: {
    // 请求图文详情的参数
    params: {
      required: true,
      type: Object
    }
  },
  components: {

  },
  watch: {

  },
  data () {
    return {
      listData: [],
      showData: {},
      visible: false,
      activeIndex: 0
    }
  },
  created () {

  },
  mounted () {
    this.getData()
  },
  methods: {
    clickSelectInfo (index) {
      this.activeIndex = index
      this.showData = this.listData[index]
    },
    // 放大图片
    clickBlowUp () {
      this.visible = true
    },
    handleModalOk () {
      this.visible = false
    },
    handleModalCancel () {
      this.visible = false
    },
    // 请求图文数据，父组件会调用这个方法
    getData () {
      console.log(this.$props.params, 99888)
      const { ptsId } = this.$props.params
      return new Promise((resolve, reject) => {
        getImg({ metaCode: localStorage.getItem('metaCode'), proId: this.$store.getters.project.id, ptsId, auditStatus: 1, visitsProcessNo: localStorage.getItem('visitsCode') }).then(res => {
          console.log(res, 222)
          this.$nextTick(() => {
            this.listData = res
            this.showData = this.listData.length > 0 ? this.listData[0] : {}
          })
          this.$forceUpdate()
          resolve()
        }, err => {
          console.log(err)
        })
      })
    }
  }
}
</script>
<style scoped lang="less">
.active {
    cursor: pointer;
    margin:4px 0;
    background-color: #EDF9FF;
    color:#3C71FA;
    list-style: none;
    display: flex;
    img{
      display: block;
      width:90px;
      margin-right:20px;
      height: 60px;
    }
  }
  .normal {
    margin:4px 0;
    cursor: pointer;
    list-style: none;
    display: flex;
    img{
      width:90px;
      margin-right:20px;
      height: 60px;
    }
  }
  .search-wrapper{
    display: flex;
    cursor: pointer;
    align-items: center;
    margin-top:30px;
    justify-content: center;
  }
  .words-detail[disabled]{
    background-color: #fff;
    color:#000;
    cursor:text;
  }
</style>
