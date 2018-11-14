<template>
  <div>
    <common-header :tittle="tittle" :showback="true"></common-header>
    <div class="page-content">
      <!-- <mt-button @click="todetail">user</mt-button> -->
      <ul>
        <li>购买步骤：</li>
        <li>1、长按二维码启动支付宝APP支付</li>
        <li>2、请您在转账付款金额时，务必填写选择<span>支付方式右上角随机生成的实际购买金额小数</span>，例如转账金额<span>100.16</span>或<span>100.66</span>等，以便相关财务人员更快确认你的转账金额并充值。</li>
        <li>3、为了方便快速审核，在转账时请备注你的<span>账户ID和注册手机号</span>。</li>
      </ul>
      <div><img :src="imgSrc" alt="" @touchstart="openUrl"></div>
    </div>
  </div>
</template>
<script src="./static/js/jquery.min.js"></script>
<script src="./static/js/reqrcode.js"></script>
<script>
import {mapMutations, mapGetters, mapState} from 'vuex'
import commonHeader from 'common/common-header'
import { MessageBox } from 'mint-ui'
export default {
  data () {
    return {
      tittle: '购买',
      num: 0,
      imgSrc: ''
    }
  },
  created() {
    if (this.$route.query.imgSrc) {
      this.imgSrc = this.$route.query.imgSrc
    }
  },
  methods: {
    ...mapMutations({
      setNum: 'SET_NUM'
    }),
    todetail() {
      this.$router.togo('/Home/Detail')
    },
    openUrl() {
      MessageBox({
          title: '提示',
          message: '识别到二维码，是否跳转打开？',
          showCancelButton: true
        }).then(action => {
          if (action === 'confirm') {
            qrcode.decode(this.imgSrc)
            qrcode.callback = function (imgMsg) {
              window.location.href = imgMsg
            }
          }
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
.page-content {
  ul {
    background: #fff;
    li {
      padding: 0 5%;
      font-size: 14px;
      line-height: 30px;
      span {
          color: red;
      }
    }
  }
  div {
    text-align: center;
    margin-top: 20px;
    img {
      width: 60%;
      text-align: center;
    }
  }
}
</style>
