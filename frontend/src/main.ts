import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import PersistedState from 'pinia-plugin-persistedstate'

// Create Vue app instance
const app = createApp(App)

// Create Pinia store instance
const pinia = createPinia()
// Use pinia-plugin-persistedstate plugin
pinia.use(PersistedState)

// Use Pinia store and router with Vue app
app.use(pinia)
app.use(router)

// Mount Vue app to DOM
app.mount('#app')
