<template>
  <div>
    <common-header :tittle="tittle" :showback="true" :showmore="rightText" @fatherWay = 'sendWay'></common-header>
    <div class="page-content">
      <!-- <mt-button @click="todetail">user</mt-button> -->
      <ul class="all-cont">
        <li class="clearfix"><span>{{code}}</span><span>{{name}}</span></li>
        <li class="add">
          <mt-button @click="Add(1,price)">-</mt-button>
          <input type="text" v-model="price">
          <mt-button @click="Add(2,price)">+</mt-button>
        </li>
        <li class="position">
          <mt-button :class="{'active': position == 1}" @click="positionData(1)">全仓</mt-button>
          <mt-button :class="{'active': position == 2}" @click="positionData(2)">3/4仓</mt-button>
          <mt-button :class="{'active': position == 3}" @click="positionData(3)">半仓</mt-button>
        </li>
        <li class="buyNum">
          <input type="text" name="" v-model="canBuy">
          <span>可买入{{buyNum}}股数</span>
        </li>
        <li>
          <mt-button @click="stobkBuy">限价买入</mt-button>
        </li>
      </ul>
    </div>
    <div class="strong-bg" v-if="isStrong">
      <div class="strong">
        <p>今日限买股</p>
        <ul class="clearfix">
          <li v-for="(item,key) in strongList" :key="key">
            <span>{{item.code}}</span>
            <span>{{item.name}}</span>
          </li>
        </ul>
        <i class="icon iconfont icon-guanbi" @click="isStrong=false"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import commonHeader from 'common/common-header'
import { getStockInfo, buy, getStrongStockList } from '../../api/stock-api.js'
import { fixDecimal } from '../../filter/index.js'
import { Toast, MessageBox } from 'mint-ui'
export default {
  data () {
    return {
      tittle: '买入',
      num: 0,
      rightText: '今日限买股',
      isStrong: false,
      name: '',
      code: '',
      price: '0',
      canBuy: 0,
      buyNum: 0,
      position: 1,
      enableMoney: '',
      strongList: []
    }
  },
  mounted () {
    this.getListdata()
  },
  created() {
    // this.getListdata()
  },
  methods: {
    todetail() {
      this.$router.togo('/Home/Detail')
    },
    positionData (num) {
      this.position = num
      if (num === 1) {
        this.canBuy = this.buyNum
      } else if (num === 2) {
        this.canBuy = parseInt(parseFloat(this.stockMoney) / parseFloat(this.price) / 100 / (1 + parseFloat(this.stockFee)) * 0.75) * 100 + 100
      } else {
        this.canBuy = parseInt(parseFloat(this.stockMoney) / parseFloat(this.price) / 100 / (1 + parseFloat(this.stockFee)) * 0.5) * 100 + 100
      }
    },
    getListdata () {
      let params = {
        code: this.$route.query.code,
        market: this.$route.query.market
      }
      getStockInfo(params).then((res) => {
        console.log(this.stockMoney)
        // this.enableMoney = this.stockMoney
        this.price = fixDecimal([res.data.stock.nowPrice, 2])
        this.canBuy = this.buyNum = parseInt(parseFloat(this.stockMoney) / parseFloat(this.price) / 100 / (1 + parseFloat(this.stockFee))) * 100
        this.name = res.data.stock.name
        this.code = res.data.stock.code
      })
    },
    Add (type, value) {
      if (type === 1) {
        this.price = parseFloat(this.price) - 0.01
        this.price = fixDecimal([this.price, 2])
        this.canBuy = this.buyNum = parseInt(parseFloat(this.stockMoney) / parseFloat(this.price) / 100 / (1 + parseFloat(this.stockFee))) * 100
      } else {
        this.price = parseFloat(this.price) + 0.01
        this.price = fixDecimal([this.price, 2])
        this.canBuy = this.buyNum = parseInt(parseFloat(this.stockMoney) / parseFloat(this.price) / 100 / (1 + parseFloat(this.stockFee))) * 100
      }
    },
    stobkBuy () {
      if (this.canBuy % 100 === 0) {
        MessageBox({
          title: '提示',
          message: `<p>您确定以每股<span style="color:red">${this.price}</span>的价格买入<span style="color:red">${this.canBuy}</span>股<span style="color:red">${this.name}</span>吗？</p>
                    <p>提醒：依据沪深交易规则，当日买入的股票需等到下个交易日才能卖出！</p>`,
          showCancelButton: true
        }).then(action => {
          if (action === 'confirm') {
            // this.$router.push({path: '/regesiter', query: {mobile: this.username}})
            let params = {
              entrustprice: this.price.toString(),
              entrustnum: this.canBuy.toString(),
              objectcode: this.$route.query.code.toString(),
              objectname: this.name,
              market: this.$route.query.market.toString(),
              pricetype: '1',
              roomid: this.stockRoom
            }
            buy(params).then((res) => {
              MessageBox({
                title: '提示',
                message: '委托成功',
                showCancelButton: false
              }).then(action => {
                this.$router.togo('/stock/stock')
              })
            })
          }
        })
      } else {
        Toast('委托数量必须是100的整数倍请重新输入')
      }
    },
    sendWay () {
      this.isStrong = true
      let params = {
        pagesize: '1000',
        pageno: '1'
      }
      getStrongStockList(params).then((res) => {
        console.log(res)
        this.strongList = res.data.list
      })
    }
  },
  components: {
    commonHeader
  },
  computed: {
    ...mapGetters([
      'stockMoney',
      'stockRoom',
      'stockFee'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "~styles/index.less";
@import "~styles/variable.less";
.Router {
  background: #fff !important;
}
.all-cont {
  padding: 5%;
  .clearfix {
    border: 1px solid #248ad2;
    border-radius: 5px;
    height: 1rem;
    line-height: 1rem;
    padding: 0 10px;
    :first-child {
      float: left;
      color: #248ad2;
    }
    :last-child {
      float: right;
    }
  }
  .add {
    display: flex;
    height: 0.8rem;
    margin-top: 20px;
    button {
      width: 1rem;
      height: 0.8rem;
      background: #248ad2;
      color: #fff;
    }
    input {
      flex: 1;
      border: 1px solid #999;
      margin: 0 20px;
      text-align: center;
      border-radius: 5px;
    }
  }
  .position {
    display: flex;
    margin-top: 20px;
    button {
      flex: 1;
      border: 1px solid #248ad2;
      background: #fff;
      margin-right: 20px;
      color: #248ad2;
    }
    :last-child {
      margin-right: 0;
    }
    .active {
      background: #248ad2;
      color: #fff;
    }
  }
  .buyNum {
    display: flex;
    margin: 20px 0;
    border: 1px solid #248ad2;
    height: 1rem;
    line-height: 1rem;
    padding: 0 10px;
    border-radius: 5px;
    input {
      flex: 1;
    }
    span{
      color: #248ad2;
    }
  }
  :last-child {
    text-align: center;
    // margin-top: 20px;
    button {
      background: #248ad2;
      color: #fff;
      width: 60%;
    }
  }
}
.strong-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  margin: 0 auto;
  .strong {
    background: #fff;
    width: 80%;
    margin: 0 auto;
    position: relative;
    p {
      text-align: center;
      background: #248ad2;
      margin-top: 20px;
      line-height: 1rem;
      height: 1rem;
      color: #fff;
      font-size: 14px;
    }
    ul {
      width: 90%;
      margin: 0 auto;
      overflow: scroll;
      height: 15rem;
      li {
        width: 50%;
        float: left;
        height: 0.6rem;
        line-height: 0.6rem;
        span {
          margin-left: 10px;
        }
      }
    }
    i {
      position: absolute;
      top: -10px;
      right: -10px;
      color: #999;
      font-size: 20px;
    }
  }
}
</style>
