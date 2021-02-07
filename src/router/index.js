import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/components/Login";
import Signup from "@/components/Signup";
import Unauthenticated from "@/views/Unauthenticated";
import Todo from "@/views/Todo";
import store from '../store'


Vue.use(VueRouter)

const routes = [
  {
    path: '/unauthenticated',
    component: Unauthenticated
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/signup',
    component: Signup
  },
  {
    path: '/',
    component: Todo,
    beforeEnter: (to, from, next) => {
      if(!store().getters.authenticated){
        next('/unauthenticated')
      }
      else{
        next()
      }
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
