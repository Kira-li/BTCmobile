<template>
  <div>
    <common-header :tittle="tittle" :showback="true" :showmore="rightText" @fatherWay = 'sendWay'></common-header>
    <div class="page-content">
      <!-- <mt-button @click="todetail">user</mt-button> -->
      <div class="buy-num">请选择购买数量</div>
      <div class="clearfix pay-list">
        <div v-for="(item,key) in payList" :key="key" class="pay-money" @click="chooseMoney(item.money,item.producttype,item.productname,item.logid)" v-bind:class="{'active': name == item.productname}">
          <!-- <mt-button @click="getPaylist" v-for="(item,key) in payList" :key="key">{{item.productname}}</mt-button> -->
            <div>
              <p>{{item.productname}}<span v-if="item.money">金币</span></p>
              <p v-if="item.money">￥{{item.money}}元</p>
            </div>
        </div>
      </div>
    </div>
    <div class="pay-bg" v-if="isPay" @click="isPay = false">
      <div v-if="isKeyborad" class="pay-keyborad"><keyborad @sendValue = 'getValue'></keyborad></div>
      <div class="pay-way" v-if="isOther">
        <div class="pay-realise clearfix">
          <div>请选择支付方式</div>
          <p>实际付款金额：<span>{{realiseMoney}}</span></p>
        </div>
        <ul v-for="(item,key) in payWay" :key="key">
          <li v-if="item.paytype ===1" class="clearfix">
            <p><i class="icon iconfont icon-zhifubao-copy"></i><span>支付宝支付</span></p>
            <div @click.stop ="chooseWay(item.paytype, item.logid)" v-bind:class="{'active': payType == item.paytype}"><img src="../../assets/imgs/check.png"></div>
          </li>
          <li v-if="item.paytype ===2" class="clearfix" >
            <p><i class="icon iconfont icon-weixin"></i><span>微信支付</span></p>
            <div @click.stop ="chooseWay(item.paytype, item.logid)" v-bind:class="{'active': payType == item.paytype}"><img src="../../assets/imgs/check.png"></div>
          </li>
          <li v-if="item.paytype ===3" class="clearfix">
            <p><img src="../../assets/imgs/bank.png" class="pay-bank"><span>银行卡支付</span></p>
            <div @click.stop ="chooseWay(item.paytype, item.logid)" v-bind:class="{'active': payType == item.paytype}"><img src="../../assets/imgs/check.png"></div>
          </li>
        </ul>
        <div class="pay-waybtn">
          <mt-button @click.stop ="createPay">确定充值</mt-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapGetters, mapState} from 'vuex'
import commonHeader from 'common/common-header'
import keyborad from 'common/keyborad'
import * as payApi from '../../api/pay-api.js'
export default {
  data () {
    return {
      tittle: '购买',
      rightText: '购买记录',
      isKeyborad: false,
      isOther: false,
      isPay: false,
      num: 0,
      money: 100,
      name: '',
      paytypeid: '',
      value: '',
      payType: 1,
      logid: '20180607000001',
      realiseMoney: 0,
      payList: [],
      payWay: []
    }
  },
  created() {
    this.getPaylist()
  },
  activated () {
    this.getPaylist()
    // Vue.use(wcKeyBoad)
  },
  methods: {
    ...mapMutations({
      setNum: 'SET_NUM'
    }),
    todetail() {
      this.$router.togo('/Home/Detail')
    },
    getPaylist () {
      let params = {}
      payApi.getPayMoneyConfig(params).then((res) => {
        console.log(res)
        this.payList = res.data.list
      })
    },
    chooseMoney (money, producttype, name, paytypeid) {
      this.name = name
      this.money = money
      this.isPay = true
      this.paytypeid = paytypeid
      if (producttype === 0) {
        this.isOther = true
        this.isKeyborad = false
        let randParams = {money: money.toString()}
        payApi.getPayRand(randParams).then((res) => {
          console.log(res)
          this.realiseMoney = res.data.randmoney
        })
        let typeParams = {}
        payApi.getPayType(typeParams).then((res) => {
          console.log(res)
          this.payWay = res.data.list
        })
      } else {
        this.isKeyborad = true
        this.isOther = false
      }
    },
    chooseWay (paytype, logid) {
      this.payType = paytype
      this.logid = logid
    },
    createPay () {
      let params = {
        paytype: this.payType.toString(),
        paytypeid: this.logid,
        productid: this.paytypeid,
        amount: this.realiseMoney,
        coinamount: this.money.toString()
      }
      payApi.createPayOrder(params).then((res) => {
        // console.log(res)
        // this.$router.togo('/mine/payDetail')
        this.$router.push({path: '/mine/payDetail', query: {imgSrc: res.data.url}})
      })
    },
    getValue (value1, value2, value3) {
      this.money = value1
      this.isPay = value2
      this.isKeyborad = value2
      if (value3) {
        this.isKeyborad = false
        this.isOther = true
        this.isPay = true
        let randParams = {money: this.money.toString()}
        payApi.getPayRand(randParams).then((res) => {
          this.realiseMoney = res.data.randmoney
        })
        let typeParams = {}
        payApi.getPayType(typeParams).then((res) => {
          this.payWay = res.data.list
        })
      }
    },
    sendWay () {
      console.log('充值')
      this.$router.togo('/mine/buyRecord')
    }
  },
  components: {
    commonHeader,
    keyborad
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
.buy-num {
    padding: 0 5%;
    font-size: 14px;
    height: 1rem;
    line-height: 1rem;
    background: #fff;
}
.pay-list {
  margin: 0 5%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  // justify-content: flex-start
  .pay-money {
    float: left;
    height: 2rem;
    width: 2rem;
    margin: 10px;
    padding: 0 0.2rem;
    border:1px solid #248ad2;
    text-align: center;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: justify;
  }
  .active {
    background: #248ad2;
    color: #fff;
  }
}
.pay-way {
  background: #fff;
  .pay-realise {
    padding: 0 5%;
    height: 1rem;
    // border-bottom: 1px solid #dadada;
    line-height: 1rem;
    div {
      float: left;
      font-size: 14px;
    }
    p {
      float: right;
      color: red;
    }
  }
  ul {
    position: relative;
    padding: 0 5%;
    li {
      height: 1.2rem;
      line-height: 1.2rem;
      overflow: hidden;
      border-top: 1px solid #dadada;
      .icon-zhifubao-copy {
        color: #00a9f4;
        font-size: 20px;
      }
      .icon-weixin {
        color: #05c701;
        font-size: 16px;
      }
      div {
        float: right;
        width: 20px;
        height: 20px;
        background: #d0d0d0;
        border-radius: 10px;
        text-align: center;
        line-height: 20px;
        margin-top: 12px;
      }
      p {
        float: left;
        line-height: 1.2rem;
      }
      span {
        font-size: 14px;
        margin-left: 10px;
        vertical-align: middle;
      }
      i {
        vertical-align: middle;
      }
      .active {
        background: #248ad2;
      }
    }
    .pay-bank {
      width: 26px;
      vertical-align: middle;
    }
  }
  .pay-waybtn {
    background: #f0f0f0;
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    button {
      background: #248ad2;
      height: 1rem;
      width: 4rem;
      color: #fff;
      margin-bottom: 20px;
    }
  }
}
.pay-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  .pay-keyborad {
    background-color: #fafafa;
  }
  .pay-keyborad,.pay-way {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
</style>
