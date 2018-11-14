<template>
  <div>
    <common-header :tittle="tittle" :showback="true"></common-header>
    <div class="page-content">
      <!-- <mt-button @click="todetail">user</mt-button> -->
      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :auto-fill="false" ref="loadmore">
        <ul v-for="(item,key) in targetList" :key="key">
          <li class="first-bg">{{item.objectname}}({{item.objectcode}})</li>
          <li>
            <p>方向：{{item.tradetype == 1 ? '委托买入': '委托卖出'}}</p>
            <p v-if="item.tradestate ==1">操作类型：委托中</p>
            <p v-if="item.tradestate ==2">操作类型：委托成交</p>
            <p v-if="item.tradestate ==3">操作类型：撤单</p>
          </li>
          <li>
            <p>股数：{{item.entrustnum}}</p>
            <p>交易金额：{{item.tradeamount}}</p>
          </li>
          <li>
            <p>委托价：{{item.entrustprice}}</p>
            <p>成交价：{{item.tradeprice}}</p>
          </li>
          <li>账户管理费：{{item.pointfee}}</li>
          <li>委托时间：{{item.entrusttime | showTime}}</li>
          <li>成交时间：{{item.tradetime | showTime}}</li>
        </ul>
      </mt-loadmore>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapGetters, mapState} from 'vuex'
import commonHeader from 'common/common-header'
import { getTargetList } from '../../api/stock-api.js'
import { Toast } from 'mint-ui'
import { showTime } from '../../filter/index.js'
export default {
  data () {
    return {
      tittle: '炒股',
      num: 0,
      targetList: []
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
    todetail() {
      this.$router.togo('/Home/Detail')
    },
    getListdata () {
      let params = {
        roomid: this.stockRoom,
        pageno: '1',
        pagesize: '10'
      }
      getTargetList(params).then((res) => {
        console.log(res)
        this.targetList = res.data.list
        if (res.data.pagesize * res.data.pageno >= res.data.total) {
          this.allLoaded = true
        } else {
          this.allLoaded = false
        }
      })
    },
    loadTop () {
      this.getListdata()
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
          roomid: this.stockRoom,
          pageno: this.searchCondition.pageNo,
          pagesize: '10'
        }
        getTargetList(params).then((res) => {
          if (res.data.pagesize * res.data.pageno >= res.data.total) {
            this.allLoaded = true
          } else {
            this.allLoaded = false
          }
          this.targetList = this.targetList.concat(res.data.list)
        })
      }
    }
  },
  filters: {
    showTime
  },
  components: {
    commonHeader
  },
  computed: {
    ...mapGetters([
      'stockRoom'
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
ul {
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
</style>
