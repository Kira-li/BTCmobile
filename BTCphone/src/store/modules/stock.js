import * as types from '../mutation-type' // 引入定义的方法
const stockMes = {
  state: {
    stockMoney: 100,
    stockRoom: '',
    stockFee: ''
  },
  mutations: {
    [types.STOCK_MES](state, money) { // 修改state 可通过mapMutations调用
      state.stockMoney = money
    },
    [types.STOCK_ROOM](state, room) {
      state.stockRoom = room
    },
    [types.STOCK_FEE](state, fee) {
      state.stockFee = fee
    }
  },
  actions: {},
  getters: { // 定义getters，可以通过mapGetters拓展函数调用
    stockMoney: state => {
      return state.stockMoney
    },
    stockRoom: state => {
      return state.stockRoom
    },
    stockFee: state => {
      return state.stockFee
    }
  }
}
export default stockMes // 输出user模块
