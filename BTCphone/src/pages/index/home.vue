<template>
  <div>
    <common-header :showinput="true" :showback="false" :tittle="tittle"></common-header>
    <div class="page-content">
      <mt-swipe :auto="4000">
        <mt-swipe-item v-for="(item,key) in bannerImg" :key="key">
          <img :src="item.url">
        </mt-swipe-item>
      </mt-swipe>
      <div class="index_market">
        <div class="index_zs clearfix">
          <p class="zs_left">指数行情</p>
          <p class="zs_right" @click="todetail">更多&nbsp;>></p>
        </div>
        <div class="clearfix index-profit">
          <ul v-for="(item,key) in indexData" :key="key" >
            <li>{{item.indexname}}</li>
            <li :class="item.profit>0 ? 'index-red': 'index-green'">{{item.price}}</li>
            <li :class="item.profit>0 ? 'index-red': 'index-green'">{{item.profit}}%</li>
          </ul>
        </div>
      </div>
      <div class="index_type">
        <p>股票配资</p>
        <div class="clearfix">
          <ul v-for="(item,key) in modelData" :key="key" :logid="item.logid" :roomtype="item.roomtype" :status="item.status" @click='enterRoom(item.status,item.roomtype,item.logid)'>
            <li class="clearfix"><img :src="item.pic" ></li>
            <li class="index-modelName">{{item.roomname}}</li>
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
import * as homeApi from 'api/home-api'
import { getRoomBase } from 'api/stock-api'
import { tokenByLogin } from 'api/user-api'
import axios from 'axios'
import { baseUrl } from '../../apiconfig/index'
// import { ERR_OK } from 'config/index'
export default {
  data () {
    return {
      num: 0,
      tittle: '首页',
      bannerImg: [],
      indexData: [],
      modelData: []
    }
  },
  created() {
    axios.post(baseUrl + 'home/getVersion', {}).then(function(res) {
      let timedif = new Date().getTime() - res.data.data.timestamp
      localStorage.setItem('timedif', timedif)
    }).catch(function (err) {
      console.log(err)
    })
  },
  mounted () {
    this.tokenLogin()
    this.getHome()
  },
  methods: {
    ...mapMutations({
      setNum: 'SET_NUM'
    }),
    todetail() {
      this.$router.togo('/market')
    },
    tokenLogin () {
      let params = {
        token: localStorage.getItem('token')
      }
      tokenByLogin(params).then((res) => {
        if (res.code !== 200) {
          this.$router.togo('/login')
        } else {
          localStorage.setItem('token', res.data.token)
        }
      })
    },
    getHome() {
      let params = {}
      let params1 = {}
      let params2 = {}
      homeApi.getBanner(params).then((res) => {
        this.bannerImg = res.data.list
      })
      homeApi.getMarketIndex(params1).then((res) => {
        this.indexData = res.data.list
      })
      homeApi.getBaseRoom(params2).then((res) => {
        this.modelData = res.data.list
      })
    },
    enterRoom(status, roomtype, logid) {
      if (status === 1) {
        if (roomtype === 2) {
          let params = {
            baseroomid: logid
          }
          getRoomBase(params).then((res) => {
            console.log(res)
            if (res.data.inroom) {
              this.$router.togo('stock/stock')
            } else {
              this.$router.togo('stock/chooseLever')
            }
          })
        } else {
          this.$router.togo('/btc/index')
        }
      } else {
        Toast({
          message: '暂未开放',
          position: 'bottom',
          duration: 3000
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
.mint-swipe {
  height: 200px;
  img {
    width: 100%;
    height: 200px;
  }
}
.index_market {
  padding: 0 5%;
  background: #fff;
  margin-bottom: 10px;
  .index_zs {
    .zs_left {
      float: left;
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid @base-color;
      color: @base-color;
      font-weight: 600;
      font-size: 14px;
    }
    .zs_right {
      float: right;
      height: 24px;
      line-height: 24px;
      font-weight: 600;
      padding: 0 10px;
      border-radius: 5px;
      background: #0169b2;
      color: #fff;
      margin-top:6px;
    }
  }
  .index-profit {
    display: flex;
    margin-top: 10px;
    ul {
      float: left;
      flex: 1;
      li {
        margin-bottom: 10px;
        font-size: 12px;
        text-align: center;
      }
    }
    .index-red {
      color: red;
    }
    .index-green {
      color: green;
    }
  }
}
.index_type {
  p {
    background: #fff;
    padding-left: 5%;
    height: 30px;
    line-height: 30px;
    color: @base-color;
    font-weight: 600;
    font-size: 14px;
  }
  div {
    padding: 5% 5%;
    ul {
      width: 31%;
      float: left;
      background: #fff;
      border-radius: 5px;
      margin-right: 3%;
      margin-top: 10px;
      img {
        width: 80%;
        margin: 10px 0;
      }
      .index-modelName {
        text-align: center;
        height: 24px;
      }
      :first-child {
        vertical-align: middle;
        text-align: center;
      }
    }
    :nth-child(3) {
      margin-right: 0;
    }
  }
}
</style>
