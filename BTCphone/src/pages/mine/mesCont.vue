<template>
  <div>
    <common-header :tittle="tittle" :showback="true"></common-header>
    <div class="page-content" v-html="cont"></div>
  </div>
</template>

<script>
import {mapMutations, mapGetters, mapState} from 'vuex'
import { getSysMsg, getArticle } from '../../api/user-api.js'
import commonHeader from 'common/common-header'
export default {
  data () {
    return {
      tittle: '',
      num: 0,
      cont: ''
    }
  },
  created() {},
  mounted () {
    this.getTitle()
  },
  methods: {
    ...mapMutations({
      setNum: 'SET_NUM'
    }),
    todetail () {
      this.$router.togo('/Home/Detail')
    },
    getTitle () {
      this.tittle = this.$route.query.title
      let params = {
        id: this.$route.query.id.toString()
      }
      if (this.$route.query.type === 1) {
        getSysMsg(params).then((res) => {
          this.cont = res.data.sysMsg.content
        })
      } else {
        getArticle(params).then((res) => {
          this.cont = res.data.article.content
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
