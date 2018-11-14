/**
 * 引入fetch、baseUrl
 * @param params
 * @returns {*}
 */
import { fetch } from '../apiconfig/index'

export function getBanner(params) {
  return fetch('home/getBanner', params)
} // banner地址

export function getMarketIndex(params) {
  return fetch('home/getMarketIndex', params)
} // 指数行情

export function getBaseRoom(params) {
  return fetch('home/getBaseRoom', params)
} // 模块类型

export function getCustom(params) {
  return fetch('home/getCustom', params)
} // 联系方式
