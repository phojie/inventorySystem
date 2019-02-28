
import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import firebase from 'firebase'

import lost from './views/404.vue'
import Login from './views/Login.vue'
import Dash from './views/Dash.vue'
import casherDash from './views/casherDash.vue'

import Category from './components/CategoryFrame.vue'
import Product from './components/ProductFrame.vue'
import UsersM from './components/UsersFrame.vue'
import Progress from './components/ProgressFrame.vue'
import DashF from './components/DashFrame.vue'
import CasherF from './components/CasherFrame.vue'
import LogF from './components/LogFrame.vue'



Vue.use(Router)

const router = new Router({
  mode: 'history',// "hash" | "history" | "abstract"
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/auth',
      name: 'login',
      component: Login,
    }, {
      path: '*',
      component: lost
    }, {
      path: '/casher',
      component: casherDash,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/cashier',
          component: CasherF
        },
        {
          path: '/activitylog',
          component: LogF,
        },
      ]
    }, {
      path: '/',
      component: Dash,
      meta: {
        requiresAuth: true
      } ,
      children: [
        {
          path: '/',
          component: DashF,
        },
        {
          path: '/category',
          component: Category,
        },
        {
          path: '/products',
          component: Product,
        },
        {
          path: '/progress',
          component: Progress,
        },
        {
          path: '/manageuser',
          component: UsersM,
        },
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // const currentUser = localStorage.getItem('accountDetails').currentUser;
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const accountDetails = localStorage.getItem('accountDetails')
  const adminIndex = localStorage.getItem('userIndex')
  // const accountDetails = store.getters.accountDetails
  if (requiresAuth && !accountDetails) {
    next({
      path: '/auth',
      query: { redirect: to.fullPath }
    })
  } else if (accountDetails && to.path == '/auth') {
    // not equal to admin key
    if (adminIndex != '-LTHvnmd4t83HpJPqokk') {
      next('/cashier')
    } else {
      next('/')
    }
  } else {
    next()
    if (adminIndex != '-LTHvnmd4t83HpJPqokk') {
      if(to.path != '/cashier' && to.path != '/activitylog') {
        next('/cashier')
      } else if (to.path == '/activitylog') {
        next('/activitylog')
      }
    } else {
      next('')
    }
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