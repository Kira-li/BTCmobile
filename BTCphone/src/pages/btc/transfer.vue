<template>
  <div>
    <common-header :tittle="tittle" :showback="true" ></common-header>
    <div class="page-content">
      <!-- <mt-button @click="todetail">user</mt-button> -->
      <ul>
        <li>总账户余额：{{money}}</li>
        <li>BTC账户余额：{{btcMoney}}</li>
        <li>转入数量：<input type="text" placeholder="请输入转入金额" v-model="tranMoney"  @input='inputNum($event)'></li>
      </ul>
      <div class="transfer-btn">
        <div><mt-button @click="toStock">确认划转</mt-button></div>
        <div class="transfer-flex">
          <span></span>
          <p>温馨提示</p>
          <span></span>
        </div>
        <p>1.对冲币的转入是自动转入，网络确认后自动入账</p>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapGetters, mapState} from 'vuex'
import commonHeader from 'common/common-header'
import { MessageBox } from 'mint-ui'
import { transferInMoney } from '../../api/btc-api.js'
import { getUserAccount } from '../../api/user-api.js'
export default {
  data () {
    return {
      tittle: '转入',
      rightText: '结算',
      num: 0,
      money: '',
      tranMoney: ''
    }
  },
  created() {},
  mounted () {
    this.getDataList()
  },
  methods: {
    ...mapMutations({
      setNum: 'SET_NUM'
    }),
    toStock() {
      // this.$router.togo('/Home/Detail')
      MessageBox({
        title: '提示',
        message: `确定转入BTC账户${this.tranMoney}金币`,
        showCancelButton: true
      }).then(action => {
        if (action === 'confirm') {
          let params = {
            money: this.tranMoney,
            roomid: this.btcRoom
          }
          transferInMoney(params).then((res) => {
            console.log(res)
            MessageBox({
              title: '提示',
              message: '转入成功',
              showCancelButton: true
            }).then(action => {
              if (action === 'confirm') {
                this.$router.togo('/btc/index')
              }
            })
          })
        }
      })
    },
    getDataList () {
      let params = {}
      getUserAccount(params).then((res) => {
        console.log(res)
        this.money = res.data.account.enableamount
      })
    },
    inputNum(e) {
      this.tranMoney = e.target.value.replace(/[^\d]/g, '')
    }
  },
  components: {
    commonHeader
  },
  computed: {
    ...mapGetters([
      'btcMoney',
      'btcRoom'
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
.page-content {
  ul {
    background: #fff;
    position: relative;
    padding: 20px 0;
    li {
      border: 1px solid #999;
      width: 70%;
      padding-left: 10px;
      margin: 0 auto;
      margin-bottom: 20px;
      height: 1rem;
      line-height: 1rem;
      input {
        height: 1rem;
      }
    }
  }
  .transfer-btn {
    margin-top: 20px;
    div {
      text-align: center;
      button {
        background: #248ad2;
        width: 50%;
        color: #fff;
      }
    }
    .transfer-flex {
      display: flex;
      span {
        flex: 1;
        height: 1px;
        background: #999;
        margin-top: 0.5rem;
      }
      p {
        color: red;
        line-height: 1rem;
        height: 1rem;
        padding: 0 10px;
      }
    }
    p {
      text-align: center;
    }
  }
}
</style>
