import { fetch } from '../apiconfig/index'

export function login(params) {
  return fetch('auth/login', params)
} // 登录

export function tokenByLogin(params) {
  return fetch('auth/tokenLogin', params)
} // token登录

export function register(params) {
  return fetch('auth/register', params)
} // 注册

export function getValidCode(params) {
  return fetch('auth/getValidCode', params)
} // 获取验证码

export function checkMobile(params) {
  return fetch('user/checkMobile', params)
} // 检测手机号是否已注册

export function loginByValidCode(params) {
  return fetch('auth/loginByValidCode', params)
} // 验证码登录

export function resetPassword(params) {
  return fetch('user/resetPassword', params)
} // 重置密码

export function getUserAccount(params) {
  return fetch('user/getUserAccount', params)
} // 获取用户账户信息

export function getUserInfo(params) {
  return fetch('user/getUserInfo', params)
} // 获取用户信息

export function sysMsg(params) {
  return fetch('sysMsg', params)
} // 获取消息标题

export function getSysMsg(params) {
  return fetch('sysMsg/getSysMsg', params)
} // 获取消息内容

export function article(params) {
  return fetch('article', params)
} // 获取新手攻略标题

export function getArticle(params) {
  return fetch('article/getArticle', params)
} // 获取新手攻略内容
