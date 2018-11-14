import Vue from 'vue'
import Vuex from 'vuex'
import home from './modules/home'
import stockMes from './modules/stock'
import btcMes from './modules/btc'
import createLogger from 'vuex/dist/logger'
import vuexAlong from 'vuex-along'

Vue.use(Vuex)
const debug = true
/* eslint-disable */
export default new Vuex.Store({
  modules: {
    home,
    stockMes,
    btcMes
  },
  plugins: debug ? [createLogger()] : [] ,  // 是否开启vuex的debug模式
  plugins:  [vuexAlong]
})
