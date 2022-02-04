<template>
  <div>
    <template>
      <div class="stepContainer">
        <div class="stepWrap">
          <template
            v-for="(item, index) in planList"
          >
            <div
              class="item-wrap"
              :key="index"
              v-if="index === 0">
              <div class="stepBox">{{ item.name }}</div>
              <div class="item"></div>
              <div
                :class="[index%2 ==0?'verticalLine':'verticalLine1']"
                v-if="item.showVisitContent"></div>
              <div class="bt">{{ item.showVisitContent }}</div>
            </div>
            <div
              class="item-wrap"
              v-if="index > 0 && index < planList.length-1"
              :key="index">
              <div class="item"></div>
              <div
                :class="[index%2 ==0?'verticalLine':'verticalLine1']"
                item.showVisitContent></div>
              <div class="stepBox">{{ item.name }}</div>
              <div class="item"></div>
              <div
                class="tp"
                v-if="!item.timePointType">入组时间</div>
              <div :class="[index%2 ==0?'bt':'bt1']">{{ item.showVisitContent }}</div>
            </div>
            <div
              class="item-wrap"
              v-if="index === planList.length-1"
              :key="index" >
              <div class="item"></div>
              <div
                :class="[index%2 ==0?'verticalLine':'verticalLine1']"
                item.showVisitContent></div>
              <div class="stepBox">{{ item.name }}</div>
              <div
                class="tp"
                v-if="!item.timePointType">入组时间</div>
              <div :class="[index%2 ==0?'bt':'bt1']">{{ item.showVisitContent }}</div>
            </div>
            <div
              class="item-wrap"
              v-if="index === planList.length"
              :key="index" >
              <div class="stepBox">{{ item.name }}</div>
              <div :class="[index%2 ==0?'bt':'bt1']">{{ item.showVisitContent }}</div>
              <!-- <div class="item"></div> -->
            </div>
          </template>
        </div>
      </div>

    </template>
    <!-- <template v-else>
      <a-empty />
    </template> -->
  </div>
</template>
<script>
export default {
  name: 'TimeLine',
  props: {
    planList: {
      required: true,
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
        return {
          firstItem: [],
          lastItem: []
        }
  },
  mounted () {
    if (this.planList.length >= 2) {
      this.firstItem = this.planList.slice(0, 1)
      this.lastItem = this.planList.pop()
    } else if (this.planList.length === 1) {
      this.firstItem = this.planList.slice(0, 1)
    }
    console.log(this.firstItem)
  },
  methods: {

  }
}
</script>
<style lang="less" scoped>
    .stepContainer{
        width: 100%;
        height: 200px;
        overflow-x:scroll;
        .stepWrap{
          display:flex;
          justify-content: center;
          margin-top: 50px;
          .item-wrap{
              font-size: 13px;
              position: relative;
              color:#1CC2FD;
              display:flex;
             .tp{
                  position: absolute;
                  width: 100%;
                  bottom: 30px;
                  text-align: center;
              }
              .verticalLine{
                  position: absolute;
                  width:50%;
                  height:28px;
                  top:37px;
                  left:-50%;
                  border-right: 1px dashed #ABB8CE;
              }
              .verticalLine1{
                  position: absolute;
                  width:50%;
                  height:28px;
                  top:0px;
                  left:-50%;
                  border-right: 1px dashed #ABB8CE;
              }
              .bt{
                  position: absolute;
                  width: 100%;
                  color:#8193B1;
                  left:-50%;
                  top: 70px;
                  text-align: center;
              }
              .bt1{
                  position: absolute;
                  width: 100%;
                  color:#8193B1;
                  left:-50%;
                  top: -35px;
                  text-align: center;
              }
         }
         .stepBox{
            border: 1px solid #1CC2FD;
            padding: 4px 10px;
            border-radius: 5px;
            white-space: nowrap;
            color:#1CC2FD;
            background:#E7F9FF; //white;
            bottom: -14px;
            margin: auto;
            position: relative;
         }
        .item{
            //flex:1;
            width: 40px;
            border-bottom:1px dashed #1CC2FD;
        }
        }

     }
</style>
