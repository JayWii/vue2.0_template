import fetch from './fetch'
export default {
  login (params = {username: '', password: ''}) {
    return fetch('/api/user', params, 'post')
  }
}
