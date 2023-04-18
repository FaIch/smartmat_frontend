import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import CreateUserView from '../views/CreateUserView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/createuser',
    name: 'createuser',
    component: CreateUserView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
