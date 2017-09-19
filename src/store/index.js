import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null
  },
  getters: {

  },
  mutations: {
    setToken (state, token) {
      state.token = token
    }
  },
  actions: {

  }
})
