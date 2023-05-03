import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

export function requireAuth (isLoggedIn: boolean, to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  if (isLoggedIn) {
    next()
  } else {
    next({ name: 'login' })
  }
}
