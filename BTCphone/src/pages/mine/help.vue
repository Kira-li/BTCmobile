<template>
  <div>
    <common-header :tittle="tittle" :showback="true"></common-header>
    <div class="page-content">
      <!-- <mt-button @click="todetail">user</mt-button> -->
      <div v-html="html"></div>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapGetters, mapState} from 'vuex'
import commonHeader from 'common/common-header'
import axios from 'axios'
export default {
  data () {
    return {
      tittle: '帮助中心与教程',
      num: 0,
      html: '',
      url: 'http://static.tzyj91.com/help.html'
    }
  },
  created() {},
  mounted () {
    this.load(this.url)
  },
  methods: {
    ...mapMutations({
      setNum: 'SET_NUM'
    }),
    todetail() {
      this.$router.togo('/Home/Detail')
    },
    load (url) {
      if (url && url.length > 0) {
        let param = {
          accept: 'text/html, text/plain',
          header: 'Access-Control-Allow-Origin'
        }
        axios.get(url, param).then((response) => {
          this.html = response.data
        }).catch(() => {
          this.loading = false
          this.html = '加载失败'
          window.location.reload()
        })
      }
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
