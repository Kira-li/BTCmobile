<template>
  <div>
    <common-header :tittle="tittle" :showback="true"></common-header>
    <div class="page-content">
      <!-- <mt-button @click="todetail">user</mt-button> -->
      <div class="cash-cont">
        <div>当前余额：{{cashMax}}</div>
        <ul>
          <li class="cash-type clearfix">
            <span>请选择收益方式：</span>
            <p @click="isChoose = true">{{cashName}}<em class="triangle-down"></em></p>
            <h5 v-if="isChoose">
              <h6 v-for="(item,key) in cashType" :key="key" v-if="item.paytype == 1" @click="chooseType(item)">支付宝</h6>
              <h6 v-for="(item,key) in cashType" :key="key" v-if="item.paytype == 3" @click="chooseType(item)">银行卡</h6>
            </h5>
          </li>
          <li>
            <span>结算账号：</span>
            <input type="text" placeholder="请输入您的支付宝/银行卡账号" v-model="useraccount">
          </li>
          <li v-if="cashKind === 3">
            <span>开户行：</span>
            <input type="text" placeholder="请输入您的开户行" v-model="bankname">
          </li>
          <li>
            <span>账号姓名：</span>
            <input type="text" placeholder="请输入您的收款账号姓名" v-model="username">
          </li>
          <li>
            <span>结算金币：</span>
            <input type="text" placeholder="" v-model="coinamount">
          </li>
        </ul>
      </div>
      <div class="cash-btn"><mt-button @click="createOrder">确定提交</mt-button></div>
      <div class="cash-tip">
        <p></p><div>温馨提示</div><p></p>
      </div>
      <p class="cash-des">1.请在工作日9:00-16:00内申请，T+1个工作日内到账</p>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapGetters, mapState} from 'vuex'
import commonHeader from 'common/common-header'
import { MessageBox } from 'mint-ui'
import {getCashMax, createCashOrder} from '../../api/pay-api.js'
export default {
  data () {
    return {
      tittle: '收益',
      num: 0,
      isChoose: false,
      cashName: '支付宝',
      useraccount: '',
      bankname: '',
      username: '',
      paytypeid: '',
      coinamount: '',
      cashMax: 0,
      cashKind: 1,
      cashType: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    ...mapMutations({
      setNum: 'SET_NUM'
    }),
    todetail () {
      this.$router.togo('/Home/Detail')
    },
    getData () {
      let params = {}
      getCashMax(params).then((res) => {
        console.log(res)
        this.cashMax = parseInt(res.data.cashMax)
        this.cashType = res.data.types
        if (res.data.types[0].useraccount) {
          this.useraccount = res.data.types[0].useraccount
          this.username = res.data.types[0].username
        }
      })
    },
    chooseType (item) {
      this.isChoose = false
      if (item.paytype === 1) {
        this.cashKind = item.paytype
        this.cashName = '支付宝'
        if (item.useraccount) {
          this.useraccount = item.useraccount
          this.username = item.username
        }
      } else {
        this.cashKind = item.paytype
        this.cashName = '银行卡'
        if (item.useraccount) {
          this.useraccount = item.useraccount
          this.username = item.username
          this.bankname = item.bankname
        }
      }
    },
    createOrder () {
      var params = JSON.stringify({
        coinamount: this.coinamount,
        useraccount: this.useraccount,
        paytypeid: this.paytypeid,
        paytype: this.cashKind,
        bankname: this.bankname,
        username: this.username
      })
      createCashOrder(params).then((res) => {
        console.log(res)
        MessageBox('提示', '提交成功，稍候客服会联系您！')
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
.cash-cont {
  background: #fff;
  div {
    padding: 5%;
  }
  ul {
    padding: 10px 10%;
    margin-bottom: 10px;
    li {
      border: 1px solid #999;
      margin-bottom: 10px;
      padding-left: 10px;
      height: 1rem;
      line-height: 1rem;
      select {
        width: 50%;
        border: 0;
      }
      input {
        width: 70%;
        height: 1rem;
        line-height: 1rem;
      }
    }
    .cash-type {
      position: relative;
      span {
        float: left;
      }
      p {
        float: left;
        width: 60%;
        position: relative;
        .triangle-down {
          width:0;
          height:0;
          border-width:6px 6px 0;
          border-style:solid;
          border-color:#333 transparent transparent;/*灰 透明 透明 */
          margin:40px auto;
          position: absolute;
          top: -22px;
          right: 0;
        }
      }
      h5 {
        position: absolute;
        top: 1rem;
        right: 20px;
        width: 60%;
        background: #dadada;
        h6{
          text-align: center;
        }
      }
    }
  }
}
.cash-btn {
  text-align: center;
  margin-top: 20px;
  button {
    background: #248ad2;
    color: #fff;
    width: 4rem;
  }
}
.cash-tip {
  display: flex;
  margin-top: 30px;
  p {
    flex:1;
    height: 1px;
    background: #dadada;
    margin-top: 0.5rem;
  }
  div {
    color: red;
    padding: 0 10px;
    height: 1rem;
    line-height: 1rem;
  }
}
.cash-des {
  text-align: center;
}
</style>
