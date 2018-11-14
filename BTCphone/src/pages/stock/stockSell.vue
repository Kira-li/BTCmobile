<template>
  <div>
    <common-header :tittle="tittle" :showback="true"></common-header>
    <div class="page-content">
      <!-- <mt-button @click="todetail">user</mt-button> -->
      <ul>
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
          <span>可卖出{{buyNum}}股数</span>
        </li>
        <li>
          <mt-button @click="stockSell">限价卖出</mt-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import commonHeader from 'common/common-header'
import { getStockInfo, sell } from '../../api/stock-api.js'
import { fixDecimal } from '../../filter/index.js'
import { Toast, MessageBox } from 'mint-ui'
export default {
  data () {
    return {
      tittle: '卖出',
      num: 0,
      name: '',
      code: '',
      price: '0',
      canBuy: 0,
      buyNum: 0,
      position: 1,
      enableMoney: ''
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
        this.canBuy = parseInt(this.buyNum * 0.75 / 100) * 100 + 100
      } else {
        this.canBuy = parseInt(this.buyNum * 0.5 / 100) * 100 + 100
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
        this.canBuy = this.buyNum = this.$route.query.num
        this.name = res.data.stock.name
        this.code = res.data.stock.code
      })
    },
    Add (type, value) {
      if (type === 1) {
        this.price = parseFloat(this.price) - 0.01
        this.price = fixDecimal([this.price, 2])
      } else {
        this.price = parseFloat(this.price) + 0.01
        this.price = fixDecimal([this.price, 2])
      }
    },
    stockSell () {
      if (this.canBuy % 100 === 0) {
        MessageBox({
          title: '提示',
          message: `<p>您确定以每股<span style="color:red">${this.price}</span>的价格买入<span style="color:red">${this.canBuy}</span>股<span style="color:red">${this.name}</span>吗？</p>`,
          showCancelButton: true
        }).then(action => {
          if (action === 'confirm') {
            // this.$router.push({path: '/regesiter', query: {mobile: this.username}})
            let params = {
              entrustprice: this.price.toString(),
              entrustnum: this.canBuy.toString(),
              logid: this.$route.query.logid.toString(),
              pricetype: '1'
            }
            sell(params).then((res) => {
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
ul {
  padding: 5%;
  .clearfix {
    border: 1px solid #248ad2;
    border-radius: 5px;
    height: 1rem;
    line-height: 1rem;
    padding: 0 10px;
    :first-child {
      float: left;
      color: #248ad2
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
.mint-msgbox-content .mint-msgbox-message {
  text-align: left !important;
  line-height: 20px;
  p {
    text-align: left !important;
  }
}
</style>
