<template>
  <div>
    <v-layout
      justify-center
      align-center
    >
      <v-responsive
      class="bgright2 white--text"
      height="130"
      > 
        <v-card height="100%" style="background-color:#ffffffcf;">
          <v-container>
          <v-layout row fill-height >
            {{passwordValidty}}
            <div>
              <div class="display-1">Manage users</div>
              <div class="body-1 font-weight-light ">"Your big opportunity may be right where you are now." - Napoleon Hill</div>
            </div>
          </v-layout>
          </v-container>
        </v-card>
      </v-responsive>
    </v-layout>
    <v-container>
      <v-btn    @click="newuser" class="right" fab dark color="teal">
       <v-icon dark>add</v-icon>
      </v-btn>
        
      <v-dialog
      v-model="dialog"
      max-width="500"
      >
      <v-card>
        <v-container grid-list-md>
          <v-card-title>
          <span class="headline">{{headTitle}}</span>
          </v-card-title>
            <v-layout wrap >
              <v-flex xs12 sm6>
                <v-text-field color="teal" label="First name" v-model="userData.fn"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field color="teal"  label="Last name" v-model="userData.ln" ></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field color="teal"  :rules="emailRules" ref="emailRef" :error-messages="emailUmessage" label="Email" v-model="userData.email" ></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field color="teal" ref="usernameRef" :error-messages="usernameUmessage" label="Username" v-model="userData.username"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field color="teal" @blur='focusOutpassord' ref="passwordWRef" :error-messages="errorMessages.weakPassword" label="Password" type="password" v-model="userData.password" ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field color="teal" @blur='focusOutCpassord' ref="passwordRef" :error-messages="errorMessages.password" label="Confirm password" type="password" v-model="userData.cpassword" ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        <v-card-actions>
          <v-btn
            v-if="headTitle != 'Add user' && userData.keyIndex != '-LTHvnmd4t83HpJPqokk'"
            color="error darken-1"
            @click="deleteUser"
            flat="flat"
          >
            Delete
            <v-icon  class="ml-2" size="20">mdi-alert</v-icon>
          </v-btn>
          <v-spacer></v-spacer>

          <v-btn
            color="teal darken-1"
            flat="flat"
            @click="dialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            v-if="headTitle == 'Add user'"
            color="teal darken-1"
            flat="flat"
            @click="saveUser"
            :disabled="submitValidty"
          >
            Submit
          </v-btn>
         
          <v-btn
            v-if="headTitle != 'Add user'"
            color="teal darken-1"
            flat="flat"
            @click="updateUser"
            :disabled="submitValidty"
          >
            Update
          </v-btn>
          
        </v-card-actions>
      </v-card>
      </v-dialog>
      <v-layout wrap row>
        <v-flex  v-for="user in allusersData" :key="user.keyIndex" xs4 class="mx-5">
          <v-card flat  class="pa-3" full-width>
            <v-layout justify-center> 
            <v-avatar size="100">
              <img  v-if="user.type != 1" src="https://img.icons8.com/office/1600/000000/person-male.png">
              <!-- style="border:8px solid #00968899"  -->
              <img v-else src="https://img.icons8.com/office/1600/administrator-male.png">
            </v-avatar>
          </v-layout>
          <div v-if="user.type == 1" class="teal--text text--darken-2 mb-2 subheading font-weight-bold text-xs-center mt-3">Administrator</div>
          <div v-else class="grey--text text--darken-2 mb-2 subheading font-weight-bold text-xs-center mt-3">Casher</div>
          <v-divider></v-divider>
          <v-layout class="mt-2">
          <div>
            <div v-if="user.type != 1" class=" mb-2 ">Account information</div>
            <div v-if="user.type == 1" class=" mb-2 "> My information</div>
            <span class="body-1 grey--text textCapital">Name: {{user.fn}} {{user.ln}} </span><br>
            <span class="body-1 grey--text textCapital">Username: {{user.username}} </span><br>
            <span class="body-1 grey--text textCapital">Email: {{user.email}} </span><br>

          </div>
          </v-layout>
          <v-btn @click="manageAccount(user)" small class="teal lighten-3 teal--text text--darken-2 caption" dark block  >Manage</v-btn>
          </v-card>
        </v-flex>
       
      </v-layout>
    </v-container>
    <v-snackbar
      bottom
      right
      color="white"
      v-model="snackbar"
    > 
    <span class="teal--text">{{snackbarMessage}}</span>
    </v-snackbar>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  data () {
    return {
      snackbar: false,
      allusersData: [],
      adminAccount: [],
      userData: {
        fn:'',
        ln:'',
        email:'',
        emailDummy:'',
        username:'',
        usernameDummy:'',
        password:'',
        passwordDummy: '',
        cpassword:'',
        keyIndex:''
      },
      dialog: false,
      headTitle: '',
      snackbarMessage:'',
      errorMessages: {
        username: '',
        email:'',
        password: '',
        weakPassword:'',
      },
      emailRules: [
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
    }
  },
  computed: {
    passwordU() {
      if(this.userData.password != this.userData.cpassword || this.userData.password.length < 5) {
        return true
      } else {
        return false
      }
    },
    usernameUmessage() {
      var capital = _.capitalize(this.userData.username)
      var findUser = _.find(this.allusersData, ['username', capital])
      if(findUser && this.userData.usernameDummy != this.userData.username) {
        return 'Please use another username'
      } else {
        return ''
      }
    },
    emailUmessage() {
      var capital = _.capitalize(this.userData.email)
      var findEmail = _.find(this.allusersData, ['email', capital])
      if(findEmail && this.userData.emailDummy != this.userData.email) {
        return 'Please use another email'
      } else {
        return ''
      }
    },
    emailU() {
      var capital = _.capitalize(this.userData.email)
      var findEmail = _.find(this.allusersData, ['email', capital])
      if(findEmail && this.userData.emailDummy != this.userData.email) {
        return true
      } else {
        return false
      }
    },
    usernameU() {
      var capital = _.capitalize(this.userData.username)
      var findUser = _.find(this.allusersData, ['username', capital])
      if(findUser && this.userData.usernameDummy != this.userData.username) {
        return true
      } else {
        return false
      }
    },
    passwordValidty() {
      
      // var user = firebase.auth().currentUser;
      // return this.userDetails
    },
    submitValidty() {
      if( this.passwordU || this.usernameU || this.emailU || this.userData.fn == '' ||this.userData.ln == '' ||this.userData.email == '' ||this.userData.username == '' ||this.userData.password == '' || this.userData.cpassword == '' ) {
        return true
      } else {
        return false
      }
    },
    userDetails() {
      return this.$store.getters.accountFDetails
    }
    
  },
  methods: {
    focusOutpassord() {
      if(this.userData.password.length < 5) {
        this.errorMessages.weakPassword = 'Password should be at least 6 characters'
      } else {
        this.errorMessages.weakPassword = ''
      }
    },
    focusOutCpassord() {
      if(this.userData.password != this.userData.cpassword) {
        this.errorMessages.password = 'Invalid password confirmation'
      } else {
        this.errorMessages.password = ''
      }
    },
    updateUser() {
      let vm = this
      var test = ""
      if(vm.userData.keyIndex == '-LTHvnmd4t83HpJPqokk') {
        test = 1
      } else {
        test = 0
      }
      var post = firebase.database().ref('AccountUser/'+vm.userData.keyIndex)
      post.update({
        fn: _.capitalize(vm.userData.fn),
        ln: _.capitalize(vm.userData.ln),
        email: _.capitalize(vm.userData.email),
        username: _.capitalize(vm.userData.username),
        password: vm.userData.password,
        type: test,
      })
      // firebase.auth().signOut()
      // firebase.auth().signInWithEmailAndPassword(vm.userData.email, vm.userData.password).catch(function(error) {
      // })
      // let user = firebase.auth().currentUser;
      // console.log(user)
      // if(vm.userData.password != vm.userData.passwordDummy) {
      //   user.updatePassword(vm.userData.password).then(function() {
      //     // Update successful.
      //   }).catch(function(error) {
      //     // An error happened.
      //     console.log(error)
      //   });
      // }
      // if(vm.userData.email != vm.userData.emailDummy) {
      //   user.updateEmail(vm.userData.email).then(function() {
      //     // Update successful.
      //   }).catch(function(error) {
      //     // An error happened.
      //     console.log(error)
      //   });
      // }
      // firebase.auth().signOut()
      vm.snackbar = true
      if(test == 1) {
        vm.snackbarMessage = `Successfully updated ${_.capitalize(vm.userData.username)} as an Administrator`
      } else {
        vm.snackbarMessage = `Successfully updated ${_.capitalize(vm.userData.username)} as a Casher`
      }
      vm.userData= {
        fn:'',
        ln:'',
        email:'',
        emailDummy:'',
        username:'',
        usernameDummy:'',
        password:'',
        cpassword:''
      }
      this.dialog = false
      var getAdmin = firebase.database().ref('AccountUser')
      getAdmin.on('value', function (getAdmin) {
        var key = getAdmin.val()
        vm.adminAccount = key['-LTHvnmd4t83HpJPqokk']
        console.log(vm.adminAccount)
      })
      firebase.auth().signInWithEmailAndPassword(vm.adminAccount.email, vm.adminAccount.password).catch(function(error) {
      })

      // console.clear()

    },
    deleteUser() {
      let vm = this
      // firebase.auth().signInWithEmailAndPassword(vm.userData.email, vm.userData.password).catch(function(error) {
      // })
      // var user = firebase.auth().currentUser;
      // console.log(user)
      // user.delete().then(function() {
      //   // User deleted.
      // }).catch(function(error) {
      //   // An error happened.
      // });
      var del = firebase.database().ref('AccountUser/'+this.userData.keyIndex)
      del.remove()
      var getAdmin = firebase.database().ref('AccountUser')
      getAdmin.on('value', function (getAdmin) {
        var key = getAdmin.val()
        vm.adminAccount = key['-LTHvnmd4t83HpJPqokk']
        console.log(vm.adminAccount)
      })
      // firebase.auth().signInWithEmailAndPassword(vm.adminAccount.email, vm.adminAccount.password).catch(function(error) {
      // })
      this.dialog = false
      this.snackbar = true
      this.snackbarMessage = `Successfully deleted ${_.capitalize(this.userData.username)}`
      this.userData= {
        fn:'',
        ln:'',
        email:'',
        emailDummy:'',
        username:'',
        usernameDummy:'',
        password:'',
        cpassword:''
      }
    
    },
    manageAccount(item) {
      this.dialog = true
      this.headTitle = "User profile"
      this.userData= {
        fn: item.fn,
        ln: item.ln,
        email: item.email,
        emailDummy: item.email,
        username: item.username,
        usernameDummy: item.username,
        password: item.password,
        keyIndex: item.keyIndex
      }
      console.log(this.userData)
    },
    saveUser() {
      var vm = this
      if(vm.userData.password != vm.userData.cpassword){
        vm.errorMessages.password = 'Please match your password'
        vm.$refs.passwordRef.focus()
      } else {
         var getAdmin = firebase.database().ref('AccountUser')
      getAdmin.on('value', function (getAdmin) {
        var key = getAdmin.val()
        vm.adminAccount = key['-LTHvnmd4t83HpJPqokk']
      })
      firebase.auth().signInWithEmailAndPassword(vm.adminAccount.email, vm.adminAccount.password).catch(function(error) {
      })

      var post = firebase.database().ref('AccountUser').push()
      post.set({
        fn: _.capitalize(vm.userData.fn),
        ln: _.capitalize(vm.userData.ln),
        email: _.capitalize(vm.userData.email),
        username: _.capitalize(vm.userData.username),
        password: vm.userData.password,
        type: 0,
      })
      vm.snackbar = true
      vm.snackbarMessage = `Successfully added ${_.capitalize(vm.userData.username)} as a casher`
      vm.userData= {
        fn:'',
        ln:'',
        email:'',
        emailDummy:'',
        username:'',
        usernameDummy:'',
        password:'',
        cpassword:''
      }
      this.dialog = false
      //   vm.errorMessages.password = ''
      //   firebase.auth().createUserWithEmailAndPassword(vm.userData.email, vm.userData.password).catch(function(error) {
      //     var errorCode = error.code;
      //     var errorMessage = error.message;
      //     if(error) {
      //       if(errorCode == 'auth/weak-password') {
      //         vm.errorMessages.weakPassword = errorMessage
      //         vm.$refs.passwordWRef.focus()
      //       } else {
      //         console.log(errorMessage)
      //         vm.$refs.emailRef.focus()
      //       }
      //     } else {
      //     }
      //     // ...
      //   });
      }
      
    },
    newuser() {
      this.dialog = true
      this.headTitle = "Add user"
      this.errorMessages = {
        username: '',
        email:'',
        password: '',
        weakPassword:''
      }
      this.userData= {
        fn:'',
        ln:'',
        email:'',
        username:'',
        password:'',
        cpassword:''
      }
    },
    getallUsersdata() {
      let vm = this
      var get = firebase.database().ref('AccountUser')
      get.on('value', function(getdata) {
        let keys = Object.keys(getdata.val())
        vm.allusersData = getdata.val()
        keys.forEach( function (key) {
          vm.allusersData[key].keyIndex = key
        })
      })
    }
  },
  created() {
    this.getallUsersdata()
  }
}
</script>

<style>

</style>
