import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import router from '../router/index'

// Define user store using Pinia
export const useUserStore = defineStore('userStore', () => {
  const email = ref('')
  const loggedIn = ref(false)
  const role = ref('')
  const refreshTokenTimeoutId = ref<ReturnType<typeof setTimeout> | null>(null)

  // Function for refreshing user token
  async function refreshToken () {
    const path = 'http://localhost:8080/auth/refreshToken'
    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }
    try {
      const response = await axios.post(path, null, config)
      if (response.status === 200) {
        const now = new Date()
        console.log(now.toLocaleTimeString(), 'new token')
      }
    } catch (error) {
      console.log('Error refreshing token:', error)
    } finally {
      startRefreshTimer()
    }
  }

  // Function for starting the refresh timer
  function startRefreshTimer () {
    if (refreshTokenTimeoutId.value) {
      clearTimeout(refreshTokenTimeoutId.value)
    }
    refreshTokenTimeoutId.value = setTimeout(refreshToken, 8 * 60 * 1000)
  }

  onMounted(() => {
    if (loggedIn.value) {
      startRefreshTimer()
    }
  })

  // Function to stop the refresh token timer
  function stopRefreshTimer () {
    if (refreshTokenTimeoutId.value) {
      clearTimeout(refreshTokenTimeoutId.value)
      refreshTokenTimeoutId.value = null
    }
  }

  async function login (userEmail: string, userRole: string) {
    email.value = userEmail
    role.value = userRole
    loggedIn.value = true

    startRefreshTimer()
  }

  async function logout () {
    email.value = ''
    role.value = ''
    loggedIn.value = false
    stopRefreshTimer()
    router.push('/login')
  }
  // Return the reactive refs and functions as store properties
  return {
    email,
    role,
    loggedIn,
    refreshToken,
    login,
    logout
  }
},
{
  // Pinia store options
  persist: true
})
