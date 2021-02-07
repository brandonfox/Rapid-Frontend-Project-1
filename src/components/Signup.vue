<template>
  <v-card class="px-10 py-6" style="min-width: 40%">
    <v-form v-on:submit="signup">
      <v-card-title class="text-h4 mb-4">Sign up</v-card-title>
      <v-text-field
          type="email"
          v-model="email"
          outlined
          label="Email"
          required
          :rules="emailRules"
      />
      <v-text-field
          type="password"
          v-model="password"
          outlined
          label="Password"
          required
          :rules="passwordRules"
      />
      <v-card-actions>
        <v-btn :disabled="!this.validForm" depressed class="px-5" color="primary" type="submit">Signup</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import signup from "@/plugins/signup";
export default {
  name: "Signup",
  computed: {
    validForm () {
      return signup.isValidEmail(this.email) && signup.isValidPassword(this.password)
    }
  },
  methods: {
    signup() {
      this.$firebase.auth().createUserWithEmailAndPassword(this.email,this.password).then(
          (user) => {
            this.$store.dispatch('setAuthenticatedUser',user.user)
            this.$router.push('/')
          }
      ).catch(console.log)
    }
  },
  data () {
    return {
      email: '',
      password: '',
      emailRules: [
          v => !!v || 'Email is required',
        // eslint-disable-next-line no-control-regex
          v => signup.isValidEmail(v) || 'E-mail must be valid'
      ],
      passwordRules: [
          v => !!v || 'Password is required',
          v => signup.isValidPassword(v) || 'Password must be longer than 8 characters'
      ]
    }
  }
}
</script>

<style scoped>

</style>