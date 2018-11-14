import { fetch } from '../apiconfig/index'

export function getRoomBase(params) {
  return fetch('btc/getRoomBase', params)
} // 判断是否在房间

export function addRoom(params) {
  return fetch('btc/addRoom', params)
} // 创建房间

export function enter(params) {
  return fetch('btc/enter', params)
} // 入场

export function buy(params) {
  return fetch('btc/buy', params)
} // 买

export function sell(params) {
  return fetch('btc/sell', params)
} // 卖

export function cancelEntrust(params) {
  return fetch('btc/cancelEntrust', params)
} // 撤单

export function getPositionList(params) {
  return fetch('btc/getPositionList', params)
} // 持仓列表

export function getTargetList(params) {
  return fetch('btc/getTargetList', params)
} // 成交列表

export function getEntrustList(params) {
  return fetch('btc/getEntrustList', params)
} // 撤单列表

export function transferInMoney(params) {
  return fetch('btc/transferInMoney', params)
} // 转入

export function transferOutMoney(params) {
  return fetch('btc/transferOutMoney', params)
} // 转出

export function setWinLoss(params) {
  return fetch('btc/setWinLoss', params)
} // 转出
