<template>
  <div>
    <common-header :tittle="tittle" :showback="true"></common-header>
    <div class="page-content">
      <!-- <h1 @click="tohome">详情页面</h1> -->
      <div class="mes">
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :auto-fill="false" ref="loadmore">
          <div class="mes-detail" v-if="isMes">
            <img src="../../assets/imgs/nomes.png" alt="">
            <p>暂无消息呦</p>
          </div>
          <div class="mes-title" v-if="!isMes">
            <ul>
              <li v-for="(item,key) in messageTitle" :key="key" @click="toMes(item.id,item.title,1)">
                <p>{{item.title}}</p>
                <div>{{item.createtime | showTime}}</div>
              </li>
            </ul>
          </div>
        </mt-loadmore>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import { showTime } from '../../filter/index.js'
import { sysMsg } from '../../api/user-api.js'
export default {
  data () {
    return {
      tittle: '消息中心',
      isMes: false,
      messageTitle: []
    }
  },
  mounted () {
    this.getTitle()
  },
  components: {
    commonHeader
  },
  methods: {
    toMes (id, title, type) {
      this.$router.push({path: '/mine/mesCont', query: {id: id, title: title, type: type}})
    },
    getTitle () {
      let params = {
        pageno: '1',
        pagesize: '999'
      }
      sysMsg(params).then((res) => {
        console.log(res)
        this.messageTitle = res.data.list
      })
    },
    loadTop () {
      this.$refs.loadmore.onTopLoaded()
    },
    loadBottom () {
      this.$refs.loadmore.onBottomLoaded()
    }
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
  height: 100%;
  .mes {
    height: 90%;
  }
}
.mes-detail {
  text-align: center;
  margin-top: 2rem;
  img {
    width: 50%;
  }
  p {
    font-size: 18px;
    color: #999999;
    font-weight: 700;
    margin-top: 20px;
  }
}
.mes-title {
  height: 100%;
  li {
    border-bottom: 1px solid #999999;
    padding-left: 10px;
  }
  p {
    height: 1rem;
    line-height: 1rem;
  }
  div {
    color: #999999;
    margin-bottom: 10px;
  }
}
</style>
