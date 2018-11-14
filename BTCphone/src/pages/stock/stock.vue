<template>
  <div>
    <common-header :tittle="tittle" :showback="true" :showmore="rightText" @fatherWay = 'sendWay'></common-header>
    <div class="page-content">
      <ul class="clearfix stock-money">
          <li class="stock-detail">入金资产:{{roomData.principal}}</li>
          <li class="stock-detail">初始资金:{{roomData.closeposition}}</li>
          <li class="stock-detail">可用额:{{roomData.enableamount}}</li>
          <li class="stock-detail">总收益(率):<span :class="roomData.totalprofit>0 ? 'index-red': 'index-green'">{{roomData.totalprofit}}/{{roomData.totalprofitrate}}%</span></li>
          <li class="stock-detail">最高可亏损额:{{[roomData.maxloss,2] | fixDecimal(roomData.maxloss,2) }}</li>
          <li class="stock-detail">股票市值:{{roomData.stocktotal}}</li>
          <li class="stock-flex">
              <mt-button @click="toChoose">买入</mt-button>
              <mt-button @click="toKillorder">撤单</mt-button>
              <mt-button @click="toQuery">查询</mt-button>
              <mt-button @click="toTransfer">转入</mt-button>
          </li>
      </ul>
      <div class="stock-position">
        <ul class="clearfix stock-posdes">
          <li>名称</li>
          <li>盈亏</li>
          <li>持仓/可用</li>
          <li>成本/现价</li>
        </ul>
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :auto-fill="false" ref="loadmore">
          <div class="position-cont" v-for="(item,key) in positionData" :key="key" v-if="positionData">
            <ul>
              <li>
                <p>{{item.objectname}}</p>
                <p>{{item.objectcode}}</p>
              </li>
              <li :class="item.lossmoney > 0 ? 'index-red': 'index-green'">
                <p>{{item.lossmoney}}</p>
                <p>{{item.lossrate}}%</p>
              </li>
              <li>
                <p>{{item.holdnum}}</p>
                <p>{{item.enablenum}}</p>
              </li>
              <li>
                <p>{{item.costprice}}</p>
                <p>{{item.price}}</p>
              </li>
            </ul>
            <div>
              <mt-button @click="toBuy(1,item.objectcode,item.market,item.enablenum)">买入</mt-button>
              <mt-button @click="toBuy(2,item.objectcode,item.market,item.enablenum,item.logid)">卖出</mt-button>
            </div>
          </div>
        </mt-loadmore>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapGetters, mapState} from 'vuex'
import commonHeader from 'common/common-header'
import { Toast, MessageBox } from 'mint-ui'
import { fixDecimal } from '../../filter/index.js'
import * as stockApi from '../../api/stock-api.js'
export default {
  data () {
    return {
      tittle: '炒股',
      rightText: '结算',
      num: 0,
      roomid: '',
      roomData: {},
      positionData: [],
      searchCondition: {// 分页属性
        pageNo: '1',
        pageSize: '5'
      },
      allLoaded: false
    }
  },
  created() {},
  mounted () {
    this.getRoomdata()
  },
  methods: {
    ...mapMutations({
      stockRoom: 'STOCK_ROOM',
      stockMes: 'STOCK_MES',
      stockFee: 'STOCK_FEE'
    }),
    getRoomdata() {
      let params = {
        baseroomid: '20180608000002'
      }
      stockApi.enter(params).then((res) => {
        this.roomid = res.data.roomid
        this.roomData = res.data
        this.stockMes(res.data.enableamount)
        this.stockRoom(res.data.roomid)
        this.stockFee(res.data.feerate)
        // this.$store.commit('STOCK_MES', res.data.enableamount)
        let positionList = {
          roomid: this.roomid,
          pageno: '1',
          pagesize: '5'
        }
        stockApi.getPositionList(positionList).then((res) => {
          this.positionData = res.data.list
          if (res.data.total <= res.data.pageno * res.data.pagesize) {
            this.allLoaded = true
          } else {
            this.allLoaded = false
          }
        })
      })
    },
    loadTop () {
      // this.loadPageList(this.selected, this.searchCondition.pageNo)
      let positionList = {
        roomid: this.roomid,
        pageno: '1',
        pagesize: '5'
      }
      this.searchCondition.pageNo = '1'
      stockApi.getPositionList(positionList).then((res) => {
        this.positionData = res.data.list
        if (res.data.total <= res.data.pageno * res.data.pagesize) {
          this.allLoaded = true
        } else {
          this.allLoaded = false
        }
      })
      this.$refs.loadmore.onTopLoaded()
    },
    loadBottom () {
      this.more()
      this.$refs.loadmore.onBottomLoaded()
    },
    more () {
      if (this.allLoaded) {
        Toast({
          message: '没有更多数据了',
          position: 'bottom'
        })
      } else {
        this.searchCondition.pageNo = (parseInt(this.searchCondition.pageNo) + 1).toString()
        let params = {
          roomid: this.roomid,
          pagesize: '5',
          pageno: this.searchCondition.pageNo
        }
        stockApi.getPositionList(params).then((res) => {
          console.log(res)
          if (res.data.pagesize * res.data.pageno > res.data.total) {
            this.allLoaded = true
          } else {
            this.allLoaded = false
          }
          this.positionData = this.positionData.concat(res.data.details)
        })
      }
    },
    toChoose () {
      this.$router.togo('/stock/chooseStock')
    },
    toKillorder () {
      this.$router.togo('/stock/killOrder')
    },
    toQuery () {
      this.$router.togo('/stock/query')
    },
    toTransfer () {
      this.$router.togo('/stock/transfer')
    },
    toBuy (num, code, market, stockNum, logid) {
      if (num === 1) {
        this.$router.push({path: '/stock/stockBuy', query: {code: code, market: market}})
      } else {
        this.$router.push({path: '/stock/stockSell', query: {code: code, market: market, num: stockNum, logid: logid}})
      }
    },
    sendWay () {
      MessageBox({
        title: '提示',
        message: '确定结算本场次并资金转出',
        showCancelButton: true
      }).then(action => {
        if (action === 'confirm') {
          // this.$router.push({path: '/regesiter', query: {mobile: this.username}})
          let params = {roomid: this.roomid}
          stockApi.transferOutMoney(params).then((res) => {
            if (res.code !== 200) {
              console.log(111)
              MessageBox({
                title: '提示',
                message: res.msg,
                showCancelButton: true
              })
            }
          })
        }
      })
    }
  },
  filters: {
    fixDecimal
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
.stock-money {
  padding: 0 5%;
  li {
    height: 30px;
    line-height: 30px;
    float: left;
    width: 100%
  }
  .stock-detail {
    float: left;
    width: 50%;
  }
  .stock-flex {
    display: flex;
    margin-top: 10px;
    button {
      border: 1px solid #248ad2;
      color: #248ad2;
      height: 30px;
      flex: 1;
      margin-left: 20px;
    }
    :first-child {
      margin-left: 0;
    }
  }
}
.stock-position {
  margin-top: 20px;
  .stock-posdes {
    background: #248ad2;
    li {
      width: 25%;
      float: left;
      text-align: center;
      color: #fff;
      height: 1rem;
      line-height: 1rem;
      font-size: 16px;
    }
  }
}
.position-cont {
  ul {
    display: flex;
    font-size: 14px;
    li {
      flex:1;
      text-align: center;
      p {
        height: 24px;
        line-height: 24px;
      }
    }
  }
  div {
    display: flex;
    button {
      flex: 1;
      border-radius: 0;
      color: #248ad2;
    }
  }
}
.index-red {
  color: red;
}
.index-green {
  color: #01cc00;
}
</style>
