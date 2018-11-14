<template>
  <div>
    <common-header :tittle="tittle" :showback="true"></common-header>
    <div class="page-content">
      <!-- <mt-button @click="todetail">操盘记录</mt-button> -->
      <ul v-for="(val, key) in dataList" :key='key' v-if="val.objecttype == 1" class="clearfix">
        <li class="page-title">BTC(btc)</li>
        <li v-if='val.tradetype == 1'>方向:委托买入({{val.tradetype == 1 && val.bullbear == 1 ? "买涨" : "买跌"}})</li>
        <li v-if='val.tradetype == 2'>方向:委托卖出</li>
        <li>操作类型:{{[val.forcesell,val.tradestate] | tradeState(val.forcesell,val.tradestate)}}</li>
        <li>委托份额:{{val.entrustnum}}</li>
        <li>交易额:{{val.tradeprice*val.entrustnum}}</li>
        <li>委托价:{{val.entrustprice}}</li>
        <li>成交价:{{val.tradeprice}}</li>
        <li>手续费:{{val.fee}}</li>
        <li>保证金:{{val.entrustnum*10000}}</li>
        <li class="page-width">委托时间:{{val.entrusttime | showTime}}</li>
        <li class="page-width">成交时间:{{val.tradetime | showTime}}</li>
      </ul>
      <ul v-for="(val, key) in dataList" :key='key' v-if="val.objecttype == 2" class="clearfix">
        <li class="page-title">{{val.objectname}}({{val.objectcode}})</li>
        <li>方向:{{val.tradetype == 1 ? '委托买入' : '委托卖出'}}</li>
        <li>操作类型:{{[val.forcesell,val.tradestate] | tradeState(val.forcesell,val.tradestate)}}</li>
        <li>股数:{{val.entrustnum}}</li>
        <li>交易金额:{{val.tradeamount}}</li>
        <li>委托价:{{val.entrustprice}}</li>
        <li>成交价:{{val.tradeprice}}</li>
        <li class="page-width">账户管理费:{{val.pointfee}}</li>
        <li class="page-width">委托时间:{{val.entrusttime | showTime}}</li>
        <li class="page-width">成交时间:{{val.tradetime | showTime}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapGetters, mapState} from 'vuex'
import commonHeader from 'common/common-header'
import { showTime } from '../../filter/index.js'
import { getTargetListAll } from '../../api/stock-api.js'
export default {
  data () {
    return {
      tittle: '操盘记录',
      num: 0,
      dataList: []
    }
  },
  created() {},
  mounted() {
    this.getData()
  },
  methods: {
    ...mapMutations({
      setNum: 'SET_NUM'
    }),
    todetail() {
      this.$router.togo('/Home/Detail')
    },
    getData () {
      let params = {}
      getTargetListAll(params).then((res) => {
        console.log(res)
        this.dataList = res.data.list
      })
    }
  },
  filters: {
    showTime,
    tradeState ([forcesell, tradestate]) {
      if (forcesell) {
        switch (forcesell) {
          case 1:
            return '平仓卖出'
          case 2:
            return '止盈卖出'
          case 3:
            return '止损卖出'
        }
      } else {
        switch (tradestate) {
          case 1:
            return '委托中'
          case 2:
            return '委托成交'
          case 3:
            return '撤单'
        }
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
.page-title {
  background: #ffbf00;
  text-align: center;
  height: 1rem;
  line-height: 1rem;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  width: 100%;
}
ul {
  width: 90%;
  margin: 0 auto;
  margin-top: 20px;
  padding-bottom: 10px;
  li {
    float: left;
    width: 50%;
    height: 20px;
    line-height: 20px;
    text-indent: 10px;
    background: #fff;
  }
  .page-width {
    width: 100%;
  }
}
</style>
