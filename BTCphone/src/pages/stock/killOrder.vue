<template>
  <div>
    <common-header :tittle="tittle" :showback="true"></common-header>
    <div class="page-content">
      <!-- <mt-button @click="todetail">user</mt-button> -->
      <ul class="title">
        <li>
          <p>股票名称</p>
          <p>股票代码</p>
        </li>
        <li>方向</li>
        <li>
          <p>价格</p>
          <p>股数</p>
        </li>
        <li>
          <p>日期</p>
          <p>时间</p>
        </li>
        <li>撤单</li>
      </ul>
      <div class="cont">
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :auto-fill="false" ref="loadmore">
          <ul v-for="(item,key) in entrustList" :key="key">
            <li>
              <p>{{item.objectname}}</p>
              <p>{{item.objectcode}}</p>
            </li>
            <li v-text="item.tradetype == 1 ? '买入':'卖出'"></li>
            <li>
              <p>{{item.entrustprice}}</p>
              <p>{{item.entrustnum}}</p>
            </li>
            <li>
              <p>{{[item.createtime,true] | showTime(item.createtime,true)}}</p>
              <p>{{[item.createtime,false] | showTime(item.createtime,false)}}</p>
            </li>
            <li>
              <mt-button @click="todetail(item.logid)">撤销买单</mt-button>
            </li>
          </ul>
        </mt-loadmore>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapGetters, mapState} from 'vuex'
import commonHeader from 'common/common-header'
import { getEntrustList, cancelEntrust } from '../../api/stock-api.js'
import { Toast, MessageBox } from 'mint-ui'
export default {
  data () {
    return {
      tittle: '炒股',
      rightText: '结算',
      num: 0,
      entrustList: [],
      searchCondition: {// 分页属性
        pageNo: '1',
        pageSize: '10'
      },
      allLoaded: false
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
    todetail(targetid) {
      // this.$router.togo('/Home/Detail')
      let params = {
        targetid: targetid
      }
      cancelEntrust(params).then((res) => {
        MessageBox({
          title: '提示',
          message: '撤单成功',
          showCancelButton: false
        }).then(action => {
          if (action === 'confirm') {
            this.getListdata()
          }
        })
      })
    },
    getListdata () {
      let params = {
        roomid: this.stockRoom,
        pageno: '1',
        pagesize: '10'
      }
      this.searchCondition.pageNo = '1'
      getEntrustList(params).then((res) => {
        console.log(res)
        this.entrustList = res.data.list
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
        getEntrustList(params).then((res) => {
          if (res.data.pagesize * res.data.pageno >= res.data.total) {
            this.allLoaded = true
          } else {
            this.allLoaded = false
          }
          this.entrustList = this.entrustList.concat(res.data.list)
        })
      }
    }
  },
  components: {
    commonHeader
  },
  filters: {
    showTime ([val, onlyDate]) {
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
.Router {
  background: #fff !important;
}
.title {
  display: flex;
  border-bottom: 2px solid #999;
  li {
    flex: 1;
    text-align: center;
    height: 1.2rem;
    line-height: 1.2rem;
    p {
      height: 0.6rem;
      line-height: 0.6rem;
    }
  }
}
.cont {
  ul {
    display: flex;
    li {
      flex: 1;
      text-align: center;
      height: 1.2rem;
      line-height: 1.2rem;
      color: #999;
      border-bottom: 1px solid #999;
      p {
        height: 0.6rem;
        line-height: 0.6rem;
      }
      button {
        height: 0.8rem;
        font-size: 12px;
        border: 1px solid #248ad2;
        color: #248ad2;
        padding: 0 6px;
      }
    }
  }
}
</style>
