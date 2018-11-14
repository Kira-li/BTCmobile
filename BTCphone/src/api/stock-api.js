import { fetch } from '../apiconfig/index'

export function getTargetListAll(params) {
  return fetch('stock/getTargetListAll', params)
} // 进入房间

export function getRoomBase(params) {
  return fetch('stock/getRoomBase', params)
} // 获取杠杆信息

export function addRoom(params) {
  return fetch('stock/addRoom', params)
} // 进入房间

export function enter(params) {
  return fetch('stock/enter', params)
} // 进入场次

export function getStrongStockList(params) {
  return fetch('stock/getStrongStockList', params)
} // 获取强势股

export function searchStock(params) {
  return fetch('stock/searchStock', params)
} // 搜索股票

export function getStockInfo(params) {
  return fetch('stock/getStockInfo', params)
} // 获取单只股票

export function getPositionList(params) {
  return fetch('stock/getPositionList', params)
} // 获取持仓列表

export function buy(params) {
  return fetch('stock/buy', params)
} // 买股

export function sell(params) {
  return fetch('stock/sell', params)
} // 卖股

export function cancelEntrust(params) {
  return fetch('stock/cancelEntrust', params)
} // 撤单

export function getEntrustList(params) {
  return fetch('stock/getEntrustList', params)
} // 撤单列表

export function getTargetList(params) {
  return fetch('stock/getTargetList', params)
} // 成交历史

export function transferInMoney(params) {
  return fetch('stock/transferInMoney', params)
} // 转入A股

export function transferOutMoney(params) {
  return fetch('stock/transferOutMoney', params)
} // 转出A股

export function getSelfStockList(params) {
  return fetch('stock/getSelfStockList', params)
} // 自选股列表

export function addSelfStock(params) {
  return fetch('stock/addSelfStock', params)
} // 添加自选股

export function delSelfStock(params) {
  return fetch('stock/delSelfStock', params)
} // 删除自选股
