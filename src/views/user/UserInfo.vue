<template>
  <page-header-wrapper @back="() => this.$router.go(-1)">
    <a-card>
      <a-row :gutter="16" type="flex" justify="center">
        <a-col :order="1" :md="24" :lg="6" :style="{ minHeight: '180px' }">
          <div class="ant-upload-preview" @click="$refs.modal.edit(1)" >
            <a-icon type="cloud-upload-o" class="upload-icon"/>
            <div class="mask">
              <a-icon type="plus" />
            </div>
            <img width="100px" height="100px" :src="headImage | dealImageUrl"/>
          </div>
        </a-col>
        <a-col :order="1" :md="12" :lg="9">
          <a-form layout="vertical" :form="form">
            <a-descriptions title="账户信息" />
            <a-form-item
              label="用户名"
            >
              <a-input
                placeholder="请输入用户名"
                v-decorator="[
                  `userName`,
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入用户名',
                      },
                    ],
                  },
                ]" />
            </a-form-item>

            <div class="bind-container">
              <div style="flex: 1; display: flex; flex-direction: column;">
                <span class="bind-title">邮箱</span>
                <span class="bind-content" v-if="email == null || email.length == 0">未绑定</span>
                <span class="bind-content" v-else>{{ email }}</span>
              </div>
              <a v-if="phone == null || phone.length == 0" @click="clickBindEmail()">绑定</a>
              <a v-else @click="clickBindEmail()">修改绑定</a>
            </div>

            <div class="bind-container">
              <div style="flex: 1; display: flex; flex-direction: column;">
                <span class="bind-title">手机号</span>
                <span class="bind-content" v-if="phone == null || phone.length == 0">未绑定</span>
                <span class="bind-content" v-else>{{ phone }}</span>
              </div>
              <a v-if="phone == null || phone.length == 0" @click="clickBindPhone()">绑定</a>
              <a v-else @click="clickBindPhone()">修改绑定</a>
            </div>

            <a-descriptions title="基本信息" />
            <a-form-item
              label="姓名"
            >
              <a-input
                placeholder="请输入姓名"
                v-decorator="[
                  `name`,
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入姓名',
                      },
                    ],
                  },
                ]" />
            </a-form-item>
            <a-form-item
              label="生日"
            >
              <a-date-picker
                v-decorator="[
                  `birthday`,
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择日期',
                      },
                    ],
                  },
                ]">
              </a-date-picker>
            </a-form-item>

            <a-form-item
              label="身份证号"
            >
              <div style="display: flex;">
                <a-input
                  placeholder="请输入身份证号"
                  v-decorator="[
                    `idCard`,
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入身份证号',
                        },
                      ],
                    },
                  ]" />
                <a-button type="primary" v-if="verifiedStatus != 1" style="margin-left:15px" @click="handleCancelAuth(true)">实名认证</a-button>
              </div>
            </a-form-item>

            <a-form-item>
              <a-button type="primary" style="margin-right: 15px" @click="clickSave()">保存</a-button>
              <a-button type="default" @click="() => this.$router.go(-1)">返回</a-button>
            </a-form-item>
          </a-form>

        </a-col>
        <a-col :order="1" :md="12" :lg="9">
        </a-col>
      </a-row>

      <avatar-modal ref="modal" @ok="setavatar"/>
      <bind-modal
        ref="bindModal"
        title="绑定邮箱"
        @cancel="handleBindCancel"
        @submit="handleBindOk">
      </bind-modal>
      <edit-phone
        ref="bindPhoneModal"
        title="绑定手机号"
        @cancel="handlePhoneCancel"
        @submit="handlePhoneOk">
      </edit-phone>
      <AuthModal :visible="authVisible" @handleCancel="handleAuthSuccess" :info="user" />

    </a-card>
  </page-header-wrapper>

</template>

<script>
import AvatarModal from './AvatarModal'
import { baseMixin } from '@/store/app-mixin'
import { bindEmail, bindPhone } from '@/api/login'
import { updateUser, getUserDetail } from '@/api/system/user'
import moment from 'moment'
import BindModal from './BindModal.vue'
import EditPhone from './EditPhone.vue'
import AuthModal from './AuthModal'

export default {
  mixins: [baseMixin],
  components: {
    AvatarModal,
    BindModal,
    EditPhone,
    AuthModal
  },
  data () {
    return {
      form: null,
      userId: null,
      account: null,
      roleId: null,
      headImage: null,
      email: null,
      phone: null,
      verifiedStatus: null,
      authVisible: false,
      user: null
    }
  },
  mounted () {
    this.form = this.$form.createForm(this)
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      getUserDetail().then(res => {
        this.form.setFieldsValue({
          userName: res.userName,
          name: res.name,
          idCard: res.idCard,
          birthday: moment(res.birthday || '', 'YYYY-MM-DD')
        })
        this.userId = res.id
        this.account = res.account
        this.roleId = res.roleId
        this.phone = res.phone
        this.email = res.email
        this.headImage = res.headimg
        this.verifiedStatus = res.verifiedStatus
        this.user = res
      })
    },
    clickBindEmail () {
      this.$refs.bindModal.visible = true
    },
    handleBindCancel () {
      this.$refs.bindModal.visible = false
    },
    handleBindOk () {
      const form = this.$refs.bindModal.form
      form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          bindEmail(values).then(res => {
            this.$message.success('操作成功！')
            this.$refs.bindModal.visible = false
            this.getUserInfo()
          })
        }
      })
    },
    clickBindPhone () {
      this.$refs.bindPhoneModal.visible = true
    },
    handlePhoneCancel () {
      this.$refs.bindPhoneModal.visible = false
    },
    handlePhoneOk () {
      const form = this.$refs.bindPhoneModal.form
      form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          bindPhone(values).then(res => {
            this.$message.success('操作成功！')
            this.$refs.bindPhoneModal.visible = false
            this.getUserInfo()
          })
        }
      })
    },
    clickSave () {
      this.form.validateFields((err, values) => {
        if (!err) {
          updateUser({
            id: this.userId,
            account: this.account,
            roleId: this.roleId,
            userName: values.userName,
            name: values.name,
						phone: this.phone,
            idCard: values.idCard,
            birthday: values.birthday.format('YYYY-MM-DD'),
            headimg: this.headImage
          }).then(res => {
            this.$message.success('保存成功')
            this.$store.dispatch('UpdateNickname', values.name)
            this.$store.dispatch('UpdateAvatar', this.headImage)
          })
        }
      })
    },
    setavatar (url) {
      console.log('$$$$$$ 上传图片 $$$$$$', url)
      this.headImage = url
    },
    handleAuthSuccess () {
      this.isEdit = true
      this.getUserInfo()
      this.handleCancelAuth()
    },
    handleCancelAuth (flag = false) {
      this.authVisible = flag
    }
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }

  .bind-container {
    display: flex;
    align-items: center;
    padding-bottom: 30px;

    .bind-title {
      font-size: 14px;
      margin-bottom: 10px;
      color: #333333;
    }

    .bind-content {
      font-size: 14px;
      color: #999999;
    }

  }

</style>
