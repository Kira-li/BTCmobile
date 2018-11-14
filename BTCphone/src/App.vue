<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view class="Router"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      transitionName: ''
    }
  },
  watch: {
    $route() {
      if (this.$router.isleft) {
        this.transitionName = 'slideleft'
      }
      if (this.$router.isright) {
        this.transitionName = 'slideright'
      }
    }
  }
}
</script>

<style lang="less">
@import "~styles/variable.less";
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color:rgba(0,0,0,0);
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}
.Router {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: @body-bg-color;;
  transition: all .5s ease;
  -webkit-transition: all .5s ease;
  -moz-transition: all .5s ease;
}
.slideleft-enter,
 .slideright-leave-active {
  opacity: 1;
  transform: translate3d(90% 0, 0);
  -webkit-transform: translate3d(90%, 0, 0);
  -moz-transform: translate3d(90%, 0, 0);
}
.slideleft-leave-active,
.slideright-enter {
 opacity: 1;
 transform: translate3d(-90% 0, 0);
 -webkit-transform: translate3d(-90%, 0, 0);
 -moz-transform: translate3d(-90%, 0, 0);
}
.mint-swipe-indicator{
  background: green !important;
  opacity: 1 !important;
}
.mint-swipe-indicator.is-active{
  background: red !important;
}
.header-tittle {
  text-align: center;
}
.mint-navbar .mint-tab-item-label {
  font-size: 14px !important;
  // color: #000;
}
.mint-navbar .mint-tab-item.is-selected {
  margin-bottom: 0px;
  color: #248ad2;
}
.mint-cell-value {
  width: 100% !important;
}
.shade-win {
  .mt-range-progress {
    background: red !important;
  }
}
.shade-loss .mt-range-progress {
  background: #01cc00 !important;
}
// .mt-range-runway {
//   border-color: #fff !important;
// }
.mint-msgbox-message {
  p {
    margin: 0 !important;
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    color: #000;
  }
}
</style>
