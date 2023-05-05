import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css'

const app = createApp(App)

const pinia = createPinia()

pinia.use(createPersistedState({
  storage: sessionStorage
}))

app.use(pinia)
app.use(router)
app.use(
  VueTippy,
  {
    directive: 'tippy',
    component: 'tippy',
    componentSingleton: 'tippy-singleton',
    defaultProps: {
      placement: 'auto-end',
      allowHTML: true
    }
  })

app.mount('#app')
