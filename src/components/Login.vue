<template>
  <v-card class="px-10 py-6" style="min-width: 40%">
    <v-form v-on:submit="login">
      <v-card-title class="text-h4 mb-4">Login</v-card-title>
      <v-text-field
          type="email"
          v-model="email"
          outlined
          label="Email"
          required
      />
      <v-text-field
          type="password"
          v-model="password"
          outlined
          label="Password"
          required
      />
      <v-card-actions>
        <v-btn depressed class="px-5" color="primary" type="submit">Login</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: "Login",
  data () {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    login () {
      this.$firebase.auth().signInWithEmailAndPassword(this.email,this.password).then(
          (userCredentials) => {
            this.$store.dispatch('setAuthenticatedUser', userCredentials.user)
            this.$router.push('/')
          }
      ).catch(console.log)
    }
  }
}
</script>

<style scoped>

</style>