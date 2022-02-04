<template>
  <a-tabs @change="callback">
    <a-tab-pane key="1" tab="访视流程" v-if="$auth('SYSTEM.PROJECT_VISIT_STAGE_FLOW')">
      <DetailVisitPlan :proId="proId" :isDetail="isDetail" ref="visitPlanDetail"/>
    </a-tab-pane>
    <a-tab-pane key="2" tab="编辑访视计划" v-if="!isDetail">
      <UpdataVisitPlan :proId="proId" ref="visitPlanUpdate"/>
    </a-tab-pane>
  </a-tabs>
</template>
<script>
import UpdataVisitPlan from './updataVisitPlan.vue'
import DetailVisitPlan from './detailVisitPlan.vue'
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
  components: {
    UpdataVisitPlan,
    DetailVisitPlan
  },
  data () {
    return {}
  },
  methods: {
    callback (key) {
      if (key === '1' && this.$refs.visitPlanDetail) {
        console.log(1)
        this.$refs.visitPlanDetail.getVisitList()
      }
      if (key === '2' && this.$refs.visitPlanUpdate) {
        console.log(2)
        this.$refs.visitPlanUpdate.getVisitList()
      }
    }
  }
}
</script>
