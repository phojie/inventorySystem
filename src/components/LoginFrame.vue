<template>
    <v-form style="width:44%;" :loading="valid" @submit.prevent="submitForm">
      <v-card flat class="mb-4 pa-3 body-1" v-if="accountData.isError" style="background-color:#f9dcd1; color:#74290e">
        {{accountData.errorMessage}}
      </v-card>
      <!-- <v-alert class="mb-5 amber" :value="accountData.isError" type="error">{{accountData.errorMessage}}</v-alert> -->
      <v-text-field
        label="Username"
        :disabled="valid"
        single-line
        append-icon="person"
        solo
        ref="username"
        background-color="teal lighten-5"
        color="teal"
        v-model="accountData.username"
        :rules="nameRules"
        flat
      ></v-text-field>
      <v-text-field
        label="Password"
        :type="passVisi ? 'text' : 'password'"
        single-line
        solo
        color="teal"
        :disabled="valid"
        flat
        background-color="teal lighten-5"
        v-model="accountData.password"
        :append-icon="passVisi ? 'visibility_off' : 'visibility'"
        :rules="passRules"
        @click:append="passVisi = !passVisi"
        ref="password"
      ></v-text-field>
      <v-btn  :disabled="validEntry" type="submit" :loading="valid" 
        dark color="teal lighten-1" large block 
        > 
        <v-icon size="18" class="mr-1">mdi-login</v-icon>
        SIGN IN 
      </v-btn>
    </v-form>
</template>

<script>
import firebase from 'firebase';
export default {
  data: () => ({
    valid: false,
    passVisi: false,
    accountData: {
      username: '',
      password: '',
      errorMessage: '',
      isError: false
    },
    nameRules: [
      v => !!v || 'Enter your username',
    ],
    passRules: [
      v => !!v || "Enter your password",
    ]
  }),
  computed: {
    validEntry() {
      if (this.accountData.username == "" || this.accountData.password == "") {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    signInto(usernameData,userIndex) {
      var vm = this
      firebase.auth().signInWithEmailAndPassword(usernameData.email, vm.accountData.password).then(
        function (user) {
          const accountDetails = Object.assign({},{user});
          const accountUserDetails = userIndex;
          localStorage.setItem("userIndex",  userIndex);
          localStorage.setItem("accountDetails", JSON.stringify(accountDetails));
          vm.$store.commit('saveAccountDetails')
          vm.$router.push('/')
        },
        function(error) {
          // var errorCode = error.code;
          vm.valid= false
          vm.accountData.isError = true
          vm.accountData.password = ''
          vm.$nextTick(() => vm.$refs.password.focus())
          // vm.accountData.errorMessage = error.message
          vm.accountData.errorMessage = 'These credentials do not match our records.'
      })
    },
    submitForm() {
      this.valid= true
      this.errorMessage = ''
      this.isError = false
      let vm = this
      let firebaseDB = firebase.database()
      // Disable deprecated features
      let AccountUserRef = firebaseDB.ref("AccountUser")
      setTimeout(function() {
        AccountUserRef.on('value', function(getData) {
          var usernameData = _.find(getData.val(), {'username': _.capitalize(vm.accountData.username), 'password': vm.accountData.password});
            if(usernameData) {
              const accountDetails = Object.assign({},{usernameData});
              const accountUserDetails = usernameData.keyIndex;
              localStorage.setItem("userIndex",  usernameData.keyIndex);
              localStorage.setItem("accountDetails", JSON.stringify(accountDetails));
              vm.$store.commit('saveAccountDetails')
              vm.$router.push('/')
            //  var userIndex = _.findKey(getData.val(), ['email', _.capitalize(usernameData.email)]);
            //  vm.signInto(usernameData,userIndex)
            } else {
              vm.valid= false
              vm.accountData.isError = true
              vm.accountData.password = ''
              vm.$refs.password.focus()
              vm.accountData.errorMessage = 'These credentials do not match our records.'
            }
       
      // console.log("​submitForm -> usernameData", usernameData)
        })
      },2000)

    }
  }
}
</script>