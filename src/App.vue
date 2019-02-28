<template>
  <v-app>
    <transition
      name="custom-classes-transition"
    >
      <!-- leave-active-class="animated slideOutLeft" -->
      <!-- enter-active-class="animated tada" -->
      <router-view/>
    </transition>
  </v-app>
</template>

<script>
  export default {
    name: 'App',
    components: {
    },
    data () {
      return {
      }
    },
    created() {
      this.$store.commit('saveAccountDetails')
      this.$store.commit('getSales')

    }
  }
</script>
