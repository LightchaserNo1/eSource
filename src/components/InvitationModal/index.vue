<!-- pin邀请码 -->
<template>
  <div>
    <label for="code">
      <ul class="code-box">
        <li class="code-number" v-for="(item, index) in length" :key="index">
          {{ code[index] }}
        </li>
      </ul>
    </label>
    <input
      class="code-input"
      v-model="code"
      :maxlength="length"
      type="number"
      id="code"
      @keyup.13="next()" />
  </div>
</template>

<script>
export default {
  name: 'CodeInput',
  props: {
    length: {
      type: Number,
      default: 6
    }
  },
  data () {
    return {
      code: ''
    }
  },
  methods: {
    getCode () {
      return this.code
    },
    next () {
      this.$emit('func', this.code)
    }
  }
}
</script>
<style scoped>
.code-box {
  border-radius: 8px;
  border: 1px solid #cccccc;
  display: inline-flex;
  padding:0;
  margin: 0 auto;
}
.code-number {
  width: 56px;
  height: 58px;
  line-height: 58px;
  border-right: solid #cccccc 1px;
  text-align: center;
  font-size: 30px;
  color: #333;
}
.code-number:last-child {
  border-right: 0;
}
.code-input {
  height: 0.44rem;
  position: fixed;
  outline: none;
  color: transparent;
  text-shadow: 0 0 0 transparent;
  width: 300%;
  margin-left: 100%;
}
button {
  width: 100px;
  height: 60px;
}
</style>
