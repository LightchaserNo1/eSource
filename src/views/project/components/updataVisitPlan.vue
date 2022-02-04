<template>
  <div>
    <div style="margin: 2rem 0 3rem;">
      <a-button type="primary" @click="() => visible=true" style="margin-right: 1rem;" :disabled="!$auth('SYSTEM.PROJECT_VISIT_STAGE_VERSION_ADD')"> 新增版本 </a-button>
      <a-upload
        ref="import"
        accept=".txt"
        name="file"
        list-type="picture"
        :before-upload="beforeUpload"
        :preview-file="handleImport"
      >
        <a-button type="default" :disabled="!$auth('SYSTEM.PROJECT_VISIT_STAGE_VERSION_IMPORT')">导入访视版本</a-button>
      </a-upload>
    </div>
    <a-modal
      :visible="visible"
      title="新增版本"
      @cancel="() => {visible=false, this.visitfrom.visitName = ''}"
      @ok="addPlan()"
      width="650px"
    >
      <a-form-model :model="visitfrom">
        <a-form-model-item label="版本名称">
          <a-input v-model.trim="visitfrom.visitName" placeholder="版本名称" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <div style="margin-bottom: 3rem;">
      <template v-if="planList && planList.length">
        <a-tabs tab-position="left" :default-active-key="planList[0].id" @change="callback">
          <a-tab-pane v-for="rem in planList" :key="rem.id" :tab="rem.name">
            <div style="margin-bottom: 2rem;">
              <a-checkbox @change="onChange(rem)" :checked="rem.status === -1 ? false : true"> 启用 </a-checkbox>
              <a-button type="primary" style="margin-left: 1rem;" @click="derive" :disabled="!$auth('SYSTEM.PROJECT_VISIT_STAGE_VERSION_EXPORT')"> 导出 </a-button>
              <a-popconfirm title="是否要删除此行？" @confirm="deleteVisit(rem.id)">
                <a-button type="primary" style="margin-left: 1rem;"> 删除版本 </a-button>
              </a-popconfirm>
            </div>
            <div>
              <a-table
                bordered
                :loading="memberLoading"
                :columns="columns"
                :scroll="{ x: 1700 }"
                :dataSource="data"
                :pagination="false"
                size="small">
                <template slot="name" slot-scope="text, record">
                  <a-form-model layout="inline" :model="record">
                    <a-form-model-item>
                      <a-input
                        v-model="record.name"
                        :disabled="!record.editable"
                        style="margin: -5px 0"
                      />
                    </a-form-model-item>
                  </a-form-model>
                </template>
                <template slot="content" slot-scope="text, record">
                  <a-form-model
                    layout="inline"
                    :model="text"
                  >
                    <a-row :gutter="4">
                      <a-col :md="6" :xs="6">
                        <a-form-model-item>
                          <a-select :disabled="!record.editable" v-model="text.genre" style="width: 12rem;">
                            <a-select-option v-for="(items, index) in genrelist" :key="index" :value="index">
                              {{ items.name }}
                            </a-select-option>
                          </a-select>
                        </a-form-model-item>
                      </a-col>
                      <a-col :md="3" :xs="3">
                        <a-form-model-item>
                          <a-select
                            :disabled="!record.editable"
                            v-model="text.timeEnd"
                            style="width: 6rem;"
                            @change="() => {text.mainNumber = '', text.mainUnit = '', text.complementaryUnit = '', text.complementaryNumber = ''}"
                          >
                            <a-select-option value="1">
                              之前
                            </a-select-option>
                            <a-select-option value="2">
                              之后
                            </a-select-option>
                          </a-select>
                        </a-form-model-item>
                      </a-col>
                      <a-col :md="3" :xs="3">
                        <a-form-model-item style="width: 100%;">
                          <a-input-number
                            :disabled="!record.editable || !text.timeEnd"
                            :min="1"
                            style="width: 100%;"
                            v-model="text.mainNumber"
                            @change="() => {text.complementaryNumber = ''}"
                          />
                        </a-form-model-item>
                      </a-col>
                      <a-col :md="3" :xs="3">
                        <a-form-model-item>
                          <a-select
                            :disabled="!record.editable || !text.timeEnd"
                            v-model="text.mainUnit"
                            style="width: 6rem;"
                            @change="() => {text.complementaryUnit = '', text.complementaryNumber = ''}"
                          >
                            <a-select-option value="1">
                              月
                            </a-select-option>
                            <a-select-option value="2">
                              天
                            </a-select-option>
                            <a-select-option value="3">
                              小时
                            </a-select-option>
                          </a-select>
                        </a-form-model-item>
                      </a-col>
                      <a-col :md="1" :xs="1">
                        <div style="width: 100%; height: 40px; display: flex; align-items: center; justify-content: center; padding-right: 8px;">±</div>
                      </a-col>
                      <a-col :md="3" :xs="3">
                        <a-form-model-item style="width: 100%;">
                          <a-input-number
                            :disabled="!record.editable || !text.mainUnit || !text.mainNumber || !text.complementaryUnit"
                            :min="1"
                            :max="maxNumber(text)"
                            style="width: 100%;"
                            v-model="text.complementaryNumber"
                          />
                        </a-form-model-item>
                      </a-col>
                      <a-col :md="2" :xs="2">
                        <a-form-model-item>
                          <a-select
                            :disabled="!record.editable || !text.mainUnit || !text.mainNumber"
                            v-model="text.complementaryUnit"
                            style="width: 6rem;"
                          >
                            <a-select-option
                              v-for="item in yearList(text)"
                              :key="item.value"
                              :value="item.value"
                            >
                              {{ item.name }}
                            </a-select-option>
                          </a-select>
                        </a-form-model-item>
                      </a-col>
                    </a-row>
                  </a-form-model>
                </template>
                <template slot="type" slot-scope="text, record">
                  <a-select
                    :disabled="!record.editable"
                    style="width: 6rem;"
                    v-model="record.type"
                  >
                    <a-select-option value="1">
                      时间点
                    </a-select-option>
                    <a-select-option value="2">
                      时间段
                    </a-select-option>
                  </a-select>
                </template>
                <template slot="operation" slot-scope="text, record">
                  <template v-if="record.editable">
                    <span v-if="record.isNew">
                      <a href="javascript:;" @click="saveRow(record)">添加</a>
                      <a-divider type="vertical" />
                      <a-popconfirm title="是否要删除此行？" @confirm="remove(record)">
                        <a href="javascript:;">删除</a>
                      </a-popconfirm>
                    </span>
                    <span v-else>
                      <a href="javascript:;" @click="saveRow(record)">保存</a>
                      <a-divider type="vertical" />
                      <a href="javascript:;" @click="cancel(record.id)">取消</a>
                    </span>
                  </template>
                  <span v-else>
                    <a href="javascript:;" @click="toggle(record.id)" :disabled="updataState" v-if="$auth('SYSTEM.PROJECT_VISIT_STAGE_EDIT')">编辑</a>
                    <a-divider type="vertical" v-if="$auth('SYSTEM.PROJECT_VISIT_STAGE_DELETE') && $auth('SYSTEM.PROJECT_VISIT_STAGE_EDIT')" />
                    <a-popconfirm title="是否要删除此行？" @confirm="remove(record)" v-if="$auth('SYSTEM.PROJECT_VISIT_STAGE_DELETE')">
                      <a href="javascript:;">删除</a>
                    </a-popconfirm>
                  </span>
                </template>
                <template slot="remark" slot-scope="text, record">
                  <a-form-model layout="inline" :model="record">
                    <a-form-model-item>
                      <a-input
                        v-model="record.remark"
                        :disabled="!record.editable"
                        style="margin: -5px 0"
                      />
                    </a-form-model-item>
                  </a-form-model>
                </template>
                <template slot="numb" slot-scope="text, record">
                  <div>{{ isNumb(record) }}</div>
                </template>
              </a-table>
              <a-button
                :disabled="!$auth('SYSTEM.PROJECT_VISIT_STAGE_ADD') || updataState"
                style="width: 100%; margin-top: 16px; margin-bottom: 8px"
                type="dashed"
                icon="plus"
                @click="newMember"
              >
                添加
              </a-button>
            </div>
          </a-tab-pane>
        </a-tabs>
      </template>
      <template v-else>
        <a-empty />
      </template>
    </div>
  </div>
</template>
<script>
import {
  addVisitPlan,
  visitPlanList,
  updateVisitStatus,
  addThePlan,
  planTheList,
  deleteThePlan,
  updateThePlan,
  toleadVisitPlan,
  deleteVisitPlan
  } from '@/api/patient/visitplan.js'

export default {
  props: {
    proId: {
      required: true,
      type: [String, Number]
    }
  },
  data () {
    return {
      visitfrom: {},
      formInline: {},
      vno: {
        no: '',
        isones: true
      },
      updataState: false,
      visible: false,
      planList: [],
      genrelist: [
        {
          name: '基线入组时间',
          timePointName: 0,
          timePointNo: 0
        }
      ],
      form: {},
      loading: true,
      // diffList: [],
      memberLoading: false,
      // table
      data: [],
      columns: [
        {
          title: '流程序号',
          dataIndex: 'no',
          key: 'no',
          align: 'center',
          fixed: 'left',
          width: 80,
          scopedSlots: { customRender: 'no' }
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
          fixed: 'left',
          width: 100,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '内容',
          dataIndex: 'content',
          key: 'content',
          align: 'center',
          width: 900,
          scopedSlots: { customRender: 'content' }
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '访视窗口期',
          dataIndex: 'numb',
          key: 'numb',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'numb' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          align: 'center',
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          width: 100,
          fixed: 'right',
          scopedSlots: { customRender: 'operation' }
        }
      ]
    }
  },
  mounted () {
    this.getVisitList()
  },
  methods: {
    // 内容中时间限制
    maxNumber (text) {
      let Max = 0
      switch (Number(text.mainUnit)) {
        case 1:
          switch (Number(text.complementaryUnit)) {
            case 1:
              Max = Number(text.mainNumber)
              break
            case 2:
              Max = Number(text.mainNumber) * 30
              break
            case 3:
              Max = Number(text.mainNumber) * 30 * 24
              break
          }
          break
        case 2:
          switch (Number(text.complementaryUnit)) {
            case 2:
              Max = Number(text.mainNumber)
              break
            case 3:
              Max = Number(text.mainNumber) * 24
              break
          }
          break
        case 3:
          Max = Number(text.mainNumber)
          break
      }
      return Max
    },
    yearList (text) {
      let mouthList = []
      switch (Number(text.mainUnit)) {
        case 1:
          mouthList = [{ name: '月', value: 1 }, { name: '天', value: 2 }, { name: '小时', value: 3 }]
          break
        case 2:
          mouthList = [{ name: '天', value: 2 }, { name: '小时', value: 3 }]
          break
        case 3:
          mouthList = [{ name: '小时', value: 3 }]
          break
      }
      return mouthList
    },
    // 导入访视计划
    beforeUpload () {
      return false
    },
    handleImport (file) {
      const params = new FormData()
      params.append('file', file)
      params.append('proId', this.proId)
      return toleadVisitPlan(params).then(res => {
        this.getVisitList()
        this.$notification.success({
          message: file.name,
          description: '上传成功'
        })
        this.$refs.table.refresh(true)
      }).finally(() => {
        this.$refs.import.sFileList = []
      })
    },
    // 导出访视计划
    derive () {
      const parseParams = (url, params) => {
        const paramsArray = []
        Object.keys(params).forEach(key => params[key] && paramsArray.push(`${key}=${params[key]}`))
        if (url.search(/\?/) === -1) {
          url += `?${paramsArray.join('&')}`
        } else {
          url += `&${paramsArray.join('&')}`
        }
        return url
      }
      const baseUrl = '/api'
      const api = '/boss/project/manage/visit/export'
      const fullUrl = baseUrl + api
      console.log(fullUrl)
      const dealUrl = parseParams(fullUrl, { proId: this.proId, vno: this.vno.no })
      console.log({ proId: this.$route.query.id })
      window.open(dealUrl, '_self')
    },
    // 访视窗口期
    isNumb (item) {
      const ftem = item.content
      let firstUnit = ''
      let afterUnit = ''
      switch (Number(ftem.mainUnit)) {
        case 1:
          firstUnit = '月'
          break
        case 2:
          firstUnit = '天'
          break
        case 3:
          firstUnit = '小时'
          break
      }
      switch (Number(ftem.complementaryUnit)) {
        case 1:
          afterUnit = '月'
          break
        case 2:
          afterUnit = '天'
          break
        case 3:
          afterUnit = '小时'
          break
      }
      let showVisitContent = ''
      if (ftem.mainNumber && firstUnit && !ftem.complementaryNumber && item.type === '2') {
        showVisitContent = (ftem.mainNumber + firstUnit).toString()
        console.log(1)
        return showVisitContent
      }
      if (ftem.complementaryNumber && item.type === '2') {
        showVisitContent = (ftem.mainNumber + firstUnit + '±' + ftem.complementaryNumber + afterUnit).toString()
        console.log(2)
        return showVisitContent
      }
      if (ftem.mainNumber && firstUnit && !ftem.complementaryNumber && item.type === '1') {
        console.log(3)
        return '1天'
      }
      if (ftem.complementaryNumber && item.type === '1') {
        const compNumber = Number(ftem.complementaryNumber) * 2
        switch (Number(ftem.complementaryUnit)) {
          case 1:
            showVisitContent = (compNumber * 30 + 1) + '天'
            break
          case 2:
            showVisitContent = (compNumber + 1) + '天'
            break
          case 3:
            const yu = compNumber % 24 ? compNumber + '小时' : ''
            showVisitContent = ((parseInt(compNumber / 24) + 1) + '天') + yu
            break
        }
        console.log(4)
        return showVisitContent
      }
    },
    // 删除当前访视计划
    deleteVisit (id) {
      deleteVisitPlan({ vid: id })
      .then((res) => {
        console.log(res)
        this.getVisitList()
        this.$message.success('访视版本删除成功')
      })
      .catch((row) => {
        console.log(row)
        this.getVisitList()
        this.$message.error('访视版本删除失败')
      })
    },
    // 获取版本列表
    getVisitList () {
      this.memberLoading = true
      visitPlanList({ proId: this.proId }).then(res => {
        console.log(res)
        this.planList = res
        if (res && res.length) {
          this.vno.no = res[0].no
          this.data = []
          this.getlist()
        }
        this.memberLoading = false
      })
      .catch((row) => {
        console.log(row)
        this.memberLoading = false
        this.$message.error('版本列表请求失败')
        this.data = []
        this.getlist()
      })
    },
    // 新增版本
    addPlan () {
      if (!this.visitfrom.visitName) {
        this.$message.error('版本名称不得为空')
      } else {
        addVisitPlan({ name: this.visitfrom.visitName, proId: this.proId, status: -1 })
        .then(() => {
          this.$message.success('新增版本成功')
          this.visitfrom.visitName = ''
          this.visible = false
          this.getVisitList()
        }).catch(() => {
          this.$message.error('新增版本失败')
          this.getVisitList()
        })
      }
    },
    // 切换
    callback (key) {
      this.planList.forEach(item => {
        if (item.id === key) {
          this.vno.no = item.no
        }
      })
      this.getlist()
      this.data = []
    },
    // 启用
    onChange (e) {
      this.memberLoading = true
      updateVisitStatus({ vid: e.id })
      .then(() => {
        this.memberLoading = false
        this.getVisitList()
        this.$message.success('当前版本状态修改成功')
      })
      .catch(() => {
        this.$message.error('当前版本状态修改失败')
        this.memberLoading = false
      })
    },
    // 新增
    newMember () {
      this.updataState = true
      const length = this.data.length
      this.data.push({
        id: length === 0 ? '1' : (length + 1).toString(),
        no: length === 0 ? '1' : (length + 1).toString(),
        // no: length === 0 ? '1' : (Number(this.data[length - 1].id) + 1).toString(),
        name: '',
        content: {
          genre: '',
          timeEnd: '',
          mainNumber: '',
          mainUnit: '',
          complementaryNumber: '',
          complementaryUnit: ''
        },
        type: '1',
        numb: '',
        remark: '',
        editable: true,
        isNew: true
      })
    },
    // 删除
    remove (value) {
      if (value.isNew) {
        this.updataState = false
        const newData = this.data.filter((item) => item.id !== value.id)
        this.data = newData
        if (this.data && this.data.length) {
          this.data.forEach((item, index) => {
            item.no = index + 1
          })
        }
      } else {
        this.memberLoading = true
        deleteThePlan({ id: value.id })
        .then(res => {
          this.memberLoading = false
          const newData = this.data.filter((item) => item.id !== value.id)
          this.data = newData
          console.log(res)
          this.$message.success('删除成功')
          this.getlist()
        })
        .catch(() => {
          this.$message.error('删除失败')
           this.memberLoading = false
        })
      }
    },
    // 编辑row
    toggle (id) {
      this.updataState = true
      console.log(id)
      const target = this.data.find((item) => item.id === id)
      // console.log(target)
      target._originalData = { ...target }
      target._originalData.content = { ...target.content }
      target._originalData.contentValue = { ...target.contentValue }
      target.editable = !target.editable
      // console.log(this.diffList, target)
    },
    // 获取访视计划
    getlist () {
      this.memberLoading = true
      planTheList({ proId: this.proId, vno: this.vno.no })
      .then(res => {
        console.log(res)
        this.memberLoading = false
        this.genrelist = [
          {
            name: '基线入组时间',
            no: 0
          },
          ...res
        ]
        // if (this.data && this.data.length) {
        //   this.data.forEach((item, indexs) => {
        //     res.forEach((ftem, index) => {
        //       if (item.name === ftem.name && !item.isNew && !item.editable) {
        //         let thegenre = ''
        //         console.log(item)
        //         if (item.content.genre) {
        //           thegenre = item.content.genre
        //         } else if ((Number(item.timePointNo) === 0 && Number(item.timePointName) === 0) || (item.contentValue && item.contentValue.timePointName === '0' && item.contentValue.timePointNo === '0')) {
        //           thegenre = 0
        //         } else if (item.contentValue && item.contentValue.timePointName !== '0' && item.contentValue.timePointNo !== '0') {
        //           this.genrelist.forEach((items, index) => {
        //             if (items.no === item.contentValue.timePointNo) {
        //               thegenre = index
        //             }
        //           })
        //         }
        //         item.content = {
        //           complementaryNumber: ftem.afterAccessFre ? ftem.afterAccessFre : '',
        //           complementaryUnit: ftem.afterAccessFreUnit ? ftem.afterAccessFreUnit : '',
        //           genre: thegenre,
        //           timeEnd: ftem.timePointType ? ftem.timePointType.toString() : '',
        //           mainNumber: ftem.firstAccessFre ? ftem.firstAccessFre : '',
        //           mainUnit: ftem.firstAccessFreUnit ? ftem.firstAccessFreUnit.toString() : ''
        //         }
        //         item.id = ftem.id
        //         item.name = ftem.name
        //         item.no = index + 1
        //         item.numb = ''
        //         item.remark = ftem.des ? ftem.des : ''
        //         item.type = ftem.timeType.toString()
        //         item.contentValue = ftem
                // item = {
                //   content: {
                //     complementaryNumber: ftem.afterAccessFre ? ftem.afterAccessFre : '',
                //     complementaryUnit: ftem.afterAccessFreUnit ? ftem.afterAccessFreUnit : '',
                //     genre: thegenre,
                //     timeEnd: ftem.timePointType ? ftem.timePointType.toString() : '',
                //     mainNumber: ftem.firstAccessFre ? ftem.firstAccessFre : '',
                //     mainUnit: ftem.firstAccessFreUnit ? ftem.firstAccessFreUnit.toString() : ''
                //   },
                //   id: ftem.id,
                //   name: ftem.name,
                //   no: index + 1,
                //   numb: '',
                //   remark: ftem.des ? ftem.des : '',
                //   type: ftem.timeType.toString(),
                //   isNew: ftem.isNew,
                //   editable: ftem.editable,
                //   contentValue: ftem
                // }
          //       console.log(item)
          //     }
          //   })
          // })
          // console.log(this.data)
        // } else {
          this.data = []
          res.forEach((item, index) => {
            let thegenre = ''
            if (Number(item.timePointNo) === 0) {
              thegenre = 0
            } else {
              this.genrelist.forEach((items, index) => {
                if (items.no === item.timePointNo) {
                  thegenre = index
                }
              })
            }
            this.data.push({
              content: {
                complementaryNumber: item.afterAccessFre ? item.afterAccessFre : '',
                complementaryUnit: item.afterAccessFreUnit ? item.afterAccessFreUnit : '',
                genre: thegenre,
                timeEnd: item.timePointType ? item.timePointType.toString() : '',
                mainNumber: item.firstAccessFre ? item.firstAccessFre : '',
                mainUnit: item.firstAccessFreUnit ? item.firstAccessFreUnit.toString() : ''
              },
              id: item.id,
              name: item.name,
              no: index + 1,
              numb: '',
              remark: item.des ? item.des : '',
              type: item.timeType.toString(),
              contentValue: item,
              isNew: false,
              editable: false
            })
          })
          console.log(this.data)
        // }
        this.$forceUpdate()
      })
      .catch((row) => {
        console.log(row)
        this.memberLoading = false
        this.$message.error('列表获取失败')
      })
      if (this.data && this.data.length) {
        this.data.forEach((item, index) => {
          item.no = index + 1
        })
      }
    },
    // 数据验证
    dataValidation (thisValue) {
      console.log(thisValue)
      if (!thisValue.name) {
        this.$message.error('名字不可为空')
        return false
      }
      if (!thisValue.content.genre && thisValue.content.genre !== 0) {
        this.$message.error('请将内容补充完整')
        return false
      }
      if (thisValue.content.genre !== 0) {
        if (!thisValue.content.timeEnd || !thisValue.content.mainNumber || !thisValue.content.mainUnit) {
          this.$message.error('请将内容补充完整')
          return false
        }
      }
      if (thisValue.content.genre === 0 && thisValue.content.timeEnd) {
        if (!thisValue.content.mainNumber || !thisValue.content.mainUnit) {
          this.$message.error('请将内容补充完整')
          return false
        }
      }
      if (!thisValue.type) {
        this.$message.error('类型不可为空')
        return false
      } else {
        return true
      }
    },
    // row保存
    saveRow (record) {
      let repetition = true
      repetition = this.dataValidation(record)
      if (repetition) {
        if (record.isNew) {
          this.memberLoading = true
          const value = {
            name: record.name,
            timePointName: this.genrelist[record.content.genre].name === '基线入组时间' ? 0 : this.genrelist[record.content.genre].name,
            timePointNo: this.genrelist[record.content.genre].no,
            timeType: record.type,
            visitVersionNo: this.vno.no,
            proId: this.proId
            // timePointType: record.content.timeEnd,
            // firstAccessFre: record.content.mainNumber,
            // firstAccessFreUnit: record.content.mainUnit,
            // afterAccessFre: record.content.complementaryNumber,
            // afterAccessFreUnit: record.content.complementaryUnit,
            // des: record.remark
          }
          if (record.content.timeEnd) {
            value.timePointType = record.content.timeEnd
          }
          if (record.content.mainNumber) {
            value.firstAccessFre = record.content.mainNumber
          }
          if (record.content.mainUnit) {
            value.firstAccessFreUnit = record.content.mainUnit
          }
          if (record.content.complementaryNumber && record.content.complementaryUnit) {
            value.afterAccessFre = record.content.complementaryNumber
          }
          if (record.content.complementaryNumber && record.content.complementaryUnit) {
            value.afterAccessFreUnit = record.content.complementaryUnit
          }
          if (record.remark) {
            value.des = record.remark
          }
          console.log(value)
          addThePlan({ ...value })
          .then((res) => {
            this.updataState = false
            this.memberLoading = false
            this.$message.success('添加成功')
            console.log(res)
            record.editable = false
            record.isNew = false
            this.getlist()
          })
          .catch((err) => {
            console.log(err)
            this.getlist()
            this.$message.error('添加失败')
            this.memberLoading = false
          })
        } else {
          const value = {
            id: record.id,
            name: record.name,
            timePointName: this.genrelist[record.content.genre].name === '基线入组时间' ? 0 : this.genrelist[record.content.genre].name,
            timePointNo: this.genrelist[record.content.genre].no,
            visitVersionNo: this.vno.no,
            proId: this.proId,
            timeType: record.type
            // timePointType: record.content.timeEnd,
            // firstAccessFre: record.content.mainNumber,
            // firstAccessFreUnit: record.content.mainUnit,
            // afterAccessFre: record.content.complementaryNumber,
            // afterAccessFreUnit: record.content.complementaryUnit,
            // des: record.remark
          }
          if (record.content.timeEnd) {
            value.timePointType = record.content.timeEnd
          }
          if (record.content.mainNumber) {
            value.firstAccessFre = record.content.mainNumber
          }
          if (record.content.mainUnit) {
            value.firstAccessFreUnit = record.content.mainUnit
          }
          if (record.content.complementaryNumber && record.content.complementaryUnit) {
            value.afterAccessFre = record.content.complementaryNumber
          }
          if (record.content.complementaryNumber && record.content.complementaryUnit) {
            value.afterAccessFreUnit = record.content.complementaryUnit
          }
          if (record.remark) {
            value.des = record.remark
          }
          console.log(value)
          this.memberLoading = true
          updateThePlan({ ...value })
          .then(res => {
            this.updataState = false
            this.memberLoading = false
            console.log(res)
            this.data.forEach(item => {
              if (item.id === record.id) {
                item.editable = false
              }
            })
            this.getlist()
            this.$message.success('修改成功')
          })
          .catch(() => {
            this.memberLoading = false
            this.getlist()
            this.$message.errror('修改失败')
          })
        }
      }
    },
    // 取消
    cancel (id) {
      const target = this.data.find((item) => item.id === id)
      Object.keys(target).forEach((id) => {
        target[id] = target._originalData[id]
      })
      this.updataState = false
      target._originalData = undefined
    }
  }
}
</script>
