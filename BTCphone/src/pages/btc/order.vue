<template>
  <div>
    <common-header :tittle="tittle" :showback="true"></common-header>
    <div class="page-content">
      <div class="clearfix title">
        <mt-button @click.native.prevent="getEntrust" :class="active==='tab-container1' ? 'active':''">委托单</mt-button>
        <mt-button @click.native.prevent="getOrder" :class="active==='tab-container2' ? 'active':''">历史订单</mt-button>
      </div>
      <mt-tab-container v-model="active">
        <mt-tab-container-item id="tab-container1">
          <div class="tab-container1">
            <ul class="tab-title">
              <li>币种</li>
              <li>交易类型</li>
              <li>
                <p>委托价格</p>
                <p>委托数量</p>
              </li>
              <li>
                <p>日期</p>
                <p>时间</p>
              </li>
              <li>撤单</li>
            </ul>
            <mt-loadmore :top-method="loadTop1" :bottom-method="loadBottom1" :auto-fill="false" ref="loadmore1">
              <div class="tab-cont">
                <ul v-for="(item,key) in entrustList" :key="key">
                  <li>BTC</li>
                  <li>{{item.bullbear===1 ? '买涨': '买跌'}}</li>
                  <li>
                    <p>{{item.entrustprice}}</p>
                    <p>{{item.entrustnum}}</p>
                  </li>
                  <li>
                    <p>{{[item.createtime,true] | showDate(item.createtime,true)}}</p>
                    <p>{{[item.createtime,false] | showDate(item.createtime,false)}}</p>
                  </li>
                  <li><input type="button" value="撤单" @click="entrust(item.logid)"></li>
                </ul>
              </div>
            </mt-loadmore>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="tab-container2">
          <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :auto-fill="false" ref="loadmore">
            <div class="tab-scroll">
              <ul v-for="(item,key) in orderList" :key="key" class="tab-container2">
                <li class="first-bg">BTC(btc)</li>
                <li>
                  <p v-if="item.tradetype == 1"><span>方向：委托买入({{item.bullbear == 1 ? '买涨' : '买跌'}})</span></p>
                  <p v-if="item.tradetype == 2"><span>方向：卖出</span></p>
                  <p v-if="!item.forcesell && item.tradestate == 1">操作类型：委托中</p>
                  <p v-if="!item.forcesell && item.tradestate == 2">操作类型：委托成交</p>
                  <p v-if="!item.forcesell && item.tradestate == 3">操作类型：撤单</p>
                  <p v-if="item.forcesell == 1">操作类型：平仓卖出</p>
                  <p v-if="item.forcesell == 2">操作类型：止盈卖出</p>
                  <p v-if="item.forcesell == 3">操作类型：止损卖出</p>
                </li>
                <li>
                  <p>委托份额：{{item.entrustnum}}</p>
                  <p>交易金额：{{item.tradeamount}}</p>
                </li>
                <li>
                  <p>委托价：{{item.entrustprice}}</p>
                  <p>成交价：{{item.tradeprice}}</p>
                </li>
                <li>
                  <p>保证金：{{item.costprice*item.entrustnum}}</p>
                  <p>手续费：{{item.fee}}</p>
                </li>
                <li>委托时间：{{item.entrusttime | showTime}}</li>
                <li>成交时间：{{item.tradetime | showTime}}</li>
              </ul>
            </div>
          </mt-loadmore>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapGetters, mapState} from 'vuex'
import { showTime } from '../../filter/index.js'
import { Toast, MessageBox } from 'mint-ui'
import commonHeader from 'common/common-header'
import { getTargetList, getEntrustList, cancelEntrust } from '../../api/btc-api.js'
export default {
  data () {
    return {
      tittle: '订单管理',
      num: 0,
      active: 'tab-container1',
      orderList: [],
      entrustList: [],
      searchCondition: {// 分页属性
        pageNo: '1',
        pageSize: '5'
      },
      allLoaded: false
    }
  },
  created() {},
  mounted () {
    this.getOrder()
  },
  methods: {
    ...mapMutations({
      setNum: 'SET_NUM'
    }),
    todetail() {
      this.$router.togo('/Home/Detail')
    },
    getOrder () {
      this.active = 'tab-container2'
      let params = {
        roomid: this.btcRoom,
        pagesize: '5',
        pageno: '1'
      }
      getTargetList(params).then((res) => {
        this.orderList = res.data.list
        if (res.data.total <= res.data.pageno * res.data.pagesize) {
          this.allLoaded = true
        } else {
          this.allLoaded = false
        }
      })
    },
    getEntrust () {
      this.active = 'tab-container1'
      let params = {
        roomid: this.btcRoom,
        pagesize: '5',
        pageno: '1'
      }
      getEntrustList(params).then((res) => {
        console.log(res)
        this.entrustList = res.data.list
        if (res.data.total <= res.data.pageno * res.data.pagesize) {
          this.allLoaded = true
        } else {
          this.allLoaded = false
        }
      })
    },
    entrust (id) {
      let params = {
        targetid: id
      }
      cancelEntrust(params).then((res) => {
        MessageBox({
          title: '提示',
          message: '撤单成功',
          showCancelButton: false
        }).then(action => {
          if (action === 'confirm') {
            // this.$router.push({path: '/regesiter', query: {mobile: this.username}})
            // if()
            this.getEntrust()
          }
        })
      })
    },
    loadTop () {
      this.getOrder()
      this.$refs.loadmore.onTopLoaded()
    },
    loadBottom () {
      this.more()
      this.$refs.loadmore.onBottomLoaded()
    },
    loadTop1 () {
      this.getEntrust()
      this.$refs.loadmore1.onTopLoaded()
    },
    loadBottom1 () {
      if (this.allLoaded) {
        Toast({
          message: '没有更多数据了',
          position: 'bottom'
        })
      } else {
        this.searchCondition.pageNo = (parseInt(this.searchCondition.pageNo) + 1).toString()
        let params = {
          roomid: this.btcRoom,
          pagesize: '5',
          pageno: this.searchCondition.pageNo
        }
        getEntrustList(params).then((res) => {
          console.log(res)
          if (res.data.pagesize * res.data.pageno > res.data.total) {
            this.allLoaded = true
          } else {
            this.allLoaded = false
          }
          this.entrustList = this.entrustList.concat(res.data.list)
        })
      }
      this.$refs.loadmore1.onBottomLoaded()
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
          roomid: this.btcRoom,
          pagesize: '5',
          pageno: this.searchCondition.pageNo
        }
        getTargetList(params).then((res) => {
          console.log(res)
          if (res.data.pagesize * res.data.pageno > res.data.total) {
            this.allLoaded = true
          } else {
            this.allLoaded = false
          }
          this.orderList = this.orderList.concat(res.data.list)
        })
      }
    }
  },
  filters: {
    showTime,
    showDate ([val, onlyDate]) {
      if (!val) return '--'
      var dtVal
      if (val.date) {
        dtVal = new Date(val.date.replace(/-/g, '/').replace(/\..*$/, ' +0'))
      } else {
        dtVal = new Date(parseInt(val))
      }
      let ret
      if (!onlyDate) {
        let fullHour = ('0' + dtVal.getHours()).substr(-2)
        let fullMinute = ('0' + dtVal.getMinutes()).substr(-2)
        let fullSecond = ('0' + dtVal.getSeconds()).substr(-2)
        ret = fullHour + ':' + fullMinute + ':' + fullSecond
      } else {
        let fullYear = dtVal.getFullYear()
        let fullMonth = ('0' + (1 + dtVal.getMonth())).substr(-2)
        let fullDate = ('0' + dtVal.getDate()).substr(-2)
        ret = fullYear + '-' + fullMonth + '-' + fullDate
      }
      return ret
    }
  },
  components: {
    commonHeader
  },
  computed: {
    ...mapGetters([
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
  .title {
    display: table;
    margin: 10px auto;
    text-align: center;
  }
  button {
    width: 100px;
    height: 0.8rem;
    border-radius: 0;
    float: left;
    color: #248ad2;
  }
  .active {
    background: #248ad2;
    color: #fff;
  }
  .tab-container1 {
    .tab-title {
      display: flex;
      text-align: center;
      background: #fff;
      border-bottom: 1px solid #EDEFF2;
      li {
        flex: 1;
        height: 1rem;
        line-height: 1rem;
        p {
          height: 0.5rem;
          line-height: 0.5rem;
        }
      }
      button {
        width: 60px !important;
      }
    }
    .tab-cont {
      height: 10rem;
      ul {
        background: #fff;
        display: flex;
        li {
          flex: 1;
          height: 1rem;
          line-height: 1rem;
          text-align: center;
          p {
            height: 0.5rem;
            line-height: 0.5rem;
          }
          input {
            background: #fff;
            color: #248ad2;
            border: 1px solid #248ad2;
            border-radius: 5px;
            padding: 5px 10px;
          }
        }
      }
    }
  }
  .tab-scroll {
    height: 15rem;
    overflow: scroll;
  }
  .tab-container2 {
    background: #fff;
    margin: 20px 5%;
    border-radius: 5px;
    overflow: hidden;
    li {
      display: flex;
      text-indent: 10px;
      line-height: 24px;
      height: 24px;
      p {
        flex: 1;
        text-indent: 10px;
      }
    }
    .first-bg {
      background: #ffbf00;
      text-align: center;
      color: #fff;
      display: block;
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>
