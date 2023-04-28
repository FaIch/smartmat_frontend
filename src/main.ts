import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css'

// Create Vue app instance
const app = createApp(App)

// Create Pinia store instance
const pinia = createPinia()

// Use pinia-plugin-persistedstate plugin
pinia.use(createPersistedState({
  storage: sessionStorage
}))

// Use Pinia store and router with Vue app
app.use(pinia)
app.use(router)
app.use(
  VueTippy,
  // optional
  {
    directive: 'tippy',
    component: 'tippy',
    componentSingleton: 'tippy-singleton',
    defaultProps: {
      placement: 'auto-end',
      allowHTML: true
    }
  }
)

// Mount Vue app to DOM
app.mount('#app')
