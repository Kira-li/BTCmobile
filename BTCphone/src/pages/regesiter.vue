<template>
  <div>
    <!-- <common-header :tittle="tittle" :showmore="true"></common-header> -->
    <ul>
        <li class="reg-phone">
            <div class="clearfix">
              <p><i class="icon iconfont icon-tel" ></i></p>
              <input type="text" placeholder="请输入手机号" v-model="phone">
            </div>
        </li>
        <li class="reg-code">
          <div class="clearfix">
              <p><i class="icon iconfont icon-im_yanzhengma" ></i></p>
              <input type="text" placeholder="请输入手机验证码" v-model="smsCode">
              <input type="button" value="发送验证码" v-model="txtSendButton" @click="getCode" :disabled="isSend">
          </div>
        </li>
        <li class="reg-pwd">
          <div class="clearfix">
              <p><i class="icon iconfont icon-mima" ></i></p>
              <input type="password" placeholder="请输入密码" v-model="pwd">
          </div>
        </li>
        <li class="reg-pwd">
          <div class="clearfix">
              <p><i class="icon iconfont icon-mima" ></i></p>
              <input type="password" placeholder="请确认密码" v-model="repwd">
          </div>
        </li>
        <li class="reg-pwd">
          <div class="clearfix">
              <p><i class="icon iconfont icon-tab2" ></i></p>
              <input type="text" placeholder="请输入邀请码" v-model="inviteCode">
          </div>
        </li>
        <li class="reg-btn">
          <input type="button" value="注册" @click="toRegesiter">
        </li>
        <li class="reg-login">
          <p @click="toLogin">已有账号？立即登录</p>
        </li>
    </ul>
  </div>
</template>

<script>
// import commonHeader from 'common/common-header'
import { Toast } from 'mint-ui'
import * as userApi from '../api/user-api'
import { isMobile } from '../filter/index'
export default {
  data () {
    return {
      tittle: '详情',
      phone: '',
      pwd: '',
      repwd: '',
      smsCode: '',
      txtSendButton: '发送验证码',
      inviteCode: '',
      waitTime: 0,
      isSend: false
    }
  },
  // components: {
  //   commonHeader
  // },
  methods: {
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
          let params = {phoneno: this.phone.toString()}
          userApi.checkMobile(params).then((res) => {
            if (res.data.isexsit) {
              Toast('手机号已注册')
            } else {
              let params = {phoneno: this.phone.toString()}
              userApi.getValidCode(params).then((res) => {
                this.isSend = true
                this.waitTime = 120
                this.updateWaitTime()
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
    toRegesiter () {
      if (this.phone && this.smsCode && this.pwd && this.repwd) {
        let params = {
          phoneno: this.phone,
          validcode: this.smsCode,
          password: this.pwd,
          repassword: this.repwd,
          inviteid: this.inviteCode
        }
        userApi.register(params).then((res) => {
          if (res.code === 200) {
            Toast('注册成功')
            this.$router.togo('/login')
          }
        })
      }
    },
    toLogin () {
      this.$router.togo('/login')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "~styles/index.less";
@import "~styles/variable.less";
ul {
  margin-top: 5rem;
  li {
    width: 80%;
    margin-left: 10%;
  }
  .reg-phone,.reg-pwd,.reg-code {
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
    input[type="button"] {
        background: #248ad2;
        color: #fff;
    }
  }
  .reg-fgt {
    p {
      font-size: 16px;
      color: #666666;
      text-indent: 10px;
    }
  }
  .reg-btn {
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
  .reg-reg  {
    color: #fb8f00;
    div {
      float: left;
    }
    p {
      float: right;
    }
  }
  .reg-login {
    p {
      color: #fb8f00;
      text-align: center;
    }
  }
}

</style>
