import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'

// Load the full build.
var _ = require('lodash');
// Load the core build.
var _ = require('lodash/core');
// Load the FP build for immutable auto-curried iteratee-first data-last methods.
var fp = require('lodash/fp');
 
// Load method categories.
var array = require('lodash/array');
var object = require('lodash/fp/object');
 
// Cherry-pick methods for smaller browserify/rollup/webpack bundles.
var at = require('lodash/at');
var curryN = require('lodash/fp/curryN');


import firebase from 'firebase'
const config = {
  apiKey: "AIzaSyDx5FJmdWWj_Fi-2DXYnpkhQST83_9ugtc",
  authDomain: "inventory-system-9a2c4.firebaseapp.com",
  databaseURL: "https://inventory-system-9a2c4.firebaseio.com",
  projectId: "inventory-system-9a2c4",
  storageBucket: "inventory-system-9a2c4.appspot.com",
  messagingSenderId: "669915201568"
};
firebase.initializeApp(config);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
