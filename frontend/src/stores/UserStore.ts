import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

// Define user store using Pinia
export const useUserStore = defineStore(
  'userStore',
  () => {
    // Define reactive refs for store data
    const username = ref('')
    const email = ref('')
    const token = ref('')
    const loggedIn = ref(false)
    const role = ref('')
    const interval = ref()

    // Define computed property for checking if user is logged in
    const isLoggedIn = computed(() => loggedIn.value)

    // Function for handling user login
    async function loginToken (loginToken: string) {
      token.value = loginToken
      loggedIn.value = true
      startInterval()
    }

    // Function for refreshing user token
    async function refreshToken () {
      const config = {
        params: {
          email: email.value
        },
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + token.value
        }
      }
      const path = 'http://localhost:8080/refreshToken'
      await axios
        .get(path, config)
        .then((response) => {
          if (response.data) {
            token.value = response.data
          }
        })
        .catch((error) => console.error(error))
    }

    // Function for logging out user
    function logOut () {
      stopInterval()
      token.value = ''
      username.value = ''
      email.value = ''
      role.value = ''
      loggedIn.value = false
    }

    // Function for stopping token refresh interval
    function stopInterval () {
      clearInterval(interval.value)
      interval.value = null
    }
    // Function for starting token refresh interval
    function startInterval () {
      if (interval.value === null) {
        interval.value = setInterval(() => {
          refreshToken()
        }, 1000 * 4 * 60)
      }
    }

    // Return the reactive refs and functions as store properties
    return {
      username,
      email,
      token,
      role,
      login: loginToken,
      loggedIn,
      logOut,
      isLoggedIn,
      startInterval,
      stopInterval
    }
  },
  {
    // Pinia store options
    persist: true
  }
)
