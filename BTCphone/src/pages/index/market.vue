<template>
  <div>
    <common-header :tittle="tittle" :showback="true"></common-header>
      <div class="page-content">
        <ul class="market-title clearfix">
            <li>名称</li>
            <li>指数</li>
            <li>涨跌幅%</li>
        </ul>
        <div v-for="(item,key) in indexData" :key="key" class="market-cont">
            <ul>
                <li>
                  <p>{{item.indexname}}</p>
                  <p>{{item.indexcode}}</p>
                </li>
                <li :class="item.profit>0 ? 'index-red': 'index-green'">{{item.price}}</li>
                <li :class="item.profit>0 ? 'index-red': 'index-green'">{{item.profit}}</li>
            </ul>
        </div>
      </div>
  </div>
</template>

<script>
import {mapMutations, mapGetters, mapState} from 'vuex'
import commonHeader from 'common/common-header'
import * as homeApi from 'api/home-api'
export default {
  data () {
    return {
      tittle: '行情指数',
      num: 0,
      indexData: []
    }
  },
  created() {},
  activated () {
    this.todetail()
  },
  methods: {
    ...mapMutations({
      setNum: 'SET_NUM'
    }),
    todetail() {
      let params = {}
      homeApi.getMarketIndex(params).then((res) => {
        // console.log(res)
        this.indexData = res.data.list
      }).catch(() => {

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
.market-title {
    display: flex;
    li {
        flex: 1;
        float: left;
        text-align: center;
        line-height: 1rem;
        height: 1rem;
        background: #fff;
        font-size: 14px;
    }
}
.market-cont {
    margin-top: 10px;
    ul {
        display: flex;
        li {
          float: left;
          flex: 1;
          text-align: center;
          height: 1rem;
          // line-height: 1rem;
        }
        .index-red {
            color: red;
            line-height: 1rem;
        }
        .index-green {
            color: green;
            line-height: 1rem;
        }
    }
}
</style>
