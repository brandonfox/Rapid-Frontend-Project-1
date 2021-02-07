<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center" style="cursor: pointer" @click="$router.push('/')">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <div class="text-h6">
          ToVue
        </div>
      </div>

      <v-spacer></v-spacer>

      <div v-if="this.$store.getters.authenticated">
        <v-btn depressed color="primary" to="/account">
          {{this.$store.getters.currentUser.email}}
          <v-icon right>
            mdi-account
          </v-icon>
        </v-btn>
        <v-btn class="ml-4" depressed color="red" @click="logout">
          Logout
        </v-btn>
      </div>
      <div v-else>
        <v-btn depressed class="mr-4" color="primary" to="/login">
          Log in
        </v-btn>
        <v-btn depressed color="primary" to="/signup">
          Sign up
        </v-btn>
      </div>

    </v-app-bar>

    <v-main>
      <v-container fluid fill-height class="justify-center grey lighten-3">
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  mounted() {
    this.$firebase.auth().onAuthStateChanged((user) => {
      this.$store.dispatch('setAuthenticatedUser',user)
      this.$router.push('/')
    })
  },
  data: () => ({
    //
  }),
  methods: {
    logout () {
      this.$firebase.auth().signOut().then(
          () => {
            this.$store.dispatch('setAuthenticatedUser', null)
            this.$router.push('/unauthenticated')
          }
      )
    }
  }
};
</script>
