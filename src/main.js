import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import Firebase from "@/plugins/firebase";

Vue.use(Vuex)
Vue.use(Firebase)

import Store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  store: Store,
  render: h => h(App)
}).$mount('#app')
