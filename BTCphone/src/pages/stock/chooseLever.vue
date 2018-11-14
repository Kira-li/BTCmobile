<template>
  <div>
    <common-header :tittle="tittle" :showback="true"></common-header>
    <div class="page-content">
      <!-- <mt-button @click="todetail">user</mt-button> -->
        <div class="lever-money">
            <span>请输入投资资金：<input type="text" placeholder="请输入投资本金，10000起投" @input='inputNum($event)' v-model="money"></span>
        </div>
        <div class="lever-btn">
            <div v-for="(item,key) in lever" :key="key" >
              <mt-button v-bind:class="{'active': levernum == item}" @click="chooseNum(item)">{{item}}倍</mt-button>
            </div>
        </div>
        <ul class="principal">
          <li class="clearfix">
            <p>投资本金</p><span>{{principalMoney}}</span>
          </li>
          <li class="clearfix">
            <p>总操盘资金</p><span>{{principalMoney*levernum}}</span>
          </li>
          <li class="clearfix">
            <p>亏损平仓线</p><span>{{principalMoney*0.99}}</span>
          </li>
          <li class="clearfix">
            <p>风险保证金</p><span>{{principalMoney*0.01}}</span>
          </li>
        </ul>
        <div class="enter"><mt-button @click="enter">确定进入</mt-button></div>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapGetters, mapState} from 'vuex'
import commonHeader from 'common/common-header'
import { Toast } from 'mint-ui'
import { getRoomBase, addRoom } from '../../api/stock-api.js'

export default {
  data () {
    return {
      tittle: '炒股',
      num: 0,
      lever: [],
      levernum: 50,
      principalMoney: 0,
      money: ''
    }
  },
  created() {
    this.getLever()
  },
  activated () {
    // this.getHome()
    this.getLever()
  },
  methods: {
    ...mapMutations({
      setNum: 'SET_NUM'
    }),
    inputNum(e) {
      this.money = e.target.value.replace(/[^\d]/g, '')
      this.principalMoney = this.money
    },
    getLever() {
      let params = {
        baseroomid: '20180608000002'
      }
      getRoomBase(params).then((res) => {
        if (res.code === 200) {
          this.lever = res.data.lever
        }
      })
    },
    chooseNum (num) {
      this.levernum = num
      this.principalMoney = this.money
    },
    enter() {
      // this.$router.togo('/stock/stock')
      if (this.money < 10000) {
        Toast('请输入至少10000的投资本金')
        this.money = ''
        this.principalMoney = 0
      } else {
        let params = {
          lever: this.levernum.toString(),
          baseroomid: '20180608000002',
          principal: this.money.toString()
        }
        addRoom(params).then((res) => {
          this.$router.togo('/stock/stock')
        })
      }
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
.hello{
  h1{
    color: red;
    .fs(38);
  }
}
.lever-money {
    background: #fff;
    padding-left: 5%;
    span {
        font-size: 14px;
    }
    height: 1.5rem;
    line-height: 1.5rem;
    input {
        border: 1px solid #999;
        height: 20px;
        font-size: 12px;
        padding: 5px 0 5px 10px;
        width: 5rem
    }
}
.lever-btn {
  margin: 20px 20px;
  display: flex;
  div {
    flex: 1;
    text-align: center;
    button {
      width: 80px;
      border: 1px solid #248ad2;
      color: #248ad2;
    }
  }
  .active {
    background: #248ad2;
    color: #fff;
  }
}
.principal {
  li {
    padding: 0 5%;
    background: #fff;
    line-height: 1rem;
    height: 1rem;
    border-bottom: 1px solid #d7d7d7;
    p {
      float: left;
    }
    span {
      float: right;
      color: red;
    }
  }
}
.enter {
  text-align: center;
  margin-top: 30px;
  button {
    width: 5rem;
    height: 1rem;
    background: #248ad2;
    color: #fff;
  }
}
</style>
