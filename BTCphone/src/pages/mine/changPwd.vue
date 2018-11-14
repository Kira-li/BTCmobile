<template>
  <div>
    <common-header :tittle="tittle" :showback="true"></common-header>
    <div class="page-content">
      <ul>
        <li class="clearfix" @click='todetail'>
          <p>修改与设置登录密码</p>
          <div><i class="icon iconfont icon-arrow-right"></i></div>
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
      tittle: '设置中心',
      num: 0
    }
  },
  created() {},
  methods: {
    ...mapMutations({
      setNum: 'SET_NUM'
    }),
    todetail() {
      this.$router.togo('/fgtpwd')
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
ul {
  background: #fff;
  li {
    width: 90%;
    margin: 0 auto;
    height: 1rem;
    line-height: 1rem;
    p {
      float: left;
    }
    div {
      float: right;
    }
  }
}
</style>
