import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { requireAuth } from '../auth-guard' // Update the import path accordingly
import { checkIfUserIsParent, checkIsSubUserLoggedIn, checkIsUserLoggedIn } from '../stores/UserStore'
import LoginView from '../views/LoginView.vue'
import StartView from '../views/StartView.vue'
import RecipePageView from '../views/RecipePageView.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'start',
    component: StartView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/fridge',
    name: 'fridge',
    component: () => import('../views/MyFridgeView.vue'),
    beforeEnter: async (to, from, next) => {
      const isLoggedIn = await checkIsSubUserLoggedIn()
      requireAuth(isLoggedIn, to, from, next)
    }
  },
  {
    path: '/shoppinglist',
    name: 'shoppinglist',
    component: () => import('../views/ShoppingListView.vue'),
    beforeEnter: async (to, from, next) => {
      const isLoggedIn = await checkIsSubUserLoggedIn()
      requireAuth(isLoggedIn, to, from, next)
    }
  },
  {
    path: '/subuser',
    name: 'subuser',
    component: () => import('../views/SubUserView.vue'),
    beforeEnter: async (to, from, next) => {
      const isLoggedIn = await checkIsUserLoggedIn()
      requireAuth(isLoggedIn, to, from, next)
    }
  },
  {
    path: '/savings',
    name: 'savings',
    component: () => import('../views/SavingsOverviewView.vue'),
    beforeEnter: async (to, from, next) => {
      const isLoggedIn = await checkIsSubUserLoggedIn()
      requireAuth(isLoggedIn, to, from, next)
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    beforeEnter: async (to, from, next) => {
      const isLoggedIn = await checkIsSubUserLoggedIn()
      const isParent = await checkIfUserIsParent()
      requireAuth(isLoggedIn && isParent, to, from, next)
    }
  },
  {
    path: '/recipes',
    name: 'recipes',
    component: () => import('../views/RecipesView.vue'),
    beforeEnter: async (to, from, next) => {
      const isLoggedIn = await checkIsSubUserLoggedIn()
      requireAuth(isLoggedIn, to, from, next)
    }
  },
  {
    path: '/addProduct',
    name: 'addProduct',
    component: () => import('../views/AddProductView.vue'),
    beforeEnter: async (to, from, next) => {
      const isLoggedIn = await checkIsSubUserLoggedIn()
      requireAuth(isLoggedIn, to, from, next)
    }
  },
  {
    path: '/weekMenu',
    name: 'weekMenu',
    component: () => import('../views/WeekMenuView.vue'),
    beforeEnter: async (to, from, next) => {
      const isLoggedIn = await checkIsSubUserLoggedIn()
      requireAuth(isLoggedIn, to, from, next)
    }
  },
  {
    path: '/specificMenu',
    name: 'specificMenu',
    component: () => import('../views/SpecificWeekMenuView.vue'),
    beforeEnter: async (to, from, next) => {
      const isLoggedIn = await checkIsSubUserLoggedIn()
      requireAuth(isLoggedIn, to, from, next)
    }
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('../views/NotificationView.vue'),
    beforeEnter: async (to, from, next) => {
      const isLoggedIn = await checkIsSubUserLoggedIn()
      requireAuth(isLoggedIn, to, from, next)
    }
  },
  {
    path: '/recipe/:id',
    name: 'recipe',
    component: RecipePageView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
