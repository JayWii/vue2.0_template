const ua = window.navigator.userAgent.toLowerCase()
const versionReg = /9ji\/(\d+\.\d+\.\d+)\//
const platform = {
  ua: ua,
  ios: /iphone/.test(ua) || /ipad/.test(ua),
  android: /android/.test(ua),
  osVersion: 0,
  app: /9ji/.test(ua),
  appVersion: ua.match(versionReg) ? ua.match(versionReg)[1] : 0,
  wechat: /micromessenger/.test(ua)
}
platform.android && (platform.osVersion = ua.substr(ua.indexOf('android') + 8, 3))
platform.ios && (platform.osVersion = ua.match(/iphone os (\w+) like/)[1].replace(/_/g, '.') || ua.match(/cpu os (\w+) like/)[1].replace(/_/g, '.'))

export default platform
