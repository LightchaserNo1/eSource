<!-- 任务计划 -->
<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <!-- <h1>{{ checked }}</h1> -->
    <a-row :gutter="24">
      <a-col
        :md="24"
        :lg="16">
        <!-- 计划任务 开始 -->
        <a-row style="margin-bottom: 24px">
          <a-card
            class="left-card"
            :headStyle="headStyle"
            title="计划任务"
            :loading="taskLoading"
            bordered>
            <a-button
              slot="extra"
              style="margin-right: 20px"
              @click="clickUseHand"
              :loading="runningLoading">手动运行</a-button>
            <a-button
              slot="extra"
              type="primary"
              @click="clickOpenModal">
              <a-icon type="plus" />
              新建任务
            </a-button>
            <s-table
              ref="taskTable"
              size="default"
              bordered
              :rowKey="(record) => record.id"
              :row-selection="{ type: 'radio', onChange: handleTaskSelectChange }"
              :pageSize="5"
              :columns="taskColumns"
              :data="loadTaskData"
            >
              <span
                slot="jobType"
                slot-scope="text,record">
                <!-- {{ record.jobType }} -->
                {{ jobTypeList.find(item=>item.value===record.jobType).jobType }}
              </span>
              <span
                slot="planStartTime"
                slot-scope="text,record"
                v-if="record.planStartTime">{{ record.planStartTime | moment() }}</span>
              <span
                slot="action"
                slot-scope="text,record">
                <a-popconfirm
                  @confirm="del(record.id)"
                  title="是否确认删除">
                  <a href="#">删除</a>
                </a-popconfirm>
              </span>
            </s-table>
          </a-card>
        </a-row>
        <!-- 计划任务 结束 -->
        <!-- 运行日志 开始 -->
        <a-row>
          <a-card
            class="left-card"
            :headStyle="headStyle"
            title="运行日志"
            :loading="logLoading"
            bordered>
            <a-select
              slot="extra"
              v-model="logParam.type"
              style="width: 120px"
              @change="handleLogDateChange">
              <a-select-option
                :value="date.id"
                v-for="(date, index) in dateList"
                :key="index">
                {{ date.name }}
              </a-select-option>
            </a-select>
            <s-table
              ref="logTable"
              size="default"
              bordered
              :rowKey="(record) => record.idJob"
              :pageSize="5"
              :columns="logColumns"
              :data="loadLogData"
            >
              <span
                slot="startdate"
                slot-scope="text">{{ text | moment }}</span>
              <span
                slot="enddate"
                slot-scope="text">{{ text | moment }}</span>
              <span
                slot="log"
                slot-scope="text,record">
                <a
                  href="javascript:;"
                  @click="watchLog(record.logField)">查看</a>
              </span>
            </s-table>
          </a-card>
        </a-row>
        <!-- 运行日志 结束 -->
      </a-col>
      <a-col
        :md="24"
        :lg="8">
        <!-- 设置 开始 -->
        <a-card
          class="left-card"
          :headStyle="headStyle"
          title="设置"
          :loading="settingLoading"
          bordered>
          <a-form-model
            layout="vertical"
            :model="form"
            ref="ruleForm"
            :rules="rules">
            <a-form-model-item label="启用状态">
              <a-checkbox
                @click="boxChange"
                :disabled="!id"
                :checked="checked">启用</a-checkbox>
            </a-form-model-item>
            <a-form-model-item
              label="任务名称"
              prop="taskName">
              <a-input
                v-model.trim="form.taskName"
                :disabled="!id"/>
            </a-form-model-item>
            <a-form-model-item label="作业">
              <a-select
                v-model.trim="form.jobId"
                :disabled="!id">
                <a-select-option
                  v-for="(work, index) in workList"
                  :key="index"
                  :value="work.idJob">{{ work.name }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="运行模式">
              <a-radio-group
                @change="typeChange"
                :disabled="!id"
                v-model="form.runType"
                :options="runModeOptions" />
            </a-form-model-item>
            <a-form-model-item label="间隔">
              <a-input
                v-model="form.intervalTime"
                :disabled="!id||banInterval">
                <a-select
                  :disabled="!id||banInterval"
                  v-model="form.intervalTimeUnit"
                  style="width: 70px;"
                  slot="addonAfter" >
                  <a-select-option
                    v-for="(unit, index) in unitList"
                    :key="index"
                    :value="unit.id">{{ unit.name }}</a-select-option>
                </a-select>
              </a-input>
            </a-form-model-item>
            <a-form-model-item
              label="最多次数"
              help="注：0 表示不限制最多次数">
              <a-input
                :disabled="!id||banInterval"
                style="width: 80px;"
                v-model="form.mostTimes"
              />
            </a-form-model-item>
            <a-form-model-item label="计划开始时间">
              <a-date-picker
                v-model="form.planStartTime"
                :allowClear="false"
                :disabled="!id"
                @change="dateOk"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-model-item>
            <a-button
              type="primary"
              html-type="submit"
              @click="clickSubmit"
              :disabled="!id">
              提交
            </a-button>
          </a-form-model>
        </a-card>
        <!-- 设置 结束 -->
      </a-col>
    </a-row>
    <a-modal
      :visible="visible"
      @ok="modalOk"
      @cancel="modalCancel">
      <div style="padding-top:40px;">
        <a-form
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16 }">
          <a-form-model-item label="任务类型">
            <a-select
              v-model="jobType"
              @change="modalChange"
              v-if="!isSupperAdmin">
              <a-select-option
                v-for="(item,index) in jobTypeList "
                :key="index"
                :value="item.value">
                {{ item.jobType }}
              </a-select-option>
            </a-select>
            <a-select
              v-model="jobType"
              @change="modalChange"
              v-else-if="isSupperAdmin&&$isCenter">
              <a-select-option
                v-for="(item,index) in centerJobList "
                :key="index"
                :value="item.value">
                {{ item.jobType }}
              </a-select-option>
            </a-select>
            <a-select
              v-model="jobType"
              @change="modalChange"
              v-else-if="isSupperAdmin&&!$isCenter">
              <a-select-option
                v-for="(item,index) in hosJobList "
                :key="index"
                :value="item.value">
                {{ item.jobType }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form>
      </div>
    </a-modal>
    <a-modal
      title="查看日志"
      :visible="logVisible"
      :width="900"
      @ok="()=>{logVisible=false}"
      @cancel="()=>{logVisible=false}">
      <a-textarea
        disabled
        class="log"
        :value="file"></a-textarea>
    </a-modal>
  </div>

</template>

<script>
import moment from 'moment'
import { getTaskList, addTask, getResource, updateTask, deleteTask, handOperation, getLogList } from '@/api/task/task'
// import { buildPaginationObj } from '@/components/Table'
export default {
  data () {
    return {
      // 卡片头部样式
      headStyle: {
        'background-color': '#FAFAFA',
        'position': 'sticky',
        // 'position': '-webkit-sticky',
        'top': 0
      },
      // 判断是否为超级管理员
      isSupperAdmin: this.$options.filters.isHasAuth(this.$const.ROLE_TYPE.ADMIN.value),
      logVisible: false,
      checked: false,
      planStartTime: null,
      // 可操作的task列表是数据。
      handleTaskList: [],
      // 任务加载
      taskLoading: false,
      file: '',
      // 设置加载
      settingLoading: false,
      // 日志加载
      logLoading: false,
      logParam: {
        type: 4
      },
      // 计划任务表头
      taskColumns: [
        {
          title: '序号',
          dataIndex: 'id',
          align: 'center',
          sorter: true
        },
        {
          title: '任务名称',
          align: 'center',
          dataIndex: 'taskName'
        },
        {
          title: '任务类型',
          align: 'center',
          dataIndex: 'jobType',
          scopedSlots: { customRender: 'jobType' }
        },
        {
          title: '计划开始时间',
          align: 'center',
          dataIndex: 'planStartTime',
          sorter: true,
          scopedSlots: { customRender: 'planStartTime' }
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 计划任务 加载数据方法 必须为 Promise 对象
      loadTaskData: parameter => {
        console.log(parameter, 7777)

        if (parameter.sortOrder === 'ascend') {
          parameter.sortOrder = 'asc'
          parameter.sortField = parameter.sortField === 'planStartTime' ? 'plan_start_time' : 'id'
        } else if (parameter.sortOrder === 'descend') {
          parameter.sortField = parameter.sortField === 'planStartTime' ? 'plan_start_time' : 'id'
          parameter.sortOrder = 'desc'
        }
        return getTaskList(Object.assign({ ...parameter, proId: this.$store.getters.project.id }))
          .then(res => {
            console.log(res.content)
            this.handleTaskList = res.content
            return res
          })
      },
      // 运行日志表头
      logColumns: [
        {
          title: '序号',
          dataIndex: 'idJob',
          sorter: true
        },
        {
          title: '作业名称',
          align: 'center',
          dataIndex: 'jobname'
        },
        {
          title: '任务状态',
          align: 'center',
          dataIndex: 'status'
        },
        {
          title: '日志',
          align: 'center',
          dataIndex: 'log',
          scopedSlots: { customRender: 'log' }
        },
        {
          title: '任务开始时间',
           align: 'center',
          dataIndex: 'startdate',
          sorter: true,
          scopedSlots: { customRender: 'startdate' }
        },
        {
          title: '任务结束时间',
          dataIndex: 'enddate',
          align: 'center',
          sorter: true,
          scopedSlots: { customRender: 'enddate' }
        }
      ],
      // 运行日志 加载数据方法 必须为 Promise 对象
      loadLogData: parameter => {
        console.log(parameter, 'logParams')
        if (parameter.sortField === 'idJob') {
          parameter.sortField = 'ID_JOB'
        } else if (parameter.sortField === 'startdate') {
          parameter.sortField = 'STARTDATE'
        } else if (parameter.sortField === 'enddate') {
          parameter.sortField = 'ENDDATE'
        }
        if (parameter.sortOrder === 'ascend') {
          parameter.sortOrder = 'asc'
        } else if (parameter.sortOrder === 'descend') {
          parameter.sortOrder = 'desc'
        }
        return getLogList(Object.assign(parameter, this.logParam))
          .then(res => {
            console.log(res.content, 'logList')
            return res
          })
      },
      runningLoading: false,
      visible: false,
      logDateParam: 1,
      dateList: [{
        id: 1,
        name: '最近一个月'
      }, {
        id: 2,
        name: '最近一周'
      }, {
        id: 3,
        name: '最近三天'
      }, {
        id: 4,
        name: '全部'
      }],
      form: {},
      id: null,
      status: -1,
      // 作业列表
      workList: [],
      runModeOptions: [{
        label: '单次运行',
        value: 1
      }, {
        label: '循环运行',
        value: 2
      }, {
        label: '定时循环运行',
        value: 3
      }],
      unitList: [{
        id: 0,
        name: '天'
      }, {
        id: 1,
        name: '小时'
      }, {
        id: 2,
        name: '分钟'
      }],
      jobType: null,
      jobTypeList: [
        {
          jobType: '指定患者抓取',
          value: 1
        },
        {
          jobType: '上报中心',
          value: 2
        },
        {
          jobType: '上传到EDC',
          value: 3
        }
      ],
      rules: {
        taskName: [{ required: true, message: '请输入任务名称' }]
      },
      centerJobList: [
         {
          jobType: '上传到EDC',
          value: 3
        }
      ],
      hosJobList: [
        {
          jobType: '指定患者抓取',
          value: 1
        },
        {
          jobType: '上报中心',
          value: 2
        }
      ],
      banInterval: null
    }
  },
  beforeMount () {

  },
  mounted () {
    getResource().then(res => {
      console.log(res, 'worklist')
      this.workList = res
    })
  },
  methods: {

    /**
    * @function 单选任务回调
    * @description 单选任务回调
    * @param e {Array} 任务ID数组
    * @return void
    */
    handleTaskSelectChange (e) {
      const target = this.handleTaskList.find(item => item.id === e[0])
      console.log(target)
      this.id = target.id
      this.jobType = target.jobType
			let planStartTime = ''
			if (target.planStartTime == null) {
         planStartTime = ''
			} else {
				planStartTime = moment(target.planStartTime).format('YYYY-MM-DD HH:mm:ss')
			}
      console.log(planStartTime)
      this.planStartTime = planStartTime
      this.checked = target.status === 1
      const { taskName, runType, mostTimes, intervalTime, jobId, intervalTimeUnit, status } = target
      const backShow = { taskName, runType, mostTimes, intervalTime, jobId, intervalTimeUnit, status, plan_start_time: planStartTime }
      this.form = backShow
      console.log(this.form)
      this.banInterval = this.form.runType === 1
    },
    /**
    * @function 切换日志查询条件
    * @description 切换日志查询条件
    * @param e {Number} 条件ID
    * @return void
    */
    modalChange (e) {
      console.log(e)
    },
    typeChange (e) {
      console.log(e.target.value)
      this.banInterval = e.target.value === 1
      console.log(this.form)
      if (this.banInterval) {
        this.form.mostTimes = 0
        this.form.intervalTime = 0
        delete this.form.intervalTimeUnit
      }
    },
    handleLogDateChange (e) {
      this.$refs.logTable.refresh(true)
    },
    clickOpenModal () {
      this.visible = true
    },
    modalOk () {
      if (!this.jobType) {
        this.$message.error('请选择任务类型')
        return false
      }
      addTask({ jobType: this.jobType, proId: this.$store.getters.project.id }).then(res => {
        console.log(res)
        this.$message.success('添加成功')
        this.$refs.taskTable.refresh(true)
        setTimeout(() => {
          this.visible = false
        }, 100)
      }, err => {
        console.log(err)
        this.jobType = null
        this.visible = false
      })
    },
    modalCancel () {
      this.jobType = null
      this.visible = false
    },
    clickSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const submitParams = { ...this.form, id: this.id, status: this.status, jobType: this.jobType }
          console.log(submitParams)
          updateTask(submitParams).then(res => {
          console.log(res)
          this.$refs.taskTable.refresh(true)
          this.$message.success('操作成功')
          })
        }
      })
    },
    boxChange () {
      console.log(this.checked)
      this.checked = !this.checked
      this.status = this.checked ? 1 : -1
    },
    dateOk (e, c) {
      console.log(e, c)
      this.form.planStartTime = c
      console.log(this.form)
    },
    del (e) {
      console.log(e)
      deleteTask({ id: e }).then(res => {
        this.$refs.taskTable.refresh(true)
        this.$message.success('删除成功')
      })
    },
    // 手动运行
    clickUseHand () {
      if (!this.id) {
        this.$message.error('请选择任务')
        return false
      }
      this.runningLoading = true
      console.log('222')
      handOperation({ jobType: this.jobType }).then(res => {
        this.$message.success('手动运行成功')
        this.runningLoading = false
      }, err => {
        console.log(err)
        this.$message.error('手动运行失败')
        this.runningLoading = false
      })
    },
    // 查看日志
    watchLog (file) {
      this.file = file
      this.logVisible = true
      console.log(file)
    }
  }
}
</script>

<style lang="less" scoped>
  .log[disabled]{
    cursor: text;
    background-color: #fff;
    color: #000;
    height: 500px;
  }
</style>
