import { fetch } from '../apiconfig/index'

export function getPayMoneyConfig(params) {
  return fetch('pay/getPayMoneyConfig', params)
} // 获取充值列表

export function getPayType(params) {
  return fetch('pay/getPayType', params)
} // 获取充值方式

export function getPayRand(params) {
  return fetch('pay/getPayRand', params)
} // 获取充值随机数

export function createPayOrder(params) {
  return fetch('pay/createPayOrder', params)
} // 获取充值订单

export function getCashMax(params) {
  return fetch('cash/getCashMax', params)
} // 获取提现最大额

export function createCashOrder(params) {
  return fetch('cash/createCashOrder', params)
} // 创建提现订单

export function getAmountDetail(params) {
  return fetch('user/getAmountDetail', params)
} // 资金流水
