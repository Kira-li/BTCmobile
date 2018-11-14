import * as types from '../mutation-type' // 引入定义的方法
const btcMes = {
  state: {
    btcMoney: 100,
    btcRoom: ''
  },
  mutations: {
    [types.BTC_MONEY](state, money) { // 修改state 可通过mapMutations调用
      state.btcMoney = money
    },
    [types.BTC_ROOM](state, room) {
      state.btcRoom = room
    }
  },
  actions: {},
  getters: { // 定义getters，可以通过mapGetters拓展函数调用
    btcMoney: state => {
      return state.btcMoney
    },
    btcRoom: state => {
      return state.btcRoom
    }
  }
}
export default btcMes // 输出user模块
