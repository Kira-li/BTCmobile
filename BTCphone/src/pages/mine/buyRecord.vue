<template>
  <div>
    <common-header :tittle="tittle" :showback="true"></common-header>
    <div class="page-content">
        <!-- tab-container -->
      <div class="page-scroll">
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :auto-fill="false" ref="loadmore">
            <ul class="item-buy" v-for="(val, key) in pageList" :key='key'>
                <li>购买数量:<span>{{val.amount}}金币</span></li>
                <li>购买方式:{{val.ext | payWay}}</li>
                <li>交易时间:{{val.createtime | showTime}}</li>
                <li>订单状态:{{val.result | states}}</li>
            </ul>
        </mt-loadmore>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapGetters, mapState} from 'vuex'
import { Toast } from 'mint-ui'
import commonHeader from 'common/common-header'
import { showTime } from '../../filter/index.js'
import { getAmountDetail } from '../../api/pay-api.js'
export default {
  data () {
    return {
      tittle: '购买记录',
      num: 0,
      selected: '2',
      searchCondition: {// 分页属性
        pageNo: '1',
        pageSize: '5'
      },
      pageList: [],
      allLoaded: false, // 是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
      scrollMode: 'auto'//  移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
    }
  },
  created() {},
  mounted() {
    this.loadPageList(this.selected)
  },
  methods: {
    ...mapMutations({
      setNum: 'SET_NUM'
    }),
    loadTop () {
      this.loadPageList(this.selected, this.searchCondition.pageNo)
      this.$refs.loadmore.onTopLoaded()
    },
    loadBottom () {
      this.more()
      this.$refs.loadmore.onBottomLoaded()
    },
    loadPageList (index, pageNo) {
      let params = {
        operatetype: '1',
        pagesize: '5',
        pageno: pageNo
      }
      // if ()
      getAmountDetail(params).then((res) => {
        console.log(res)
        this.pageList = res.data.details
      })
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
          operatetype: this.selected,
          pagesize: '5',
          pageno: this.searchCondition.pageNo
        }
        getAmountDetail(params).then((res) => {
          console.log(res)
          if (res.data.pagesize * res.data.pageno > res.data.total) {
            this.allLoaded = true
          } else {
            this.allLoaded = false
          }
          this.pageList = this.pageList.concat(res.data.details)
        })
      }
    }
  },
  watch: {
    selected: function (val, oldVal) {
      console.log(val, oldVal)
      this.loadPageList(val)
    }
  },
  components: {
    commonHeader
  },
  filters: {
    showTime,
    states (val) {
      if (val === 1) {
        return '确认中'
      } else if (val === 2) {
        return '成功'
      } else {
        return '拒绝'
      }
    },
    payWay (val) {
      switch (val) {
        case 1:
          return '支付宝'
        case 2:
          return '微信'
        case 3:
          return '银行卡'
        case 4:
          return 'A股'
        case 5:
          return 'BTC'
        default:
          return '新手体验'
      }
    },
    accountType (val) {
      switch (val) {
        case 1:
          return 'BTC'
        case 2:
          return 'A股'
        default:
          return 'A股'
      }
    }
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
.mint-navbar .mint-tab-item-label {
  font-size: 16px !important;
}
.item-buy,.item-despoit,.item {
  padding: 10px 0;
  border-bottom: 1px solid #999;
  li {
    margin-left: 5%;
    height: 20px;
  }
  span {
    color: red;
  }
}
.page-scroll {
  overflow: scroll;
  height: 16rem;
  width: 100%;
//   position: fixed;
//   top: 1.33rem;
//   left: 0;
  background: @body-bg-color;
}
.mint-navbar .mint-tab-item.is-selected {
  margin-bottom: 0px;
}
</style>
