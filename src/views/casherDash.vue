<template>
  <v-app id="inspire">
     <v-navigation-drawer
      v-model="drawer"
      fixed
      clipped
      class="white  grey--text text--darken-2"
      app
      width="230"
      floating
      
     >
      <v-list
        dense
        class="mt-3 white"
      >
        <v-layout justify-center> 
          <v-avatar size="100">
            <img style="border:8px solid #00968899" src="https://img.icons8.com/office/1600/000000/person-male.png">
          </v-avatar>
        </v-layout>
          <div class="grey--text text--darken-2 mb-5 subheading font-weight-bold text-xs-center mt-3">Cashier</div>
          <v-list-tile
            to="/casher"
          >
            <v-list-tile-action>
              <v-icon size="18" color="teal">mdi-keyboard-settings</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="body-1 grey--text text--darken-2">
                Transaction 
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
         
          <v-layout
            class="mt-4"
            row
            align-center
          >
            <v-flex xs6>
              <v-subheader class="font-weight-bold" >
                INFORMATION
              </v-subheader>
            </v-flex>
          </v-layout>

          <v-list-tile
            to="activitylog"
          >
            <v-list-tile-action>
              <v-icon size="18" color="teal">mdi-progress-check</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="body-1 grey--text text--darken-2">
                Activity Log
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

      </v-list>
    </v-navigation-drawer>
    <v-toolbar clipped-left color="teal lighten-1" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Lazcom sales and inventory</v-toolbar-title>
      <v-spacer></v-spacer>
     

      <v-menu denseallow-overflow offset-y>
        <v-btn
          slot="activator"
          color="teal lighten-1"
          dark
          depressed
          class="white--text textCapital"
        >
         <v-avatar color="white" size="32px" class="mr-2" >
          <img src="https://img.icons8.com/office/1600/000000/person-male.png">
          </v-avatar>
          {{userDetails.username}}
        </v-btn>
        <v-list dense>
          <!-- <v-list-tile @click="test">
            <v-list-tile-title>Profile</v-list-tile-title>
          </v-list-tile> -->
          <v-list-tile  @click="logoutAccount">
            <v-list-tile-title>
              <v-icon size="15" class="mr-1" color="teal">mdi-logout</v-icon>
              Logout 
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      
    </v-toolbar>
    <v-content style="background-color:#f4f6fa">
      <router-view/>
    </v-content>
    <!-- <v-footer color="teal lighten-2" app>
      <span class=" white--text">&copy; 2019</span>
    </v-footer> -->
  </v-app>
</template>

<script>
  import firebase from 'firebase'
  export default {
    data: () => ({
      drawer: null,
    }),
    
    props: {
      source: String
    },
    methods: {
      test() {
        alert('wer')
      },
      logoutAccount() {
        let vm = this
        firebase.auth().signOut().then(
          function() {
            vm.$store.commit('logoutAccount')
            vm.$router.replace({
              path:'/auth',
            })
          }
        )
      }
    },
    computed: {
      userDetails() {
        return this.$store.getters.accountFDetails
      }
    }
  }
</script>