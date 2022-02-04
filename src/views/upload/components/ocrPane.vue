<!--
 * @Author: Ling
 * @Descripttion: 图片脱敏
 * @Date: 2021-11-11 16:26:53
-->
<template>
  <div>
    <a-modal
      :visible="visible"
      width="1400"
      centered
      :maskClosable="false"
      :destroyOnClose="true"
      title="识别结果"
      okText="提交"
      @cancel="
        () => {
          $emit('cancel')
        }
      "
      @ok="
        () => {
          $emit('ok')
        }
      "
    >
      <a-row>
        <a-col span="12" class="left">
          <img id="imgSrc" :src="selectImg !== null ? selectImg : null | dealImageUrl" alt="脱敏图片" />
        </a-col>
        <a-col span="12" class="right">
          <a-textarea class="text" disabled :value="ocrText" :auto-size="{ minRows: 22 }"></a-textarea>
        </a-col>
      </a-row>
      <span slot="footer" class="dialog-footer">
        <a-button @click="handleCancel" type="primary">关闭</a-button>
      </span>
    </a-modal>
  </div>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectImg: {
      type: String,
      default: null
    },
    ocrText: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  beforeCreate () {

  },
  mounted () {
  },
  methods: {
    // 取消
    handleCancel () {
      this.$emit('cancel')
    }
  }
}

</script>

<style scoped lang="less">
.left,
.right {
  width: 700px;
  .text[disabled] {
    background-color: #fff;
    color: black;
    cursor: text;
  }
}
.left {
  margin-right: 20px;
  img {
    width: 700px;
  }
}
.mySign {
  border: 1px dashed #000;
}
</style>
