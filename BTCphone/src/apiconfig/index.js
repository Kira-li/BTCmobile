/* eslint-disable */
import axios from 'axios'
import CryptoJS from 'crypto-js/crypto-js'
import { Toast } from 'mint-ui'

function objKeySort(arys) { 
  //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  var newkey = Object.keys(arys).sort();　　 
  //console.log('newkey='+newkey);
  var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
  for(var i = 0; i < newkey.length; i++) {
      //遍历newkey数组
      newObj[newkey[i]] = arys[newkey[i]]; 
      //向新创建的对象中按照排好的顺序依次增加键值对
  }
  return newObj; //返回排好序的新对象
}

/**
* 定义请求常量
* TIME_OUT、ERR_OK
*/
export const TIME_OUT = 3000;    // 请求超时时间
export const ERR_OK = true;      // 请求成功返回状态，字段和后台统一
// export const baseUrl = process.env.BASE_URL   // 引入全局url，定义在全局变量process.env中
export const baseUrl = 'http://api.tzyj91.com/'
// export const baseUrl = 'http://192.168.1.17/finance-app/'
let headerStr = ''
headerStr += navigator.userAgent + returnCitySN.cip
headerStr = CryptoJS.MD5(headerStr).toString()
// 请求超时时间
axios.defaults.timeout = TIME_OUT
// 封装请求拦截
axios.interceptors.request.use(
	config => {
		let token = localStorage.getItem('token')   // 获取token
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    config.headers['clientId'] = 'Firefox'
		config.headers['token'] = ''
		if(token != null) {                      // 如果token不为null，否则传token给后台
			config.headers['token'] = token
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

// 封装响应拦截，判断token是否过期
axios.interceptors.response.use(
  response => {
    let {data} = response
    if (data.message === 'token failure!') {    // 如果后台返回的错误标识为token过期，则重新登录
      localStorage.removeItem('token')          // token过期，移除token
      // 进行重新登录操作
    } else {
      return Promise.resolve(response)
    }
  },
  error => {
    return Promise.reject(error)
  }
)
// 封装post请求
export function fetch(requestUrl, params = '') {
  let str = ''
  let timestamp = (new Date().getTime() - parseFloat(localStorage.getItem("timedif"))).toString()
  const key = '360'
  const appid = '10022'
  str += JSON.stringify(objKeySort(params)) + timestamp + key + appid
  str = CryptoJS.MD5(str).toString()
  let params1 = {
    appid :appid,
    timestamp :timestamp,
    signdata : str
  }
  let params2 = ''
  if (params == {}) {
    params2 = params1
  } else {
    params2 = Object.assign(params,params1)
  }
  
  return new Promise((resolve,reject) => {
    axios.post(baseUrl+requestUrl,params2)
      .then(response => {
        // resolve(response.data);
        if (response.data.code === 200) {
          resolve(response.data)
        } else {
          if (requestUrl === 'auth/tokenLogin') {
            resolve(response.data)
          } else {
            Toast(response.data.msg)
          }
        }
      },err => {
        // reject(err)
        Toast('网络不好，请稍后再试')
      })
  })
}
