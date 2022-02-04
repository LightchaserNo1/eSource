<template>
  <page-header-wrapper @back="$router.go(-1)">
    <ProjectUpdate
      v-if="$store.getters.project ? (($store.getters.project.status !== 3) && showProject) : true"
      :proId="$route.query.id || this.$store.getters.project.id"
    />
    <ProjectDetail
      v-if="$store.getters.project ? (($store.getters.project.status !== 3) && !showProject) : false"
      :proId="$route.query.id || this.$store.getters.project.id"
    />
  </page-header-wrapper>
</template>

<script>
import ProjectUpdate from './ProjectUpdate'
import ProjectDetail from './ProjectDetail'

export default {
  components: {
    ProjectUpdate,
    ProjectDetail
  },
  data () {
    return {
      showProject: false,
      showNewProject: false
    }
  },
  mounted () {
    console.log(this.$store.getters.roles[0])
    // console.log(this.$store.getters.project.id)
    console.log(this.$route.query)
    if (this.$store.getters.roles[0].code === 'SYS_ADMIN' && this.$auth('PROJECT.PROJECT_EDIT')) {
      this.showProject = true
    } else if (this.$store.getters.roles[0].code === 'SYS_BIZ' && this.$auth('PROJECT.PROJECT_EDIT')) {
      this.showProject = true
    } else if (this.$store.getters.roles[0].code === 'PM' && this.$auth('PROJECT.PROJECT_EDIT')) {
      this.showProject = true
    } else {
      this.showProject = false
    }
    console.log(this.showProject)
  },
  methods: {

  }
}
</script>
<style lang="less">

</style>
