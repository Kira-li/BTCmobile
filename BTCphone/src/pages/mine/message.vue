<template>
  <div>
    <common-header :tittle="tittle"></common-header>
    <div class="page-content">
      <!-- <h1 @click="tohome">详情页面</h1> -->
      <div>
        <div class="mes-detail" v-if="isMes">
          <img src="../../assets/imgs/nomes.png" alt="">
          <p>暂无消息呦</p>
        </div>
        <div class="mes-detail" v-if="!isMes">
         <p>A股消息</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
export default {
  data () {
    return {
      tittle: '消息中心',
      isMes: true
    }
  },
  components: {
    commonHeader
  },
  methods: {
    tohome () {
      this.$router.goBack()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "~styles/index.less";
@import "~styles/variable.less";
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
</style>
