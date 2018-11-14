let isMobile = (mobile) => {
  let reg = /^1[345789]\d{9}$/
  let isPhone = /^((0\d{2,3})-?)(\d{7,8})(-(\d{3,}))?$/
  return (reg.test(mobile) || isPhone.test(mobile) || false)
}
let showTime = (val, onlyDate) => {
  if (!val) return '--'
  var dtVal
  if (val.date) {
    dtVal = new Date(val.date.replace(/-/g, '/').replace(/\..*$/, ' +0'))
  } else {
    dtVal = new Date(parseInt(val))
  }
  let fullYear = dtVal.getFullYear()
  let fullMonth = ('0' + (1 + dtVal.getMonth())).substr(-2)
  let fullDate = ('0' + dtVal.getDate()).substr(-2)
  let ret = fullYear + '-' + fullMonth + '-' + fullDate
  if (!onlyDate) {
    let fullHour = ('0' + dtVal.getHours()).substr(-2)
    let fullMinute = ('0' + dtVal.getMinutes()).substr(-2)
    let fullSecond = ('0' + dtVal.getSeconds()).substr(-2)
    ret += ' ' + fullHour + ':' + fullMinute + ':' + fullSecond
  }
  return ret
}
let fixDecimal = ([val, num]) => {
  var value = Number(val)
  value = value.toFixed(num)
  return value
}
export { showTime, isMobile, fixDecimal }
