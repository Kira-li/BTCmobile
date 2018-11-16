<template>
  <div>
    <common-header :tittle="tittle" :showback="false"></common-header>
    <div class="page-content">
      <!-- <mt-button @click="todetail">user</mt-button> -->
      <div class="user-nav">
        <div class="user-avt"><p><i class="icon iconfont icon-tab2"></i></p></div>
        <div class="user-id"><mt-button>ID：{{userId}}</mt-button></div>
        <div class="user-account">账户余额：{{userMoney}}</div>
        <div class="user-money">
            <mt-button class="user-despoit" @click="toDespot">收益</mt-button>
            <mt-button class="user-buy" @click="toBuy">购买</mt-button>
        </div>
      </div>
    </div>
    <ul class="user-option">
        <li class="clearfix" @click="toMessage(1)"><p><i class="icon iconfont icon-xiaoxizhongxin"></i><span>消息中心</span></p><div><i class="icon iconfont icon-arrow-right"></i></div></li>
        <li class="clearfix" @click="toMessage(2)"><p><i class="icon iconfont icon-qunfengjiaoyijilu"></i><span>操盘记录</span></p><div><i class="icon iconfont icon-arrow-right"></i></div></li>
        <li class="clearfix" @click="toMessage(3)"><p><i class="icon iconfont icon-mingxi"></i><span>资金明细</span></p><div><i class="icon iconfont icon-arrow-right"></i></div></li>
        <li class="clearfix" @click="toMessage(4)"><p><i class="icon iconfont icon-bangzhuzhongxin"></i><span class="user-help">帮助中心与教程</span></p><div><i class="icon iconfont icon-arrow-right"></i></div></li>
        <li class="clearfix" @click="toMessage(5)"><p><i class="icon iconfont icon-jiaoyijilu"></i><span class="user-help">新手攻略</span></p><div><i class="icon iconfont icon-arrow-right"></i></div></li>
        <li class="clearfix" @click="toMessage(6)"><p><i class="icon iconfont icon-shezhi"></i><span>设置中心</span></p><div><i class="icon iconfont icon-arrow-right"></i></div></li>
    </ul>
    <div class="user-exit"><mt-button @click="exit">退出登录</mt-button></div>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui'
import {mapMutations, mapGetters, mapState} from 'vuex'
import commonHeader from 'common/common-header'
import { getUserAccount, getUserInfo } from '../../api/user-api.js'
export default {
  data () {
    return {
      tittle: '我的',
      num: 0,
      userId: 10064,
      userMoney: 100
    }
  },
  created() {},
  activated () {
    this.getUsermes()
    // console.log(this.userId)
  },
  methods: {
    ...mapMutations({
      setNum: 'SET_NUM'
    }),
    getUsermes() {
      let params = {}
      getUserAccount(params).then((res) => {
        // console.log(res)
        if (res.code === 200) {
          this.userMoney = parseInt(res.data.account.amount)
        }
      })
      let params1 = {}
      getUserInfo(params1).then((res) => {
        // console.log(res.data.user)
        if (res.code === 200) {
          this.userId = res.data.user.userid
        }
      })
    },
    toBuy () {
      this.$router.togo('/mine/buy')
    },
    toDespot () {
      this.$router.togo('/mine/despoit')
    },
    toMessage (index) {
      // this.$router.togo('/mine/message')
      switch (index) {
        case 1:
          this.$router.togo('/mine/message')
          break
        case 2:
          this.$router.togo('/mine/record')
          break
        case 3:
          this.$router.togo('/mine/fund')
          break
        case 4:
          this.$router.togo('/mine/help')
          break
        case 5:
          this.$router.togo('/mine/newHand')
          break
        case 6:
          this.$router.togo('/mine/setting')
          break
      }
    },
    exit () {
      MessageBox({
        title: '提示',
        message: '确定退出账号登录？',
        showCancelButton: true
      }).then(action => {
        if (action === 'confirm') {
          // this.$router.push({path: '/regesiter', query: {mobile: this.username}})
          localStorage.removeItem('token')
          this.$router.togo('/home')
        }
      })
    }
  },
  components: {
    commonHeader
  },
  computed: {
    ...mapGetters([
      'number'
    ]),
    ...mapState({
      number: state => state.home.number
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "~styles/index.less";
@import "~styles/variable.less";
.user-nav {
    background: #248ad2;
    border-top: 1px solid #d7d7d7;
    padding: 20px 0;
    div {
        margin-top: 10px;
    }
    .user-avt {
        text-align: center;
        margin: 0 auto;
        p {
            margin: 0 auto;
            height: 1rem;
            width: 1rem;
            border-radius: 50%;
            background: #d7d7d7;
            text-align: center;
            i {
                font-size: 30px;
            }
        }
    }
    .user-id {
        text-align: center;
        button {
            width: 4rem;
            height: 0.6rem;
            border-radius: 10px;
            background: #248ad2;
            border: 0;
            color: #fff;
        }
    }
    .user-account {
        text-align: center;
        font-size: 14px;
        color: #fff;
    }
    .user-money {
        text-align: center;
        .user-despoit {
            border:1px solid #d7d7d7;
            color: #fff;
            background: #248ad2;
            width: 2rem;
            height: 0.8rem;
            margin-right: 0.8rem;
        }
        .user-buy {
            background: red;
            color: #fff;
            width: 2rem;
            height: 0.8rem;
        }
    }
}
.user-option {
    background: #fff;
    padding: 0 5%;
    li {
        border-bottom: 1px solid#d7d7d7;
        height: 1.2rem;
        line-height: 1.2rem;
        position: relative;
        p {
            position: absolute;
            top: 0;
            left: 0;
        }
        div {
            position: absolute;
            top: 0;
            right: 0;
        }
        span {
            font-size: 16px;
            margin-left: 10px;
        }
    }
    :last-child {
        border: 0;
    }
    .icon-xiaoxizhongxin {
        color: red;
        font-size: 24px;
    }
    .icon-qunfengjiaoyijilu {
        color: #22e5fc;
        font-size: 24px;
    }
    .icon-mingxi {
        color: #cc8dff;
        font-size: 24px;
    }
    .icon-bangzhuzhongxin {
        color: #fd7a70;
        font-size: 24px;
        position: absolute;
        top: 0px;
        left: -8px;
    }
    .icon-jiaoyijilu {
      color: #f3a51d;
      font-size: 28px;
      position: absolute;
      top: 0px;
      left: -6px;
    }
    .user-help {
        position: absolute;
        top: 0px;
        left: 22px;
        width: 4rem;
    }
    .icon-shezhi {
        color: #6395ee;
        font-size: 24px;
    }
}
.user-exit {
  text-align: center;
  margin-top: 20px;
  button {
    height: 1rem;
    background: #248ad2;
    color: #fff;
    width: 120px;
  }
}
</style>
