<template>
  <div>
    <common-header :tittle="tittle" :showback="true" :showmore="rightText" @fatherWay = 'sendWay'></common-header>
      <div class="page-content">
        <!-- <mt-button @click="todetail"></mt-button> -->
        <div class="index-accout clearfix">
          <p>账户余额：{{accountMoney}}</p>
          <mt-button @click="transfer(1)">订单管理</mt-button>
          <mt-button @click="transfer(2)">转入金币</mt-button>
        </div>
        <div class="index-kchart">
          <div class="index-min clearfix">
            <p>分时行情图</p>
            <div>当前价：{{nowPrice}}</div>
          </div>
          <div class="index-kline" id="myChart"></div>
          <!-- <div class="index-kline" id="myChart1" v-if="isMin"></div> -->
          <ul class="clearfix">
            <li @click="changeline('1m')" :class="ischeck === '1m' ? 'checkd':''">分时</li>
            <li @click="changeline('5m')" :class="ischeck === '5m' ? 'checkd':''">5分</li>
            <li @click="changeline('1d')" :class="ischeck === '1d' ? 'checkd':''">日线</li>
          </ul>
          <div class="index-buybtn clearfix">
            <mt-button @click="toBuy(1,nowPrice)">买涨</mt-button>
            <mt-button @click="toBuy(2,nowPrice)">买跌</mt-button>
          </div>
          <p>总保证金:{{promisetotal}}</p>
        </div>
        <div class="index-title">
          <p>名称</p>
          <p>买入方向</p>
          <p>份额</p>
          <p>买入价</p>
          <p>盈亏</p>
        </div>
        <div class="positionScroll">
           <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :auto-fill="false" ref="loadmore">
             <ul v-for="(item,key) in positionList" :key="key" class="index-buy clearfix">
               <li>BTC</li>
               <li>{{item.bullbear === 1 ? "买涨" : "买跌"}}</li>
               <li>{{item.enablenum}}</li>
               <li>{{[item.totalbuyamount/item.enablenum,2] | fixDecimal(item.totalbuyamount/item.enablenum,2)}}</li>
               <li>{{item.lossMoney ? item.lossMoney : 0}}</li>
               <div>
                 <mt-button @click="buyShade(1,item.enablenum,item.logid)">卖出平仓</mt-button>
                 <mt-button @click="buyShade(2,item.winrate,item.lossrate)">查看止损止盈</mt-button>
               </div>
             </ul>
           </mt-loadmore>
        </div>
      </div>
      <div class="shade-bg" v-if="isShade" @click="isShade = false">
        <ul class="shade-buy" v-if="shadeType === 1">
          <li class="shade-type">
            <span>交易类型：</span>
            <input type="button" value="限价买入">
          </li>
          <li class="shade-price">
            <span>买入价格：</span>
            <input type="button" value="-" @click.stop="addPlus(1,0.01)">
            <input type="text" value="6888" v-model="buyPrice" @click.stop="">
            <input type="button" value="+" @click.stop="addPlus(2,0.01)">
          </li>
          <li class="shade-num">
            <input type="button" v-for='(item,key) in numArr' :key="key" :value="item + '份'" @click.stop="buyNum = item" :class="item === buyNum ? 'active':''">
          </li>
          <li class="shade-buyDet">
            <span>买入份额：</span>
            <input type="button" value="-" @click.stop="addPlus(3,1)">
            <input type="text" value="5" v-model="buyNum" @input.stop='inputNum($event)' @click.stop="">
            <input type="button" value="+" @click.stop="addPlus(4,1)">
          </li>
          <li class="shade-win">
            <span>止盈：</span>
            <mt-range
              v-model="rangeWin"
              :min="10"
              :max="90"
              :bar-height="20">
            </mt-range>
            <span>{{rangeWin}}%</span>
          </li>
          <li class="shade-loss">
            <span>止损：</span>
            <mt-range
              v-model="rangeLoss"
              :min="10"
              :max="75"
              :bar-height="20">
            </mt-range>
            <span>{{rangeLoss}}%</span>
          </li>
          <li class="shade-money">
            <span>所需保证金：</span>
            <input type="button" :value="10000*buyNum">
          </li>
          <li class="shade-btn">
            <mt-button @click="buy(buttonText)">{{buttonText}}</mt-button>
          </li>
        </ul>
        <ul v-if="shadeType === 2" class="shade-sell">
          <li class="sell-type">
            <span>交易类型：</span>
            <p>限价卖出</p>
          </li>
          <li class="sell-price">
            <span>卖出价格：</span>
            <input type="button" value="-" @click.stop="addPlus(5,0.01)">
            <input type="text" value="6888" v-model="sellPrice" @click.stop="">
            <input type="button" value="+" @click.stop="addPlus(6,0.01)">
          </li>
          <li class="sell-num">
            <span>卖出份额：</span>
            <p>{{sellNum}}</p>
          </li>
          <li class="sell-money">
            <span>卖出金币：</span>
            <p>{{sellNum*sellPrice}}</p>
          </li>
          <li class="sell-btn"><mt-button @click="Sell">卖出平仓</mt-button></li>
        </ul>
        <ul class="shade-set" v-if="shadeType === 3">
          <li class="set-first">查看止损止盈</li>
          <li class="set-win">
            <span>止盈：</span>
            <div><p></p></div>
            <span>{{rangeWin}}%</span>
          </li>
          <li class="set-loss">
            <span>止损：</span>
            <div><p></p></div>
            <span>{{rangeLoss}}%</span>
          </li>
        </ul>
      </div>
  </div>
</template>

<script>
import {mapMutations, mapGetters, mapState} from 'vuex'
import commonHeader from 'common/common-header'
import { MessageBox, Toast } from 'mint-ui'
import { fixDecimal, showTime } from '../../filter/index.js'
import * as btcApi from '../../api/btc-api.js'
export default {
  data () {
    return {
      tittle: '选股',
      rightText: '结算',
      num: 0,
      shadeType: 1,
      buttonText: '',
      accountMoney: '',
      ischeck: '1m',
      nowPrice: 0,
      buyPrice: '',
      sellPrice: '',
      buyNum: 5,
      sellNum: 0,
      sellId: '',
      pointprofit: '',
      financecoin: '',
      lossMoney: '',
      roomid: '',
      promisetotal: 0,
      rangeWin: 90,
      rangeLoss: 20,
      isShade: false,
      numArr: [5, 10, 15, 20],
      minData: [],
      isMin: true,
      positionList: [],
      noAct: [],
      dHistory: [],
      wsMIn: null,
      searchCondition: {// 分页属性
        pageNo: '1',
        pageSize: '5'
      },
      allLoaded: false
    }
  },
  created() {},
  mounted () {
    this.getRoomData()
    this.successMes('1m')
  },
  methods: {
    ...mapMutations({
      btcMoney: 'BTC_MONEY',
      btcRoom: 'BTC_ROOM'
    }),
    toBuy (type, price) {
      this.isShade = true
      this.shadeType = 1
      this.buyPrice = price
      if (type === 1) {
        this.buttonText = '确定买涨'
      } else {
        this.buttonText = '确定买跌'
      }
    },
    transfer (diretion) {
      if (diretion === 1) {
        this.$router.togo('/btc/order')
      } else {
        this.$router.togo('/btc/transfer')
      }
    },
    buyShade (type, num, rate) {
      this.isShade = true
      this.sellPrice = this.nowPrice
      if (type === 1) {
        this.shadeType = 2
        this.sellNum = num
        this.sellId = rate
      } else {
        this.shadeType = 3
        this.rangeWin = num * 100
        this.rangeLoss = rate * 100
      }
    },
    Sell () {
      let params = {
        entrustprice: this.sellPrice,
        entrustnum: this.sellNum,
        logid: this.sellId,
        pricetype: '1'
      }
      btcApi.sell(params).then((res) => {
        MessageBox({
          title: '提示',
          message: '委托卖出成功',
          showCancelButton: false
        }).then(action => {
          if (action === 'confirm') {
            this.getRoomData()
          }
        })
      })
    },
    buy (diretion) {
      let bullbear = ''
      let bullText = ''
      if (diretion === '确定买涨') {
        bullbear = '1'
        bullText = '买涨'
      } else {
        bullbear = '2'
        bullText = '买跌'
      }
      MessageBox({
        title: '提示',
        message: `<p>品种名称：BTC</p><p>委托方向：${bullText}</p><p>委托价格：${this.buyPrice} </p>
                  <p>委托份额：${this.buyNum}</p><p>止盈：90%</p><p>止损：80%</p><p>委托时间：${showTime(Date.parse(new Date()))}</p>`,
        showCancelButton: true
      }).then(action => {
        if (action === 'confirm') {
          // this.$router.push({path: '/regesiter', query: {mobile: this.username}})
          // if()
          let params = {
            entrustprice: this.buyPrice,
            entrustnum: this.buyNum.toString(),
            objectcode: 'btc',
            objectname: 'btc',
            market: 'BTCUSTD',
            pricetype: '1',
            bullbear: bullbear,
            winstop: '0.9',
            lossstop: '0.75',
            roomid: this.roomid
          }
          btcApi.buy(params).then((res) => {
            MessageBox({
              title: '提示',
              message: '委托买入成功',
              showCancelButton: false
            }).then(action => {
              if (action === 'confirm') {
                this.getRoomData()
              }
            })
          })
        }
      })
    },
    loadTop () {
      let params = {
        roomid: this.roomid,
        pagesize: '5',
        pageno: '1'
      }
      btcApi.getPositionList(params).then((res) => {
        this.positionList = res.data.list
        if (res.data.total <= res.data.pageno * res.data.pagesize) {
          this.allLoaded = true
        } else {
          this.allLoaded = false
        }
      })
      this.$refs.loadmore.onTopLoaded()
    },
    loadBottom () {
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
        btcApi.getPositionList(params).then((res) => {
          console.log(res)
          if (res.data.pagesize * res.data.pageno > res.data.total) {
            this.allLoaded = true
          } else {
            this.allLoaded = false
          }
          this.positionList = this.positionList.concat(res.data.details)
        })
      }
      this.$refs.loadmore.onBottomLoaded()
    },
    inputNum(e) {
      this.tranMoney = e.target.value.replace(/[^\d]/g, '')
    },
    addPlus (type, step) {
      switch (type) {
        case 1:
          this.buyPrice = fixDecimal([parseFloat(this.buyPrice) - step, 2])
          break
        case 2:
          this.buyPrice = fixDecimal([parseFloat(this.buyPrice) + step, 2])
          break
        case 3:
          this.buyNum -= step
          if (this.buyNum < 1) {
            this.buyNum = 1
          }
          break
        case 4:
          this.buyNum += step
          break
        case 5:
          this.sellPrice = fixDecimal([parseFloat(this.sellPrice) - step, 2])
          break
        case 6:
          this.sellPrice = fixDecimal([parseFloat(this.sellPrice) - step, 2])
          break
      }
    },
    getRoomData () {
      let params = {
        baseroomid: '20180608000001'
      }
      btcApi.getRoomBase(params).then((res) => {
        this.rangeWin = res.data.winrate.defalut * 100
        this.rangeLoss = res.data.lossrate.defalut * 100
        if (res.data.inroom) {
          let params = {
            baseroomid: '20180608000001'
          }
          btcApi.enter(params).then((res) => {
            this.roomid = res.data.roomid
            this.promisetotal = res.data.promisetotal
            this.pointprofit = res.data.pointprofit
            this.financecoin = res.data.financecoin
            this.accountMoney = res.data.enableamount
            this.btcRoom(res.data.roomid)
            this.btcMoney(res.data.enableamount)
            let params1 = {
              roomid: res.data.roomid,
              pagesize: '5',
              pageno: '1'
            }
            btcApi.getPositionList(params1).then((res) => {
              console.log(res)
              this.positionList = res.data.list
            })
          })
        } else {
          let params = {
            baseroomid: '20180608000001',
            principal: '0'
          }
          btcApi.addRoom(params).then((res) => {
            console.log(res)
          })
        }
      })
    },
    sendWay () {
      MessageBox({
        title: '提示',
        message: '确定结算交易并资金转出',
        showCancelButton: true
      }).then(action => {
        if (action === 'confirm') {
          let params = {
            roomid: this.roomid
          }
          btcApi.transferOutMoney(params).then((res) => {
            Toast({
              message: '结算成功'
            })
            this.$router.togo('/home')
          })
        }
      })
    },
    changeline (type) {
      this.colseWebsocket()
      this.ischeck = type
      this.noAct = []
      this.dHistory = []
      if (type === '1m') {
        this.minData = []
        this.successMes(type)
      } else if (type === '5m') {
        this.successMes(type)
      } else {
        this.successMes(type)
      }
    },
    successMes (type) {
      let wsMIn = this.wsMIn = new WebSocket('ws://ws.tzyj91.com/btc?type=' + type)
      wsMIn.onopen = function () {
        // Web Socket 已连接上，使用 send() 方法发送数据
        wsMIn.send('发送数据')
        console.log(type + '已连接')
      }
      wsMIn.onclose = function () {
        wsMIn.close()
        if (this.wsMIn) {
          this.wsMIn.close()
        }
        console.log(type + '关闭')
      }
      wsMIn.onmessage = (evt) => {
        if (type === '1m') {
          this.drawLine(evt.data, 3)
        } else if (type === '5m') {
          this.drawKline(evt.data, 1)
        } else {
          this.drawKline(evt.data, 2)
        }
      }
    },
    colseWebsocket () {
      this.wsMIn.close()
    },
    drawLine (res) {
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      let data = this.minData
      let msg = JSON.parse(res).data
      var lent = JSON.parse(res).data.length
      for (var j = 0; j < lent; j++) {
        data.push({
          name: new Date(msg[j].openTime).toString(),
          value: [new Date(msg[j].openTime), fixDecimal([msg[j].close, 2])]
        })
      }
      let option = {
        // title: {
        //   text: 'BTC分时图',
        //   left: 'center'
        // },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            params = params[0]
            var date = new Date(params.name)
            return '时间：' + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + '<br>价格：' + params.value[1]
          },
          axisPointer: {
            animation: false
          }
        },
        grid: {
          x: 45,
          y: 10,
          x2: 20,
          y2: 20
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: ['10%', '30%'],
          scale: true,
          splitLine: {
            show: false
          },
          splitNumber: 10
        },
        series: [{
          name: '模拟数据',
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          data: data
        }]
      }
      myChart.setOption(option)
      if (JSON.parse(res).symbol === 'actual') {
        var minStr = new Date(JSON.parse(res).data.openTime).getMinutes()
        var hourStr = new Date(JSON.parse(res).data.openTime).getHours()
        this.nowPrice = fixDecimal([JSON.parse(res).data.close, 2])
        if (minStr === data[119].value[0].getMinutes() && hourStr === data[119].value[0].getHours()) {
          data[119].value[1] = fixDecimal([JSON.parse(res).data.close, 2])
        } else {
          data.shift()
          data.push({
            name: new Date(JSON.parse(res).data.openTime).toString(),
            value: [new Date(JSON.parse(res).data.openTime), fixDecimal([JSON.parse(res).data.close, 2])]
          })
        }
        myChart.setOption(option)
      }
    },
    drawKline (res, type) {
      var myChart = this.$echarts.init(document.getElementById('myChart'))
      var data0 = []
      var upColor = '#ec0000'
      var upBorderColor = '#8A0000'
      var downColor = '#00da3c'
      var downBorderColor = '#008F28'
      var receivedMsg = res
      if (JSON.parse(receivedMsg).symbol === 'actual') {
        var len = this.noAct.length
        if (this.noAct[len - 1].openTime === JSON.parse(receivedMsg).data.openTime) {
          this.noAct = this.dHistory
          console.log(111)
        } else {
          this.noAct.shift()
          this.noAct.push(JSON.parse(receivedMsg).data)
        }
      } else {
        var length = JSON.parse(receivedMsg).data.length
        for (var i = 0; i < length; i++) {
          this.dHistory = JSON.parse(receivedMsg).data
          this.noAct = this.dHistory
        }
      }
      var categoryData = []
      var values = []
      this.noAct.forEach(function(item) {
        var date = new Date(item.openTime)
        if (type === 1) {
          categoryData.push((date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()))
        } else {
          categoryData.push(((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '/' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()))
        }
        // categoryData.push((date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()))
        values.push([fixDecimal([item.open, 2]), fixDecimal([item.close, 2]), fixDecimal([item.low, 2]), fixDecimal([item.high, 2])])
      })
      data0 = {
        categoryData: categoryData,
        values: values
      }
      var option = {
        // title: {
        //   text: 'BTC日k',
        //   left: 'center'
        // },
        tooltip: {
          trigger: 'axis',
          // axisPointer: {
          //   type: 'cross'
          // },
          formatter: function (params) {
            return '时间:' + params[0].name + '<br>' +
              '开盘:' + params[0].value[1] + '<br>' +
              '收盘:' + params[0].value[2] + '<br>' +
              '最低:' + params[0].value[3] + '<br>' +
              '最高:' + params[0].value[4]
          }
        },
        grid: {
          x: 45,
          y: 10,
          x2: 10,
          y2: 20
        },
        xAxis: {
          type: 'category',
          data: data0.categoryData,
          scale: true,
          boundaryGap: false,
          axisLine: {onZero: false},
          splitLine: {show: false},
          splitNumber: 20
        },
        yAxis: {
          scale: true,
          splitArea: {
            show: true
          }
        },
        dataZoom: [
          {
            show: false,
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            show: false,
            type: 'slider',
            y: '0%',
            start: 50,
            end: 100
          }
        ],
        series: [
          {
            name: '5分',
            type: 'candlestick',
            data: data0.values,
            itemStyle: {
              normal: {
                color: upColor,
                color0: downColor,
                borderColor: upBorderColor,
                borderColor0: downBorderColor
              }
            },
            markPoint: {
              label: {
                normal: {
                  formatter: function (param) {
                    console.log(param)
                    return param != null ? Math.round(param.value) : ''
                  }
                }
              },
              tooltip: {
                formatter: function (param) {
                  return param.name + '<br>' + (param.data.coord || '')
                }
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    }
  },
  beforeDestroy: function() {
    if (this.wsMIn) {
      this.colseWebsocket()
    }
  },
  watch: {
    nowPrice (idx) {
      this.positionList.forEach((item, index) => {
        if (item.bullbear === 2) {
          this.positionList[index].lossMoney = parseInt((-(item.holdnum * idx + item.totalsellamount - item.totalbuyamount) -
          item.pointfee / this.pointprofit / this.financecoin) * this.pointprofit * this.financecoin)
        } else {
          this.positionList[index].lossMoney = parseInt(((item.holdnum * idx + item.totalsellamount - item.totalbuyamount) -
          item.pointfee / this.pointprofit / this.financecoin) * this.pointprofit * this.financecoin)
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
.Router {
  background: #fff !important;
}
.index-accout {
  margin-top: 10px;
  p {
    padding-left: 20px;
    float: left;
    height: 30px;
    line-height: 30px;
  }
  button {
    float: right;
    font-size: 12px;
    height: 30px;
    border: 1px solid #248ad2;
    color: #248ad2;
    margin-right: 20px;
  }
}
.index-kchart {
  .index-min {
    line-height: 0.8rem;
    height: 0.8rem;
    margin: 0 5%;
    p {
      float: left;
    }
    div {
      float: right;
    }
  }
  .index-kline {
    height: 6rem;
    width: 100%;
  }
  ul {
    margin: 0 auto;
    display: table;
    margin-top: 10px;
    li {
      float: left;
      margin: 0 10px;
      height: 20px;
      line-height: 20px;
      border: 1px solid #248ad2;
      padding: 0 10px;
      border-radius: 5px;
      color: #248ad2;
    }
    .checkd {
      background: #248ad2;
      color: #fff;
    }
  }
  .index-buybtn {
    display: flex;
    margin: 10px 0;
    button {
      flex: 1;
      text-align: center;
      margin: 0 5%;
      height: 0.8rem;
      background: #01cc00;
      color: #fff;
    }
    button:first-of-type {
      background: red
    }
  }
  p {
    text-align: center;
  }
}
.index-title {
  display: flex;
  margin-top: 10px;
  background: #248ad2;
  p {
    flex: 1;
    text-align: center;
    line-height: 1rem;
    height: 1rem;
    color: #fff;
    font-size: 14px;
  }
}
.positionScroll {
  height: 4.8rem;
  overflow: scroll;
}
.index-buy {
  height: 60px;
  li {
    width: 20%;
    float: left;
    text-align: center;
    height: 30px;
    line-height: 30px;
  }
  div {
    display: flex;
    // height: 30px;
    width: 100%;
    button {
      flex: 1;
      height: 30px;
      border-radius: 0;
    }
  }
}
.shade-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  .shade-buy {
    background: #fafafa;
    position: absolute;
    bottom:0;
    left: 0;
    width: 90%;
    padding: 0 5%;
    li {
      margin-top: 10px;
    }
    .shade-type {
      display: flex;
      span {
        height: 30px;
        line-height: 30px;
      }
      input {
        flex: 1;
        height: 30px;
        border: 1px solid #248ad2;
        background: #fff;
      }
    }
    .shade-price,.shade-buyDet {
      display: flex;
      span {
        height: 30px;
        line-height: 30px;
      }
      input[type=button] {
        width: 30px;
        height: 30px;
        border: 1px solid #248ad2;
        background: #248ad2;
        color: #fff;
        border-radius: 5px;
      }
      input[type=text] {
        flex: 1;
        text-align: center;
        border: 1px solid #248ad2;
        margin: 0 10px;
      }
    }
    .shade-num {
      display: flex;
      input {
        flex: 1;
        margin-left: 20px;
        border-radius: 5px;
        height: 24px;
        background: #fff;
        border: 1px solid #248ad2;
        color: #248ad2;
      }
      :first-child {
        margin-left:0;
      }
      .active {
        background: #248ad2;
        color: #fff;
      }
    }
    .shade-win,.shade-loss {
      display: flex;
      span {
        height: 30px;
        line-height: 30px;
      }
      .mt-range {
        flex: 1;
      }
    }
    .shade-money {
      display: flex;
      span {
        height: 30px;
        line-height: 30px;
      }
      input {
        flex: 1;
        background: #fff;
        border: 1px solid #248ad2;
      }
    }
    .shade-btn {
      text-align: center;
      margin-bottom: 10px;
      button {
        height: 30px;
        width: 80%;
        background: #248ad2;
        color: #fff;
      }
    }
  }
  .shade-sell {
    position: absolute;
    bottom: 0;
    left: 0;
    background: #fff;
    width: 80%;
    padding: 0 10%;
    li {
      margin-bottom: 10px;
    }
    .sell-type {
      display: flex;
      height: 30px;
      line-height: 30px;
      margin-top: 10px;
      p {
        flex: 1;
        border: 1px solid #248ad2;
        text-align: center;
      }
    }
    .sell-price {
      display: flex;
      input[type=button] {
        width: 30px;
        height: 30px;
        border: 1px solid #248ad2;
        background: #248ad2;
        color: #fff;
        border-radius: 5px;
      }
      input[type=text] {
        flex: 1;
        text-align: center;
        border: 1px solid #248ad2;
        margin: 0 10px;
        height: 30px;
      }
    }
    .sell-num,.sell-money {
      display: flex;
      height: 30px;
      line-height: 30px;
      p {
        flex: 1;
        border: 1px solid #248ad2;
        text-align: center;
      }
    }
    .sell-btn {
      text-align: center;
      button {
        width: 60%;
        background: #248ad2;
        color: #fff;
      }
    }
  }
  .shade-set {
    position: absolute;
    bottom: 0;
    left: 0;
    background: #cacaca;
    width: 100%;
    padding-bottom: 50px;
    li {
      background: #fff;
      width: 80%;
      padding: 0 10%;
    }
    .set-first {
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-bottom: 1px solid #cacaca;
    }
    .set-win {
      display: flex;
      padding-top: 10px;
      div {
        flex: 1;
        p {
          background: red;
          width: 20px;
          height: 20px;
          border-radius: 10px;
        }
      }
    }
    .set-loss {
      display: flex;
      padding: 10px 10%;
      div {
        flex: 1;
        p {
          background: #01cc00;
          width: 20px;
          height: 20px;
          border-radius: 10px;
        }
      }
    }
  }
}
</style>
