<template>
  <a-card :loading="loading" :body-style="{ padding: 0, cursor: 'pointer' }" :bordered="false">
    <div
      :style="{
        padding: '16px',
        borderWidth: '1px',
        borderStyle:'solid',
        borderColor: borderColor,
        borderRadius: '20px',
        marginBottom: '24px',
      }"
    >
      <div class="card-header">
        <div class="meta">
          <!-- 图标 -->
          <slot name="img"> </slot>
          <!-- 父子标题 -->
          <div class="card-title">
            <span class="title">
              <slot name="title">
                {{ title }}
              </slot>
            </span>
            <span>
              <slot name="subTitle">
                {{ subTitle }}
              </slot>
            </span>
          </div>
        </div>
      </div>
      <!-- totle -->
      <div class="total">
        <slot name="total">
          <span>{{ (typeof total === 'function' && total()) || total }}</span>
        </slot>
      </div>
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'UploadCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    borderColor: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    },
    total: {
      type: [Function, Number, String],
      required: false,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less" scoped>
.card-header {
  position: relative;
  overflow: hidden;
  width: 100%;
  .meta {
    display: flex;
    .card-title {
      display: inline-grid;
      .title {
        font-size: 18px;
        color: #333;
        font-weight: bold;
      }
      .sub-title {
        font-size: 14px;
        color: #b7b7b7;
      }
    }
  }
}

.card-action {
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 0;
}

.total {
  // overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
  color: #000;
  margin: 0 28px 28px 0;
  font-size: 50px;
  line-height: 38px;
  height: 38px;
  text-align: right;
  font-weight: bold;
}
</style>
