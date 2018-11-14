<template>
  <div class="input-box" v-if="isipt">
    <div class="input-bg" v-if="isipt">
      <p class="input-money">{{iptval}}</p>
    </div>
    <div class="keyborad">
      <ul class="clearfix">
        <li @click.stop="keyWord('1')">1</li>
        <li @click.stop="keyWord('2')">2</li>
        <li @click.stop="keyWord('3')">3</li>
        <li @click.stop="keyWord('4')">4</li>
        <li @click.stop="keyWord('5')">5</li>
        <li @click.stop="keyWord('6')">6</li>
        <li @click.stop="keyWord('7')">7</li>
        <li @click.stop="keyWord('8')">8</li>
        <li @click.stop="keyWord('9')">9</li>
        <li>.</li>
        <li @click.stop="keyWord('0')">0</li>
        <li @click.stop="exit(false)"><img src="../assets/imgs/keybord.png"></li>
      </ul>
      <div>
        <p @click.stop="del"><img src="../assets/imgs/del.png"></p>
        <p @click.stop="exit(true)">确定</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      iptval: '',
      isipt: true
    }
  },
  methods: {
    keyWord (num) {
      this.iptval = this.iptval + num
    },
    del () {
      this.iptval = this.iptval.slice(0, this.iptval.length - 1)
    },
    exit (isTran) {
      this.isipt = false
      this.$emit('sendValue', this.iptval, this.isipt, isTran)
    }
  }
}
</script>
<style lang="less" scoped>
@import "~styles/index.less";
@import "~styles/variable.less";
.input-box{
  .input-bg {
    background: #fff;
    padding: 10px 0;
    .input-money {
      width: 80%;
      margin-left: 10%;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
      border: 1px solid #d7d7d7;
    }
  }
  .keyborad {
    ul {
      width: 80%;
      float: left;
      li {
        float: left;
        width: 33%;
        height: 1rem;
        text-align: center;
        line-height: 1rem;
        border-right: 1px solid #d7d7d7;
        border-top: 1px solid #d7d7d7;
        font-size: 14px;
        font-weight: 700;
        img {
          height: 0.6rem;
          margin-top: 0.2rem;
        }
      }
      border-bottom: 1px solid #d7d7d7;
    }
    div {
      width: 20%;
      float: left;
      border-bottom: 1px solid #d7d7d7;
      p {
        height: 2.03rem;
        line-height: 2rem;
        text-align: center;
        border-top: 1px solid #d7d7d7;
        font-weight: 600;
        font-size: 16px;
      }
      img {
         height: 0.6rem;
         margin-top: 0.8rem;
      }
    }
  }
}
</style>
