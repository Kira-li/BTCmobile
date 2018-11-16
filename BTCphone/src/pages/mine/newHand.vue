<template>
  <div>
    <common-header :tittle="tittle" :showback="true"></common-header>
    <div class="page-content">
      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :auto-fill="false" ref="loadmore">
          <div class="mes-title">
            <ul>
              <li v-for="(item,key) in messageTitle" :key="key" @click="toMes(item.id,item.title,2)">
                <p>{{item.title}}</p>
                <div>{{item.createtime | showTime}}</div>
                <img src="../../assets/imgs/hot.png" alt="" v-if="item.ishot">
              </li>
            </ul>
          </div>
        </mt-loadmore>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapGetters, mapState} from 'vuex'
import commonHeader from 'common/common-header'
import { showTime } from '../../filter/index.js'
import { article } from '../../api/user-api.js'
export default {
  data () {
    return {
      tittle: '新手攻略',
      num: 0,
      messageTitle: []
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
    toMes (id, title, type) {
      // this.$router.togo('/mine/mesCont')
      this.$router.push({path: '/mine/mesCont', query: {id: id, title: title, type: type}})
    },
    getTitle () {
      let params = {
        pageno: '1',
        pagesize: '999'
      }
      article(params).then((res) => {
        console.log(res)
        this.messageTitle = res.data.list
      })
    },
    loadTop () {
      this.getTitle()
      this.$refs.loadmore.onTopLoaded()
    },
    loadBottom () {
      this.getTitle()
      this.$refs.loadmore.onBottomLoaded()
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
  },
  filters: {
    showTime
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "~styles/index.less";
@import "~styles/variable.less";
.page-content {
  height: 92%;
}
.mes-title {
  height: 100%;
  background: #EDEFF2;
  overflow: scroll;
  li {
    border-bottom: 1px solid #999999;
    padding-left: 10px;
    position: relative;
  }
  p {
    height: 1rem;
    line-height: 1rem;
  }
  div {
    color: #999999;
    margin-bottom: 10px;
  }
  img {
    position: absolute;
    top: 0.5rem;
    right: 20px;
    width: 30px;
  }
}
</style>
