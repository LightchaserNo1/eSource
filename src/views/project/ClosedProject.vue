<template>
  <div>
    <AdminHospital :status="status"/>
  </div>
</template>
<script>
import AdminHospital from './components/AdminHospital'
export default {
  props: {

  },
  components: {
    AdminHospital
  },
  data () {
    return {
      status: 3
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {

  }
}
</script>
<style scoped lang="">

</style>
