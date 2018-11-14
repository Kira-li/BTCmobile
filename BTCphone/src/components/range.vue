<template>
  <div class="range-box">
    <div><input type="range" name="" id="" min="min" max="max" value="val" @swipeleft="changeWid"></div>
    <p :style="{width: widNum + 'px'}"></p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      widNum: 80,
      num: 0
    }
  },
  props: {
    min: {
      type: String,
      default: '0'
    },
    max: {
      type: String,
      default: '100'
    },
    val: {
      type: String,
      default: '30'
    }
  },
  methods: {
    changeWid () {
      console.log(11)
      this.num += 1
      var arr = [80, 160]
      this.num = this.num > 1 ? 1 : this.num
      this.widNum = arr[this.num]
    }
  }
}
</script>
<style lang="less" scoped>
@import "~styles/index.less";
@import "~styles/variable.less";
.range-box {
  position: relative;
  height: 30px;
  div {
    position: absolute;
    top: 0;
    left: 0;
    // background: green;
  }
  p {
    position: absolute;
    top: 0;
    left: 0;
    background: red;
    height: 20px;
    // width: 300px;
    z-index: 10;
  }
  input[type=range] {
      // 去除浏览器默认的样式
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 300px;
    border-radius: 10px;
    &:focus {
      // 去除落焦时的外边框效果
      outline: none;
    }
  }
  input[type=range]::-webkit-slider-runnable-track {
    height: 20px;
    border-radius: 10px; /*将轨道设为圆角的*/
    background: #fff;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    position: relative;
    top: -2px;
    background: red;
    z-index: 20;
  }
}
</style>
