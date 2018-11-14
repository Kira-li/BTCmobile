import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
// 需要左方向动画的路由用this.$router.to('****')
Router.prototype.togo = function (path) {
  this.isleft = true
  this.isright = false
  this.push(path)
}
// 需要右方向动画的路由用this.$router.goRight('****')
Router.prototype.goRight = function (path) {
  this.isright = true
  this.isleft = false
  this.push(path)
}
// 需要返回按钮动画的路由用this.$router.goBack()，返回上一个路由
Router.prototype.goBack = function () {
  this.isright = true
  this.isleft = false
  this.go(-1)
}
// 点击浏览器返回按钮执行，此时不需要路由回退
Router.prototype.togoback = function () {
  this.isright = true
  this.isleft = false
}
// 点击浏览器前进按钮执行
Router.prototype.togoin = function () {
  this.isright = false
  this.isleft = true
}
export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'index',
      component: (resolve) => require(['@/pages/index'], resolve),
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'home',
          component: (resolve) => require(['@/pages/index/home'], resolve)
        },
        {
          path: '/story',
          name: 'story',
          component: (resolve) => require(['@/pages/index/story'], resolve)
        },
        {
          path: '/mine',
          name: 'mine',
          component: (resolve) => require(['@/pages/mine/mine'], resolve)
        },
        {
          path: '/day',
          name: 'day',
          component: (resolve) => require(['@/pages/index/day'], resolve)
        },
        {
          path: '/market',
          name: 'market',
          component: (resolve) => require(['@/pages/index/market'], resolve)
        }
      ]
    },
    {
      path: '/Home/Detail',
      name: 'Detail',
      component: (resolve) => require(['@/pages/detail'], resolve)
    },
    {
      path: '/btc/index',
      name: 'BTC',
      component: (resolve) => require(['@/pages/btc/index'], resolve)
    },
    {
      path: '/btc/order',
      name: 'BTCorder',
      component: (resolve) => require(['@/pages/btc/order'], resolve)
    },
    {
      path: '/btc/transfer',
      name: 'BTCtransfer',
      component: (resolve) => require(['@/pages/btc/transfer'], resolve)
    },
    {
      path: '/stock/chooseLever',
      name: 'chooseLever',
      component: (resolve) => require(['@/pages/stock/chooseLever'], resolve)
    },
    {
      path: '/stock/chooseStock',
      name: 'chooseStock',
      component: (resolve) => require(['@/pages/stock/chooseStock'], resolve)
    },
    {
      path: '/stock/killOrder',
      name: 'killOrder',
      component: (resolve) => require(['@/pages/stock/killOrder'], resolve)
    },
    {
      path: '/stock/query',
      name: 'query',
      component: (resolve) => require(['@/pages/stock/query'], resolve)
    },
    {
      path: '/stock/sell',
      name: 'sell',
      component: (resolve) => require(['@/pages/stock/sell'], resolve)
    },
    {
      path: '/stock/stock',
      name: 'stock',
      component: (resolve) => require(['@/pages/stock/stock'], resolve)
    },
    {
      path: '/stock/stockBuy',
      name: 'stockBuy',
      component: (resolve) => require(['@/pages/stock/stockBuy'], resolve)
    },
    {
      path: '/stock/stockSell',
      name: 'stockSell',
      component: (resolve) => require(['@/pages/stock/stockSell'], resolve)
    },
    {
      path: '/stock/transfer',
      name: 'transfer',
      component: (resolve) => require(['@/pages/stock/transfer'], resolve)
    },
    {
      path: '/mine/buy',
      name: 'buy',
      component: (resolve) => require(['@/pages/mine/buy'], resolve)
    },
    {
      path: '/mine/buyRecord',
      name: 'buyRecord',
      component: (resolve) => require(['@/pages/mine/buyRecord'], resolve)
    },
    {
      path: '/mine/payDetail',
      name: 'payDetail',
      component: (resolve) => require(['@/pages/mine/payDetail'], resolve)
    },
    {
      path: '/mine/despoit',
      name: 'despoit',
      component: (resolve) => require(['@/pages/mine/despoit'], resolve)
    },
    {
      path: '/mine/message',
      name: 'message',
      component: (resolve) => require(['@/pages/mine/message'], resolve)
    },
    {
      path: '/mine/record',
      name: 'record',
      component: (resolve) => require(['@/pages/mine/record'], resolve)
    },
    {
      path: '/mine/fund',
      name: 'fund',
      component: (resolve) => require(['@/pages/mine/fund'], resolve)
    },
    {
      path: '/mine/help',
      name: 'help',
      component: (resolve) => require(['@/pages/mine/help'], resolve)
    },
    {
      path: '/mine/setting',
      name: 'setting',
      component: (resolve) => require(['@/pages/mine/setting'], resolve)
    },
    {
      path: '/mine/changPwd',
      name: 'changPwd',
      component: (resolve) => require(['@/pages/mine/changPwd'], resolve)
    },
    {
      path: '/login',
      name: 'login',
      component: (resolve) => require(['@/pages/login'], resolve)
    },
    {
      path: '/regesiter',
      name: 'regesiter',
      component: (resolve) => require(['@/pages/regesiter'], resolve)
    },
    {
      path: '/mesLogin',
      name: 'mesLogin',
      component: (resolve) => require(['@/pages/mesLogin'], resolve)
    },
    {
      path: '/fgtpwd',
      name: 'fgtpwd',
      component: (resolve) => require(['@/pages/fgtpwd'], resolve)
    }
  ]
})
