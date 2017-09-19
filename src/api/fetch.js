import axios from 'axios'
import store from '../store'
import router from '../router'
import { MessageBox } from 'mint-ui'

axios.defaults.timeout = 15000
axios.defaults.baseURL = ''
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

axios.interceptors.request.use(config => {
  config.headers.Authorization = store.state.token
  return config
}, err => {
  return Promise.reject(err)
})

function fetch (url = '', params = {}, method = 'get') {
  if (method.toLowerCase() === 'get') {
    let paramFlag = false
    for (let i in params) {
      if (url.indexOf('?') < 0 && !paramFlag) {
        url += '?' + i + '=' + params[i]
        paramFlag = true
      } else {
        url += '&' + i + '=' + params[i]
      }
    }
  }
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: url,
      data: params
    }).then(function (response) {
      if (response.status >= 200 && response.status < 400) {
        if (response.data.code === 1000) { // 未登录
          router.push('/login')
          return
        }
        resolve(response.data)
      } else {
        MessageBox.alert(response.statusText, response.status)
      }
    }).catch(function (err) {
      MessageBox.alert(err.statusText, err.status)
      reject(err)
    })
  })
}

export default fetch
