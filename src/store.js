import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    accountDetails: [],
    userIndex: '',
    accountFDetails: [],
    sales: []
  },
  getters: {
    accountDetails(state) {
      return state.accountDetails
    },
    userIndex(state) {
      return state.userIndex
    },
    accountFDetails(state) {
      return state.accountFDetails
    },
    sales(state) {
       return state.sales
    }
  },
  mutations: {
    saveAccountDetails(state) {
      state.accountDetails = localStorage.getItem('accountDetails')
      state.userIndex = localStorage.getItem('userIndex')
      console.log(state.userIndex)
      
      var db = firebase.database()
      // var getdb = db.ref('AccountUser')
      // getdb.on('value', function(getData) {
      //   // var key =_.findKey(getData.val(), ['email', _.capitalize(state.accountUserDetails.email)]);
      //   console.log(_.capitalize(state.accountDetails))
        
      // })
      var myAccount = db.ref(`AccountUser/${state.userIndex}`);
      myAccount.on("value", function(data) {
        state.accountFDetails = data.val()
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    },
    logoutAccount() {
      localStorage.removeItem("accountDetails");
      localStorage.removeItem("userIndex");
    },
    getSales(state) {
      var get = firebase.database().ref("sales");
      get.on("value", function(data) {
         state.sales = data.val()
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    }
  },
  actions: {
    //rt
  }
})

export default store
