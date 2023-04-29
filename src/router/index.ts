import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import LoginViewVue from '../views/LoginView.vue'
import StartView from '../views/StartView.vue'
import MyFridgeView from '../views/MyFridgeView.vue'
import ShoppingListView from '../views/ShoppingListView.vue'
import NewSubUserViewVue from '../views/NewSubUserView.vue'
import ProductSelectorView from '../views/ProductSelectorView.vue'
import SavingsOverview from '../views/SavingsOverviewView.vue'
import ProfileView from '../views/ProfileView.vue'
import AddProductView from '../views/AddProductView.vue'
import RecipesView from '../views/RecipesView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'start',
    component: StartView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginViewVue
  },
  {
    path: '/fridge',
    name: 'fridge',
    component: MyFridgeView
  },
  {
    path: '/shoppinglist',
    name: 'shoppinglist',
    component: ShoppingListView
  },
  {
    path: '/subuser',
    name: 'subuser',
    component: NewSubUserViewVue
  },
  {
    path: '/productSelection',
    name: 'productSelection',
    component: ProductSelectorView
  },
  {
    path: '/savings',
    name: 'savings',
    component: SavingsOverview
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView
  },
  {
    path: '/recipes',
    name: 'recipes',
    component: RecipesView
  },
  {
    path: '/addProduct',
    name: 'addProduct',
    component: AddProductView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
