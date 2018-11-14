<template>
  <div>
    <!-- <common-header :tittle="tittle" :showmore="true"></common-header> -->
    <ul>
        <li class="login-phone">
            <div class="clearfix">
              <p><i class="icon iconfont icon-tel" ></i></p>
              <input type="text" placeholder="请输入手机号" v-model="phone">
            </div>
        </li>
        <li class="login-pwd">
          <div class="clearfix">
            <p><i class="icon iconfont icon-im_yanzhengma" ></i></p>
            <input type="text" placeholder="请输入手机验证码" v-model="smsCode">
            <input type="button"  v-model="txtSendButton" @click="getCode" :disabled='!isSend'>
          </div>
        </li>
        <li class="login-btn">
          <input type="button" value="登录" @click="toLogin">
        </li>
    </ul>
  </div>
</template>

<script>
import { Toast, MessageBox } from 'mint-ui'
import * as userApi from '../api/user-api'
import { isMobile } from '../filter/index'
export default {
  data () {
    return {
      tittle: '详情',
      phone: '',
      smsCode: '',
      txtSendButton: '发送验证码',
      waitTime: 0,
      isSend: true
    }
  },
  // components: {
  //   commonHeader
  // },
  methods: {
    tohome () {
      this.$router.goBack()
    },
    updateWaitTime () {
      if (this.waitTime === 0) {
        this.waitTime = 0
        this.isSend = true
        this.txtSendButton = '发送验证码'
      } else {
        --this.waitTime
        this.txtSendButton = `${this.waitTime}s重新获取`
        window.setTimeout(this.updateWaitTime, 1000)
      }
    },
    getCode () {
      // this.isSend = false
      if (this.phone) {
        if (isMobile(this.phone)) {
          let params = {phoneno: this.phone}
          userApi.checkMobile(params).then((res) => {
            if (res.data.isexsit) {
              userApi.getValidCode(params).then((res) => {
                this.isSend = false
                this.waitTime = 120
                this.updateWaitTime()
              })
            } else {
              MessageBox({
                title: '提示',
                message: '手机号未注册，请前往注册',
                showCancelButton: true
              }).then(action => {
                if (action === 'confirm') {
                  this.$router.push({path: '/regesiter', query: {mobile: this.phone}})
                }
              })
            }
          })
        } else {
          Toast('手机号码格式错误')
        }
      } else {
        Toast('手机号码不能为空')
      }
    },
    toLogin () {
      let params = {
        phoneno: this.phone,
        validcode: this.smsCode
      }
      userApi.loginByValidCode(params).then((res) => {
        if (res.code === 200) {
          Toast('登录成功')
          this.$router.togo('/home')
        } else {
          Toast(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import "~styles/index.less";
@import "~styles/variable.less";
ul {
  margin-top: 5rem;
  li {
    width: 80%;
    margin-left: 10%;
  }
  .login-phone,.login-pwd {
    margin-bottom: 0.6rem;
    div {
      display: flex;
    }
    p,input {
      float: left;
    }
    p {
      background: #d7d7d7;
      height: 1rem;
      width: 1rem;
      line-height: 1rem;
    }
    i {
      font-size: 24px;
      margin-left: 8px;
    }
    input {
      border:1px solid #d7d7d7;
      flex: 1;
      padding: 10px;
    }
    input[type='button'] {
        background: #248ad2;
        color: #fff;
    }
  }
  .login-fgt {
    p {
      font-size: 16px;
      color: #666666;
      text-indent: 10px;
    }
  }
  .login-btn {
    margin-top: 0.8rem;
    margin-bottom: 0.6rem;
    input {
      width: 100%;
      background: #248ad2;
      color: #fff;
      height: 1rem;
      line-height: 1rem;
    }
  }
  .login-reg  {
    color: #fb8f00;
    div {
      float: left;
    }
    p {
      float: right;
    }
  }
}

</style>
