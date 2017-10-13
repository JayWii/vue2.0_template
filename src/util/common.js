export function isMobile (num) { // 验证手机
  return /^1[3|4|5|7|8][0-9]\d{8}$/.test(num)
}
export function isEmail (email) { // 验证邮箱
  return /^([a-zA-Z0-9]+[_|_|-|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(email)
}
export function isNumber (num) { // 验证数字
  return /^[0-9]*$/.test(num)
}
export function isEmptyObject (target) {
  let key
  for (key in target) {
    return !1
  }
  return !0
}
export function arrayUnique (array) {
  let temp
  let arrVal
  let arrClone = array.concat() // 克隆数组
  let typeArr = {// 数组原型
    'obj': '[object Object]',
    'fun': '[object Function]',
    'arr': '[object Array]',
    'num': '[object Number]'
  }
  let ent = /(\u3000|\s|\t)*(\n)+(\u3000|\s|\t)*/gi// 空白字符正则

  // 把数组中的object和function转换为字符串形式
  for (let i = arrClone.length; i--;) {
    arrVal = arrClone[i]
    temp = Object.prototype.toString.call(arrVal)

    if (temp === typeArr['num'] && arrVal.toString() === 'NaN') {
      arrClone[i] = arrVal.toString()
    }

    if (temp === typeArr['obj']) {
      arrClone[i] = JSON.stringify(arrVal)
    }

    if (temp === typeArr['fun']) {
      arrClone[i] = arrVal.toString().replace(ent, '')
    }
  }

  // 去重关键步骤
  for (let i = arrClone.length; i--;) {
    arrVal = arrClone[i]
    temp = Object.prototype.toString.call(arrVal)

    if (temp === typeArr['arr']) this.arrayUnique(arrVal)// 如果数组中有数组，则递归
    if (arrClone.indexOf(arrVal) !== arrClone.lastIndexOf(arrVal)) { // 如果有重复的，则去重
      array.splice(i, 1)
      arrClone.splice(i, 1)
    } else {
      if (Object.prototype.toString.call(array[i]) !== temp) {
        // 检查现在数组和原始数组的值类型是否相同，如果不同则用原数组中的替换，原因是原数组经过了字符串变换
        arrClone[i] = array[i]
      }
    }
  }
  return arrClone
}
export function getCurrentPosition () {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in window.navigator)) {
      reject(new Error('browser not support'))
    }
    window.navigator.geolocation.getCurrentPosition(position => {
      resolve({lat: position.coords.latitude, lng: position.coords.longitude})
    }, (err) => {
      reject(err)
    }, {enableHighAcuracy: false, timeout: 10000, maximumAge: 1000 * 3600})
  })
}
