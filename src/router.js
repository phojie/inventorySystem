
import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import firebase from 'firebase'

import lost from './views/404.vue'
import Login from './views/Login.vue'
import Dash from './views/Dash.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/auth',
      name: 'login',
      component: Login,
      meta: {
        requrestGuest: true
      }
    }, {
      path: '*',
      component: lost
    }, {
      path: '/',
      component: Dash,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  // const currentUser = localStorage.getItem('accountDetails').currentUser;
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const accountDetails = localStorage.getItem('accountDetails')
  // const accountDetails = store.getters.accountDetails
  if (requiresAuth && !accountDetails) {
    next({
      path: '/auth',
      query: { redirect: to.fullPath }
    })
  } else if (accountDetails && to.path == '/auth') {
    next('/')
  } else {
    next() // make sure to always call next()!
  }
});

export default router;


// if(requiresAuth) {
//   if(!accountDetails) {
//     next({
//       path: '/auth',
//       query: {
//         redirect: to.fullPath
//       }
//     })
//     console.log(firebase.auth().currentUser)
//   } else {
//     next()
//   }
// } else if(requiresGuest) {
//   if(accountDetails) {
//     next({
//       path: '/',
//       query: {
//         redirect: to.fullPath
//       }
//     })
//   } else {
//     next()
//   }