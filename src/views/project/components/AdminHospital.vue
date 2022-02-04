<template>
  <!-- 业务管理员项目列表 -->
  <div>
    <!-- <h1>{{ $auth('PROJECT.PROJECT_EDIT') }}</h1> -->
    <div class="table-top">
      <div>
        <a-descriptions
          :title="
            this.$props.status == 1
              ? '未启用项目'
              : this.$props.status == 2
                ? '进行中项目'
                : this.$props.status == 3
                  ? '关闭项目'
                  : '全部项目'
          "
        ></a-descriptions>
      </div>
      <div class="btns">
        <a-button
          type="primary"
          @click="clickJoinProject"
          v-if="$auth('PROJECT.PROJECT_JOIN') && $isCenter"
        ><a-icon type="plus" />加入项目</a-button
        >
        <div style="width: 14px"></div>
        <a-button
          type="primary"
          @click="clickAddProject"
          v-if="$auth('PROJECT.PROJECT_ADD')"
        ><a-icon type="plus" />新增项目</a-button
        >
        <div
          style="width: 30px"
          v-if="!$isCenter"></div>
        <a-upload
          v-if="!$isCenter"
          name="file"
          ref="import"
          accept=".txt"
          list-type="picture"
          :preview-file="clickImport"
        >
          <a-button type="default">导入</a-button>
        </a-upload>
      </div>
    </div>
    <div>
      <s-table
        ref="table"
        :rowKey="(record) => record.id"
        size="middle"
        :data="loadData"
        :columns="columns"
      >
        <template
          slot="status"
          slot-scope="text, record">
          <div>
            <span
              :style="{'color':(record.status ==1 ? '#FC0119' :record.status ==2 ? '#62D883':'#676767')}"
            >
              •&nbsp;{{ record.status | enumValueByKey($const.PROJECT_STATUS) }}
            </span>
          </div>
        </template>

        <template
          slot="name"
          slot-scope="text, record">
          <div>
            <!-- <a href="javascript:;" v-if="(record.status==2||record.status==1)" @click="clickUpdateProject(record)">{{ record.name }}</a> -->
            <div style="margin-right:10px; color: #4d5c6f">{{ record.name }}</div>
          </div>
        </template>
        <template
          slot="sponsorName"
          slot-scope="text, record">
          <div>
            <!-- <a href="javascript:;" v-if="(record.status==2||record.status==1)" @click="clickUpdateProject(record)">{{ record.name }}</a> -->
            <div style="margin-right:10px; color: #4d5c6f">{{ record.sponsorName }}</div>
          </div>
        </template>
        <template
          slot="id"
          slot-scope="text, record">
          <div>
            <!-- <a href="javascript:;" v-if="(record.status==2||record.status==1)" @click="clickUpdateProject(record)">{{ record.name }}</a> -->
            <div style="margin-left:12px;">{{ record.id }}</div>
          </div>
        </template>
        <!-- <template slot="watch" slot-scope="text,record" >
          <div>
            <a @click="watchDetail(record)" href="javascript:;" v-if="!$auth('PROJECT.PROJECT_EDIT')">查看</a>
          </div>
        </template> -->
        <template
          slot="buildTime"
          slot-scope="text, record">
          <div>
            {{ record.buildTime | moment('YYYY-MM-DD') }}
          </div>
        </template>
        <template
          slot="action"
          slot-scope="text, record">
          <!-- <a href="javascript:;" @click="clickWatchProject(record)" v-if="(record.status===2||record.status==1)&&$auth('PROJECT.PROJECT_DETAIL')">进入项目</a> -->
          <div
            class="table-action"
            style="margin: 12px;"
            :class="{ disabled: !(record.status === 2 || record.status == 1) && $auth('PROJECT.PROJECT_DETAIL') }"
            @click="clickWatchProject(record)"
          >
            进入项目
          </div>
          <!-- <div
            class="table-action"
            :class="{ disabled: record.status == 3 }"
            @click="clickUpdateProject(record)">
            查看详情
          </div> -->
        </template>
      </s-table>
    </div>
    <PinModal
      :joinProjectVisible="pinVisible"
      @closeJoinProject="closeJoinProject" />
    <AddProModal
      :addProVisible="addProVisible"
      @cancelAdd="cancelAdd" />
  </div>
</template>
<script>
import PinModal from './PinModal.vue'
import AddProModal from '../AddProModal.vue'
import { getInfo } from '@/api/login'
import { getProjectList, importProject } from '@/api/project/project'
// import { buildPaginationObj } from '@/components/Table'
// 定义模块大组件时，传入识别项目状态的参数。
// 引入columns配置
import { specialColumns } from '../project-columns'
import { getResearchList } from '@api/patient/patient'
export default {
  props: {
    status: {
      required: false,
      default: null,
      type: [String, Number]
    }
  },
  components: {
    PinModal,
    AddProModal
  },
  data () {
    return {
      // isPM: this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.PM.value),
      pinVisible: false,
      addProVisible: false,
      specialColumns,
      queryParam: {
        status: this.$props.status
      },
      loadData: (parameter) => {
        return getProjectList(Object.assign(parameter, this.queryParam)).then((res) => {
          console.log(res)
          // 此处后端返回proceedNum字段为错的
          const { allNum, closeNum, proceedNum, unstartNum } = res
          this.$bus.$emit('projectNum', { allNum, closeNum, proceedNum, unstartNum })
          return res.page
        })
      }
    }
  },
  computed: {
    // 处理要用到的columns，需要用身份来选择。
    columns () {
      return this.specialColumns
    }
  },
  created () {},
  mounted () {
    console.log('PM', this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.PM.value), this.isPM)
    console.log(this.$isCenter, 6662)
    console.log(this.$store.getters.userInfo.roleId)
    if (this.$const.ROLE_TYPE.CRC.value === 5) {
      console.log('crc')
    }
    if (!this.$props.status) {
      this.queryParam = { systemId: 3 }
    }
  },
  methods: {
    // 导入项目文件
    clickImport (file) {
      // const isJpgOrPng = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      // console.log(isJpgOrPng, 55555)
      // if (!isJpgOrPng) {
      //   this.$notification.error({
      //     message: file.name,
      //     description: '404'
      //   })
      //   return false
      // } else {
      //   const params = new FormData()
      //   params.append('file', file)
      //   return importProject(params).then(res => {
      //     this.$notification.success({
      //       message: file.name,
      //       description: '上传成功'
      //     })
      //     console.log(res)
      //   })
      // }
      const params = new FormData()
      console.log(file, params)
      params.append('file', file)
      // params.file = file
      console.log(params, '上传时的请求参数')
      return importProject(params)
        .then((res) => {
          this.$notification.success({
            message: file.name,
            description: '上传成功'
          })
          console.log(res)
        })
        .finally(() => {
          this.$refs.import.sFileList = []
          this.$nextTick(() => {
            this.$nextTick(() => {
              this.$refs.table.refresh(true)
            })
          })
        })
    },
    cancelAdd () {
      this.addProVisible = false
    },
    clickAddProject () {
      // this.$router.push({
      //   name: 'ProjectAdd'
      // })
      this.addProVisible = true
    },
    clickUpdateProject (record) {
      console.log(record)
      getInfo({ proId: record.id }).then((res) => {
        console.log(res.pms)
        // const goInArray = ['SYS_ADMIN',"SYS_BIZ",'PM']
        /*
          pm可直接进入编辑项目，
          业务管理员和超级管理员收权限限制
        */
        if (res.roles.length > 0 && res.roles[0].code === 'SYS_ADMIN' && res.pms.indexOf('PROJECT_EDIT') !== -1) {
          this.$store.dispatch('EnterProject', record).then((res) => {
            this.$router.push({
              name: 'ProjectUpdate',
              query: {
                id: record.id
              }
            })
          })
        } else if (res.roles.length > 0 && res.roles[0].code === 'SYS_BIZ' && this.$auth('PROJECT.PROJECT_EDIT')) {
          this.$store.dispatch('EnterProject', record).then((res) => {
            this.$router.push({
              name: 'ProjectUpdate',
              query: {
                id: record.id
              }
            })
          })
        } else if (res.roles.length > 0 && res.roles[0].code === 'PM' && res.pms.indexOf('PROJECT_EDIT') !== -1) {
          // $auth对PM的权限判断失灵
          this.$store.dispatch('EnterProject', record).then((res) => {
            this.$router.push({
              name: 'ProjectUpdate',
              query: {
                id: record.id
              }
            })
          })
        } else {
          this.$store.dispatch('EnterProject', record).then((res) => {
            this.$router.push({
              name: 'ProjectDetail',
              query: {
                id: record.id
              }
            })
          })
        }
      })
      // this.$store.dispatch('EnterProject', record).then(res => {
      //   console.log(this.$store.getters)
      //   setTimeout(() => {
      //     const isYeWuAdmin = this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.YW_ADMIN.value)
      //     const isAdmin = this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.ADMIN.value)
      //     const isPm = this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.PM.value)
      //     console.log(isYeWuAdmin, isAdmin, isPm)
      //   }, 200)
      // })
    },
    // 查看项目详情
    watchDetail (record) {
      // this.$store.dispatch('EnterProject', record).then(res => {
      //   this.$router.push({
      //     name: 'ProjectDetail',
      //     query: {
      //       id: record.id
      //     }
      //   })
      // })
      this.$router.push({
        name: 'ProjectDetail',
        query: {
          id: record.id
        }
      })
    },
    clickWatchProject (record) {
      console.log(record, this.$isCenter)
      if (!this.$isCenter) {
          getResearchList({ proId: record.id })
            .then((res) => {
              console.log(res)
              if (res && res.length) {
                this.$store.dispatch('EnterProject', record).then((resser) => {
                  this.$router.push({
                    name: 'sickLoop',
                    query: {
                      proId: res[0].proId,
                      siteOrgId: res[0].orgId,
                      orgId: res[0].orgId,
                      researchId: res[0].id
                    }
                  })
                })
              } else {
                this.$message.error('该项目没有研究中心')
              }
            })
            .catch((row) => {
              console.log(row)
            })
      } else {
        this.$store.dispatch('EnterProject', record).then((res) => {
          this.$router.push({
            name: 'ProjectWatch'
          })
        })
      }
    },
    clickJoinProject () {
      this.pinVisible = true
    },
    closeJoinProject (val) {
      this.pinVisible = false
      if (val) {
        this.$refs.table.refresh(true)
      }
    }
  }
}
</script>
<style scoped lang="less">
.ant-descriptions-title {
  font-size: 18px;
  font-family: Noto Sans CJK;
  font-weight: bold;
}
.table-top {
  display: flex;
  justify-content: space-around;
}
.btns {
  display: flex;
}
::v-deep .ant-table-wrapper{
   border: 1px solid #E5EBF3
}
::v-deep .ant-table-thead > tr > th{
    padding: 14px 8px!important;
    &:first-child {
    padding-left: 16px!important;
  }
 }
// ::v-deep .ant-table-header-column{
//   // margin: 0 12px;
// }
</style>
