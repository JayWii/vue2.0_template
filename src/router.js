import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'

import index from './pages/index.vue'

Vue.use(VueRouter)

function load (component) {
  return () => System.import(`./pages/${component}.vue`)
}

const router = new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/',
      component: index,
      meta: {requireAuth: false}
    },
    {
      path: '/login',
      component: load('acount/login'),
      meta: {requireAuth: false}
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (store.state.token) {
      next()
    } else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
  } else {
    next()
  }
})

export default router
