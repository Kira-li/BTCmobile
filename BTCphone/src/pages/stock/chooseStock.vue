<template>
  <div>
    <common-header :tittle="tittle" :showback="true"></common-header>
    <div class="page-content">
      <div class="search">
        <input type="text" placeholder="输入股票代码或拼音或中文名称" @focus="isChoose = false" v-model="searchCode">
        <p @click="searchCode=''"><i class="icon iconfont icon-guanbi"></i></p>
        <mt-button @click="search(searchCode)">搜索</mt-button>
      </div>
      <div v-if="isChoose">
        <div class="list-title">
          <p>名称</p>
          <p>最新价</p>
          <p>涨跌幅</p>
        </div>
        <div>
          <div class="cont-scroll list-cont" v-for="(item,key) in selfStockList" :key="key">
            <mt-cell-swipe
            :right="[
              {
                content: '删除',
                style: { background: '#ff7900', color: '#fff',width:'60px',textAlign:'center'},
                handler: () => deleteSection(item.code,item.name,item.market,item.logid)
              }
            ]">
            <ul v-if="selfStockList" @click="goBuy(item.code,item.market)">
              <li>
                <div>
                  <p>{{item.name}}</p>
                  <p>{{item.code}}</p>
                </div>
              </li>
              <li>{{item.nowprice}}</li>
              <li><mt-button :class="item.diffrate>0 ? 'index-red': 'index-green'">{{item.diffrate}}%</mt-button></li>
            </ul>
            </mt-cell-swipe>
          </div>
        </div>
      </div>
      <div v-else class="list-choose">
        <p>自选股</p>
        <div class="list-scroll">
          <ul v-for="(item,key) in searchStockList" :key="key" @click="goBuy(item.code,item.market)">
            <li>{{item.name}}</li>
            <li>{{item.code}}</li>
            <li><p v-if="!item.isself" @click.stop="addStock(item.name,item.code,item.market)">+</p></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapGetters, mapState} from 'vuex'
import commonHeader from 'common/common-header'
import { Toast } from 'mint-ui'
import { getSelfStockList, searchStock, addSelfStock, delSelfStock, getRoomBase } from '../../api/stock-api.js'
export default {
  data () {
    return {
      tittle: '选股',
      num: 0,
      isChoose: true,
      searchCode: '',
      selfStockList: [],
      searchStockList: []
    }
  },
  created() {},
  mounted () {
    this.getListdata()
  },
  methods: {
    ...mapMutations({
      setNum: 'SET_NUM'
    }),
    getListdata() {
      let params = {
        pageno: '1',
        pagesize: '10'
      }
      getSelfStockList(params).then((res) => {
        this.selfStockList = res.data.list
      })
    },
    search (valData) {
      let regChinese = /^[\u4e00-\u9fa5]+$/
      let regNumber = /^\d+$/
      let params = {}
      if (regChinese.test(valData)) {
        params = {name: valData}
      } else if (regNumber.test(valData)) {
        params = {code: valData}
      } else {
        params = {pinyin: valData}
      }
      searchStock(params).then((res) => {
        this.searchStockList = res.data.list
      })
    },
    addStock (name, code, market) {
      let params = {
        name: name,
        code: code.toString(),
        market: market
      }
      addSelfStock(params).then((res) => {
        Toast('添加成功')
        this.search(this.searchCode)
      })
    },
    deleteSection (code, name, market, logid) {
      let params = {
        name: name,
        code: code.toString(),
        market: market,
        logid: logid
      }
      delSelfStock(params).then((res) => {
        Toast('删除成功')
        this.getListdata()
      })
    },
    goBuy (code, name) {
      // this.$router.togo('/stock/stockBuy')
      let params = {
        baseroomid: '20180608000002'
      }
      getRoomBase(params).then((res) => {
        if (res.data.inroom) {
          this.$router.push({path: '/stock/stockBuy', query: {code: code, market: name}})
        } else {
          this.$router.togo('/stock/chooseLever')
        }
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
.search {
  display: flex;
  padding: 0.2rem 5%;
  position: relative;
  input {
    flex: 1;
    padding-left: 10px;
  }
  .icon-guanbi {
    color: #666;
  }
  p {
    position: absolute;
    top: 0.5rem;
    right: 2.8rem;
    z-index: 10;
  }
  button {
    border-radius: 0;
    background: #248ad2;
    color: #fff;
    width: 2rem;
  }
}
.list-title {
  display: flex;
  background: #248ad2;
  p {
    flex: 1;
    text-align: center;
    color: #fff;
    height: 1rem;
    line-height: 1rem;
    font-size: 16px;
  }
}
.list-cont {
  ul {
    display: flex;
    width:100%;
    li {
      flex: 1;
      text-align: center;
      height: 1.6rem;
      line-height: 1.6rem;
      font-size: 14px;
      border-bottom: 1px solid #999;
      div {
        p {
          // width: 100%;
          height: 0.8rem;
          line-height: 0.8rem;
        }
      }
      button {
        font-size: 14px;
        width: 2rem;
      }
    }
  }
  .index-red {
    background: red;
    color: #fff;
  }
  .index-green {
    background: #01cc00;
    color: #fff;
  }
}
.list-choose {
  p {
    height: 1rem;
    line-height: 1rem;
    font-size: 16px;
    background: #248ad2;
    color: #fff;
    text-align: center;
  }
  ul {
    display: flex;
    background: #fff;
    li {
      flex: 1;
      text-align: center;
      border-bottom: 1px solid #999;
      line-height: 1rem;
      height: 1rem;
      margin: auto;
      position: relative;
    }
  }
  .list-scroll {
    height: 14rem;
    overflow: scroll;
    p {
      position: absolute;
      top: 50%;
      left:50%;
      margin-left: -10px;
      margin-top: -10px;
      width: 20px;
      height: 20px;
      line-height: 20px;
      border-radius: 10px;
      font-size: 16px;
    }
  }
}
.mint-cell-value {
  width: 100% !important;
}
</style>
