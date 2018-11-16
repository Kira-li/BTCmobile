<template>
  <div>
    <!-- <common-header :tittle="tittle" :showmore="true"></common-header> -->
    <ul>
        <li class="login-phone">
            <div class="clearfix">
              <p><i class="icon iconfont icon-tel" ></i></p>
              <input type="text" placeholder="请输入手机号" v-model="username">
            </div>
        </li>
        <li class="login-pwd">
          <div class="clearfix">
              <p><i class="icon iconfont icon-mima" ></i></p>
              <input type="password" placeholder="请输入密码" v-model="userpwd">
            </div>
        </li>
        <li class="login-fgt clearfix">
          <div><input type="checkbox" v-model="checkState" @click="remberPwd"><span>记住密码</span></div><p @click="tofgtpwd">忘记密码？</p>
        </li>
        <li class="login-btn">
          <input type="button" value="登录" @click="login">
        </li>
        <li class="login-reg clearfix">
          <div @click="toRegesiter">快速注册</div>
          <p @click="toMeslogin">短信验证登录</p>
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
      username: '',
      userpwd: '',
      checkState: true
    }
  },
  mounted () {
    this.username = JSON.parse(window.decodeURIComponent(window.atob(window.localStorage.getItem('user')))).phoneno
    if (window.localStorage.getItem('ischeck') === 'false') {
      this.checkState = false
      this.userpwd = ''
    } else {
      this.userpwd = JSON.parse(window.decodeURIComponent(window.atob(window.localStorage.getItem('user')))).password
    }
  },
  methods: {
    login () {
      if (this.username) {
        if (isMobile(this.username)) {
          let params = {phoneno: this.username}
          userApi.checkMobile(params).then((res) => {
            if (res.data.isexsit) {
              if (this.userpwd) {
                let loginParams = {
                  phoneno: this.username,
                  password: this.userpwd
                }
                userApi.login(loginParams).then((res) => {
                  if (res.code === 200) {
                    Toast('登录成功')
                    window.localStorage.setItem('token', res.data.token)
                    window.localStorage.setItem('user', window.btoa(unescape(window.encodeURIComponent(JSON.stringify(loginParams)))))
                    // window.localStorage.setItem('user', JSON.stringify(loginParams))
                    this.$router.togo('/home')
                  } else {
                    Toast(res.msg)
                  }
                })
              } else {
                Toast('密码不正确')
              }
            } else {
              MessageBox({
                title: '提示',
                message: '手机号未注册，请前往注册',
                showCancelButton: true
              }).then(action => {
                if (action === 'confirm') {
                  this.$router.push({path: '/regesiter', query: {mobile: this.username}})
                }
              })
            }
          })
        } else {
          Toast('手机号格式不正确')
        }
      } else {
        Toast('手机号不能为空')
      }
    },
    remberPwd () {
      this.checkState = !this.checkState
      window.localStorage.setItem('ischeck', this.checkState)
    },
    toRegesiter () {
      this.$router.togo('/regesiter')
    },
    toMeslogin () {
      this.$router.togo('/mesLogin')
    },
    tofgtpwd () {
      this.$router.togo('/fgtpwd')
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
  }
  .login-fgt {
    p {
      font-size: 14px;
      color: #666666;
      text-indent: 10px;
      float: right;
      margin-right: 10px;
    }
    div {
      float: left;
      font-size: 14px;
      margin-left: 10px;
      color: #666666;
      input {
        float: left;
        height: 18px;
        width: 18px;
      }
      span {
        float: left;
        margin-left: 5px;
      }
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
