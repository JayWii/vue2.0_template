import Vue from 'vue'
import 'es6-promise/auto'
import cookies from 'js-cookie'

import router from './router'
import store from './store'
import api from './api'
import App from './App.vue'

import 'font-awesome/css/font-awesome.min.css'
import './assets/style/main.css'

// import './mock'

Vue.prototype.$cookie = cookies
Vue.prototype.$api = api

if (!store.state.token) {
  const authorization = cookies.get('authorization')
  store.commit('setToken', authorization)
}

// 解决点击延迟
const FastClick = require('fastclick')
FastClick.attach(document.body)

/* 下面这句注释不能删，不然通不过eslint */
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
