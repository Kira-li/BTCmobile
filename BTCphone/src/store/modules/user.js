import * as types from '../mutation-type' // 引入定义的方法
const user = {
  state: {
    number: 1
  },
  mutations: {
    [types.SET_USER](state, num) { // 修改state 可通过mapMutations调用
      state.number = num
    }
  },
  actions: {},
  getters: { // 定义getters，可以通过mapGetters拓展函数调用
    number: state => {
      return state.number
    }
  }
}
export default user // 输出user模块
