<template>
  <div>
    <common-header :tittle="tittle" :showback="false" :showmore="rightText"></common-header>
    <div class="page-content">
      <!-- <mt-button @click="todetail">user</mt-button> -->
      <ul>
          <li>入金资产:</li>
          <li>总收益(率):</li>
          <li>可用额:</li>
          <li>股票市值:</li>
          <li>最高可亏损额:</li>
          <li>
              <mt-button @click="todetail">买入</mt-button>
              <mt-button @click="todetail">撤单</mt-button>
              <mt-button @click="todetail">查询</mt-button>
              <mt-button @click="todetail">转入</mt-button>
          </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapGetters, mapState} from 'vuex'
import commonHeader from 'common/common-header'
export default {
  data () {
    return {
      tittle: '炒股',
      rightText: '结算',
      num: 0
    }
  },
  created() {},
  methods: {
    ...mapMutations({
      setNum: 'SET_NUM'
    }),
    todetail() {
      this.$router.togo('/Home/Detail')
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
</style>
